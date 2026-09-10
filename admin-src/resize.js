/*
  /admin — 사진 크기 손잡이.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 `public/admin/editor.js` 예요.

  **왜 만들었나.** 사진 크기를 바꾸는 길이 도구 띠 아래 「사진 크기」 슬라이더
  하나뿐이었습니다. 사진에서 멀리 떨어진 자리라, 끌면서 사진이 어떻게 되는지
  보려면 눈이 위아래로 오갔습니다. **사진 가장자리를 직접 끕니다** (노션과
  같은 모양).

      ┌──────────────┐
      │              ▐   ← 손잡이. 끌면 그만큼 넓어지고 좁아집니다
      │    사진      ▐
      └──────────────┘
                  [ 62% ]   ← 끄는 동안만 뜨는 숫자

  ⚠ **슬라이더와 같은 값을 씁니다** — `width` 속성 하나입니다. 손잡이로 끌든
    슬라이더를 밀든 저장되는 마크다운은 `<img src alt width>` 로 같고, **가득
    채우면 속성을 지웁니다**(`![...](...)` 로 돌아갑니다 — editor.js 의
    `setImagePercent` 과 같은 규칙). HTML 로 적힌 사진이 늘면 그만큼 왕복
    검사가 나빠집니다.

  ⚠ **문서는 끄는 동안 한 번도 안 건드립니다.** 끄는 중에는 `img` 의 인라인
    style 만 바꾸고, 손을 뗄 때 **한 번** 속성으로 넣습니다. 움직일 때마다
    문서를 고치면 되돌리기(⌘Z) 한 번에 1px 씩 돌아갑니다.

  ⚠ **손잡이는 자유로운 쪽 가장자리에만 답니다.** 사진이 왼쪽에 붙어 있으면
    (기본) 왼쪽 가장자리는 못 움직입니다 — 그쪽을 끌면 손가락은 왼쪽으로
    가는데 사진은 오른쪽으로 자랍니다. 가운데 정렬한 사진만 양쪽입니다
    (`.ta-center` · align.js).
*/
import { Extension } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'

/** 이보다 작게는 못 줄입니다 — 더 줄이면 무슨 사진인지 안 보입니다. */
const MIN = 60

/** 이 비율을 넘겨 끌면 "가득"으로 보고 크기를 지웁니다. */
const FULL = 0.98

/** 손잡이가 사진 높이의 몇 %를 차지하는가 (최소·최대는 px). */
const GRIP_RATIO = 0.45
const GRIP_MIN = 28
const GRIP_MAX = 88

const key = new PluginKey('limImageGrips')

/**
 * 테두리·여백을 뺀 안쪽 폭.
 *
 * `clientWidth` 는 여백을 포함합니다. 사진의 100% 는 **글이 놓이는 폭**이라
 * 여백을 빼야 맞습니다 — editor.js 의 「사진 크기」 슬라이더도 이걸 씁니다.
 */
export function boxWidth(el) {
  if (!el) return 0
  const cs = typeof getComputedStyle === 'function' ? getComputedStyle(el) : null
  const pad = cs ? (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0) : 0
  const w = el.clientWidth - pad
  return w > 0 ? w : 0
}

/**
 * DOM 의 `<img>` 가 문서 어디에 있는가.
 *
 * ⚠ **두 자리를 봅니다.** 사진은 잎 노드라 `posAtDOM(img, 0)` 이 사진 **앞**을
 *   줄 때도 있고 **자기 자리**를 줄 때도 있습니다 (감싼 것에 따라 다릅니다).
 *   실제로 사진이 있는 쪽을 골라야 엉뚱한 노드의 속성을 고치지 않습니다.
 */
function posOfImage(view, img) {
  let pos
  try {
    pos = view.posAtDOM(img, 0)
  } catch {
    return -1
  }
  const doc = view.state.doc
  for (const p of [pos, pos - 1]) {
    if (p < 0 || p > doc.content.size) continue
    const node = doc.nodeAt(p)
    if (node && node.type.name === 'image') return p
  }
  return -1
}

/** 지금 고른 것이 사진이면 그 `<img>`. */
function selectedImage(view) {
  const sel = view.state.selection
  if (!(sel instanceof NodeSelection) || !sel.node) return null
  if (sel.node.type.name !== 'image') return null
  const dom = view.nodeDOM(sel.from)
  return dom && dom.nodeName === 'IMG' ? dom : null
}

/** 사진이 어느 쪽에 붙어 있는가 — 자유로운 가장자리를 고르는 데 씁니다. */
function anchorOf(img) {
  if (!img.closest) return 'left'
  if (img.closest('.ta-center')) return 'center'
  if (img.closest('.ta-right')) return 'right'
  return 'left'
}

