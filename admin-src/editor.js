/*
  /admin 본문 편집기 — Toast UI Editor.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 esbuild 로 묶은
    `public/admin/editor.js` (와 같이 나오는 `editor.css`) 입니다.
    고쳤으면 `npm run admin` 을 돌리세요.

  왜 Toast 냐 (2026-08-25 에 tiptap 에서 옮겨왔습니다):

  - **마크다운이 1급 시민입니다.** 위지윅과 원문을 버튼 하나로 오가고,
    원문 모드에도 툴바와 미리보기가 그대로 있습니다. tiptap 때는 원문이
    맨 textarea 였습니다.
  - **옛 글을 덜 망가뜨립니다.** 글 128편을 왕복시켜 보면 글자가 달라지는
    글이 tiptap 76편 → Toast 21편입니다 (scripts/check-md-roundtrip.mjs).
  - 툴바·표·미리보기가 내장이라 손으로 만들 것이 색과 형광펜뿐입니다.

  ⚠ 저장되는 것은 여전히 **마크다운 원문**입니다. 글 128편이 마크다운
    파일이라 형식을 바꿀 수 없습니다.

  ⚠ 왕복은 여전히 공짜가 아닙니다. 옛 글을 서식 모드로 열었다 저장하면
    목록 표시나 표 정렬이 Toast 방식으로 다시 쓰입니다. 그래서 **열 때 한 번
    되돌려 보고, 원본과 다르면 원문 모드로 엽니다.**
*/
/*
  ⚠ CSS 는 여기서 import 하지 않습니다 — `admin-src/index.js` 가 합니다.
    이 파일을 node 에서 그대로 불러다 쓰는 곳이 있어서입니다
    (scripts/check-md-roundtrip.mjs). node 는 .css import 를 못 읽습니다.
*/
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/i18n/ko-kr'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import { keymap } from 'prosemirror-keymap'

/* -------------------------------------------------------------------
   글자 색.

   마크다운에 색이 없어서 <span class="c-*"> 로 넣습니다. 색 값을 본문에
   박지 않고 클래스만 넣는 이유는, 값을 박으면 다크·라이트 한쪽에서 반드시
   안 읽히기 때문입니다. 실제 색은 global.css 가 테마별로 고릅니다.

   ⚠ Toast 가 기본으로 주는 color-syntax 플러그인은 안 씁니다 —
     그건 `<span style="color: #58dddf">` 를 본문에 박습니다.
   색을 늘리려면 global.css 의 `.prose .c-*` 와 admin/index.html 의
   편집기용 `.c-*` 도 같이 늘리세요.
   ------------------------------------------------------------------- */
export const COLORS = [
  { k: 'teal', label: '청록', swatch: '#58dddf' },
  { k: 'blue', label: '파랑', swatch: '#429ff5' },
  { k: 'green', label: '초록', swatch: '#5bc25d' },
  { k: 'orange', label: '주황', swatch: '#ff9100' },
  { k: 'red', label: '빨강', swatch: '#fe6d6d' },
]

/*
  ⚠ 이 renderer 를 등록해야 위지윅 스키마에 그 태그의 마크가 생깁니다.
    안 등록하면 <span> 도 <mark> 도 **글자만 남기고 태그가 사라집니다.**
    (Toast 는 모르는 인라인 태그를 지웁니다 — 확인하고 넣은 것입니다.)
*/
function htmlInlineTag(name) {
  return {
    [name]: (node, { entering }) =>
      entering
        ? { type: 'openTag', tagName: name, attributes: node.attrs }
        : { type: 'closeTag', tagName: name },
  }
}

