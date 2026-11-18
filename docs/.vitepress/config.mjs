import { defineConfig } from 'vitepress'
import { createLogger } from 'vite'
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
// e.g. en/lessons/06-functions/01-defining-functions.md. `rewrites` below keeps the
// URLs short (/en/lessons/defining-functions). scripts/organize-lessons.py moves the files.
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

// The sidebar has three sections of equal weight: the 12-module course, and the two follow-on
// tracks (modules 13 and 14). Each track has a landing page (en/data.md, en/advanced.md) and is
// named without the module number or the "(Optional)" suffix that course.json keeps for
// scripts/make-notebooks.py. Section and module headings are styled in theme/style.css.
const tracks = { '13': 'data', '14': 'advanced' }
const sidebarFor = ({ course, lang, start, quizLabel, hasQuiz, overview, core }) => {
 const modules = groupsOf(course).map(text => {
  const number = text.slice(0, 2)
  const items = course.filter(l => l.group === text).map(l => ({ text: l.title, link: `/${lang}/lessons/${l.slug}` }))
  if (hasQuiz(number)) items.push({ text: `<span class="checkpoint-link">${quizLabel}</span>`, link: `/${lang}/checkpoints/module-${number}` })
  const track = tracks[number]
  if (!track) return { number, text, collapsed: number !== '01', items }
  const name = text.split(' · ')[1].replace(/\s*\(.*?\)$/, '')
  return { number, text: name, collapsed: true, items: [{ text: overview, link: `/${lang}/${track}` }, ...items] }
 })
 const group = ({ number, ...item }) => item
 return [
  start,
  { text: core, items: modules.filter(m => !tracks[m.number]).map(group) },
  ...modules.filter(m => tracks[m.number]).map(group)
 ]
}

// English (served under /en/).
const courseEn = load('./course.json')
const files = lessonFiles(courseEn)
const hasQuiz = number => existsSync(new URL(`./quizzes/module-${number}.json`, import.meta.url))
const sidebarEn = sidebarFor({
 course: courseEn, lang: 'en', hasQuiz, quizLabel: 'Checkpoint quiz', overview: 'Track overview', core: 'Python',
 start: { text: 'Start Here', items: [{ text: 'Course Overview', link: '/en/' }, { text: 'Playground', link: '/en/playground' }, { text: 'Python Lab', link: '/en/lab' }] }
})

// Uzbek (the default language, served under /uz/): the same course, translated. Titles come from course-uz.json.
const courseUz = load('./course-uz.json')
const hasQuizUz = number => existsSync(new URL(`../uz/checkpoints/module-${number}.md`, import.meta.url))
const sidebarUz = sidebarFor({
 course: courseUz, lang: 'uz', hasQuiz: hasQuizUz, quizLabel: 'Nazorat testi', overview: 'Yönaliş haqida', core: 'Python',
 start: { text: 'Boşlaş', items: [{ text: 'Darslik haqida', link: '/uz/' }, { text: 'Sinov maydonçasi', link: '/uz/playground' }, { text: 'Python laboratoriyasi', link: '/uz/lab' }] }
})

