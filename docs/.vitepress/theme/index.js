import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Playground from './Playground.vue'
import Difficulty from './Difficulty.vue'
import Mark from './Mark.vue'
import Quiz from './Quiz.vue'
import CodeEnhancer from './CodeEnhancer.vue'
import LabLink from './LabLink.vue'
import course from '../course.json'
import './style.css'

// The language switcher keeps the page path and only swaps the /uz/ prefix, but the two
// languages use different folder names (/lessons/ vs /uz/darslar/ and so on). Map them here.
const slugs = new Set(course.map(lesson => lesson.slug))
const pairs = [['lessons/', 'darslar/'], ['checkpoints/', 'nazorat/'], ['playground', 'sinov-maydoni'], ['lab', 'laboratoriya']]
function localeTarget(href) {
 const match = href.match(/^(.*?\/)(uz\/)?([a-z-]+\/?)([a-z0-9-]*)(\.html)?([?#].*)?$/)
 if (!match) return null
 const [, base, uz, part, slug, html = '', rest = ''] = match
 for (const [en, local] of pairs) {
  const known = !en.endsWith('/') ? slug === '' : en === 'lessons/' ? slugs.has(slug) : /^module-\d\d$/.test(slug)
  if (!known) continue
  if (uz && part === en) return `${base}uz/${local}${slug}${html}${rest}`
  if (!uz && part === local) return `${base}${en}${slug}${html}${rest}`
 }
 return null
}

export default {
 extends: DefaultTheme,
 // CodeEnhancer adds Run buttons to code blocks and Check editors to exercises;
 // LabLink points each lesson at its module notebook in the Python Lab.
 Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => [h(CodeEnhancer), h(LabLink)] }),
 enhanceApp({ app, router }) {
  router.onBeforeRouteChange = href => { const target = localeTarget(href); if (target) { router.go(target); return false } }
  app.component('PythonPlayground', Playground)
  app.component('Difficulty', Difficulty)
  app.component('Quiz', Quiz)
  app.component('Yes', { render: () => h(Mark, { ok: true }) })
  app.component('No', { render: () => h(Mark, { ok: false }) })
 }
}
