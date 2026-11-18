<script setup>
import { ref, computed, nextTick, onBeforeUnmount, watch } from 'vue'
import { withBase } from 'vitepress'
import { useT } from './i18n.js'
import CodeEditor from './CodeEditor.vue'

const t = useT()
const props = defineProps({
 code: { type: String, default: '' },
 // When a solution is given, the editor becomes an exercise with a Check button.
 solution: { type: String, default: '' },
 title: { type: String, default: 'main.py' },
 // Shows a Close button (used when an editor replaces a lesson code block).
 closable: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])
const isExercise = computed(() => Boolean(props.solution))
const initial = () => props.code || (isExercise.value ? t.value.starterCode : t.value.defaultCode)
const code = ref(initial()), output = ref(''), status = ref('')
const busy = ref(false), images = ref([]), verdict = ref(null), copied = ref(false)
// input(): the program stops at each question and the answer is typed into the output, like a terminal.
const asking = ref(null), answer = ref(''), answerField = ref(null), outputBox = ref(null)

let worker, timer, pending, answered
watch(() => props.code, () => { stop(); code.value = initial() })

function stop() {
 worker?.terminate(); worker = undefined; clearTimeout(timer)
 if (busy.value) status.value = t.value.stopped
 busy.value = false; pending = undefined
 asking.value = null; answered?.(null); answered = undefined
}

function ensureWorker() {
 if (worker) return
 worker = new Worker(withBase('/python-worker.js'), { type: 'module' })
 worker.onmessage = ({ data }) => {
  if (data.type === 'packages') status.value = t.value.packages
  else if (data.type === 'ready') { status.value = t.value.running; clearTimeout(timer); timer = setTimeout(stop, data.heavy ? 45000 : 15000) }
  else { clearTimeout(timer); const resolve = pending; pending = undefined; resolve?.(data) }
 }
 worker.onerror = () => { stop(); status.value = t.value.loadFailed }
}

function execute(source, inputs, seed, replay) {
 ensureWorker()
 return new Promise(resolve => {
  pending = resolve
  timer = setTimeout(stop, 120000)
  worker.postMessage({ code: source, inputs: [...inputs], seed, replay })
 })
}

// Runs `source` to the end. Whenever it calls input() with no answer left, the worker stops and
// reports the question; it is shown at the end of the output, the reply is added to `answers`,
// and the program runs again from the start with every answer so far. The worker gives each of
// those runs the same random seed and the same files, so the program continues where it stopped.
async function interact(source, answers, seed) {
 for (let replay = false; ; replay = true) {
  const result = await execute(source, answers, seed, replay)
  if (!result || result.type !== 'input') return result
  output.value = result.text ? result.text + '\n' : ''
  status.value = ''; answer.value = ''; asking.value = result.prompt
  await nextTick()
  answerField.value?.focus({ preventScroll: true })
  const reply = await new Promise(resolve => { answered = resolve })
  if (reply === null) return undefined
  answers.push(reply)
  output.value += `${result.prompt}${reply}\n`
  asking.value = null; status.value = t.value.running
 }
}
function submitAnswer() { const resolve = answered; answered = undefined; resolve?.(answer.value) }
const newSeed = () => Math.floor(Math.random() * 2 ** 31)
function begin() { busy.value = true; images.value = []; verdict.value = null; output.value = ''; status.value = t.value.loading }
// Keep the newest line in view. Either the <pre> or the output panel around it scrolls, depending on the page.
watch([output, asking], async () => {
 await nextTick()
 for (const box of [outputBox.value, outputBox.value?.parentElement]) if (box) box.scrollTop = box.scrollHeight
})

async function run() {
 if (busy.value) return
 begin()
 const result = await interact(code.value, [], newSeed())
 if (!result) return
 images.value = result.images || []
 output.value = result.text || (images.value.length ? '' : t.value.noOutput)
 status.value = ''; busy.value = false
}

const normalize = text => (text || '').split('\n').map(line => line.trimEnd()).join('\n').trim()

