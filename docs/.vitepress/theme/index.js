import { h, watch } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Playground from './Playground.vue'
import Difficulty from './Difficulty.vue'
import Mark from './Mark.vue'
import Quiz from './Quiz.vue'
import CodeEnhancer from './CodeEnhancer.vue'
import LabLink from './LabLink.vue'
import CourseHome from './CourseHome.vue'
import LibraryClasses from './LibraryClasses.vue'
import FlowDiagram from './FlowDiagram.vue'
import TreeDiagram from './TreeDiagram.vue'
import CodeAnatomy from './CodeAnatomy.vue'
import SliceDiagram from './SliceDiagram.vue'
import FigureAxes from './FigureAxes.vue'
import './style.css'

export default {
 extends: DefaultTheme,
 // CodeEnhancer adds Run buttons to code blocks and Check editors to exercises;
 // LabLink points each lesson at its module notebook in the Python Lab.
 Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => [h(CodeEnhancer), h(LabLink)] }),
 // Remember the last lesson opened and every lesson opened so far, so the landing page can
 // offer to continue and show progress. This stays in the learner's browser.
 setup() {
  const route = useRoute()
  if (!inBrowser) return
  watch(() => route.path, path => {
   const lesson = path.match(/\/(?:en|uz)\/lessons\/([a-z0-9-]+)/)
   if (!lesson) return
   try {
    localStorage.setItem('python-uz:last-lesson', lesson[1])
    const opened = new Set(JSON.parse(localStorage.getItem('python-uz:opened') || '[]'))
    localStorage.setItem('python-uz:opened', JSON.stringify([...opened.add(lesson[1])]))
   } catch { /* storage is blocked */ }
  }, { immediate: true })
 },
 enhanceApp({ app }) {
  app.component('PythonPlayground', Playground)
  app.component('Difficulty', Difficulty)
  app.component('Quiz', Quiz)
  app.component('CourseHome', CourseHome)
  app.component('LibraryClasses', LibraryClasses)
  app.component('FlowDiagram', FlowDiagram)
  app.component('TreeDiagram', TreeDiagram)
  app.component('CodeAnatomy', CodeAnatomy)
  app.component('SliceDiagram', SliceDiagram)
  app.component('FigureAxes', FigureAxes)
  app.component('Yes', { render: () => h(Mark, { ok: true }) })
  app.component('No', { render: () => h(Mark, { ok: false }) })
 }
}