// Markdown plugin: an italic lesson title (for example *Nested Data* or *Içma-iç maʼlumotlar*)
// becomes a link to that lesson, so lessons can reference each other without hard-coded links.
const linkSets = [
 { test: path => path.startsWith('en/'), prefix: '/en/lessons/', dir: 'en/lessons/', titles: new Map(courseEn.map(l => [l.title, `/en/lessons/${l.slug}`])) },
 { test: path => path.startsWith('uz/'), prefix: '/uz/lessons/', dir: 'uz/lessons/', titles: new Map(courseUz.map(l => [l.title, `/uz/lessons/${l.slug}`])) }
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

// Markdown plugin: ```flow, ```tree and ```anatomy blocks become drawn diagrams. Each component
// in theme/ explains its own format. The text is URL-encoded so that it travels safely through
// an HTML attribute.
const DIAGRAMS = { flow: 'FlowDiagram', tree: 'TreeDiagram', anatomy: 'CodeAnatomy' }
function flowDiagrams(md) {
 const fence = md.renderer.rules.fence
 md.renderer.rules.fence = (tokens, index, options, env, self) => {
  const token = tokens[index]
  const component = DIAGRAMS[token.info.trim()]
  if (!component) return fence(tokens, index, options, env, self)
  return `<${component} source="${encodeURIComponent(token.content).replace(/'/g, '%27')}" />\n`
 }
}

const base = process.env.SITE_BASE || '/'

const rewrites = Object.fromEntries(Object.entries(files).flatMap(([slug, file]) => [
 [`en/lessons/${file}`, `en/lessons/${slug}.md`],
 [`uz/lessons/${file}`, `uz/lessons/${slug}.md`]
]))

// VitePress 1.x is written for Vite 5; this project runs it on Vite 6, which prints a warning
// about one line in VitePress's own search box ("Failed to resolve /@localSearchIndex") every time
// the dev server starts. Search works either way, so that one message is dropped. Every other
// warning still gets through.
const logger = createLogger()
const warn = logger.warn
logger.warn = (message, options) => { if (!String(message).includes('/@localSearchIndex')) warn(message, options) }

export default defineConfig({
 vite: { customLogger: logger },
 title: 'codeuz',
 base, outDir: '../dist',
 sitemap: { hostname: 'https://yakhyo.github.io/python-tutorials/' },
 lastUpdated: true,
 rewrites,
 // Catppuccin Latte/Mocha, contrast-corrected above; the CodeMirror editor matches (--cm-* in theme/style.css).
 markdown: { theme: codeThemes, config: md => { linkLessonTitles(md); flowDiagrams(md) } },
 // The Python Lab (JupyterLite) is built separately into dist/lab by scripts/build-lab.sh.
 ignoreDeadLinks: [/^\/lab\//],
 head: [
  ['link', { rel: 'icon', href: `${base}favicon.svg` }],
  // Both languages live under a prefix (/uz/, /en/). Uzbek is the default: the bare site
  // root sends every visitor to /uz/, and the language menu switches to English.
  ['script', {}, `(function () { var base = ${JSON.stringify(base)}; var path = location.pathname; if (path !== base && path !== base + 'index.html') return; location.replace(base + 'uz/' + location.search + location.hash) })()`],
  ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap' }]
 ],
 // `root` is the fallback locale: it also covers the site root and the 404 page, so it is Uzbek.
 locales: {
  root: {
   label: 'Özbekça', lang: 'uz', link: '/uz/',
   description: 'Pythonni noldan örganing: tuşunarli izohlar, brauzerda işlaydigan misollar va maşqlar.',
   themeConfig: {
    nav: [{ text: 'Darslar', link: `/uz/lessons/${courseUz[0].slug}` }, { text: 'Sinov maydonçasi', link: '/uz/playground' }, { text: 'Laboratoriya', link: '/uz/lab' }],
    sidebar: sidebarUz,
    outline: { label: 'Bu sahifada', level: [2, 3] },
    docFooter: { prev: 'Oldingi dars', next: 'Keyingi dars' },
    darkModeSwitchLabel: 'Rang rejimi', sidebarMenuLabel: 'Mundarija', returnToTopLabel: 'Yuqoriga', langMenuLabel: 'Tilni özgartiriş',
    editLink: { pattern: 'https://github.com/yakhyo/python-tutorials/edit/dev/docs/:path', text: 'Bu sahifaga özgartiriş taklif qiliş' },
    lastUpdatedText: 'Oxirgi yangilanish', notFound: { title: 'Sahifa topilmadi', quote: 'Bu manzilda sahifa yöq. Balki u köçirilgandir.', linkText: 'Boş sahifaga' }
   }
  },
  en: {
   label: 'English', lang: 'en', link: '/en/',
   description: 'Learn Python from scratch with clear explanations, runnable examples, and exercises.',
   themeConfig: {
    nav: [{ text: 'Lessons', link: `/en/lessons/${courseEn[0].slug}` }, { text: 'Playground', link: '/en/playground' }, { text: 'Lab', link: '/en/lab' }],
    sidebar: sidebarEn,
    outline: { label: 'On this page', level: [2, 3] },
    docFooter: { prev: 'Previous lesson', next: 'Next lesson' },
    editLink: { pattern: 'https://github.com/yakhyo/python-tutorials/edit/dev/docs/:path', text: 'Suggest a change to this page' },
    lastUpdatedText: 'Last updated'
   }
  }
 },
 themeConfig: {
  // The site carries the name of the author's YouTube channel, codeuz. Its mark is the Python
  // prompt ">>>" and a cursor (public/logo.svg, with a lighter version for dark mode). The name
  // next to it is text, with "uz" in the accent color.
  logo: { light: '/logo.svg', dark: '/logo-dark.svg', alt: '' },
  siteTitle: 'code<span class="site-tld">uz</span>',
  socialLinks: [{ icon: 'youtube', link: 'https://youtube.com/codeuz', ariaLabel: 'YouTube' }, { icon: 'github', link: 'https://github.com/yakhyo/python-tutorials', ariaLabel: 'GitHub' }],
  // Search matches both Uzbek Latin spellings. The lessons use ş, ç, ö, ğ, but many people type
  // sh, ch, o', g'. Every word, in the index and in what the visitor types, is reduced to one
  // plain form ("özgaruvçi", "o'zgaruvchi" and "ozgaruvchi" all become "ozgaruvchi").
  // VitePress copies these two functions to the browser as text, so they must not use anything
  // defined outside themselves.
  search: { provider: 'local', options: { miniSearch: { options: {
   tokenize: text => text.replace(/(\p{L})['’‘`ʻʼ](?=\p{L})/gu, '$1').split(/[\n\r\p{Z}\p{P}]+/u),
   processTerm: term => term.toLowerCase().replace(/ş/g, 'sh').replace(/ç/g, 'ch').replace(/ö/g, 'o').replace(/ğ/g, 'g').replace(/[ʻʼ]/g, '')
  } }, locales: { root: { translations: { button: { buttonText: 'Qidiriş', buttonAriaLabel: 'Darslardan qidiriş' }, modal: { noResultsText: 'Natija topilmadi', resetButtonTitle: 'Tozalaş', footer: { selectText: 'tanlaş', navigateText: 'ötiş', closeText: 'yopiş' } } } } } } }
 }
})
