/*
  /admin — 노션식 표 손잡이.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 `public/admin/editor.js` 예요.

  **왜 만들었나.** 표를 넣고 나면 행·열을 늘리는 길이 도구 띠 셋째 줄의
  `행+ 행↑ 행− 열+ 열← 열−` 뿐이었습니다. 표에서 멀리 떨어진 자리에 작은
  글자 여섯 개라, 어느 단추가 어디를 가리키는지 화면만 봐서는 알 수가
  없었습니다. 노션처럼 **표 자체에 손잡이를 붙입니다.**

    ┌ ＋ 열                      열 손잡이(위) · 눌러서 그 열을 고릅니다
    │  ┌──────┬──────┐
    행 │      │      │           행 손잡이(왼쪽) · 눌러서 그 행을 고릅니다
    손 ├──────┼──────┤
    잡 │      │      │
    이 └──────┴──────┘
       ＋ 행                     끝에 한 줄 더

  ⚠ **문서를 하나도 안 건드립니다.** 손잡이는 표 위에 겹쳐 놓는 판(overlay)
    이고 `.lim-md-editor` 의 자식입니다 — 문서에 노드나 속성을 더하지 않으니
    저장되는 마크다운도, 왕복 검사 숫자도 그대로입니다. 사진 올릴 때 쓰는
    자리표시(`upload.js`)를 decoration 으로 둔 것과 같은 이유입니다.

  ⚠ **표는 언제나 반듯한 격자입니다.** GFM 표에는 `colspan`·`rowspan` 을 적을
    자리가 없어서, 칸을 합쳐 봐야 저장할 때 도로 갈라집니다 (재현해서
    확인했습니다 — `<th colspan="2">` 가 `| 가 | |` 로 나갔습니다). 그래서
    2026-09-07 에 「합치기」를 뺐습니다. 다만 **옛 글에 손으로 쓴 HTML 표**가
    있을 수 있어서, 자리를 잴 때는 합쳐진 칸도 견디게 해 뒀습니다.
*/
import { Extension, generateHTML } from '@tiptap/core'
import { Table, renderTableToMarkdown } from '@tiptap/extension-table'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { htmlExtensions } from './align.js'
import {
  CellSelection,
  TableMap,
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
} from '@tiptap/pm/tables'

/** 손잡이 두께(px)와 표에서 띄우는 간격(px). */
const GRIP = 14
const GAP = 4

/** 칸 너비 손잡이의 누르는 자리(px)와 더 못 줄이는 폭(px). */
const SIZER = 12
const MIN_COL = 48

const key = new PluginKey('limTableGrips')

/**
 * DOM 의 `<table>` 로 문서 안의 표 노드를 찾습니다.
 *
 * ⚠ `<table>` 자체가 아니라 **첫 칸**으로 위치를 묻습니다. 표 바깥쪽은
 *   `colgroup`·`tbody` 처럼 문서에 없는 것들이 끼어 있어서 `posAtDOM` 이
 *   엉뚱한 자리를 줍니다.
 */
function tableAt(view, tableEl) {
  const cell = tableEl.querySelector('th, td')
  if (!cell) return null
  let pos
  try {
    pos = view.posAtDOM(cell, 0)
  } catch {
    return null
  }
  const $pos = view.state.doc.resolve(pos)
  for (let d = $pos.depth; d > 0; d -= 1) {
    const node = $pos.node(d)
    if (node.type.spec.tableRole === 'table') {
      return { node, start: $pos.start(d), dom: tableEl }
    }
  }
  return null
}

/** 지금 고른 자리가 들어 있는 표의 DOM. 없으면 null. */
function tableOfSelection(view) {
  const { $from } = view.state.selection
  for (let d = $from.depth; d > 0; d -= 1) {
    if ($from.node(d).type.spec.tableRole === 'table') {
      const dom = view.nodeDOM($from.before(d))
      if (dom && dom.nodeType === 1) {
        return dom.tagName === 'TABLE' ? dom : dom.querySelector('table')
      }
      return null
    }
  }
  return null
}

/**
 * 격자 한 칸이 (row, col) 에서 **시작하는지**.
 *
 * 합쳐진 칸은 격자 여러 자리에 같은 위치가 들어 있습니다. 손잡이 자리를 잴
 * 때 그 칸을 두 번 세면 손잡이가 겹치므로, 시작하는 자리에서만 씁니다.
 */