// The learner's code runs first and is asked for input() answers as usual; the solution then runs
// with the same answers, the same seed and the same starting files, and the two outputs are compared.
async function check() {
 if (busy.value) return
 begin()
 const answers = [], seed = newSeed()
 const actual = await interact(code.value, answers, seed)
 if (!actual) return
 status.value = t.value.running
 const expected = await execute(props.solution, answers, seed, true)
 if (!expected) return
 status.value = ''; busy.value = false
 images.value = actual.images || []
 output.value = actual.text || t.value.noOutput
 if (expected.type !== 'done') verdict.value = { kind: 'unknown' }
 else if (actual.type === 'error') verdict.value = { kind: 'error' }
 else if (normalize(actual.text) === normalize(expected.text)) verdict.value = { kind: 'pass' }
 else verdict.value = { kind: 'fail', expected: normalize(expected.text) }
}

function reset() { code.value = initial(); verdict.value = null; output.value = ''; status.value = '' }

// VitePress puts a copy button on static code blocks; the editor replaces the block, so it needs its own.
let copyTimer
async function copy() {
 try {
  await navigator.clipboard.writeText(code.value)
  copied.value = true
  clearTimeout(copyTimer); copyTimer = setTimeout(() => { copied.value = false }, 1500)
 } catch { /* clipboard blocked: the code is selectable in the editor */ }
}
onBeforeUnmount(() => { stop(); clearTimeout(copyTimer) })
</script>

<template>
 <section :class="['python-editor', { 'is-exercise': isExercise, 'is-standalone': !closable && !isExercise }]" :aria-label="t.editorLabel">
  <div class="editor-toolbar">
   <span class="editor-title">{{ isExercise ? t.exerciseTitle : title }}</span>
   <div class="editor-buttons">
    <button :class="['icon-button', { 'is-done': copied }]" @click="copy" :title="copied ? t.copied : t.copy" :aria-label="copied ? t.copied : t.copy">
     <svg v-if="copied" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
     <svg v-else viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
    </button>
    <button class="icon-button" @click="reset" :disabled="busy" :title="t.reset" :aria-label="t.reset">
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.6-5.9" /><path d="M4 4v5h5" /></svg>
    </button>
    <button v-if="busy" class="stop" @click="stop">{{ t.stop }}</button>
    <template v-else>
     <button :class="{ primary: !isExercise }" @click="run" :title="t.runTitle">{{ t.run }}</button>
     <button v-if="isExercise" class="primary" @click="check" :title="t.runTitle">{{ t.check }}</button>
    </template>
    <button v-if="closable" class="icon-button" @click="stop(); emit('close')" :title="t.close" :aria-label="t.close">
     <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </button>
   </div>
  </div>
  <ClientOnly><CodeEditor v-model="code" :label="t.codeLabel" @run="isExercise ? check() : run()" /></ClientOnly>
  <div v-if="verdict" :class="['editor-verdict', `is-${verdict.kind}`]" role="status">
   <strong>
    <Yes v-if="verdict.kind === 'pass'" />
    <No v-else-if="verdict.kind === 'fail'" />
    <span v-else class="verdict-icon" aria-hidden="true">{{ verdict.kind === 'error' ? '!' : '?' }}</span>
    {{ t.verdict[verdict.kind] }}</strong>
   <details v-if="verdict.kind === 'fail'"><summary>{{ t.showExpected }}</summary><pre>{{ verdict.expected }}</pre></details>
  </div>
  <div class="editor-output" @click="answerField?.focus({ preventScroll: true })">
   <div class="editor-output-label">{{ t.outputLabel }}</div>
   <pre v-if="output || asking !== null" ref="outputBox" class="python-output">{{ output }}<label v-if="asking !== null" class="terminal-ask">{{ asking }}<input ref="answerField" v-model="answer" class="terminal-input" type="text" :style="{ width: `${answer.length}ch` }" :aria-label="asking.trim() || t.answerLabel" autocomplete="off" autocapitalize="off" spellcheck="false" @keydown.enter.prevent="submitAnswer" /><span class="terminal-caret" aria-hidden="true">_</span></label></pre>
   <p v-else-if="!images.length" class="editor-idle">{{ isExercise ? t.exerciseIdle : t.idle }}</p>
   <div v-if="images.length" class="python-images"><img v-for="(img, i) in images" :key="i" :src="`data:image/png;base64,${img}`" :alt="`${t.chartAlt} ${i + 1}`" /></div>
  </div>
  <p class="editor-status" role="status">{{ status }}</p>
  <p class="visually-hidden">{{ t.keyHints }}</p>
 </section>
</template>
