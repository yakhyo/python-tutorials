import { computed } from 'vue'
import { useData } from 'vitepress'

const messages = {
 en: {
  defaultCode: 'print("Hello, world!")',
  idle: 'Press Run or Ctrl + Enter. The output appears here.', close: 'Close', outputLabel: 'Output', loading: 'Loading Python… The first run needs an internet connection.',
  running: 'Running…', packages: 'Loading packages (numpy, pandas, matplotlib)… this can take a few seconds the first time.', noOutput: 'Code ran without errors (no output).', chartAlt: 'Chart', stopped: 'Stopped. The Python session will restart.', loadFailed: 'Python failed to load. Check your connection and try again.',
  editorLabel: 'Interactive Python editor', inBrowser: 'Python · in your browser', codeLabel: 'Python code',
  keyHints: 'Ctrl/Cmd + Enter runs the code. Esc, then Tab moves focus out of the editor.',
  runTitle: 'Run (Ctrl + Enter)', answerLabel: 'Your answer',
  reset: 'Reset', stop: 'Stop', run: '▶ Run', waiting: 'Waiting…', copy: 'Copy', copied: 'Copied',
  labLink: 'Practice this module in the Python Lab',
  starterCode: '# Write your solution here\n', exerciseIdle: 'Write your solution, then press Check to compare your output with the expected output (Ctrl + Enter).', exerciseTitle: 'Your solution', check: 'Check', showExpected: 'Show expected output', solveHere: 'Solve in the browser', closeEditor: 'Close editor', runBlock: '▶ Run in editor',
  verdict: { pass: 'Correct: your output matches the expected output.', fail: 'Not yet: your output is different from the expected output.', error: 'Your code raised an error. Read the message below.', unknown: 'This exercise cannot be checked automatically. Compare with the solution.' }
 },
 uz: {
  defaultCode: 'print("Salom, dunyo!")',
  idle: 'Işga tuşiriş tugmasini yoki Ctrl + Enter ni bosing. Natija şu yerda çiqadi.', close: 'Yopiş', outputLabel: 'Natija', loading: 'Python yuklanmoqda… Birinçi işga tuşirişda internet kerak.',
  running: 'Bajarilmoqda…', packages: 'Paketlar yuklanmoqda (numpy, pandas, matplotlib)… birinçi safar bir neçta soniya oladi.', noOutput: 'Kod xatosiz bajarildi (natija çiqmadi).', chartAlt: 'Grafik', stopped: 'Töxtatildi. Python seansi qayta işga tuşadi.', loadFailed: 'Python yuklanmadi. Internet aloqasini tekşirib, qayta urinib köring.',
  editorLabel: 'Interaktiv Python muharriri', inBrowser: 'Python · brauzeringizda', codeLabel: 'Python kodi',
  keyHints: 'Ctrl/Cmd + Enter kodni işga tuşiradi. Esc, söng Tab fokusni muharrirdan çiqaradi.',
  runTitle: 'Işga tuşiriş (Ctrl + Enter)', answerLabel: 'Javobingiz',
  reset: 'Tiklaş', stop: 'Töxtatiş', run: '▶ Işga tuşiriş', waiting: 'Kutilmoqda…', copy: 'Nusxa oliş', copied: 'Nusxa olindi',
  labLink: 'Bu modulni Python laboratoriyasida maşq qiling',
  starterCode: '# Yeçimingizni şu yerga yozing\n', exerciseIdle: 'Yeçimingizni yozing, söng natijangizni kutilgan natija bilan soliştiriş uçun Tekşiriş tugmasini bosing (Ctrl + Enter).', exerciseTitle: 'Sizning yeçimingiz', check: 'Tekşiriş', showExpected: 'Kutilgan natijani körsatiş', solveHere: 'Brauzerda yeçiş', closeEditor: 'Muharrirni yopiş', runBlock: '▶ Muharrirda işga tuşiriş',
  verdict: { pass: 'Töğri: natijangiz kutilgan natijaga mos keladi.', fail: 'Hali emas: natijangiz kutilgan natijadan farq qiladi.', error: 'Kodingiz xato berdi. Quyidagi xabarni öqing.', unknown: 'Bu maşqni avtomatik tekşirib bölmaydi. Yeçim bilan soliştiring.' }
 }
}

export function useT() {
 const { lang } = useData()
 return computed(() => messages[lang.value?.startsWith('uz') ? 'uz' : 'en'])
}