/* -------------------------------------------------------------------
   위지윅에서 Enter 한 번이 빈 줄까지 만들게 합니다.

   Toast 는 **원문 한 줄 = 블록 하나**로 잡습니다. 빈 줄도 빈 문단 하나로
   들고 있어서, Enter 를 한 번 누르면 마크다운에는 줄바꿈 하나(`\n`)만
   들어갑니다. 그런데 이 블로그는 remark-breaks 를 안 쓰기 때문에(§2)
   그 줄바꿈은 화면에서 앞 줄에 그대로 이어 붙습니다 — **편집기에서는 두
   줄인데 올라간 글은 한 줄**이 됩니다.

   그래서 문단을 가를 때 사이에 빈 문단을 하나 더 둡니다. 빈 문단이 곧
   마크다운의 빈 줄이라, 본 대로 나옵니다.

   ⚠ 최상위 문단에서만 합니다. 목록·인용문·표·코드블록·제목 안에서는
     false 를 돌려주고 Toast 기본 동작에 맡깁니다 — 거기서는 줄이 이어
     붙지 않고, Enter 가 항목을 늘리는 등 따로 할 일이 있습니다.
   ⚠ **Shift+Enter 는 그대로 둡니다.** 앞 줄에 이어 붙이고 싶을 때 쓸 수
     있는 유일한 방법입니다 (티스토리에서 옮겨온 116편이 그 모양입니다).
   ⚠ **원문 모드에는 안 겁니다.** 거기서는 마크다운 소스를 직접 보고
     고치는 것이라 Enter 가 줄바꿈 하나인 것이 맞습니다.
   ------------------------------------------------------------------- */
function splitWithBlankLine(state, dispatch) {
  const { $from, $to, empty } = state.selection
  /* 최상위(doc > paragraph)가 아니면 손대지 않습니다 */
  if ($from.depth !== 1 || $to.depth !== 1) return false
  if ($from.parent.type.name !== 'paragraph') return false
  if (!dispatch) return true

  const tr = state.tr
  if (!empty) tr.deleteSelection()

  const pos = tr.selection.from
  const before = tr.steps.length
  try {
    tr.split(pos)
    /* 첫 split 로 밀린 자리에서 한 번 더 — 가운데에 빈 문단이 남습니다.
       커서는 ProseMirror 가 알아서 따라와 세 번째 문단에 놓입니다. */
    tr.split(tr.mapping.slice(before).map(pos))
  } catch (err) {
    return false
  }

  dispatch(tr)
  return true
}

/** 선택한 글자를 태그로 감쌉니다 — 원문 모드에서는 글자를 그대로 끼워 넣습니다. */
function wrapInMarkdown(openTag, closeTag) {
  return (payload, state, dispatch) => {
    const { tr, selection } = state
    const slice = selection.content()
    const text = slice.content.textBetween(0, slice.content.size, '\n')
    tr.replaceSelectionWith(state.schema.text(openTag + text + closeTag))
    dispatch(tr)
    return true
  }
}

/** 위지윅에서 마크를 켜고 끕니다. */
function toggleMarkInWysiwyg(markName, attrs) {
  return (payload, state, dispatch) => {
    const { tr, selection, schema, doc } = state
    const type = schema.marks[markName]
    if (!type) return false
    const { from, to } = selection
    if (from === to) return false

    const already = doc.rangeHasMark(from, to, type)
    if (already) tr.removeMark(from, to, type)
    else tr.addMark(from, to, type.create(attrs))
    dispatch(tr)
    return true
  }
}

/**
 * 이 블로그에만 있는 것 둘 — 글자 색과 형광펜.
 *
 * Toast 플러그인 규약대로 명령·툴바·렌더러를 한 덩어리로 돌려줍니다.
 * `onImage` 는 사진 버튼이 눌렸을 때 부를 것(=Decap 미디어 라이브러리)입니다.
 */
/**
 * 이 블로그에만 있는 것 둘 — 글자 색과 형광펜.
 *
 * Toast 플러그인 규약대로 **명령과 렌더러만** 돌려줍니다. 툴바 버튼은
 * 여기서 안 만듭니다 — 플러그인의 toolbarItems 는 `groupIndex` 로 기존
 * 묶음 안에 끼워 넣는 방식이라, 빈 묶음을 만들어 두면 무시되고 엉뚱한
 * 자리(목록 묶음 한가운데)에 붙습니다. 버튼은 makeEditor 에서 툴바 배열에
 * 직접 넣습니다.
 */
