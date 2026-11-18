<script setup>
// The class diagram of the library project (lesson "oop-project"), drawn in the site's colors.
// A diamond marks the class that owns the other one, and the line's arrowhead points at the class
// it owns; a hollow triangle points at a parent class.
// Class, attribute and method names are code, so only the two words below are translated.
defineProps({
 label: { type: String, required: true },
 inherits: { type: String, default: 'inherits' }
})

const HEAD = 40, LINE = 22, PAD = 16
const classes = [
 { name: 'Library', x: 24, y: 24, w: 250, attrs: ['name', 'books: {isbn: Book}', 'members: {id: Member}', 'notifier', 'loans: [Loan]'], methods: ['borrow()', 'return_book()', 'mark_lost()', 'status_of()', 'overdue_loans()', 'search()', 'report()', 'send_reminders()', 'save() / load()'] },
 { name: 'Loan', x: 24, y: 450, w: 250, attrs: ['isbn, member_id', 'borrowed_on', 'due_on', 'returned_on'], methods: [] },
 { name: 'Book', x: 440, y: 24, w: 256, attrs: ['isbn, title', 'author, year', 'lost'], methods: [] },
 { name: 'Member', x: 440, y: 178, w: 256, attrs: ['max_books = 5', 'loan_days = 21'], methods: [] },
 { name: 'StudentMember', x: 440, y: 326, w: 256, attrs: ['max_books = 2'], methods: [] },
 { name: 'Notifier (ABC)', x: 440, y: 436, w: 256, attrs: [], methods: ['notify()'] },
 { name: 'ConsoleNotifier', x: 440, y: 562, w: 256, attrs: [], methods: [] }
].map(item => {
 const attrsHeight = item.attrs.length ? item.attrs.length * LINE + PAD : 0
 const methodsHeight = item.methods.length ? item.methods.length * LINE + PAD : 0
 return { ...item, attrsHeight, methodsHeight, height: HEAD + attrsHeight + methodsHeight }
})
</script>

<template>
 <figure class="class-diagram">
  <svg viewBox="0 0 720 626" role="img" :aria-label="label">
   <!-- Library owns books, members, a notifier and loans. Each line starts at the attribute that
        holds the objects and ends in an arrowhead on the class it holds. The three lines to the
        right are nested (members outside notifier) so that they never cross. -->
   <path class="link" d="M294 108H428M294 130H400V228H428M294 152H316V475H428M110 424V438" />
   <path class="arrowhead" d="M440 108l-12-6v12zM440 228l-12-6v12zM440 475l-12-6v12zM110 450l-6-12h12z" />
   <path class="diamond" d="M274 108l10-6l10 6l-10 6zM274 130l10-6l10 6l-10 6zM274 152l10-6l10 6l-10 6zM110 404l6 10l-6 10l-6-10z" />
   <text class="rel" x="364" y="98" text-anchor="middle">books</text>
   <text class="rel" x="392" y="184" text-anchor="end">members</text>
   <text class="rel" x="326" y="466">notifier</text>
   <text class="rel" x="124" y="434">loans</text>
   <!-- StudentMember is a Member; ConsoleNotifier is a Notifier. -->
   <path class="link" d="M568 292V326M568 528V562" />
   <path class="triangle" d="M568 278l8 14h-16zM568 514l8 14h-16z" />
   <text class="rel" x="584" y="314">{{ inherits }}</text>
   <text class="rel" x="584" y="550">{{ inherits }}</text>

   <g v-for="item in classes" :key="item.name" :transform="`translate(${item.x} ${item.y})`">
    <rect class="box" :width="item.w" :height="item.height" rx="8" />
    <path class="head-fill" :d="`M0 ${HEAD}V8a8 8 0 0 1 8-8H${item.w - 8}a8 8 0 0 1 8 8V${HEAD}z`" />
    <text class="name" :x="item.w / 2" y="25" text-anchor="middle">{{ item.name }}</text>
    <path v-if="item.attrs.length || item.methods.length" class="rule" :d="`M0 ${HEAD}H${item.w}`" />
    <text v-for="(line, i) in item.attrs" :key="line" class="member" x="16" :y="HEAD + 26 + i * LINE">{{ line }}</text>
    <path v-if="item.attrs.length && item.methods.length" class="rule" :d="`M0 ${HEAD + item.attrsHeight}H${item.w}`" />
    <text v-for="(line, i) in item.methods" :key="line" class="member method" x="16" :y="HEAD + item.attrsHeight + 26 + i * LINE">{{ line }}</text>
   </g>
  </svg>
 </figure>
</template>

<style scoped>
/* Wide drawings scroll inside their own frame on a phone; the page itself never scrolls sideways. */
.class-diagram { margin: 24px 0; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); overflow-x: auto; }
svg { display: block; width: 100%; min-width: 600px; max-width: 720px; height: auto; margin: 0 auto; }
.box { fill: var(--vp-c-bg); stroke: var(--vp-c-divider); stroke-width: 1.5; }
.head-fill { fill: var(--vp-c-brand-soft); }
.rule { fill: none; stroke: var(--vp-c-divider); stroke-width: 1.5; }
.name { fill: var(--vp-c-text-1); font: 600 15px var(--vp-font-family-mono); }
.member { fill: var(--vp-c-text-2); font: 13px var(--vp-font-family-mono); }
.method { fill: var(--vp-c-brand-1); }
.link { fill: none; stroke: var(--vp-c-text-2); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.arrowhead { fill: var(--vp-c-text-2); stroke: var(--vp-c-text-2); stroke-width: 1; stroke-linejoin: round; }
.diamond, .triangle { fill: var(--vp-c-bg-soft); stroke: var(--vp-c-text-2); stroke-width: 1.5; stroke-linejoin: round; }
.rel { fill: var(--vp-c-text-2); font: 12px var(--vp-font-family-base); }
</style>
