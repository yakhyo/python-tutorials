<script setup>
// End-of-module checkpoint quiz. Questions live in docs/.vitepress/quizzes/module-XX.json
// (English) and docs/.vitepress/quizzes/uz/module-XX.json (Uzbek).
import { ref, computed, onMounted } from 'vue'
import { withBase, useData } from 'vitepress'
import courseEn from '../course.json'
import courseUz from '../course-uz.json'

const text = {
 en: { best: 'Your best score so far:', question: 'Question', correct: 'Correct.', wrong: 'Not quite.', review: 'Review:', check: 'Check my answers', answerAll: n => `Answer all ${n} questions to check`, perfect: 'Perfect! You are ready for the next module.', good: 'Well done. Review the questions you missed, then move on.', low: 'Review the linked lessons and try again.', retry: 'Try again', reviewList: 'Lessons to review:' },
 uz: { best: 'Eng yaxşi natijangiz:', question: 'Savol', correct: 'Töğri.', wrong: 'Unçalik emas.', review: 'Takrorlang:', check: 'Javoblarimni tekşiriş', answerAll: n => `Tekşiriş uçun barça ${n} ta savolga javob bering`, perfect: 'Ajoyib! Keyingi modulga tayyorsiz.', good: 'Barakalla. Xato qilgan savollaringizni körib çiqing, söng davom eting.', low: 'Havola berilgan darslarni takrorlang va qayta urinib köring.', retry: 'Qayta urinib köriş', reviewList: 'Takrorlaş uçun darslar:' }
}

const props = defineProps({ id: { type: String, required: true } })
const { lang } = useData()
const isUz = computed(() => Boolean(lang.value?.startsWith('uz')))
const t = computed(() => text[isUz.value ? 'uz' : 'en'])
const files = import.meta.glob(['../quizzes/*.json', '../quizzes/uz/*.json'], { eager: true, import: 'default' })
const quiz = computed(() => files[`../quizzes/${isUz.value ? 'uz/' : ''}${props.id}.json`])
const answers = ref([])
const submitted = ref(false)
const best = ref(null)
const storageKey = computed(() => `python-uz:quiz:${isUz.value ? 'uz:' : ''}${props.id}`)

const score = computed(() => quiz.value.questions.reduce((sum, q, i) => sum + (answers.value[i] === q.answer ? 1 : 0), 0))
const total = computed(() => quiz.value?.questions.length || 0)
const allAnswered = computed(() => answers.value.filter(a => a !== undefined).length === total.value)
const lessonTitle = slug => (isUz.value ? courseUz : courseEn).find(lesson => lesson.slug === slug)?.title ?? slug
const lessonLink = slug => withBase(`${isUz.value ? '/uz/darslar/' : '/lessons/'}${slug}`)
// After checking, the lessons behind the missed questions, in course order and without repeats.
const missedLessons = computed(() => [...new Set(quiz.value.questions
 .filter((q, i) => answers.value[i] !== q.answer && q.lesson)
 .map(q => q.lesson))])

onMounted(() => {
 answers.value = Array(total.value).fill(undefined)
 try { const saved = localStorage.getItem(storageKey.value); if (saved !== null) best.value = Number(saved) } catch {}
})

function choose(questionIndex, optionIndex) {
 if (submitted.value) return
 const copy = [...answers.value]
 copy[questionIndex] = optionIndex
 answers.value = copy
}

// Respect the reader's motion setting for the two scrolls below.
const scrollBehavior = () =>
 (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')

function submit() {
 submitted.value = true
 try {
  if (best.value === null || score.value > best.value) { best.value = score.value; localStorage.setItem(storageKey.value, String(score.value)) }
 } catch {}
 requestAnimationFrame(() => document.querySelector('.quiz-result')?.scrollIntoView({ behavior: scrollBehavior(), block: 'center' }))
}

function retry() {
 submitted.value = false
 answers.value = Array(total.value).fill(undefined)
 window.scrollTo({ top: 0, behavior: scrollBehavior() })
}

function optionClass(q, qi, oi) {
 if (!submitted.value) return { selected: answers.value[qi] === oi }
 return { correct: oi === q.answer, wrong: answers.value[qi] === oi && oi !== q.answer }
}
</script>

<template>
 <div v-if="quiz" class="quiz">
  <p class="quiz-intro">{{ quiz.intro }}</p>
  <p v-if="best !== null" class="quiz-best">{{ t.best }} {{ best }} / {{ total }}</p>

  <ol class="quiz-questions">
   <li v-for="(q, qi) in quiz.questions" :key="qi" class="quiz-question">
    <p class="quiz-text">{{ q.question }}</p>
    <pre v-if="q.code" class="quiz-code"><code>{{ q.code }}</code></pre>
    <div class="quiz-options" role="radiogroup" :aria-label="`${t.question} ${qi + 1}`">
     <label v-for="(option, oi) in q.options" :key="oi" :class="['quiz-option', optionClass(q, qi, oi)]">
      <input type="radio" :name="`${id}-q${qi}`" :checked="answers[qi] === oi" :disabled="submitted"
       @change="choose(qi, oi)">
      <span class="quiz-letter" aria-hidden="true">{{ 'ABCD'[oi] }}</span><span class="quiz-option-text">{{ option }}</span>
     </label>
    </div>
    <div v-if="submitted" :class="['quiz-feedback', answers[qi] === q.answer ? 'is-right' : 'is-wrong']">
     <strong><Yes v-if="answers[qi] === q.answer" /><No v-else /> {{ answers[qi] === q.answer ? t.correct : t.wrong }}</strong>
     {{ q.explanation }}
     <a v-if="q.lesson" :href="lessonLink(q.lesson)">{{ t.review }} {{ lessonTitle(q.lesson) }}</a>
    </div>
   </li>
  </ol>

  <div class="quiz-actions">
   <button v-if="!submitted" class="quiz-submit" :disabled="!allAnswered" @click="submit">
    {{ allAnswered ? t.check : t.answerAll(total) }}
   </button>
   <template v-else>
    <p class="quiz-result" role="status"><strong>{{ score }} / {{ total }}</strong>
     — {{ score === total ? t.perfect : score >= total * 0.7 ? t.good : t.low }}</p>
    <div v-if="missedLessons.length" class="quiz-review">
     <strong>{{ t.reviewList }}</strong>
     <ul><li v-for="slug in missedLessons" :key="slug"><a :href="lessonLink(slug)">{{ lessonTitle(slug) }}</a></li></ul>
    </div>
    <button class="quiz-submit" @click="retry">{{ t.retry }}</button>
   </template>
  </div>
 </div>
</template>
