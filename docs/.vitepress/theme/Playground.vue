<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
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
const code = ref(initial()), output = ref(''), status = ref(''), showInputs = ref(false)
const busy = ref(false), inputs = ref(''), images = ref([]), verdict = ref(null), copied = ref(false)

let worker, timer, pending
watch(() => props.code, () => { stop(); code.value = initial() })

function stop() {
 worker?.terminate(); worker = undefined; clearTimeout(timer)
 if (busy.value) status.value = t.value.stopped
 busy.value = false; pending = undefined
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

function execute(source) {
 ensureWorker()
 return new Promise(resolve => {
  pending = resolve
  timer = setTimeout(stop, 120000)
  worker.postMessage({ code: source, inputs: inputs.value.split('\n') })
 })
}

async function run() {
 if (busy.value) return
 busy.value = true; images.value = []; verdict.value = null; output.value = ''; status.value = t.value.loading
 const result = await execute(code.value)
 if (!result) return
 images.value = result.images || []
 output.value = result.text || (images.value.length ? '' : t.value.noOutput)
 status.value = ''; busy.value = false
}

const normalize = text => (text || '').split('\n').map(line => line.trimEnd()).join('\n').trim()

async function check() {
 if (busy.value) return
 busy.value = true; images.value = []; verdict.value = null; output.value = ''; status.value = t.value.loading
 const expected = await execute(props.solution)
 if (!expected) return
 const actual = await execute(code.value)
 if (!actual) return
 status.value = ''; busy.value = false
 images.value = actual.images || []
 output.value = actual.text || t.value.noOutput
 if (expected.type === 'error') verdict.value = { kind: 'unknown' }
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
    <button :class="{ 'is-active': showInputs }" @click="showInputs = !showInputs" :aria-expanded="showInputs" :title="t.inputsSummary">input()</button>
    <button @click="copy">{{ copied ? t.copied : t.copy }}</button>
    <button @click="reset" :disabled="busy">{{ t.reset }}</button>
    <button v-if="closable" @click="stop(); emit('close')">{{ t.close }}</button>
    <button v-if="busy" @click="stop">{{ t.stop }}</button>
    <button :class="{ primary: !isExercise }" @click="run" :disabled="busy">{{ busy ? t.waiting : t.run }}</button>
    <button v-if="isExercise" class="primary" @click="check" :disabled="busy">{{ t.check }}</button>
   </div>
  </div>
  <ClientOnly><CodeEditor v-model="code" :label="t.codeLabel" @run="isExercise ? check() : run()" /></ClientOnly>
  <div v-if="showInputs" class="editor-inputs"><label>{{ t.inputsHelp }}<textarea v-model="inputs" rows="2" :aria-label="t.inputsLabel" /></label></div>
  <div v-if="verdict" :class="['editor-verdict', `is-${verdict.kind}`]" role="status">
   <strong>
    <Yes v-if="verdict.kind === 'pass'" />
    <No v-else-if="verdict.kind === 'fail'" />
    <span v-else class="verdict-icon" aria-hidden="true">{{ verdict.kind === 'error' ? '!' : '?' }}</span>
    {{ t.verdict[verdict.kind] }}</strong>
   <details v-if="verdict.kind === 'fail'"><summary>{{ t.showExpected }}</summary><pre>{{ verdict.expected }}</pre></details>
  </div>
  <div v-if="output || images.length" class="editor-output">
   <div class="editor-output-label">{{ t.outputLabel }}</div>
   <pre v-if="output" class="python-output">{{ output }}</pre>
   <div v-if="images.length" class="python-images"><img v-for="(img, i) in images" :key="i" :src="`data:image/png;base64,${img}`" :alt="`${t.chartAlt} ${i + 1}`" /></div>
  </div>
  <div v-else class="editor-hint">{{ isExercise ? t.exerciseIdle : t.idle }}</div>
  <p class="editor-status" role="status">{{ status }}</p>
  <p class="editor-keys">{{ t.keyHints }}</p>
 </section>
</template>
