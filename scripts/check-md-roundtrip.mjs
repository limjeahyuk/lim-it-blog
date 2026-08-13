/*
  마크다운 왕복 검사.

  /admin 의 tiptap 편집기는 글을 열 때 마크다운을 tiptap 문서로 바꾸고,
  저장할 때 다시 마크다운으로 되돌립니다. 이 왕복에서 글자가 바뀌면 옛 글을
  한 번 열었다 저장하는 것만으로 파일이 통째로 다시 쓰입니다.

  그래서 글 전체를 미리 돌려 보고 **어떤 글이 안 돌아오는지** 세어 둡니다.
  많이 바뀌는 글은 서식 모드로 열지 말고 원문 모드로 고치면 됩니다.

    node scripts/check-md-roundtrip.mjs           # 요약
    node scripts/check-md-roundtrip.mjs --diff    # 달라진 줄까지
*/
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>')
globalThis.window = dom.window
globalThis.document = dom.window.document
// node 25 의 navigator 는 getter 라 그냥 못 덮습니다.
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
})
globalThis.DOMParser = dom.window.DOMParser
globalThis.Node = dom.window.Node
globalThis.Element = dom.window.Element
globalThis.HTMLElement = dom.window.HTMLElement

const { Editor } = await import('@tiptap/core')
const { EXTENSIONS, normalizeMarkdown } = await import('../admin-src/editor.js')

const DIR = 'src/content/posts'
const showDiff = process.argv.includes('--diff')

const editor = new Editor({
  element: document.createElement('div'),
  extensions: EXTENSIONS,
  content: '',
  contentType: 'markdown',
})

/** frontmatter 를 떼고 본문만 돌려줍니다. */
function bodyOf(raw) {
  const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
  return m ? raw.slice(m[0].length) : raw
}

/**
 * 글자만 남깁니다 — 표시 기호(`#`, `-`, `|`, 역슬래시…)와 공백을 다 뺍니다.
 *
 * 모양이 달라지는 것(`* * *` → `---`)과 **내용이 없어지는 것**(표가 통째로
 * 사라지는 것)은 완전히 다른 문제입니다. 앞은 참아도 되지만 뒤는 안 됩니다.
 */
function letters(s) {
  return s
    .replace(/[\s#>*_~`|\\+-]+/g, '')
    .replace(/\[|\]|\(|\)/g, '')
}

/*
  "의미 없는 차이"의 기준은 편집기와 같아야 합니다. 편집기는 이 기준으로
  글을 열 때 서식/원문을 고르기 때문에, 여기서만 느슨하게 보면 검사에서는
  괜찮다고 나오고 폰에서는 원문으로 열리는 일이 생깁니다.
*/
const normalize = normalizeMarkdown

const files = readdirSync(DIR).filter((f) => f.endsWith('.md'))
const changed = []
const lost = []

for (const file of files) {
  const body = bodyOf(readFileSync(join(DIR, file), 'utf8'))
  let out
  try {
    editor.commands.setContent(body, { contentType: 'markdown' })
    out = editor.getMarkdown()
  } catch (err) {
    changed.push({ file, lines: -1, err: err.message })
    continue
  }

  const before = letters(body)
  const after = letters(out)
  if (before !== after) {
    lost.push({ file, before: before.length, after: after.length })
  }

  const a = normalize(body).split('\n')
  const b = normalize(out).split('\n')
  let diff = 0
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) diff++
  }
  if (diff > 0) changed.push({ file, lines: diff, a, b })
}

changed.sort((x, y) => y.lines - x.lines)

console.log(`글 ${files.length}개 중 ${changed.length}개가 왕복에서 모양이 달라집니다.`)
console.log(`그중 글자가 없어지거나 늘어난 글: ${lost.length}개\n`)

for (const l of lost) {
  const sign = l.after > l.before ? '+' : ''
  console.log(`  ⚠ ${l.file} — 글자 ${l.before} → ${l.after} (${sign}${l.after - l.before})`)
}
if (lost.length) console.log()

for (const c of changed) {
  if (c.err) {
    console.log(`  ✗ ${c.file} — 오류: ${c.err}`)
    continue
  }
  console.log(`  ${String(c.lines).padStart(4)}줄  ${c.file}`)
  if (showDiff) {
    for (let i = 0; i < Math.max(c.a.length, c.b.length); i++) {
      if (c.a[i] !== c.b[i]) {
        console.log(`        - ${JSON.stringify(c.a[i])}`)
        console.log(`        + ${JSON.stringify(c.b[i])}`)
      }
    }
    console.log()
  }
}

process.exit(0)