class SizeLayer {
  constructor(view) {
    this.view = view
    this.host = view.dom.parentNode /* .lim-md-editor */
    this.hover = null
    this.drag = null
    this.timer = null
    this.grips = []

    this.root = document.createElement('div')
    this.root.className = 'lim-img'
    if (this.host) this.host.appendChild(this.root)

    this.badge = document.createElement('div')
    this.badge.className = 'lim-img-size'
    this.badge.hidden = true
    this.root.appendChild(this.badge)

    this.onMove = (e) => {
      if (this.drag) return
      const el = e.target instanceof Element ? e.target.closest('img') : null
      if (el === this.hover) return
      this.hover = el
      this.schedule()
    }

    /*
      ⚠ **손잡이 위로 옮겨간 것은 "나간 것"이 아닙니다.** 손잡이는 본문
        (`.ProseMirror`) 위에 겹쳐 놓은 판이지 그 자식이 아니라서, 잡으러
        가는 순간 본문에 `mouseleave` 가 납니다 — 그대로 지우면 **손잡이가
        손끝에서 사라져서 영영 못 잡습니다** (실제로 그랬습니다).
    */
    this.onLeave = (e) => {
      if (this.drag) return
      if (e && e.relatedTarget && this.root && this.root.contains(e.relatedTarget)) return
      if (!this.hover) return
      this.hover = null
      this.schedule()
    }

    /* 편집기 밖으로 아주 나갔을 때 — 손잡이에서 곧장 나가는 길입니다. */
    this.onHostLeave = () => {
      if (this.drag || !this.hover) return
      this.hover = null
      this.schedule()
    }

    this.onResize = () => this.schedule()

    view.dom.addEventListener('mousemove', this.onMove)
    view.dom.addEventListener('mouseleave', this.onLeave)
    if (this.host) this.host.addEventListener('mouseleave', this.onHostLeave)
    window.addEventListener('resize', this.onResize)

    /* 글자를 치면 사진 자리가 밀립니다 — 그때도 손잡이가 따라와야 합니다. */
    if (typeof ResizeObserver === 'function') {
      this.ro = new ResizeObserver(() => this.schedule())
      this.ro.observe(view.dom)
    }

    this.draw()
  }

  /*
    ⚠ **`requestAnimationFrame` 을 쓰지 마세요.** 화면이 안 보이는 동안은 아예
      안 돌아서 손잡이가 옛 자리에 멈춥니다 (table.js·skin.js 와 같은 함정).
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

  /** 지금 손잡이를 달 사진. 고른 것이 먼저고, 없으면 마우스가 올라간 것. */
  target() {
    return selectedImage(this.view) || this.hover
  }

  /** 사진 100% 의 기준 폭. 슬라이더와 같은 값이어야 합니다. */
  fullWidth() {
    const w = boxWidth(this.view.dom)
    return w > 80 ? w : 640
  }

  draw() {
    /* 끄는 중에는 다시 그리지 않습니다 — 잡고 있던 손잡이가 사라집니다. */
    if (this.drag) {
      this.place(this.drag.img)
      return
    }
    if (!this.root) return
    this.clear()

    if (!this.view.editable) return
    /*
      원문 모드에서는 편집기가 통째로 `display: none` 입니다 (두 편집기를 같이
      두고 하나만 보여 줍니다). 잴 것이 없으니 그리지도 않습니다.
    */
    if (!this.host || (!this.host.offsetWidth && !this.host.offsetHeight)) return

    const img = this.target()
    if (!img || !this.host.contains(img)) return
    if (posOfImage(this.view, img) < 0) return

    const anchor = anchorOf(img)
    const sides = anchor === 'center' ? ['left', 'right'] : anchor === 'right' ? ['left'] : ['right']
    for (const side of sides) this.add(side)
    this.place(img)
  }

  clear() {
    for (const g of this.grips) if (g.parentNode) g.parentNode.removeChild(g)
    this.grips = []
    this.badge.hidden = true
  }

  add(side) {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'lim-img-grip is-' + side
    el.dataset.side = side
    el.title = '끌어서 사진 크기 바꾸기'
    el.setAttribute('aria-label', el.title)
    el.addEventListener('pointerdown', (e) => this.start(e, side))
    this.root.appendChild(el)
    this.grips.push(el)
  }

  /** 손잡이를 사진 가장자리에 세웁니다. */
  place(img) {
    if (!img || !this.host) return
    const base = this.host.getBoundingClientRect()
    const r = img.getBoundingClientRect()
    const h = Math.max(GRIP_MIN, Math.min(GRIP_MAX, r.height * GRIP_RATIO))
    const top = r.top - base.top + (r.height - h) / 2

    for (const el of this.grips) {
      const right = el.dataset.side === 'right'
      el.style.top = top + 'px'
      el.style.height = h + 'px'
      el.style.left = (right ? r.right - base.left : r.left - base.left) + 'px'
    }

    if (!this.badge.hidden) {
      this.badge.style.left = r.right - base.left + 'px'
      this.badge.style.top = r.bottom - base.top + 'px'
    }
  }

