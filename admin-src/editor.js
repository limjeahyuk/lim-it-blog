/*
  /admin 본문 편집기 — tiptap.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 esbuild 로 묶은
    `public/admin/editor.js` 입니다. 고쳤으면 `npm run admin` 을 돌리세요.

  ⚠ CSS 는 여기서 import 하지 않습니다 — `admin-src/index.js` 가 합니다.
    `scripts/check-md-roundtrip.mjs` 가 이 파일을 node 에서 그대로 불러다
    쓰는데, node 는 `.css` import 를 못 읽습니다.

  왜 tiptap 이냐 (2026-09-04 에 Toast 에서 되돌아왔습니다):

  - **단축키.** 하니 매거진의 편집기가 tiptap 이고, 거기 매어 둔 단축키 표를
    그대로 옮겨 쓸 수 있습니다 (`blocks.js` · `shortcuts.js`).
  - **도구 띠를 우리가 그립니다.** Toast 는 폭이 모자라면 단추를 "..." 안으로
    숨기는데, 제일 자주 쓰는 것이 숨는 일이 잦았습니다. 여기서는 줄바꿈합니다.
  - **보이는 대로 나옵니다.** 편집기 안 글자 모양을 블로그 `.prose` 와 같은
    값으로 맞춰 뒀습니다 (`admin-src/editor.css`).

  ⚠ **대신 옛 글 왕복이 나빠집니다.** Toast 는 128편 중 21편에서 글자가
    달라졌는데 tiptap 은 76편입니다. 알고 되돌아온 것이고, 그래서 **옛 글은
    원문 모드로 엽니다** (아래 `pickMode`).

  ⚠ 저장되는 것은 여전히 **마크다운 원문**입니다. 글 128편이 마크다운 파일이라
    형식을 바꿀 수 없습니다. tiptap 문서 → 마크다운 변환은 @tiptap/markdown 이
    하고, 이 블로그에만 있는 것(글자 색·형광펜)은 아래에서 마크로 직접
    정의해 왕복시킵니다.
*/
import { Editor, Mark } from '@tiptap/core'
import { Markdown } from '@tiptap/markdown'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import StarterKit from '@tiptap/starter-kit'
import { BLOCKS, blockAt, setBlock } from './blocks.js'
import { BlockShortcuts, ToolShortcuts } from './shortcuts.js'

/* -------------------------------------------------------------------
   글자 색.

   마크다운에 색이 없어서 <span class="c-*"> 로 넣습니다. 색 값을 본문에
   박지 않고 클래스만 넣는 이유는, 값을 박으면 다크·라이트 한쪽에서 반드시
   안 읽히기 때문입니다. 실제 색은 global.css 가 테마별로 고릅니다.
   색을 늘리려면 global.css 의 `.prose .c-*` 도 같이 늘리세요.
   ------------------------------------------------------------------- */
const COLORS = [
  { k: 'teal', label: '청록', swatch: '#58dddf' },
  { k: 'blue', label: '파랑', swatch: '#429ff5' },
  { k: 'green', label: '초록', swatch: '#5bc25d' },
  { k: 'orange', label: '주황', swatch: '#ff9100' },
  { k: 'red', label: '빨강', swatch: '#fe6d6d' },
]

const COLOR_KEYS = COLORS.map((c) => c.k)

/** 마크에 걸린 attrs 를 꺼냅니다. 마크의 renderMarkdown 은 마크 자체를 받습니다. */
function attrOf(node, key) {
  return (node && node.attrs && node.attrs[key]) || null
}