export function limPlugin() {
  return function () {
    return {
      markdownCommands: {
        limColor: (payload, state, dispatch) =>
          wrapInMarkdown('<span class="c-' + payload.key + '">', '</span>')(
            payload,
            state,
            dispatch
          ),
        limUncolor: () => false,
        limHighlight: (payload, state, dispatch) =>
          wrapInMarkdown('<mark>', '</mark>')(payload, state, dispatch),
      },

      wysiwygCommands: {
        limColor: (payload, state, dispatch) =>
          toggleMarkInWysiwyg('span', {
            htmlInline: true,
            htmlAttrs: { class: 'c-' + payload.key },
          })(payload, state, dispatch),

        limUncolor: (payload, state, dispatch) => {
          const { tr, selection, schema, doc } = state
          const type = schema.marks.span
          if (!type || selection.from === selection.to) return false
          if (!doc.rangeHasMark(selection.from, selection.to, type)) return false
          tr.removeMark(selection.from, selection.to, type)
          dispatch(tr)
          return true
        },

        limHighlight: (payload, state, dispatch) =>
          toggleMarkInWysiwyg('mark', { htmlInline: true, htmlAttrs: {} })(
            payload,
            state,
            dispatch
          ),
      },

      toHTMLRenderers: {
        htmlInline: Object.assign({}, htmlInlineTag('span'), htmlInlineTag('mark')),
      },

      /* ⚠ 여기 넣은 것이 Toast 자기 keymap 보다 **먼저** 걸립니다
           (WysiwygEditor.createPlugins 가 플러그인 것을 앞에 놓습니다).
           그래서 목록·표에서는 반드시 false 를 돌려줘야 합니다. */
      wysiwygPlugins: [() => keymap({ Enter: splitWithBlankLine })],
    }
  }
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

/*
  툴바.

  ⚠ 기본 `image` 는 넣지 않습니다. 그건 파일을 직접 올리는 버튼이라
    Decap 미디어 라이브러리(=public/images/<주소>/)를 안 거칩니다.
    대신 아래 "사진" 버튼이 그 자리를 대신합니다.
*/
function limButton(label, title, onClick) {
  const el = document.createElement('button')
  el.type = 'button'
  el.className = 'toastui-editor-toolbar-icons lim-tb'
  el.textContent = label
  el.setAttribute('aria-label', title)
  el.addEventListener('click', (e) => {
    e.preventDefault()
    onClick()
  })
  return el
}

/** 색·형광펜·사진 — 이 블로그가 더 쓰는 것들. `ref.editor` 로 명령을 보냅니다. */
function limToolbarGroup(ref, onImage) {
  const palette = document.createElement('div')
  palette.className = 'lim-palette'

  const exec = (name, payload) => {
    if (ref.editor) ref.editor.exec(name, payload)
  }

  for (const c of COLORS) {
    const sw = document.createElement('button')
    sw.type = 'button'
    sw.className = 'lim-swatch'
    sw.title = c.label
    sw.style.backgroundColor = c.swatch
    sw.addEventListener('click', (e) => {
      e.preventDefault()
      exec('limColor', { key: c.k })
    })
    palette.appendChild(sw)
  }

  const clear = document.createElement('button')
  clear.type = 'button'
  clear.className = 'lim-swatch is-none'
  clear.textContent = '색 빼기'
  clear.addEventListener('click', (e) => {
    e.preventDefault()
    exec('limUncolor')
  })
  palette.appendChild(clear)

  return [
    {
      name: 'lim-color',
      tooltip: '글자 색',
      el: limButton('색', '글자 색', () => {}),
      popup: { className: 'lim-popup', body: palette, style: { width: 'auto' } },
    },
    {
      name: 'lim-highlight',
      tooltip: '형광펜',
      el: limButton('형광', '형광펜', () => exec('limHighlight')),
    },
    {
      name: 'lim-image',
      tooltip: '사진',
      el: limButton('사진', '사진 넣기', () => onImage && onImage()),
    },
  ]
}

/** 지금 어두운 화면인지. node(왕복 검사)에서는 항상 밝은 쪽입니다. */
function isDark() {
  if (typeof document === 'undefined') return false
  const picked = document.documentElement.getAttribute('data-theme')
  if (picked) return picked === 'dark'
  return !!(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

/** 글 하나를 여는 편집기. 왕복 검사(scripts/check-md-roundtrip.mjs)도 씁니다. */
export function makeEditor(el, markdown, { onImage, onChange, onFocus, onBlur } = {}) {
  /* ⚠ 값이 undefined 인 채로 넘기면 Toast 가 그걸 부르려다 터집니다 */
  const events = {}
  if (onChange) events.change = onChange
  if (onFocus) events.focus = onFocus
  if (onBlur) events.blur = onBlur

  /* 버튼이 만들어질 때는 editor 가 아직 없습니다 — 상자에 담아 뒤에 채웁니다 */
  const ref = {}

  const editor = new Editor({
    el,
    /*
      ⚠ 높이를 고정하지 않습니다. 안쪽에 스크롤을 만들면 글을 쓰다 커서가
        편집기 밖으로 밀려나고, 폰에서는 페이지 스크롤과 겹쳐 손이 꼬입니다.
    */
    height: 'auto',
    /* ⚠ Toast 의 minHeight 는 px 만 받습니다. 화면 높이에 맞추는 건
         admin/index.html 의 `min-height: 55vh` 가 합니다. */
    /* 옛 글 판정 전이라 원문으로 엽니다 — 원문은 소스를 그대로 들고 있습니다 */
    initialEditType: 'markdown',
    previewStyle: 'tab',
    language: 'ko-KR',
    initialValue: markdown || '',
    usageStatistics: false,
    hideModeSwitch: false,
    /* 테마는 <html data-theme> 를 먼저 봅니다 — 머리글의 해/달 단추가
       거기에 씁니다 (admin-src/skin.js). 고른 적이 없으면 OS 를 따릅니다.
       ⚠ 나중에 테마를 바꾸면 편집기를 다시 만들지 않고 skin.js 가
         `toastui-editor-dark` 클래스만 켰다 끕니다. */
    theme: isDark() ? 'dark' : 'default',
    /*
      ⚠ 순서가 곧 살아남는 차례입니다. Toast 는 폭이 모자라면 **뒤에서부터**
        "..." 안으로 밀어 넣습니다. 2026-08-25 에 편집 화면이 두 열이 되면서
        본문 칸이 좁아졌고, 그때 "사진" 이 "..." 안으로 들어갔습니다 —
        사진은 이 블로그에서 제일 자주 쓰는 버튼이라(§6-2) 앞으로 당겼습니다.
      ⚠ indent·outdent 는 뺐습니다. 자리를 둘 차지하는데 목록 안에서
        Tab / Shift+Tab 이 같은 일을 합니다.
    */
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      limToolbarGroup(ref, onImage),
      ['hr', 'quote'],
      ['ul', 'ol', 'task'],
      ['table', 'link'],
      ['code', 'codeblock'],
    ],
    plugins: [tableMergedCell, limPlugin()],
    events,
  })

  ref.editor = editor
  return editor
}

/**
 * 서식 모드로 열어도 되는 글인지 봅니다.
 *
 * 마크다운 → 위지윅 → 마크다운 을 한 번 돌려 보고 원본과 같으면 서식으로,
 * 다르면 **원본을 도로 부어 넣고** 원문으로 둡니다. 도로 부어 넣는 것이
 * 중요합니다 — 모드를 바꾸는 순간 Toast 가 자기 방식으로 다시 쓰기 때문에,
 * 그냥 두면 열기만 해도 파일이 바뀐 것이 됩니다.
 */
export function pickMode(editor, original) {
  /* 새 글은 볼 것도 없이 서식으로 엽니다 (만들 때는 원문 모드입니다) */
  if (!original) {
    editor.changeMode('wysiwyg', true)
    return 'wysiwyg'
  }

  editor.changeMode('wysiwyg', true)
  const back = editor.getMarkdown()
  if (normalizeMarkdown(back) === normalizeMarkdown(original)) return 'wysiwyg'
  editor.changeMode('markdown', true)
  editor.setMarkdown(original)
  return 'markdown'
}

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
    this.state = { rawAuto: false }
    this.editor = null
    this.host = null
    this.lastEmitted = props.value || ''
    this.lastMedia = null
    this.flushTimer = null
    this.booting = true
    this.pending = false

    this.setHost = this.setHost.bind(this)
  }

  LimMarkdownControl.prototype = Object.create(Base.prototype)
  LimMarkdownControl.prototype.constructor = LimMarkdownControl

  const P = LimMarkdownControl.prototype

  /*
    ⚠ **폭이 잡힌 다음에 만들어야 합니다.**

    Toast 는 만들어질 때 툴바 폭을 한 번 재서, 모자라면 버튼을 "..." 안으로
    옮깁니다. Decap 이 위젯을 붙이는 시점에는 이 칸의 폭이 아직 0 이라,
    그대로 만들면 버튼 하나만 남고 나머지가 전부 "..." 로 들어갑니다.
    (나중에 폭이 생겨도 되돌아 나오지 않습니다.)

    그래서 폭이 생길 때까지 기다렸다 만듭니다.
  */
  P.setHost = function (el) {
    this.host = el
    if (!el || this.editor || this.pending) return

    if (el.clientWidth > 0) {
      this.mount(el)
      return
    }

    this.pending = true
    const self = this
    const wait = () => {
      if (!self.host || self.editor) {
        self.pending = false
        return
      }
      if (self.host.clientWidth > 0) {
        self.pending = false
        self.mount(self.host)
        return
      }
      requestAnimationFrame(wait)
    }
    requestAnimationFrame(wait)
  }

  P.mount = function (el) {
    const self = this
    const original = this.props.value || ''

    this.editor = makeEditor(el, original, {
      onImage: () => self.openMedia(),
      onChange: () => {
        if (!self.booting) self.scheduleFlush()
      },
      onFocus: () => {
        if (self.props.setActiveStyle) self.props.setActiveStyle()
      },
      onBlur: () => {
        self.flush()
        if (self.props.setInactiveStyle) self.props.setInactiveStyle()
      },
    })

    const mode = pickMode(this.editor, original)
    this.lastEmitted = original
    this.booting = false
    if (mode === 'markdown' && original) this.setState({ rawAuto: true })
  }

  /*
    글자를 칠 때마다 마크다운으로 옮기면 긴 글에서 눌립니다. 조금 모아서
    보냅니다. 대신 포커스가 빠질 때(=게시 버튼을 누르기 직전)와 언마운트
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
        this.editor.exec('addImage', { imageUrl: url, altText: '설명' })
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
    if (this.editor && next !== this.lastEmitted && !this.isFocused()) {
      this.lastEmitted = next
      this.booting = true
      this.editor.setMarkdown(next)
      this.booting = false
    }
  }

  P.isFocused = function () {
    return !!(this.host && this.host.contains(document.activeElement))
  }

  P.componentWillUnmount = function () {
    this.flush()
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  }

  P.render = function () {
    const p = this.props

    return h(
      'div',
      { className: (p.classNameWrapper || '') + ' lim-md' },
      this.state.rawAuto
        ? h(
            'p',
            { className: 'lim-md-note' },
            '옛 형식으로 쓰인 글이라 원문으로 열었습니다. 위쪽 "WYSIWYG" 로 바꾸면 글 전체가 다시 쓰입니다.'
          )
        : null,
      h('div', { id: p.forID, className: 'lim-md-editor', ref: this.setHost })
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