function startsHere(map, row, col, pos) {
  if (row > 0 && map.map[(row - 1) * map.width + col] === pos) return false
  if (col > 0 && map.map[row * map.width + col - 1] === pos) return false
  return true
}

/** (row, col) 칸이 그 열/행 하나만 차지하는지. */
function spansOne(map, row, col, pos, axis) {
  if (axis === 'col') {
    return col === map.width - 1 || map.map[row * map.width + col + 1] !== pos
  }
  return row === map.height - 1 || map.map[(row + 1) * map.width + col] !== pos
}

/**
 * 열 c(또는 행 r)의 화면 자리를 재 줄 **대표 칸**의 DOM.
 *
 * 합쳐진 칸으로 덮인 줄은 잴 방법이 없어서 그 손잡이만 건너뜁니다 (표 전체를
 * 포기하지 않습니다 — 옛 글의 HTML 표에서도 나머지는 그대로 쓸 수 있습니다).
 */
function repCell(view, info, map, index, axis) {
  const outer = axis === 'col' ? map.height : map.width
  for (let i = 0; i < outer; i += 1) {
    const row = axis === 'col' ? i : index
    const col = axis === 'col' ? index : i
    const pos = map.map[row * map.width + col]
    if (!startsHere(map, row, col, pos)) continue
    if (!spansOne(map, row, col, pos, axis)) continue
    const dom = view.nodeDOM(info.start + pos)
    if (dom && dom.nodeType === 1) return dom
  }
  return null
}

/**
 * 화면의 `<col>` 을 문서와 맞춥니다.
 *
 * ⚠ **되돌리기로 너비가 사라져도 `<col>` 에 옛 `width` 가 남습니다.**
 *   라이브러리는 너비가 없어지면 `min-width` 만 덮어쓰고 `width` 를 안 지웁니다
 *   (`TableView.updateColumns` — 재현해서 확인했습니다). 그러면 문서에는 너비가
 *   없는데 화면은 그대로라, ⌘Z 를 눌러도 아무 일도 안 일어난 것처럼 보입니다.
 */
function syncCols(tableEl, node) {
  const colgroup = tableEl.querySelector('colgroup')
  const row = node && node.firstChild
  if (!colgroup || !row) return
  let i = 0
  for (let c = 0; c < row.childCount; c += 1) {
    const cell = row.child(c)
    const span = cell.attrs.colspan || 1
    for (let j = 0; j < span; j += 1, i += 1) {
      const el = colgroup.children[i]
      if (!el) continue
      const w = cell.attrs.colwidth && cell.attrs.colwidth[j]
      if (!w && el.style.width) el.style.removeProperty('width')
    }
  }
}

/** 문서 안 칸의 위치 → 그 자리를 가리키는 resolved position. */
function cellPos(state, info, map, row, col) {
  return state.doc.resolve(info.start + map.map[row * map.width + col])
}

/* -------------------------------------------------------------------
   칸 너비를 저장하는 법.

   ⚠ **GFM 표에는 너비를 적을 자리가 없습니다.** `| 가 | 나 |` 가 전부입니다.
     그래서 **너비를 준 표만** HTML 한 덩어리로 내보냅니다 — 사진 크기를
     `<img width>` 로, 정렬을 `<div class="ta-center">` 로 내보내는 것과 같은
     방식입니다 (§6-2). 너비를 안 준 표는 하나도 안 건드립니다 (GFM 그대로).

   ⚠ **`.table-wrap` 으로 감쌉니다.** 블로그는 빌드할 때 표를 그 판으로 감싸서
     좁은 화면에서 가로로만 스크롤되게 하는데(astro.config.mjs), 그 일을 하는
     rehype 플러그인은 **마크다운이 만든 표만** 봅니다. 손으로 적어 넣은 HTML
     표는 그냥 지나쳐서, 감싸지 않으면 폰에서 지면이 통째로 옆으로 밀립니다
     (빌드해서 확인했습니다).

   ⚠ **되읽는 것은 tiptap 이 알아서 합니다.** 칸에 `colwidth="260"` 이 그대로
     붙어 나가고, `parseHTML` 이 그것을 도로 읽습니다 (재 보고 확인).
   ------------------------------------------------------------------- */

