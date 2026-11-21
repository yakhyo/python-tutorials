<script setup>
// The landing page (en/index.md, uz/index.md). All copy comes from the page's `home` frontmatter,
// so each language keeps its own text; the lesson lists come from course.json / course-uz.json.
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import courseEn from '../course.json'
import courseUz from '../course-uz.json'
import ProjectArt from './ProjectArt.vue'

const { frontmatter, lang } = useData()
const home = computed(() => frontmatter.value.home || {})
const locale = computed(() => (lang.value?.startsWith('uz') ? 'uz' : 'en'))
const course = computed(() => (locale.value === 'uz' ? courseUz : courseEn))
const url = path => withBase(`/${locale.value}${path}`)
const firstLesson = computed(() => url(`/lessons/${course.value[0].slug}`))

// Each level lists module numbers ("01"…"14"); a track level (modules 13 and 14) drops the
// module number and the "(Optional)" suffix that course.json keeps for the notebook script.
const levels = computed(() => (home.value.path?.levels || []).map(level => ({
 ...level,
 modules: level.modules.map(number => {
  const lessons = course.value.filter(lesson => lesson.group.startsWith(number))
  const [, name = ''] = (lessons[0]?.group || '').split(' · ')
  return { number, name: name.replace(/\s*\(.*?\)$/, ''), lessons }
 })
})))
const core = computed(() => levels.value.filter(level => !level.track))
const lessonCount = computed(() => core.value.reduce((sum, level) => sum + level.modules.reduce((n, m) => n + m.lessons.length, 0), 0))
const moduleCount = computed(() => core.value.reduce((sum, level) => sum + level.modules.length, 0))
const stats = computed(() => {
 const labels = home.value.stats || {}
 return [[lessonCount.value, labels.lessons], [moduleCount.value, labels.modules], [labels.projectCount, labels.projects]]
})

// A returning learner continues from the last lesson they opened (saved by theme/index.js).
// Read after mounting, so the server-rendered page and the first client render stay identical.
const resume = ref(null)
// Lessons the learner has opened in this browser: a check mark in the lists and a count per part.
const opened = ref(new Set())
onMounted(() => {
 try {
  const slug = localStorage.getItem('python-uz:last-lesson')
  if (slug && slug !== course.value[0].slug) resume.value = course.value.find(lesson => lesson.slug === slug) || null
  opened.value = new Set(JSON.parse(localStorage.getItem('python-uz:opened') || '[]'))
 } catch { /* storage is blocked or holds something else: the page works without it */ }
})
const progressOf = level => {
 const lessons = level.modules.flatMap(module => module.lessons)
 const done = lessons.filter(lesson => opened.value.has(lesson.slug)).length
 return { percent: lessons.length ? Math.round(done / lessons.length * 100) : 0, text: (home.value.path?.progress || '').replace('{done}', done).replace('{total}', lessons.length) }
}

// Project cards: the title and module come from the course list; ProjectArt draws the picture.
const projects = computed(() => Object.entries(home.value.projects?.items || {}).flatMap(([slug, text]) => {
 const lesson = course.value.find(item => item.slug === slug)
 if (!lesson) return []
 return [{
  slug, text,
  title: lesson.title.replace(/^[^:]+:\s*/, ''),
  module: (home.value.projects?.moduleLabel || '{n}').replace('{n}', lesson.group.slice(0, 2))
 }]
}))

const active = ref(0)
const tabs = ref([])
function onKey(event) {
 const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
 if (!step) return
 event.preventDefault()
 active.value = (active.value + step + levels.value.length) % levels.value.length
 tabs.value[active.value]?.focus()
}
</script>

