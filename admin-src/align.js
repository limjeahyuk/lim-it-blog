/*
  /admin — 문단 정렬 (가운데 · 오른쪽).

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 `public/admin/editor.js` 예요.

  **왜 감싸는 블록인가.** 문단(paragraph)에 정렬 속성만 붙이는 쪽이 쓰기에는
  더 좋은데, 그러면 마크다운으로 **안 나갑니다**. `@tiptap/markdown` 은
  `paragraph` 같은 기본 토큰의 렌더러를 먼저 잡아 두고 그것만 씁니다
  (registry 가 nodeTypeRegistry 보다 우선 — 번들에서 확인하고, 실제로
  가로채 보려다 실패했습니다). 그래서 **새 이름의 블록**으로 감쌉니다.

  ⚠ **정렬을 준 덩어리만 HTML 로 나갑니다** — `<div class="ta-center">…</div>`.
    마크다운에는 정렬을 적을 자리가 없어서인데, 사진 크기를 `<img width>` 로
    내보내는 것과 같은 방식입니다 (§6-2). 안 준 문단은 하나도 안 건드립니다.

  ⚠ **안쪽도 HTML 로 내보냅니다.** CommonMark 는 HTML 블록 **안의 마크다운을
    안 읽습니다** — `<div>**굵게**</div>` 는 블로그에서 별표가 그대로 보입니다.
    그래서 `generateHTML` 로 `<strong>`·`<span class="c-teal">`·`<mark>` 까지
    HTML 로 바꿔서 넣습니다. 되읽는 쪽은 그 HTML 을 그대로 파싱합니다.
*/
import { Node, generateHTML, mergeAttributes } from '@tiptap/core'

/** 도구 띠에 나오는 것들. `left` 는 감싼 것을 푸는 것입니다. */
export const ALIGNS = [
  { k: 'left', label: '왼쪽' },
  { k: 'center', label: '가운데' },
  { k: 'right', label: '오른쪽' },
]

/*
  안쪽을 HTML 로 바꿀 때 쓰는 확장 묶음.

  ⚠ **왜 모듈 변수인가.** `renderMarkdown` 안에서는 `this.options` 가 없습니다 —
    라이브러리가 그 함수를 확장 컨텍스트가 아닌 핸들러에 매어 부릅니다
    (번들에서 확인). 그래서 `makeExtensions()` 가 만들면서 여기에 넣어 줍니다.

  ⚠ 재귀는 안 됩니다. `generateHTML` 은 `renderHTML` 만 쓰고 `renderMarkdown`
    을 안 부릅니다.
*/
let EXTENSIONS_FOR_HTML = []

export function setAlignExtensions(list) {
  EXTENSIONS_FOR_HTML = list
}

/** 같은 묶음을 표(table.js)도 씁니다 — 칸 너비를 준 표는 HTML 로 나갑니다. */
export function htmlExtensions() {
  return EXTENSIONS_FOR_HTML
}

export const Align = Node.create({
  name: 'align',
  group: 'block',
  /* 문단 하나만이 아니라 사진·제목이 이어진 덩어리도 같이 감쌉니다. */
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      align: {
        default: 'center',
        parseHTML: (el) => (/\bta-right\b/.test(el.className) ? 'right' : 'center'),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div.ta-center' }, { tag: 'div.ta-right' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ta-' + node.attrs.align }), 0]
  },

  renderMarkdown(node) {
    const align = (node.attrs && node.attrs.align) === 'right' ? 'right' : 'center'
    const inner = generateHTML({ type: 'doc', content: node.content || [] }, EXTENSIONS_FOR_HTML)
    return `<div class="ta-${align}">${inner}</div>`
  },

  addCommands() {
    return {
      /* 이미 같은 정렬이면 풉니다 — 같은 단추를 다시 누르는 것이 되돌리기입니다. */
      setAlign:
        (align) =>
        ({ editor, chain }) => {
          if (align === 'left' || editor.isActive('align', { align })) {
            return chain().focus().lift('align').run()
          }
          if (editor.isActive('align')) {
            return chain().focus().updateAttributes('align', { align }).run()
          }
          return chain().focus().wrapIn('align', { align }).run()
        },
    }
  },
})