/**
 * 칸 너비를 하나라도 준 표인가.
 *
 * ⚠ **여기 오는 `node` 는 ProseMirror 노드가 아니라 JSON 입니다** — `content`
 *   가 배열이고 `descendants()` 같은 것이 없습니다 (`node.descendants is not a
 *   function` 으로 한 번 걸렸습니다). 사진(`LimImage`)·정렬(`align.js`)의
 *   `renderMarkdown` 도 `attrs`·`content` 만 보고 있습니다.
 */
function hasColWidth(node) {
  if (!node) return false
  if (node.attrs && node.attrs.colwidth) return true
  return Array.isArray(node.content) && node.content.some(hasColWidth)
}

export const LimTable = Table.extend({
  renderMarkdown(node, h) {
    if (!hasColWidth(node)) return renderTableToMarkdown(node, h)
    const html = generateHTML({ type: 'doc', content: [node] }, htmlExtensions())
    return `<div class="table-wrap">${html}</div>`
  },
})

class GripLayer {
  constructor(view) {
    this.view = view
    this.host = view.dom.parentNode
    this.hover = null
    /*
      열린 메뉴는 **DOM 이 아니라 "어느 손잡이"로** 들고 있습니다. 손잡이를
      누르면 칸 선택이 바뀌고, 그게 곧 `update()` → 다시 그리기라서 방금
      만든 메뉴 노드는 그 자리에서 지워집니다. 무엇이 열려 있는지만 남겨
      두고 메뉴도 `draw()` 안에서 같이 그립니다.
    */
    this.open = null
    this.timer = null
    /* 지금 끌고 있는 칸 너비 (null 이면 안 끄는 중). */
    this.sizing = null

    this.root = document.createElement('div')
    this.root.className = 'lim-tbl'
    if (this.host) this.host.appendChild(this.root)

    this.onMove = (e) => {
      if (this.sizing) return
      const el = e.target instanceof Element ? e.target.closest('table') : null
      if (el !== this.hover) {
        this.hover = el
        this.schedule()
      }
    }

    /*
      ⚠ **손잡이 위로 옮겨간 것은 "나간 것"이 아닙니다.** 손잡이는 본문
        (`.ProseMirror`) 위에 겹쳐 놓은 판이지 그 자식이 아니라서, 잡으러 가는
        순간 본문에 `mouseleave` 가 납니다 — 그대로 지우면 손잡이가 손끝에서
        사라집니다 (사진 손잡이에서 실제로 그랬습니다 · resize.js).
    */
    this.onLeave = (e) => {
      if (this.sizing) return
      if (e && e.relatedTarget && this.root && this.root.contains(e.relatedTarget)) return
      if (!this.hover) return
      this.hover = null
      this.schedule()
    }
    this.onAway = (e) => {
      if (!this.open) return
      const inside = e.target instanceof Element && e.target.closest('.lim-tbl-menu')
      if (!inside) this.closeMenu()
    }
    this.onKey = (e) => {
      if (e.key === 'Escape') this.closeMenu()
    }

    view.dom.addEventListener('mousemove', this.onMove)
    view.dom.addEventListener('mouseleave', this.onLeave)
    document.addEventListener('mousedown', this.onAway, true)
    document.addEventListener('keydown', this.onKey)

    /* 글자를 치면 줄 높이가 바뀝니다 — 그때도 손잡이가 따라와야 합니다. */
    if (typeof ResizeObserver === 'function') {
      this.ro = new ResizeObserver(() => this.schedule())
      this.ro.observe(view.dom)
    }
    this.onResize = () => this.schedule()
    window.addEventListener('resize', this.onResize)

    this.draw()
  }