<template>
 <div class="course-home">
  <section class="home-hero">
   <div class="home-wrap hero-grid">
    <div class="hero-copy">
     <h1>{{ home.title }}</h1>
     <p class="hero-lead">{{ home.lead }}</p>
     <div class="home-actions">
      <a v-if="resume" class="home-button primary is-resume" :href="url(`/lessons/${resume.slug}`)" :title="`${home.resume}: ${resume.title}`"><span>{{ home.resume }}: {{ resume.title }}</span></a>
      <a v-else class="home-button primary" :href="firstLesson">{{ home.start }}</a>
      <a class="home-button" href="#path">{{ home.browse }}</a>
     </div>
     <dl class="hero-stats">
      <div v-for="[value, label] in stats" :key="label"><dt>{{ value }}</dt><dd>{{ label }}</dd></div>
     </dl>
    </div>
    <div class="hero-demo">
     <p class="demo-label">{{ home.demoLabel }}</p>
     <ClientOnly>
      <PythonPlayground :code="home.code" />
      <template #fallback><pre class="demo-fallback">{{ home.code }}</pre></template>
     </ClientOnly>
    </div>
   </div>
  </section>

  <section id="path" class="home-section is-tinted">
   <div class="home-wrap">
    <h2>{{ home.path?.title }}</h2>
    <p class="section-lead">{{ home.path?.lead }}</p>
    <div class="level-tabs" role="tablist" :aria-label="home.path?.title" @keydown="onKey">
     <button v-for="(level, i) in levels" :key="level.name" :ref="el => (tabs[i] = el)" role="tab" :id="`level-tab-${i}`"
      :aria-selected="active === i" :aria-controls="`level-panel-${i}`" :tabindex="active === i ? 0 : -1"
      :class="{ 'is-active': active === i }" @click="active = i">{{ level.name }}</button>
    </div>
    <div v-for="(level, i) in levels" v-show="active === i" :key="level.name" class="level-panel" role="tabpanel"
     :id="`level-panel-${i}`" :aria-labelledby="`level-tab-${i}`" tabindex="0">
     <div class="level-head">
      <p>{{ level.text }}</p>
      <a v-if="level.link" class="text-link" :href="url(level.link)">{{ level.linkText }} →</a>
     </div>
     <div class="level-progress">
      <span class="progress-track" aria-hidden="true"><span :style="{ width: `${progressOf(level).percent}%` }" /></span>
      <span class="progress-text">{{ progressOf(level).text }}</span>
     </div>
     <div class="module-grid">
      <div v-for="module in level.modules" :key="module.number" class="module-card">
       <h3>
        <span><span v-if="!level.track" class="module-number">{{ module.number }}</span>{{ module.name }}</span>
        <span class="module-count">{{ module.lessons.length }} {{ home.stats?.lessons }}</span>
       </h3>
       <ol>
        <li v-for="lesson in module.lessons" :key="lesson.slug">
         <a :href="url(`/lessons/${lesson.slug}`)">{{ lesson.title }}<span v-if="opened.has(lesson.slug)" class="visually-hidden"> ({{ home.path?.opened }})</span></a>
         <svg v-if="opened.has(lesson.slug)" class="lesson-opened" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </li>
       </ol>
      </div>
     </div>
    </div>
   </div>
  </section>

  <section class="home-section">
   <div class="home-wrap">
    <h2>{{ home.projects?.title }}</h2>
    <p class="section-lead">{{ home.projects?.lead }}</p>
    <ul class="project-grid">
     <li v-for="project in projects" :key="project.slug">
      <a class="project-card" :href="url(`/lessons/${project.slug}`)">
       <ProjectArt :name="project.slug" />
       <span class="project-body">
        <span class="project-module">{{ project.module }}</span>
        <span class="project-title">{{ project.title }}</span>
        <span class="project-text">{{ project.text }}</span>
       </span>
      </a>
     </li>
    </ul>
   </div>
  </section>

  <p v-if="home.note" class="home-note home-wrap">{{ home.note }}</p>

  <section class="home-section is-closing">
   <div class="home-wrap closing">
    <div>
     <h2>{{ home.closing?.title }}</h2>
     <p class="section-lead">{{ home.closing?.text }}</p>
    </div>
    <div class="home-actions">
     <a class="home-button primary" :href="firstLesson">{{ home.start }}</a>
     <a class="home-button" :href="url('/playground')">{{ home.closing?.playground }}</a>
    </div>
   </div>
  </section>
 </div>
</template>

<style scoped>
/* Spacing sits on an 8px grid (4px inside components). Three text sizes carry the copy:
   16px for the main paragraphs, 14px for lists and cards, 12px for small labels. */