  /* ---------------------------------------------------------------
     끌기.

     ⚠ **손가락·마우스를 한 길로 받습니다** (Pointer Events). 폰에서 끌 때
       지면이 같이 스크롤되는 것은 CSS 의 `touch-action: none` 이 막습니다.

     ⚠ **움직인 거리(dx)가 아니라 포인터가 있는 자리로 폭을 냅니다.** dx 로
       더해 가면 최소·최대에 부딪힌 만큼 어긋나서, 되돌아와도 사진이 손끝을
       안 따라옵니다.
     --------------------------------------------------------------- */
  start(e, side) {
    const img = this.target()
    if (!img || e.button > 0) return
    const pos = posOfImage(this.view, img)
    if (pos < 0) return

    /* 커서가 본문으로 튀지 않게. 고르는 일은 아래에서 직접 합니다. */
    e.preventDefault()
    e.stopPropagation()

    const r = img.getBoundingClientRect()
    const anchor = anchorOf(img)
    this.drag = {
      img,
      pos,
      side,
      anchor,
      max: this.fullWidth(),
      /* 안 움직이는 쪽 가장자리(가운데 정렬이면 한가운데) */
      fixed: anchor === 'center' ? (r.left + r.right) / 2 : anchor === 'right' ? r.right : r.left,
      /* 손잡이 한가운데가 아니라 잡은 그 자리를 기준으로 — 안 그러면 튑니다 */
      grab: e.clientX - (side === 'right' ? r.right : r.left),
      width: r.width,
    }

    /* 사진을 고른 상태로 둡니다 — 아래 「사진 크기」 줄도 같이 뜹니다. */
    const sel = this.view.state.selection
    if (!(sel instanceof NodeSelection) || sel.from !== pos) {
      this.view.dispatch(this.view.state.tr.setSelection(NodeSelection.create(this.view.state.doc, pos)))
    }

    this.onDrag = (ev) => this.move(ev)
    this.onDrop = (ev) => this.end(ev)
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.addEventListener('pointermove', this.onDrag)
    e.currentTarget.addEventListener('pointerup', this.onDrop)
    e.currentTarget.addEventListener('pointercancel', this.onDrop)

    this.badge.hidden = false
    this.show(r.width)
  }

  move(e) {
    const d = this.drag
    if (!d) return
    const x = e.clientX - d.grab
    const span = d.side === 'right' ? x - d.fixed : d.fixed - x
    const raw = d.anchor === 'center' ? span * 2 : span
    const width = Math.max(MIN, Math.min(d.max, Math.round(raw)))
    d.width = width
    d.img.style.width = width + 'px'
    this.show(width)
    this.place(d.img)
  }

  /*
    ⚠ **가득 채우면 속성을 지웁니다.** 그래야 마크다운이 `![...](...)` 로
      돌아갑니다 — 「원래대로」 단추와 같은 규칙입니다.
  */
  end(e) {
    const d = this.drag
    if (!d) return
    const el = e.currentTarget
    if (el) {
      el.removeEventListener('pointermove', this.onDrag)
      el.removeEventListener('pointerup', this.onDrop)
      el.removeEventListener('pointercancel', this.onDrop)
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        /* 이미 놓였으면 그만입니다 */
      }
    }
    this.drag = null
    this.badge.hidden = true

    /* 인라인 style 은 끄는 동안만 쓰는 것입니다. 안 지우면 속성을 덮습니다. */
    d.img.style.width = ''

    const width = d.width >= d.max * FULL ? null : d.width
    const node = this.view.state.doc.nodeAt(d.pos)
    if (!node || node.type.name !== 'image') return
    if ((node.attrs.width || null) === width) {
      this.schedule()
      return
    }
    const attrs = Object.assign({}, node.attrs, { width, height: null })
    this.view.dispatch(this.view.state.tr.setNodeMarkup(d.pos, undefined, attrs))
    this.view.focus()
  }

  show(width) {
    const pct = Math.round((width / this.fullWidth()) * 100)
    this.badge.textContent = Math.min(100, pct) + '%'
  }

  destroy() {
    if (this.timer) clearTimeout(this.timer)
    this.view.dom.removeEventListener('mousemove', this.onMove)
    this.view.dom.removeEventListener('mouseleave', this.onLeave)
    if (this.host) this.host.removeEventListener('mouseleave', this.onHostLeave)
    window.removeEventListener('resize', this.onResize)
    if (this.ro) this.ro.disconnect()
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root)
    this.root = null
    this.grips = []
  }
}

export const ImageGrips = Extension.create({
  name: 'limImageGrips',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key,
        view: (view) => new SizeLayer(view),
      }),
    ]
  },
})