const TextColor = Mark.create({
  name: 'textColor',

  addAttributes() {
    return {
      color: {
        default: COLOR_KEYS[0],
        parseHTML: (el) => (el.getAttribute('class') || '').replace(/^c-/, ''),
        renderHTML: (attrs) => ({ class: 'c-' + attrs.color }),
      },

      /* ⚠ 여기 넣은 것이 Toast 자기 keymap 보다 **먼저** 걸립니다
           (WysiwygEditor.createPlugins 가 플러그인 것을 앞에 놓습니다).
           그래서 목록·표에서는 반드시 false 를 돌려줘야 합니다. */
      wysiwygPlugins: [() => keymap({ Enter: splitWithBlankLine })],
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[class]',
        // c-teal 처럼 우리가 쓰는 클래스만 가져옵니다. 남의 span 은 그냥 둡니다.
        getAttrs: (el) => {
          const cls = (el.getAttribute('class') || '').trim()
          const m = /^c-([a-z]+)$/.exec(cls)
          return m && COLOR_KEYS.indexOf(m[1]) !== -1 ? { color: m[1] } : false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },

  renderMarkdown: (node, h) =>
    `<span class="c-${attrOf(node, 'color') || COLOR_KEYS[0]}">${h.renderChildren(node)}</span>`,

  markdownOptions: {
    htmlReopen: { open: '<span>', close: '</span>' },
  },

  addCommands() {
    return {
      setTextColor:
        (color) =>
        ({ commands }) =>
          commands.setMark(this.name, { color }),
      unsetTextColor:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },
})

/*
  형광펜. tiptap 기본 Highlight 는 `==글자==` 로 내보내는데, 이 블로그의
  마크다운 파서(remark)는 `==` 를 모릅니다 — 그대로 별표처럼 보입니다.
  손으로 쓰던 규칙대로 <mark> 를 씁니다.
*/
const Highlight = Mark.create({
  name: 'highlight',
  parseHTML() {
    return [{ tag: 'mark' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0]
  },
  renderMarkdown: (node, h) => `<mark>${h.renderChildren(node)}</mark>`,
  markdownOptions: {
    htmlReopen: { open: '<mark>', close: '</mark>' },
  },
  addCommands() {
    return {
      toggleHighlight:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    }
  },
})


/*
  글자 색 다섯. 단축키 ⌘⌥⇧1~5 가 이 순서를 따릅니다 (shortcuts.js).
  색을 늘리려면 여기와 `global.css` 의 `.prose .c-*`, `admin/index.html` 의
  편집기용 `.c-*` 를 같이 고치세요.
*/
export { COLORS }

/** 왕복 검사(scripts/check-md-roundtrip.mjs)가 쓰는, 손잡이 없는 기본 묶음. */
export const EXTENSIONS = makeExtensions()

/**
 * tiptap 확장 묶음.
 *
 * ⚠ **확장을 뺄 때 조심하세요.** 표(`TableKit`)를 안 넣었더니 표가 있는 글을
 *   열었다 저장할 때 표가 통째로 사라졌습니다. StarterKit 에 없는 것은 직접
 *   넣어야 합니다.
 */
export function makeExtensions({ pickImage, pickLink } = {}) {
  return [
    StarterKit.configure({
      // 밑줄은 마크다운에 없습니다. 넣어 주면 <u> 가 본문에 박힙니다.
      underline: false,
      link: { openOnClick: false },
    }),
    Image,
    TableKit,
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight,
    TextColor,
    BlockShortcuts,
    ToolShortcuts.configure({
      pickImage: pickImage || (() => {}),
      pickLink: pickLink || (() => {}),
      colors: COLORS,
    }),
    Markdown,
  ]
}

/**
 * 왕복 결과를 견줄 때 쓰는 다듬기.
 *
 * 줄 끝 공백·문단 사이 빈 줄 개수·파일 끝 줄바꿈은 화면에서 아무 차이가
 * 없습니다. 이것까지 다르다고 하면 **모든 글이** 옛 글로 취급됩니다.
 * scripts/check-md-roundtrip.mjs 도 같은 기준을 씁니다.
 */
export function normalizeMarkdown(s) {
  return (s || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** 마크다운 → tiptap → 마크다운. 왕복 검사에서도 씁니다. */
export function makeEditor(element, markdown, handlers = {}) {
  const { pickImage, pickLink, ...rest } = handlers
  return new Editor({
    element,
    extensions: makeExtensions({ pickImage, pickLink }),
    content: markdown || '',
    contentType: 'markdown',
    ...rest,
  })
}

/**
 * 서식 모드로 열어도 되는 글인지 봅니다.
 *
 * 마크다운을 넣었다 도로 꺼내서 원본과 같으면 서식으로, 다르면 원문으로
 * 엽니다. 직접 쓴 글은 tiptap 이 만든 그대로라 서식으로 열리고, 티스토리에서
 * 옮겨온 글은 원문으로 열립니다.
 */
export function isRoundTripSafe(editor, original) {
  if (!original) return true
  return normalizeMarkdown(editor.getMarkdown()) === normalizeMarkdown(original)
}

/* =================================================================
   도구 띠.

   ⚠ **줄바꿈합니다. 넘치는 것을 "..." 안에 숨기지 마세요.** Toast 를 쓰던
     동안 제일 자주 쓰는 단추(사진)가 거기 숨어서 매번 두 번 눌러야 했습니다.
     단추가 늘면 띠가 한 줄 더 길어지는 편이 낫습니다.

   ⚠ 단축키 글자는 **`shortcuts.js`·tiptap 이 실제로 매어 둔 것**과 같아야
     합니다. 여기만 고치면 툴팁이 거짓말을 합니다.
   ================================================================= */
const GROUPS = [
  [
    { k: 'undo', label: '↺', title: '되돌리기 ⌘Z' },
    { k: 'redo', label: '↻', title: '다시하기 ⌘⇧Z' },
  ],
  BLOCKS.map((b) => ({
    k: 'block:' + b.id,
    label: b.mark,
    title: b.label + ' ' + b.shortcut,
    block: b.id,
  })),
  [
    { k: 'bold', label: 'B', title: '굵게 ⌘B', mod: 'bold', active: ['bold'] },
    { k: 'italic', label: 'I', title: '기울임 ⌘I', mod: 'italic', active: ['italic'] },
    { k: 'strike', label: 'S', title: '취소선 ⌘⇧X', mod: 'strike', active: ['strike'] },
    { k: 'code', label: '`코드`', title: '인라인 코드 ⌘E', active: ['code'] },
  ],
  [
    { k: 'color', label: '색', title: '글자 색 ⌘⌥⇧1~5', active: ['textColor'] },
    { k: 'highlight', label: '형광', title: '형광펜 ⌘⌥Y', active: ['highlight'] },
    { k: 'clear', label: '서식 지우기', title: '서식 지우기 ⌘\\' },
  ],
  [
    { k: 'quote', label: '인용', title: '인용 ⌘⇧B', active: ['blockquote'] },
    { k: 'ul', label: '• 목록', title: '글머리 목록 ⌘⇧8', active: ['bulletList'] },
    { k: 'ol', label: '1. 번호', title: '번호 목록 ⌘⇧7', active: ['orderedList'] },
    { k: 'task', label: '☑ 할 일', title: '할 일 목록 ⌘⇧9', active: ['taskList'] },
  ],
  [
    { k: 'pre', label: '코드블록', title: '코드 블록 ⌘⌥C', active: ['codeBlock'] },
    { k: 'table', label: '표', title: '표 넣기' },
    { k: 'hr', label: '구분선', title: '구분선' },
    { k: 'link', label: '링크', title: '링크 ⌘K', active: ['link'] },
    { k: 'image', label: '사진', title: '사진 넣기 ⌘⌥P' },
  ],
]

/** 위 표를 한 줄로 편 것 — 눌림 표시를 만들 때 씁니다. */
const BUTTONS = GROUPS.reduce((all, g) => all.concat(g), [])

/* ================================================================= */

/* Decap 위젯 등록. 브라우저에서만 돕니다. */
if (typeof window !== 'undefined' && window.CMS && window.h) {
  registerWidget(window.CMS, window.h)
}

function registerWidget(CMS, h) {
  const stringWidget = CMS.getWidget('string')
  const markdownWidget = CMS.getWidget('markdown')
  if (!stringWidget || !markdownWidget) return

  /* React.Component. Decap 이 React 를 밖으로 안 내보내서 이미 등록된 위젯
     컨트롤의 부모 클래스에서 꺼냅니다. Decap 을 올리면 여기부터 확인하세요. */
  const Base = Object.getPrototypeOf(stringWidget.control)
  if (!Base || !Base.prototype || !Base.prototype.setState) return

  function LimMarkdownControl(props) {
    Base.call(this, props)
    this.state = { palette: false, raw: false, rawAuto: false, tick: 0 }
    this.editor = null
    this.host = null
    this.ta = null
    this.lastEmitted = props.value || ''
    this.lastMedia = null
    this.flushTimer = null
    this.lastSig = ''

    this.setHost = this.setHost.bind(this)
    this.setTa = this.setTa.bind(this)
    this.onRawInput = this.onRawInput.bind(this)
  }

  LimMarkdownControl.prototype = Object.create(Base.prototype)
  LimMarkdownControl.prototype.constructor = LimMarkdownControl

  const P = LimMarkdownControl.prototype

  P.setHost = function (el) {
    this.host = el
    if (el && !this.editor) this.mount(el)
  }

  P.setTa = function (el) {
    this.ta = el
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 2 + 'px'
    }
  }

  P.mount = function (el) {
    const self = this
    const original = this.props.value || ''

    this.editor = makeEditor(el, original, {
      pickImage: () => self.openMedia(),
      pickLink: () => self.setLink(),
      onUpdate() {
        self.scheduleFlush()
      },
      onSelectionUpdate() {
        self.refreshBar()
      },
      onTransaction() {
        self.refreshBar()
      },
      onFocus() {
        if (self.props.setActiveStyle) self.props.setActiveStyle()
      },
      onBlur() {
        self.flush()
        if (self.props.setInactiveStyle) self.props.setInactiveStyle()
      },
    })

    /*
      옛 글은 원문 모드로 엽니다.

      티스토리에서 옮겨온 글들은 목록 표시가 `-   ` 세 칸이고 구분선이
      `* * *` 입니다. 서식 모드로 열었다 저장하면 tiptap 이 자기 방식으로
      다시 쓰기 때문에, 한 글자만 고쳐도 파일 전체가 바뀐 것으로 남습니다.
      본문에 `<label>` 같은 글자가 있는 글은 아예 없어지기도 합니다.

      그래서 **열자마자 한 번 되돌려 보고**, 원본과 다르면 원문으로 엽니다.
      "서식" 단추로 언제든 바꿀 수 있습니다.
    */
    if (!isRoundTripSafe(this.editor, original)) {
      this.lastEmitted = original
      this.setState({ raw: true, rawAuto: true })
    }
  }

  /*
    글자를 칠 때마다 마크다운으로 옮기면 긴 글에서 눌립니다. 조금 모아서
    보냅니다. 대신 포커스가 빠질 때(=게시 단추를 누르기 직전)와 언마운트
    때는 반드시 흘려보냅니다 — 안 그러면 마지막 몇 글자가 빠집니다.
  */
  P.scheduleFlush = function () {
    if (this.flushTimer) clearTimeout(this.flushTimer)
    this.flushTimer = setTimeout(this.flush.bind(this), 150)
  }

  P.flush = function () {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
      this.flushTimer = null
    }
    if (!this.editor) return
    const md = this.editor.getMarkdown()
    if (md === this.lastEmitted) return
    this.lastEmitted = md
    this.props.onChange(md)
  }

  /** 도구 띠의 눌림 표시만 다시 그립니다. 바뀐 게 없으면 아무것도 안 합니다. */
  P.refreshBar = function () {
    const sig = this.activeSignature()
    if (sig === this.lastSig) return
    this.lastSig = sig
    this.setState({ tick: this.state.tick + 1 })
  }

  P.activeSignature = function () {
    const ed = this.editor
    if (!ed) return ''
    const marks = BUTTONS.map((b) => (b.active && ed.isActive.apply(ed, b.active) ? '1' : '0'))
    return marks.join('') + '|' + blockAt(ed)
  }

  P.run = function (key) {
    const ed = this.editor
    if (key === 'raw') return this.toggleRaw()
    if (key === 'image') return this.openMedia()
    if (key === 'color') return this.setState({ palette: !this.state.palette })
    if (!ed) return

    if (key.indexOf('block:') === 0) {
      setBlock(ed, key.slice(6))
      return
    }
    if (key.indexOf('color:') === 0) {
      const color = key.slice(6)
      this.setState({ palette: false })
      const c = ed.chain().focus()
      if (color === 'none') c.unsetTextColor().run()
      else c.setTextColor(color).run()
      return
    }

    const c = ed.chain().focus()
    switch (key) {
      case 'undo': c.undo().run(); break
      case 'redo': c.redo().run(); break
      case 'bold': c.toggleBold().run(); break
      case 'italic': c.toggleItalic().run(); break
      case 'strike': c.toggleStrike().run(); break
      case 'code': c.toggleCode().run(); break
      case 'highlight': c.toggleHighlight().run(); break
      case 'clear': c.unsetAllMarks().run(); break
      case 'quote': c.toggleBlockquote().run(); break
      case 'ul': c.toggleBulletList().run(); break
      case 'ol': c.toggleOrderedList().run(); break
      case 'task': c.toggleTaskList().run(); break
      case 'pre': c.toggleCodeBlock().run(); break
      case 'hr': c.setHorizontalRule().run(); break
      case 'table': c.insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run(); break
      case 'link': this.setLink(); break
      default: break
    }
  }

  P.setLink = function () {
    const ed = this.editor
    if (!ed) return
    const now = ed.getAttributes('link').href || ''
    const url = window.prompt('링크 주소', now)
    if (url === null) return
    if (url === '') {
      ed.chain().focus().unsetLink().run()
      return
    }
    ed.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  /*
    원문 모드. 마크다운을 그대로 고칩니다.

    두 가지 때문에 남겨 뒀습니다 — 옛 글을 왕복시키면 파일 전체가 다시
    쓰이는 것, 그리고 tiptap 이 못 다루는 것(직접 쓴 HTML 등)이 들어 있는
    글입니다. 그런 글은 서식 모드로 열지 말고 여기서 고치세요.
  */
  P.toggleRaw = function () {
    if (!this.state.raw) {
      this.flush()
      this.setState({ raw: true, rawAuto: false, palette: false })
      return
    }
    // 원문 → 서식. 텍스트를 tiptap 에 다시 부어 넣습니다.
    const md = this.ta ? this.ta.value : this.lastEmitted
    this.lastEmitted = md
    this.props.onChange(md)
    this.setState({ raw: false, rawAuto: false }, () => {
      if (this.editor) this.editor.commands.setContent(md, { contentType: 'markdown' })
    })
  }

  P.onRawInput = function (e) {
    const md = e.target.value
    this.lastEmitted = md
    this.props.onChange(md)
    if (this.ta) {
      this.ta.style.height = 'auto'
      this.ta.style.height = this.ta.scrollHeight + 2 + 'px'
    }
  }

  P.openMedia = function () {
    const p = this.props

    /*
      사진은 public/images/<주소>/ 로 올라갑니다 (config.yml 의 media_folder).
      주소가 비어 있으면 갈 곳이 없어 public/images 바닥에 떨어집니다 —
      나중에 어느 글 사진인지 알 수가 없으니 여기서 막습니다.
    */
    const slug = p.entry && p.entry.getIn ? p.entry.getIn(['data', 'slug']) : null
    if (!slug) {
      window.alert('"주소"를 먼저 적어 주세요.\n사진이 /images/<주소>/ 안에 올라갑니다.')
      return
    }

    p.onOpenMediaLibrary({
      controlID: p.forID,
      forImage: true,
      privateUpload: false,
      allowMultiple: false,
      field: p.field,
    })
  }

  P.componentDidUpdate = function () {
    const p = this.props

    // 미디어 라이브러리에서 고른 사진이 돌아오면 커서 자리에 꽂습니다.
    const paths = p.mediaPaths
    const picked = paths && paths.get ? paths.get(p.forID) : paths && paths[p.forID]
    if (picked && picked !== this.lastMedia) {
      this.lastMedia = picked
      const url = Array.isArray(picked) ? picked[0] : picked
      if (typeof url === 'string' && this.editor) {
        this.editor.chain().focus().setImage({ src: url, alt: '설명' }).run()
        this.flush()
      }
      if (p.onRemoveInsertedMedia) p.onRemoveInsertedMedia(p.forID)
      this.lastMedia = null
    }

    /*
      바깥에서 값이 바뀐 경우(글을 새로 열거나 되돌렸을 때)만 다시 부어
      넣습니다. 입력 중에는 절대 건드리지 않습니다 — 한글 조합 중에 내용을
      갈아끼우면 글자가 깨집니다. 이게 리치 텍스트에서 나던 그 증상입니다.
    */
    const next = p.value || ''
    if (!this.state.raw && this.editor && !this.editor.isFocused && next !== this.lastEmitted) {
      this.lastEmitted = next
      this.editor.commands.setContent(next, { contentType: 'markdown' })
    }
  }

  P.componentWillUnmount = function () {
    this.flush()
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  }

  P.render = function () {
    const self = this
    const p = this.props
    const ed = this.editor
    const raw = this.state.raw
    const here = ed && !raw ? blockAt(ed) : null

    const groups = GROUPS.map((group, gi) =>
      h(
        'div',
        { key: 'g' + gi, className: 'lim-md-group' },
        group.map((b) => {
          const on = !raw && ed && (b.block ? b.block === here : b.active && ed.isActive.apply(ed, b.active))
          return h(
            'button',
            {
              key: b.k,
              type: 'button',
              title: b.title,
              'aria-label': b.title,
              disabled: raw,
              className:
                'lim-md-btn' +
                (b.mod ? ' is-' + b.mod : '') +
                (on ? ' is-on' : '') +
                (b.k === 'color' && self.state.palette ? ' is-open' : ''),
              // 눌러도 본문에서 포커스가 안 빠지게 — 안 막으면 선택이 풀립니다
              onMouseDown: (e) => e.preventDefault(),
              onClick: () => self.run(b.k),
            },
            b.label
          )
        })
      )
    )

    groups.push(
      h(
        'div',
        { key: 'graw', className: 'lim-md-group is-last' },
        h(
          'button',
          {
            key: 'raw',
            type: 'button',
            title: raw ? '서식 모드로 보기' : '마크다운 원문으로 고치기',
            className: 'lim-md-btn is-raw' + (raw ? ' is-on' : ''),
            onMouseDown: (e) => e.preventDefault(),
            onClick: () => self.run('raw'),
          },
          raw ? '서식' : '원문'
        )
      )
    )

    const palette = this.state.palette
      ? h(
          'div',
          { className: 'lim-md-palette' },
          COLORS.map((c, i) =>
            h(
              'button',
              {
                key: c.k,
                type: 'button',
                title: c.label + ' ⌘⌥⇧' + (i + 1),
                className: 'lim-md-swatch',
                style: { backgroundColor: c.swatch },
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => self.run('color:' + c.k),
              },
              c.label
            )
          ).concat([
            h(
              'button',
              {
                key: 'none',
                type: 'button',
                title: '색 빼기 ⌘⌥⇧0',
                className: 'lim-md-swatch is-none',
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => self.run('color:none'),
              },
              '색 빼기'
            ),
          ])
        )
      : null

    return h(
      'div',
      { className: (p.classNameWrapper || '') + ' lim-md' },
      h('div', { className: 'lim-md-bar' }, groups),
      palette,
      this.state.rawAuto
        ? h(
            'p',
            { className: 'lim-md-note' },
            '옛 형식으로 쓰인 글이라 원문으로 열었습니다. "서식" 으로 바꾸면 글 전체가 다시 쓰입니다.'
          )
        : null,
      // 두 편집기를 같이 두고 하나만 보여 줍니다. tiptap 을 없앴다 다시
      // 만들면 되돌리기 기록이 날아가서, 원문을 잠깐 보고 온 것뿐인데
      // ⌘Z 가 안 먹습니다.
      h('div', {
        id: raw ? undefined : p.forID,
        className: 'lim-md-editor' + (raw ? ' is-hidden' : ''),
        ref: this.setHost,
      }),
      raw
        ? h('textarea', {
            id: p.forID,
            className: 'lim-md-ta',
            defaultValue: this.lastEmitted,
            onChange: this.onRawInput,
            ref: this.setTa,
            spellCheck: false,
            autoCorrect: 'off',
            autoCapitalize: 'off',
          })
        : null
    )
  }

  CMS.registerWidget('markdown', LimMarkdownControl, markdownWidget.preview)
  /* ---------------------------------------------------------------
     주소(slug) 칸을 미리 채웁니다.

     비워두면 폰에서 한글로 글을 쓰다 말고 영문 자판으로 바꿔서
     주소를 쳐야 합니다. 그런데 이 값은 저장할 때만 쓰이는 게 아니라
     **사진을 넣는 순간** 필요합니다 — config.yml 의 media_folder 가
     public/images/{{fields.slug}} 라, 비어 있으면 openMedia() 가
     막습니다. 그래서 저장 시점에 제목에서 뽑는 방식으로는 늦습니다.

     ⚠ 제목에서 뽑지 않습니다. 한글 제목이 그대로 파일명이 되면
       주소가 %EB%B8%94… 로 나갑니다. ASCII 만 남기면 한글 제목은
       남는 글자가 없어서 빈 파일명이 됩니다.

     ⚠ 번호(dev1·dev2…)도 안 씁니다. 다음 번호를 알려면 저장소를
       먼저 읽어야 하는데, 새 글 화면에는 그 목록이 없을 수 있습니다.
       티스토리에서 옮겨온 116편이 그 방식(swiftui-68)인데, 그건
       티스토리 서버가 번호를 발급해 줬기 때문에 됐던 것입니다.

     그래서 **시각**을 씁니다. 시계만 보면 나오니 저장소를 안 읽어도
     되고, 저자를 바꿔도 주소가 안 틀어집니다.

     ⚠ 분까지 넣는 게 과해 보여도 날짜만으로는 모자랍니다. 지금 글
       128편이 71일에 몰려 있고 **31일은 하루에 두 편 이상**입니다.
       겹치면 Decap 이 파일명만 `-1` 을 붙여 바꾸는데(덮어쓰지는
       않습니다), 사진 폴더는 이 칸의 값 그대로라 둘이 갈라집니다.
  --------------------------------------------------------------- */

  const StringControl = stringWidget.control

  function LimStringControl(props) {
    Base.call(this, props)
  }

  LimStringControl.prototype = Object.create(Base.prototype)
  LimStringControl.prototype.constructor = LimStringControl

  LimStringControl.prototype.componentDidMount = function () {
    const p = this.props
    /* 값이 있으면 손대지 않습니다 — 옛 글을 열었을 때 주소가 바뀌면
       그 자리에서 404 가 됩니다. 지운 채로 두는 것도 그대로 둡니다
       (componentDidMount 는 한 번만 돕니다). */
    if (!p.field || p.field.get('name') !== 'slug') return
    if (p.value) return
    p.onChange(slugStamp())
  }

  /* 원래 string 위젯을 그대로 그립니다. 직접 input 을 그리면 Decap 이
     칸에 주는 스타일·포커스 처리를 하나씩 따라 만들어야 합니다. */
  LimStringControl.prototype.render = function () {
    return h(StringControl, this.props)
  }

  CMS.registerWidget('string', LimStringControl, stringWidget.preview)
}

/**
 * 새 글의 기본 주소 — `2026-08-25-0930`.
 *
 * config.yml 의 pattern(`^[a-z0-9]+(-[a-z0-9]+)*$`)을 통과하는 모양이어야
 * 합니다. 네 덩어리가 전부 숫자라 통과합니다.
 */
export function slugStamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return [
    d.getFullYear(),
    p(d.getMonth() + 1),
    p(d.getDate()),
    p(d.getHours()) + p(d.getMinutes()),
  ].join('-')
}