.course-home { --home-max: 1152px; color: var(--vp-c-text-1); }
.home-wrap { max-width: var(--home-max); margin: 0 auto; padding: 0 24px; }
h1, h2, h3, p, ol, ul, dl, dd { margin: 0; padding: 0; }
ul, ol { list-style: none; }
a { text-decoration: none; }

.home-hero { padding: 64px 0; background: linear-gradient(180deg, var(--vp-c-brand-soft), transparent); }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: start; }
h1 { font-size: 48px; line-height: 1.1; font-weight: 700; letter-spacing: -.035em; text-wrap: balance; }
.hero-lead { margin-top: 24px; font-size: 18px; line-height: 1.6; color: var(--vp-c-text-2); max-width: 34em; }
.home-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hero-copy .home-actions { margin-top: 32px; flex-wrap: nowrap; }
.hero-copy .home-button { flex: none; white-space: nowrap; }
/* "Continue: <lesson title>" can be long: it gives up width and ends in "…" so that the second
   button stays on the same line. The full text is in the tooltip. */
.hero-copy .home-button.is-resume { flex: 0 1 auto; min-width: 0; }
.is-resume span { overflow: hidden; text-overflow: ellipsis; }
.home-button { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1.4; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1); background: var(--vp-c-bg); transition: border-color .2s, background-color .2s; }
.home-button:hover { border-color: var(--vp-c-brand-1); }
.home-button.primary { border-color: transparent; background: var(--vp-c-brand-3); color: #fff; }
.home-button.primary:hover { background: #1d4ed8; }
.hero-stats { display: flex; flex-wrap: wrap; gap: 16px 32px; margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--vp-c-divider); }
.hero-stats dt { font-size: 24px; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; font-variant-numeric: tabular-nums; }
.hero-stats dd { margin-top: 4px; font-size: 14px; line-height: 1.5; color: var(--vp-c-text-2); }
.demo-label { margin-bottom: 8px; font-size: 14px; line-height: 1.5; font-weight: 600; color: var(--vp-c-text-2); }
.hero-demo { min-width: 0; }
/* The editor keeps one size in the hero: the code, the result and the status line each reserve
   their space, so pressing Run fills it without moving the rest of the page. */
.hero-demo :deep(.python-editor) { margin: 0; }
.hero-demo :deep(.cm-scroller) { height: 200px; min-height: 0; }
.hero-demo :deep(.editor-output) { box-sizing: border-box; height: 170px; overflow: auto; }
.hero-demo :deep(.python-output) { max-height: none; overflow: visible; }
.hero-demo :deep(.editor-status), .hero-demo :deep(.editor-status:empty) { display: block; box-sizing: border-box; min-height: 30px; }
.demo-fallback { margin: 0; padding: 24px; min-height: 465px; box-sizing: border-box; border-radius: 8px; background: var(--vp-code-block-bg); font-family: var(--vp-font-family-mono); font-size: 14px; line-height: 1.7; overflow-x: auto; }

.home-section { padding: 64px 0; }
.home-section.is-tinted { background: var(--vp-c-bg-soft); }
h2 { font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -.025em; text-wrap: balance; }
.section-lead { margin-top: 16px; font-size: 16px; line-height: 1.6; color: var(--vp-c-text-2); max-width: 65ch; }
h3 { font-size: 16px; line-height: 1.4; font-weight: 600; }
.text-link { font-size: 14px; font-weight: 600; color: var(--vp-c-brand-1); white-space: nowrap; }
.text-link:hover { text-decoration: underline; }


.level-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
.level-tabs button { min-height: 44px; padding: 0 16px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color .2s, background-color .2s, color .2s; }
.level-tabs button:hover { border-color: var(--vp-c-brand-1); }
.level-tabs button.is-active { border-color: transparent; background: var(--vp-c-brand-3); color: #fff; }
.level-panel { margin-top: 16px; padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); }
.level-head { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 24px; }
.level-head p { font-size: 16px; line-height: 1.6; color: var(--vp-c-text-2); max-width: 65ch; }
.level-progress { display: flex; align-items: center; gap: 16px; margin-top: 16px; }
.progress-track { flex: 1; max-width: 240px; height: 8px; border-radius: 4px; background: var(--vp-c-default-soft); overflow: hidden; }
.progress-track span { display: block; height: 100%; border-radius: 4px; background: var(--vp-c-brand-3); transition: width .3s; }
.progress-text { font-size: 14px; line-height: 1.5; color: var(--vp-c-text-2); font-variant-numeric: tabular-nums; }
.module-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; margin-top: 32px; }
.module-card h3 { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; padding-bottom: 8px; border-bottom: 1px solid var(--vp-c-divider); }
.module-number { margin-right: 8px; color: var(--vp-c-brand-1); font-variant-numeric: tabular-nums; }
.module-count { flex: none; font-size: 12px; font-weight: 400; color: var(--vp-c-text-2); }
.module-card ol { margin-top: 8px; counter-reset: lesson; }
.module-card li { counter-increment: lesson; display: flex; align-items: baseline; gap: 12px; font-size: 14px; line-height: 1.5; }
.module-card li::before { content: counter(lesson, decimal-leading-zero); color: var(--vp-c-text-3); font-variant-numeric: tabular-nums; }
.module-card li a { flex: 1; padding: 6px 0; color: var(--vp-c-text-1); }
.module-card li a:hover { color: var(--vp-c-brand-1); }
.lesson-opened { flex: none; align-self: center; width: 16px; height: 16px; fill: none; stroke: var(--vp-c-green-1); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

/* Five projects in two rows: two wide cards, then three. */
.project-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 24px; margin-top: 40px; }
.project-grid li { grid-column: span 2; }
.project-grid li:nth-child(-n+2) { grid-column: span 3; }
.project-card { display: flex; flex-direction: column; height: 100%; border: 1px solid var(--vp-c-divider); border-radius: 12px; overflow: hidden; background: var(--vp-c-bg); color: var(--vp-c-text-1); transition: border-color .2s; }
.project-card:hover { border-color: var(--vp-c-brand-1); }
.project-card :deep(.project-art) { border-bottom: 1px solid var(--vp-c-divider); }
.project-body { display: flex; flex-direction: column; gap: 4px; padding: 16px 24px 24px; }
.project-module { font-size: 12px; line-height: 1.5; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--vp-c-brand-1); }
.project-title { font-size: 18px; line-height: 1.4; font-weight: 600; }
.project-text { font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); }


