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
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
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

/** 문서 안 칸의 위치 → 그 자리를 가리키는 resolved position. */
function cellPos(state, info, map, row, col) {
  return state.doc.resolve(info.start + map.map[row * map.width + col])
}

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

    this.root = document.createElement('div')
    this.root.className = 'lim-tbl'
    if (this.host) this.host.appendChild(this.root)

    this.onMove = (e) => {
      const el = e.target instanceof Element ? e.target.closest('table') : null
      if (el !== this.hover) {
        this.hover = el
        this.schedule()
      }
    }
    this.onLeave = () => {
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
