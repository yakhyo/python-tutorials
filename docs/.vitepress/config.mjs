import { defineConfig } from 'vitepress'
import { readFileSync, existsSync } from 'node:fs'
import catppuccinLatte from '@shikijs/themes/catppuccin-latte'
import catppuccinMocha from '@shikijs/themes/catppuccin-mocha'

// Catppuccin is drawn for its own background, not VitePress's, so several token colors land
// under the WCAG AA 4.5:1 contrast ratio on our code background (Latte comments reach only
// 2.4:1). Scale each failing color's luminance until it passes; multiplying the linear RGB
// channels keeps the hue, so the palette still looks like Catppuccin.
const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
 .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const toHex = rgb => '#' + rgb.map(c => {
 const srgb = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
 return Math.round(Math.min(1, Math.max(0, srgb)) * 255).toString(16).padStart(2, '0')
}).join('')
const ratio = (a, b) => {
 const [hi, lo] = [luminance(channels(a)), luminance(channels(b))].sort((x, y) => y - x)
 return (hi + 0.05) / (lo + 0.05)
}
const readable = (color, background, min = 4.6) => {
 if (ratio(color, background) >= min) return color
 const backgroundLuminance = luminance(channels(background))
 const target = backgroundLuminance > 0.5
  ? (backgroundLuminance + 0.05) / min - 0.05
  : min * (backgroundLuminance + 0.05) - 0.05
 const rgb = channels(color)
 const scaled = toHex(rgb.map(c => c * (target / luminance(rgb))))
 if (ratio(scaled, background) >= min - 0.1) return scaled
 // Scaling up can clip a channel; mix toward white instead.
 for (let t = 0.02; t <= 1; t += 0.02) {
  const mixed = toHex(rgb.map(c => c + (1 - c) * t))
  if (ratio(mixed, background) >= min) return mixed
 }
 return color
}
const contrastSafe = (theme, background) => ({
 ...theme,
 tokenColors: theme.tokenColors.map(token => {
  const foreground = token.settings?.foreground
  if (!/^#[0-9a-f]{6}$/i.test(foreground || '')) return token
  return { ...token, settings: { ...token.settings, foreground: readable(foreground, background) } }
 })
})
// --vp-code-block-bg in each mode.
const codeThemes = {
 light: contrastSafe(catppuccinLatte, '#f6f6f7'),
 dark: contrastSafe(catppuccinMocha, '#161618')
}

const load = file => JSON.parse(readFileSync(new URL(file, import.meta.url)))
const groupsOf = list => [...new Set(list.map(lesson => lesson.group))]

// Lesson files live in numbered module folders so they sort in course order,
// e.g. lessons/06-functions/01-defining-functions.md. `rewrites` below keeps the
// URLs short (/lessons/defining-functions). scripts/organize-lessons.py moves the files.
const moduleFolder = group => {
 const [number, name] = group.split(' · ')
 return `${number}-${name.replace(/\(.*?\)/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}
const lessonFiles = list => {
 const counters = {}
 return Object.fromEntries(list.map(({ slug, group }) => {
  const folder = moduleFolder(group)
  counters[folder] = (counters[folder] || 0) + 1
  return [slug, `${folder}/${String(counters[folder]).padStart(2, '0')}-${slug}.md`]
 }))
}

// English (root locale).
const courseEn = load('./course.json')
const files = lessonFiles(courseEn)
const hasQuiz = number => existsSync(new URL(`./quizzes/module-${number}.json`, import.meta.url))
const sidebarEn = [
 { text: 'Start Here', items: [{ text: 'Course Overview', link: '/' }, { text: 'Playground', link: '/playground' }, { text: 'Python Lab (notebooks)', link: '/lab' }] },
 ...groupsOf(courseEn).map(text => {
  const lessons = courseEn.filter(l => l.group === text)
  const number = text.slice(0, 2)
  const items = lessons.map(l => ({ text: l.title, link: `/lessons/${l.slug}` }))
  if (hasQuiz(number)) items.push({ text: '<span class="checkpoint-link">Checkpoint quiz</span>', link: `/checkpoints/module-${number}` })
  return { text, collapsed: number !== '01', items }
 })
]

// Uzbek (/uz/ locale): the same course, translated. Titles come from course-uz.json.
const courseUz = load('./course-uz.json')
const hasQuizUz = number => existsSync(new URL(`../uz/nazorat/module-${number}.md`, import.meta.url))
const sidebarUz = [
 { text: 'Boşlaş', items: [{ text: 'Darslik haqida', link: '/uz/' }, { text: 'Sinov maydonçasi', link: '/uz/sinov-maydoni' }, { text: 'Python laboratoriyasi', link: '/uz/laboratoriya' }] },
 ...groupsOf(courseUz).map(text => {
  const lessons = courseUz.filter(l => l.group === text)
  const number = text.slice(0, 2)
  const items = lessons.map(l => ({ text: l.title, link: `/uz/darslar/${l.slug}` }))
  if (hasQuizUz(number)) items.push({ text: '<span class="checkpoint-link">Nazorat testi</span>', link: `/uz/nazorat/module-${number}` })
  return { text, collapsed: number !== '01', items }
 })
]

// Markdown plugin: an italic lesson title (for example *Nested Data* or *Içma-iç maʼlumotlar*)
// becomes a link to that lesson, so lessons can reference each other without hard-coded links.
const linkSets = [
 { test: path => path.startsWith('lessons/') || path.startsWith('checkpoints/') || path === 'index.md', prefix: '/lessons/', dir: 'lessons/', titles: new Map(courseEn.map(l => [l.title, `/lessons/${l.slug}`])) },
 { test: path => path.startsWith('uz/'), prefix: '/uz/darslar/', dir: 'uz/darslar/', titles: new Map(courseUz.map(l => [l.title, `/uz/darslar/${l.slug}`])) }
]
function linkLessonTitles(md) {
 md.core.ruler.push('lesson_title_links', state => {
  const path = state.env?.relativePath || ''
  const set = linkSets.find(s => s.test(path))
  if (!set) return
  const current = path.startsWith(set.dir) ? `${set.prefix}${path.slice(set.dir.length).replace(/\.md$/, '')}` : ''
  for (const block of state.tokens) {
   if (block.type !== 'inline' || !block.children) continue
   const children = block.children
   for (let i = 0; i + 2 < children.length; i++) {
    const [open, text, close] = [children[i], children[i + 1], children[i + 2]]
    if (open.type !== 'em_open' || text.type !== 'text' || close.type !== 'em_close') continue
    const href = set.titles.get(text.content)
    if (!href || href === current) continue
    const linkOpen = new state.Token('link_open', 'a', 1)
    linkOpen.attrs = [['href', href]]
    const linkClose = new state.Token('link_close', 'a', -1)
    children.splice(i + 1, 0, linkOpen)
    children.splice(i + 3, 0, linkClose)
    i += 4
   }
  }
 })
}

const base = process.env.SITE_BASE || '/'

const rewrites = Object.fromEntries(Object.entries(files).flatMap(([slug, file]) => [
 [`lessons/${file}`, `lessons/${slug}.md`],
 [`uz/darslar/${file}`, `uz/darslar/${slug}.md`]
]))

export default defineConfig({
 title: 'python.uz',
 base, outDir: '../dist',
 sitemap: { hostname: 'https://yakhyo.github.io/python-tutorials/' },
 lastUpdated: true,
 rewrites,
 // Catppuccin Latte/Mocha, contrast-corrected above; the CodeMirror editor matches (--cm-* in theme/style.css).
 markdown: { theme: codeThemes, config: md => linkLessonTitles(md) },
 // The Python Lab (JupyterLite) is built separately into dist/lab by scripts/build-lab.sh.
 ignoreDeadLinks: [/^\/lab\//],
 head: [
  ['link', { rel: 'icon', href: `${base}favicon.svg` }],
  ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap' }]
 ],
 locales: {
  root: {
   label: 'English', lang: 'en',
   description: 'Learn Python from scratch with clear explanations, runnable examples, and exercises.',
   themeConfig: {
    nav: [{ text: 'Lessons', link: `/lessons/${courseEn[0].slug}` }, { text: 'Playground', link: '/playground' }, { text: 'Lab', link: '/lab' }],
    sidebar: sidebarEn,
    outline: { label: 'On this page', level: [2, 3] },
    docFooter: { prev: 'Previous lesson', next: 'Next lesson' },
    editLink: { pattern: 'https://github.com/yakhyo/python-tutorials/edit/dev/docs/:path', text: 'Suggest a change to this lesson' },
    lastUpdatedText: 'Last updated'
   }
  },
  uz: {
   label: 'Özbekça', lang: 'uz', link: '/uz/',
   description: 'Pythonni noldan örganing: tuşunarli izohlar, brauzerda işlaydigan misollar va maşqlar.',
   themeConfig: {
    nav: [{ text: 'Darslar', link: '/uz/darslar/what-is-python' }, { text: 'Sinov maydonçasi', link: '/uz/sinov-maydoni' }, { text: 'Laboratoriya', link: '/uz/laboratoriya' }],
    sidebar: sidebarUz,
    outline: { label: 'Bu sahifada', level: [2, 3] },
    docFooter: { prev: 'Oldingi dars', next: 'Keyingi dars' },
    darkModeSwitchLabel: 'Rang rejimi', sidebarMenuLabel: 'Mundarija', returnToTopLabel: 'Yuqoriga', langMenuLabel: 'Tilni özgartiriş',
    editLink: { pattern: 'https://github.com/yakhyo/python-tutorials/edit/dev/docs/:path', text: 'Bu darsga özgartiriş taklif qiliş' },
    lastUpdatedText: 'Oxirgi yangilanish', notFound: { title: 'Sahifa topilmadi', quote: 'Bu manzilda sahifa yöq. Balki u köçirilgandir.', linkText: 'Boş sahifaga' }
   }
  }
 },
 themeConfig: {
  // The official Python logo (unaltered, from python.org/community/logos) next to the site name.
  logo: { src: '/python-logo.svg', alt: 'Python' },
  siteTitle: false,
  socialLinks: [{ icon: 'github', link: 'https://github.com/yakhyo/python-tutorials', ariaLabel: 'GitHub' }],
  search: { provider: 'local', options: { locales: { uz: { translations: { button: { buttonText: 'Qidiriş', buttonAriaLabel: 'Darslardan qidiriş' }, modal: { noResultsText: 'Natija topilmadi', resetButtonTitle: 'Tozalaş', footer: { selectText: 'tanlaş', navigateText: 'ötiş', closeText: 'yopiş' } } } } } } }
 }
})