.home-section.is-closing { background: var(--vp-c-brand-3); }
.is-closing h2, .is-closing .section-lead { color: #fff; }
.is-closing .home-button { border-color: rgba(255, 255, 255, .7); background: transparent; color: #fff; }
.is-closing .home-button:hover { border-color: #fff; background: rgba(255, 255, 255, .12); }
.is-closing .home-button.primary { border-color: transparent; background: #fff; color: #1d4ed8; }
.is-closing .home-button.primary:hover { background: #e8efff; }
.is-closing a:focus-visible { outline-color: #fff; }
.home-note { padding-block: 0 48px; font-size: 14px; line-height: 1.6; color: var(--vp-c-text-2); }
.closing { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px 48px; }
.closing > div:first-child { flex: 1 1 28em; }

a:focus-visible, button:focus-visible, .level-panel:focus-visible { outline: 3px solid var(--vp-c-brand-1); outline-offset: 2px; }

@media (max-width: 960px) {
 .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 40px; }
 .module-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
 .project-grid li, .project-grid li:nth-child(-n+2) { grid-column: span 3; }
 .project-grid li:first-child { grid-column: span 6; }
 h1 { font-size: 40px; }
}
@media (max-width: 600px) {
 .home-wrap { padding: 0 16px; }
 .hero-copy .home-actions { flex-wrap: wrap; }
 .hero-copy .home-button.is-resume { max-width: 100%; }
 .home-hero { padding: 40px 0; }
 .home-section { padding: 48px 0; }
 .module-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; }
 h1 { font-size: 32px; }
 h2 { font-size: 24px; }
 .level-panel { padding: 16px; }
 .project-grid li, .project-grid li:nth-child(-n+2), .project-grid li:first-child { grid-column: span 6; }
 /* Finger-sized rows for the lesson links. */
 .module-card li a { padding: 12px 0; }
}
@media (prefers-reduced-motion: reduce) {
 .home-button, .level-tabs button, .project-card, .progress-track span { transition: none; }
}
</style>
