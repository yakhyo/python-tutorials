<script setup>
// CodeMirror 6 editor for Python, themed with VitePress colors (light and dark).
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { syntaxHighlighting, HighlightStyle, indentOnInput, bracketMatching, indentUnit } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const props = defineProps({ modelValue: { type: String, default: '' }, label: { type: String, default: 'Python code' } })
const emit = defineEmits(['update:modelValue', 'run'])
const host = ref(null)
let view

const highlight = HighlightStyle.define([
 { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.definitionKeyword, tags.moduleKeyword], color: 'var(--cm-keyword)' },
 { tag: [tags.string, tags.special(tags.string)], color: 'var(--cm-string)' },
 { tag: [tags.number, tags.bool, tags.null], color: 'var(--cm-number)' },
 { tag: [tags.comment, tags.lineComment], color: 'var(--cm-comment)', fontStyle: 'italic' },
 { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--cm-function)' },
 { tag: [tags.definition(tags.variableName), tags.className, tags.definition(tags.className)], color: 'var(--cm-definition)' },
 { tag: [tags.self, tags.standard(tags.variableName)], color: 'var(--cm-builtin)' },
 { tag: tags.operator, color: 'var(--cm-operator)' }
])

const theme = EditorView.theme({
 '&': { backgroundColor: 'var(--vp-code-block-bg)', color: 'var(--vp-c-text-1)', fontSize: 'var(--vp-code-font-size, 14px)' },
 '.cm-content': { fontFamily: 'var(--vp-font-family-mono)', padding: '16px 0', caretColor: 'var(--vp-c-brand-1)' },
 '.cm-line': { padding: '0 24px 0 8px' },
 '.cm-gutters': { backgroundColor: 'var(--vp-code-block-bg)', color: 'var(--vp-c-text-3)', border: 'none', paddingLeft: '8px' },
 '.cm-lineNumbers .cm-gutterElement': { minWidth: '24px', padding: '0 4px 0 0' },
 '.cm-activeLine': { backgroundColor: 'var(--vp-c-default-soft)' },
 '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--vp-c-text-2)' },
 '&.cm-focused': { outline: 'none' },
 '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: 'var(--vp-c-brand-soft) !important' },
 '.cm-cursor': { borderLeftColor: 'var(--vp-c-brand-1)' },
 '.cm-scroller': { lineHeight: 'var(--vp-code-line-height, 1.7)', maxHeight: '560px', overflow: 'auto' }
})

onMounted(() => {
 view = new EditorView({
  parent: host.value,
  state: EditorState.create({
   doc: props.modelValue,
   extensions: [
    lineNumbers(), history(), drawSelection(), highlightActiveLine(), indentOnInput(), bracketMatching(),
    indentUnit.of('    '), EditorState.tabSize.of(4), python(), syntaxHighlighting(highlight), theme,
    EditorView.contentAttributes.of({ 'aria-label': props.label, spellcheck: 'false', autocapitalize: 'off' }),
    keymap.of([{ key: 'Mod-Enter', run: () => { emit('run'); return true } }, indentWithTab, ...defaultKeymap, ...historyKeymap]),
    EditorView.updateListener.of(update => { if (update.docChanged) emit('update:modelValue', update.state.doc.toString()) })
   ]
  })
 })
})

watch(() => props.modelValue, value => {
 if (view && value !== view.state.doc.toString()) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
})

onBeforeUnmount(() => view?.destroy())
</script>

<template><div ref="host" class="code-editor"></div></template>