  /*
    ⚠ **`requestAnimationFrame` 을 쓰지 마세요.** 화면이 안 보이는 동안(다른
      앱으로 넘어갔을 때)은 아예 안 돌아서, 손잡이가 옛 자리에 멈춥니다.
      `skin.js` 에서 같은 것에 한 번 당했습니다.
  */
  schedule() {
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.timer = null
      this.draw()
    }, 0)
  }

  update() {
    this.schedule()
  }

  closeMenu() {
    if (!this.open) return
    this.open = null
    this.schedule()
  }

  /** 표 하나를 골라 그 위에 손잡이를 그립니다. */
  draw() {
    if (!this.root) return
    /* 너비를 끄는 중에는 다시 그리지 않습니다 — 잡고 있던 손잡이가 사라집니다. */
    if (this.sizing) return
    this.root.textContent = ''

    if (!this.view.editable) return
    /*
      원문 모드에서는 편집기가 통째로 `display: none` 입니다 (두 편집기를 같이
      두고 하나만 보여 줍니다). 잴 것이 없으니 그리지도 않습니다.
    */
    if (!this.host || (!this.host.offsetWidth && !this.host.offsetHeight)) {
      this.open = null
      return
    }
    const tableEl = this.hover || tableOfSelection(this.view)
    if (!tableEl || !this.host || !this.host.contains(tableEl)) {
      this.open = null
      return
    }

    const info = tableAt(this.view, tableEl)
    if (!info) return

    const map = TableMap.get(info.node)
    syncCols(tableEl, info.node)
    const base = this.host.getBoundingClientRect()
    const box = tableEl.getBoundingClientRect()
    const top = box.top - base.top
    const left = box.left - base.left

    for (let c = 0; c < map.width; c += 1) {
      const dom = repCell(this.view, info, map, c, 'col')
      if (!dom) continue
      const r = dom.getBoundingClientRect()
      this.add('col', c, {
        left: r.left - base.left,
        width: r.width,
        top: top - GRIP - GAP,
        height: GRIP,
      })
    }

    for (let r = 0; r < map.height; r += 1) {
      const dom = repCell(this.view, info, map, r, 'row')
      if (!dom) continue
      const rect = dom.getBoundingClientRect()
      this.add('row', r, {
        top: rect.top - base.top,
        height: rect.height,
        left: left - GRIP - GAP,
        width: GRIP,
      })
    }

    /* 칸 너비 — 열 경계마다 세로 손잡이. */
    for (let c = 0; c < map.width; c += 1) {
      const dom = repCell(this.view, info, map, c, 'col')
      if (!dom) continue
      const r = dom.getBoundingClientRect()
      this.addSizer(c, { left: r.right - base.left, top, height: box.height })
    }

    this.addPlus('col', info, map, {
      left: left + box.width + GAP,
      top,
      width: GRIP,
      height: box.height,
    })
    this.addPlus('row', info, map, {
      left,
      top: top + box.height + GAP,
      width: box.width,
      height: GRIP,
    })
  }

  place(el, at) {
    el.style.left = at.left + 'px'
    el.style.top = at.top + 'px'
    el.style.width = at.width + 'px'
    el.style.height = at.height + 'px'
  }

  add(axis, index, at) {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'lim-tbl-grip is-' + axis
    el.setAttribute(
      'aria-label',
      (axis === 'col' ? index + 1 + '번째 열' : index + 1 + '번째 행') + ' 고르기'
    )
    el.title = axis === 'col' ? '눌러서 이 열 고르기' : '눌러서 이 행 고르기'
    this.place(el, at)
    /* 눌러도 본문 커서가 안 튀게 — 고르는 일은 아래에서 직접 합니다. */
    el.addEventListener('mousedown', (e) => e.preventDefault())
    el.addEventListener('click', () => this.pick(axis, index))
    this.root.appendChild(el)
    if (this.open && this.open.axis === axis && this.open.index === index) {
      this.drawMenu(axis, el)
    }
  }

  addPlus(axis, info, map, at) {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'lim-tbl-plus is-' + axis
    el.title = axis === 'col' ? '오른쪽 끝에 열 더하기' : '아래에 행 더하기'
    el.setAttribute('aria-label', el.title)
    el.textContent = '+'
    this.place(el, at)
    el.addEventListener('mousedown', (e) => e.preventDefault())
    el.addEventListener('click', () => {
      this.open = null
      const last = axis === 'col' ? map.width - 1 : map.height - 1
      this.select(axis, last, info, map)
      this.cmd(axis === 'col' ? 'addColumnAfter' : 'addRowAfter')
    })
    this.root.appendChild(el)
  }

  /* ---------------------------------------------------------------
     칸 너비 손잡이.

     ⚠ **prosemirror-tables 의 `columnResizing` 을 안 씁니다.** 그쪽은
       `mousedown`·`mousemove` 만 듣습니다 — iOS 는 손가락으로 끌 때 그 이벤트를
       안 내주므로 **폰에서 아예 안 됩니다.** 글은 대부분 폰에서 씁니다(§6-2).
       그래서 사진 손잡이(resize.js)와 같은 길(Pointer Events)로 직접 답니다.

     ⚠ **끄는 동안에는 문서를 안 건드립니다.** `<col>` 의 style 만 바꿔서 보여
       주고, 손을 뗄 때 **한 번** 속성(`colwidth`)으로 넣습니다 — 움직일 때마다
       고치면 되돌리기 한 번에 1px 씩 돌아갑니다.

     ⚠ **움직인 거리가 아니라 포인터가 있는 자리로 폭을 냅니다** (resize.js 와
       같은 이유). 왼쪽 가장자리는 끄는 동안 안 움직입니다 — 넓히면 오른쪽
       열들이 줄어들 뿐입니다.
     --------------------------------------------------------------- */

  addSizer(col, at) {
    const el = document.createElement('button')
    el.className = 'lim-tbl-size'
    el.type = 'button'
    el.dataset.col = String(col)
    el.title = '끌어서 칸 너비 바꾸기'
    el.setAttribute('aria-label', col + 1 + '번째 칸 너비')
    el.style.left = at.left + 'px'
    el.style.top = at.top + 'px'
    el.style.height = at.height + 'px'
    el.style.width = SIZER + 'px'
    el.addEventListener('pointerdown', (e) => this.startSize(e, col))
    this.root.appendChild(el)
  }

  startSize(e, col) {
    if (e.button > 0) return
    const tableEl = this.hover || tableOfSelection(this.view)
    if (!tableEl) return
    const info = tableAt(this.view, tableEl)
    if (!info) return
    const map = TableMap.get(info.node)
    const dom = repCell(this.view, info, map, col, 'col')
    if (!dom) return

    e.preventDefault()
    e.stopPropagation()

    const r = dom.getBoundingClientRect()
    this.open = null
    this.sizing = {
      col,
      tableEl,
      info,
      map,
      handle: e.currentTarget,
      base: this.host.getBoundingClientRect(),
      leftEdge: r.left,
      grab: e.clientX - r.right,
      width: Math.round(r.width),
    }

    this.onSizeMove = (ev) => this.moveSize(ev)
    this.onSizeUp = (ev) => this.endSize(ev)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.addEventListener('pointermove', this.onSizeMove)
    e.currentTarget.addEventListener('pointerup', this.onSizeUp)
    e.currentTarget.addEventListener('pointercancel', this.onSizeUp)
    e.currentTarget.classList.add('is-on')
  }

  moveSize(e) {
    const d = this.sizing
    if (!d) return
    const width = Math.max(MIN_COL, Math.round(e.clientX - d.grab - d.leftEdge))
    d.width = width
    this.previewSize(width)
    /* 손잡이도 새 경계로 옮깁니다 — 안 옮기면 손끝에서 뒤처집니다. */
    if (d.handle) d.handle.style.left = d.leftEdge - d.base.left + width + 'px'
  }

  /** 보여 주기만 합니다 — `TableView.updateColumns` 와 같은 규칙입니다. */
  previewSize(width) {
    const d = this.sizing
    const colgroup = d.tableEl.querySelector('colgroup')
    if (!colgroup) return
    const one = colgroup.children[d.col]
    if (one) {
      one.style.removeProperty('min-width')
      one.style.width = width + 'px'
    }
    const widths = [...colgroup.children].map((c) => parseFloat(c.style.width) || 0)
    if (widths.every((w) => w > 0)) {
      d.tableEl.style.removeProperty('min-width')
      d.tableEl.style.width = widths.reduce((a, b) => a + b, 0) + 'px'
    }
  }

  endSize(e) {
    const d = this.sizing
    if (!d) return
    const el = e.currentTarget
    if (el) {
      el.removeEventListener('pointermove', this.onSizeMove)
      el.removeEventListener('pointerup', this.onSizeUp)
      el.removeEventListener('pointercancel', this.onSizeUp)
      el.classList.remove('is-on')
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        /* 이미 놓였으면 그만입니다 */
      }
    }
    this.sizing = null
    this.applySize(d)
    this.schedule()
  }

  /*
    칸에 `colwidth` 를 넣습니다.

    ⚠ **합쳐진 칸을 견뎌야 합니다.** 옛 글에 손으로 쓴 HTML 표가 있을 수
      있습니다(위). 격자 여러 자리에 같은 칸이 들어 있으므로 **시작하는 줄에서만**
      쓰고, 그 칸이 몇 번째 열에서 시작하는지 보고 안쪽 자리를 고릅니다.
  */
  applySize(d) {
    const { state } = this.view
    const tr = state.tr
    for (let row = 0; row < d.map.height; row += 1) {
      const idx = row * d.map.width + d.col
      const pos = d.map.map[idx]
      if (row > 0 && d.map.map[idx - d.map.width] === pos) continue
      const abs = d.info.start + pos
      const cell = state.doc.nodeAt(abs)
      if (!cell) continue
      const span = cell.attrs.colspan || 1
      const widths = cell.attrs.colwidth ? cell.attrs.colwidth.slice() : new Array(span).fill(0)
      const at = d.col - d.map.colCount(pos)
      if (at < 0 || at >= widths.length) continue
      if (widths[at] === d.width) continue
      widths[at] = d.width
      tr.setNodeMarkup(abs, undefined, Object.assign({}, cell.attrs, { colwidth: widths }))
    }
    if (tr.docChanged) this.view.dispatch(tr)
  }

  /** 손잡이를 누르면 그 줄을 고르고 메뉴를 엽니다. */
  pick(axis, index) {
    const tableEl = this.hover || tableOfSelection(this.view)
    if (!tableEl) return
    const info = tableAt(this.view, tableEl)
    if (!info) return
    const map = TableMap.get(info.node)
    this.open = { axis, index }
    this.select(axis, index, info, map)
    this.schedule()
  }

  select(axis, index, info, map) {
    const { state } = this.view
    const $cell =
      axis === 'col'
        ? cellPos(state, info, map, 0, Math.min(index, map.width - 1))
        : cellPos(state, info, map, Math.min(index, map.height - 1), 0)
    const sel =
      axis === 'col' ? CellSelection.colSelection($cell) : CellSelection.rowSelection($cell)
    this.view.dispatch(state.tr.setSelection(sel))
  }

  /*
    ⚠ **명령은 tiptap 이 아니라 여기서 직접 부릅니다.** `editor.chain().focus()`
      를 쓰면 포커스가 먼저 가면서 방금 잡아 둔 칸 선택이 풀립니다 — 그러면
      "이 열 지우기" 가 커서가 있던 칸 하나만 지웁니다.
  */
  cmd(name) {
    const fn = COMMANDS[name]
    if (!fn) return
    fn(this.view.state, this.view.dispatch)
    this.view.focus()
    this.schedule()
  }

  drawMenu(axis, anchor) {
    const items = axis === 'col' ? COL_MENU : ROW_MENU
    const menu = document.createElement('div')
    menu.className = 'lim-tbl-menu'
    items.forEach((it) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'lim-tbl-item' + (it.danger ? ' is-danger' : '')
      b.textContent = it.label
      b.addEventListener('mousedown', (e) => e.preventDefault())
      b.addEventListener('click', () => {
        this.open = null
        this.cmd(it.cmd)
      })
      menu.appendChild(b)
    })
    /* 손잡이 바로 옆에 답니다 — 자리는 그릴 때 잰 값을 그대로 씁니다. */
    menu.style.left = anchor.style.left
    menu.style.top = parseFloat(anchor.style.top) + parseFloat(anchor.style.height) + 2 + 'px'
    this.root.appendChild(menu)
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer)
    this.view.dom.removeEventListener('mousemove', this.onMove)
    this.view.dom.removeEventListener('mouseleave', this.onLeave)
    document.removeEventListener('mousedown', this.onAway, true)
    document.removeEventListener('keydown', this.onKey)
    window.removeEventListener('resize', this.onResize)
    if (this.ro) this.ro.disconnect()
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root)
    this.root = null
  }
}

/*
  prosemirror-tables 의 명령을 그대로 씁니다. tiptap 을 거치지 않는 이유는
  위 `cmd()` 에 적어 뒀습니다.
*/
const COMMANDS = {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
}

const COL_MENU = [
  { label: '왼쪽에 열 넣기', cmd: 'addColumnBefore' },
  { label: '오른쪽에 열 넣기', cmd: 'addColumnAfter' },
  { label: '이 열 지우기', cmd: 'deleteColumn', danger: true },
]

const ROW_MENU = [
  { label: '위에 행 넣기', cmd: 'addRowBefore' },
  { label: '아래에 행 넣기', cmd: 'addRowAfter' },
  { label: '이 행 지우기', cmd: 'deleteRow', danger: true },
]

export const TableGrips = Extension.create({
  name: 'limTableGrips',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key,
        view: (view) => new GripLayer(view),
      }),
    ]
  },
})
