/*
  /admin 본문 편집기.

  Decap 기본 markdown 위젯을 통째로 갈아끼웁니다. 왜 갈아끼우냐면:

  - **리치 텍스트는 못 씁니다.** 폰에서 한글 입력이 끊기고 코드펜스를 망칩니다
    (config.yml 의 modes 주석 참고). 그래서 원문(raw)만 쓰고 있었는데,
  - **원문 모드에서는 Decap 툴바가 전부 disabled 입니다.** 굵게·제목·사진이
    다 막힙니다. 실제로 버튼이 `disabled` 속성을 달고 렌더됩니다.

  그래서 「마크다운 원문 + 직접 만든 툴바」로 갑니다. 저장되는 것은 여전히
  마크다운 원문이라 글 117개와 같은 형식이고, 툴바는 커서 자리에 마크다운을
  꽂아 넣을 뿐입니다.

  ⚠ 이 파일이 안 불러와지면 Decap 기본 위젯이 그대로 남습니다 — 지금까지
    쓰던 원문 편집기입니다. 툴바만 없어지고 글은 계속 쓸 수 있습니다.

  ⚠ Decap 은 React 를 밖으로 내보내지 않습니다. 그래서 React.Component 를
    이미 등록된 위젯의 프로토타입에서 꺼내 씁니다 (아래 Base).
*/
;(function () {
  if (!window.CMS || !window.h) return

  var h = window.h
  var CMS = window.CMS

  var stringWidget = CMS.getWidget('string')
  var markdownWidget = CMS.getWidget('markdown')
  if (!stringWidget || !markdownWidget) return

  /* React.Component. Decap 이 window 에 React 를 안 올려 두기 때문에
     이미 등록된 위젯 컨트롤의 부모 클래스에서 꺼냅니다. */
  var Base = Object.getPrototypeOf(stringWidget.control)
  if (!Base || !Base.prototype || !Base.prototype.setState) return

  /* -----------------------------------------------------------------
     글자 색.

     마크다운에는 색이 없어서 <span class="c-*"> 로 넣습니다. 색을 직접
     박지 않고 클래스만 넣는 이유는, 값을 본문에 박으면 다크/라이트 한쪽에서
     반드시 안 읽히기 때문입니다. 실제 색은 global.css 가 테마별로 고릅니다.
     여기 목록을 늘리려면 global.css 의 `.prose .c-*` 도 같이 늘리세요.
     ----------------------------------------------------------------- */
  var COLORS = [
    { k: 'teal', label: '청록', swatch: '#58dddf' },
    { k: 'blue', label: '파랑', swatch: '#429ff5' },
    { k: 'green', label: '초록', swatch: '#5bc25d' },
    { k: 'orange', label: '주황', swatch: '#ff9100' },
    { k: 'red', label: '빨강', swatch: '#fe6d6d' },
  ]

  var BUTTONS = [
    { k: 'h2', title: '큰 제목', label: 'H2' },
    { k: 'h3', title: '작은 제목', label: 'H3' },
    { k: 'bold', title: '굵게', label: 'B', mod: 'bold' },
    { k: 'italic', title: '기울임', label: 'I', mod: 'italic' },
    { k: 'strike', title: '취소선', label: 'S', mod: 'strike' },
    { k: 'mark', title: '형광펜', label: '형광' },
    { k: 'color', title: '글자 색', label: '색' },
    { k: 'quote', title: '인용', label: '인용' },
    { k: 'ul', title: '글머리 목록', label: '• 목록' },
    { k: 'ol', title: '번호 목록', label: '1. 번호' },
    { k: 'code', title: '인라인 코드', label: '`코드`' },
    { k: 'pre', title: '코드 블록', label: '코드블록' },
    { k: 'link', title: '링크', label: '링크' },
    { k: 'image', title: '사진 넣기', label: '사진' },
    { k: 'hr', title: '구분선', label: '구분선' },
  ]

  /* 줄머리 표시(제목·인용·목록)를 서로 갈아끼울 때 떼어내는 것들 */
  var LINE_MARK = /^(#{1,6} |> |- |\d+\. )/

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /** 선택 영역을 before/after 로 감쌉니다. 선택이 없으면 ph 를 넣고 그걸 고릅니다. */
  function wrap(before, after, ph) {
    return function (val, s, e) {
      var sel = val.slice(s, e)
      var body = sel || ph
      return {
        start: s,
        end: e,
        text: before + body + after,
        selStart: s + before.length,
        selEnd: s + before.length + body.length,
      }
    }
  }

  /**
   * 선택에 걸친 줄 전체의 머리에 표시를 붙입니다.
   * 이미 붙어 있으면 뗍니다 — 같은 버튼을 두 번 누르면 원래대로 돌아옵니다.
   */
  function linePrefix(prefix, numbered) {
    return function (val, s, e) {
      var ls = val.lastIndexOf('\n', s - 1) + 1
      var le = val.indexOf('\n', e)
      if (le === -1) le = val.length

      var lines = val.slice(ls, le).split('\n')
      var re = numbered ? /^\d+\. / : new RegExp('^' + escapeRe(prefix))
      var isOn = lines.every(function (l) {
        return re.test(l)
      })

      var out = lines
        .map(function (l, i) {
          if (isOn) return l.replace(re, '')
          // 다른 줄머리 표시가 있으면 갈아끼웁니다 (## → > 처럼)
          var bare = l.replace(LINE_MARK, '')
          return (numbered ? i + 1 + '. ' : prefix) + bare
        })
        .join('\n')

      return { start: ls, end: le, text: out, selStart: ls, selEnd: ls + out.length }
    }
  }

  /** 앞이 줄바꿈이 아니면 줄을 하나 띄웁니다 — 코드블록·구분선용. */
  function freshLine(val, s) {
    if (s === 0) return ''
    return val[s - 1] === '\n' ? '' : '\n'
  }

  var ACTIONS = {
    h2: linePrefix('## '),
    h3: linePrefix('### '),
    quote: linePrefix('> '),
    ul: linePrefix('- '),
    ol: linePrefix('', true),
    bold: wrap('**', '**', '굵게'),
    italic: wrap('*', '*', '기울임'),
    strike: wrap('~~', '~~', '취소선'),
    code: wrap('`', '`', '코드'),
    mark: wrap('<mark>', '</mark>', '형광펜'),

    link: function (val, s, e) {
      var sel = val.slice(s, e) || '링크 글자'
      var text = '[' + sel + '](주소)'
      // 글자보다 주소를 먼저 채우게, 「주소」 쪽을 골라 둡니다
      var at = s + text.length - 1 - '주소'.length
      return { start: s, end: e, text: text, selStart: at, selEnd: at + '주소'.length }
    },

    pre: function (val, s, e) {
      var sel = val.slice(s, e)
      var nl = freshLine(val, s)
      var body = sel || '코드'
      var text = nl + '```\n' + body + '\n```\n'
      // 선택이 있었으면 언어를 적을 자리(``` 바로 뒤)에 커서를 둡니다
      var at = s + nl.length + 3
      return sel
        ? { start: s, end: e, text: text, selStart: at, selEnd: at }
        : {
            start: s,
            end: e,
            text: text,
            selStart: s + nl.length + 4,
            selEnd: s + nl.length + 4 + body.length,
          }
    },

    hr: function (val, s, e) {
      var text = freshLine(val, s) + '\n---\n\n'
      return { start: s, end: e, text: text, selStart: s + text.length, selEnd: s + text.length }
    },
  }

  COLORS.forEach(function (c) {
    ACTIONS['color:' + c.k] = wrap('<span class="c-' + c.k + '">', '</span>', c.label + ' 글자')
  })

  function imageAction(url) {
    return function (val, s, e) {
      var nl = freshLine(val, s)
      var alt = '설명'
      var text = nl + '![' + alt + '](' + url + ')\n'
      var at = s + nl.length + 2
      return { start: s, end: e, text: text, selStart: at, selEnd: at + alt.length }
    }
  }

  /* ----------------------------------------------------------------- */

  function LimMarkdownControl(props) {
    Base.call(this, props)
    this.state = { palette: false }
    this.ta = null
    this.sel = [0, 0]
    this.lastValue = props.value || ''
    this.lastMedia = null

    this.setRef = this.setRef.bind(this)
    this.onInput = this.onInput.bind(this)
    this.rememberSelection = this.rememberSelection.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  LimMarkdownControl.prototype = Object.create(Base.prototype)
  LimMarkdownControl.prototype.constructor = LimMarkdownControl

  var P = LimMarkdownControl.prototype

  P.setRef = function (el) {
    this.ta = el
    if (el) this.grow()
  }

  /** 내용에 맞춰 키를 늘립니다. 안 늘리면 작은 창 안에서 스크롤하며 쓰게 됩니다. */
  P.grow = function () {
    var ta = this.ta
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 2 + 'px'
  }

  P.rememberSelection = function () {
    if (this.ta) this.sel = [this.ta.selectionStart, this.ta.selectionEnd]
  }

  P.onFocus = function () {
    this.rememberSelection()
    if (this.props.setActiveStyle) this.props.setActiveStyle()
  }

  P.onBlur = function () {
    this.rememberSelection()
    if (this.props.setInactiveStyle) this.props.setInactiveStyle()
  }

  P.onInput = function (e) {
    this.lastValue = e.target.value
    this.rememberSelection()
    this.grow()
    this.props.onChange(this.lastValue)
  }

  /**
   * 커서 자리를 fn 이 만든 문자열로 바꿉니다.
   *
   * execCommand 를 쓰는 이유는 되돌리기(⌘Z) 때문입니다. value 를 직접
   * 갈아끼우면 브라우저의 실행취소 기록이 끊겨서, 버튼 한 번 누르면 그 전으로
   * 못 돌아갑니다. 안 먹는 브라우저에서는 아래 fallback 으로 떨어집니다.
   */
  P.apply = function (fn) {
    var ta = this.ta
    if (!ta) return

    /*
      본문에 아직 포커스가 있으면 지금 선택을 그대로 읽습니다. 툴바 버튼이
      mousedown 을 막고 있어서 대개 이쪽입니다. 어쩌다 포커스가 빠졌으면
      (터치 등) 마지막으로 기억해 둔 자리로 되돌립니다.
    */
    if (document.activeElement === ta) {
      this.sel = [ta.selectionStart, ta.selectionEnd]
    }
    ta.focus()
    ta.setSelectionRange(this.sel[0], this.sel[1])

    var val = ta.value
    var r = fn(val, ta.selectionStart, ta.selectionEnd)

    var expected = val.slice(0, r.start) + r.text + val.slice(r.end)

    ta.setSelectionRange(r.start, r.end)
    var ok = false
    try {
      ok = document.execCommand('insertText', false, r.text)
    } catch (err) {
      ok = false
    }

    /*
      ⚠ execCommand 를 믿고 넘어가면 안 됩니다.

      크롬·사파리에는 「똑똑한 교체(smart replace)」가 있어서, 단어 하나를
      통째로 고른 채 무언가를 넣으면 **옆에 붙은 공백을 저 혼자 지웁니다.**
      「AAAA」를 골라 색을 입히면 `</span>` 뒤의 띄어쓰기가 사라졌습니다.

      그래서 결과를 대조하고, 어긋나면 직접 갈아끼웁니다. 되돌리기(⌘Z)는
      그 경우에만 끊깁니다 — 글자가 틀리는 것보다는 낫습니다.
    */
    if (!ok || ta.value !== expected) {
      ta.value = expected
    }

    ta.setSelectionRange(r.selStart, r.selEnd)
    this.sel = [r.selStart, r.selEnd]
    this.lastValue = ta.value
    this.grow()
    this.props.onChange(ta.value)
  }

  P.run = function (key) {
    if (key === 'color') {
      this.setState({ palette: !this.state.palette })
      return
    }
    if (key === 'image') {
      this.openMedia()
      return
    }
    if (key.indexOf('color:') === 0) this.setState({ palette: false })
    var fn = ACTIONS[key]
    if (fn) this.apply(fn)
  }

  P.openMedia = function () {
    var p = this.props

    /*
      사진은 public/images/<주소>/ 로 올라갑니다 (config.yml 의 media_folder).
      주소가 비어 있으면 갈 곳이 없어서 public/images/ 바닥에 떨어집니다 —
      나중에 어느 글 사진인지 알 수가 없으니 여기서 막습니다.
    */
    var slug = p.entry && p.entry.getIn ? p.entry.getIn(['data', 'slug']) : null
    if (!slug) {
      window.alert('「주소」를 먼저 적어 주세요.\n사진이 /images/<주소>/ 안에 올라갑니다.')
      return
    }

    this.rememberSelection()
    p.onOpenMediaLibrary({
      controlID: p.forID,
      forImage: true,
      privateUpload: false,
      allowMultiple: false,
      field: p.field,
    })
  }

  P.componentDidUpdate = function () {
    var p = this.props

    // 미디어 라이브러리에서 고른 사진이 돌아오면 커서 자리에 꽂습니다.
    var paths = p.mediaPaths
    var picked = paths && paths.get ? paths.get(p.forID) : paths && paths[p.forID]
    if (picked && picked !== this.lastMedia) {
      this.lastMedia = picked
      var url = Array.isArray(picked) ? picked[0] : picked
      if (typeof url === 'string') this.apply(imageAction(url))
      if (p.onRemoveInsertedMedia) p.onRemoveInsertedMedia(p.forID)
      this.lastMedia = null
    }

    /*
      바깥에서 값이 바뀐 경우(글을 새로 열거나 되돌렸을 때)만 상자를 맞춥니다.
      입력 중에는 절대 건드리지 않습니다 — 한글 조합 중에 value 를 덮어쓰면
      글자가 깨집니다. 이게 리치 텍스트에서 나던 그 증상입니다.
    */
    var ta = this.ta
    if (!ta) return
    var next = p.value || ''
    if (document.activeElement !== ta && next !== this.lastValue && next !== ta.value) {
      ta.value = next
      this.lastValue = next
      this.grow()
    }
  }

  P.render = function () {
    var self = this
    var p = this.props

    var bar = BUTTONS.map(function (b) {
      return h(
        'button',
        {
          key: b.k,
          type: 'button',
          title: b.title,
          className:
            'lim-md-btn' +
            (b.mod ? ' is-' + b.mod : '') +
            (b.k === 'color' && self.state.palette ? ' is-open' : ''),
          // 눌러도 본문에서 포커스가 안 빠져나가게 — 안 막으면 선택이 풀립니다
          onMouseDown: function (e) {
            e.preventDefault()
          },
          onClick: function () {
            self.run(b.k)
          },
        },
        b.label
      )
    })

    var palette = this.state.palette
      ? h(
          'div',
          { className: 'lim-md-palette' },
          COLORS.map(function (c) {
            return h(
              'button',
              {
                key: c.k,
                type: 'button',
                title: c.label,
                className: 'lim-md-swatch',
                style: { backgroundColor: c.swatch },
                onMouseDown: function (e) {
                  e.preventDefault()
                },
                onClick: function () {
                  self.run('color:' + c.k)
                },
              },
              c.label
            )
          })
        )
      : null

    return h(
      'div',
      { className: (p.classNameWrapper || '') + ' lim-md' },
      h('div', { className: 'lim-md-bar' }, bar),
      palette,
      h('textarea', {
        id: p.forID,
        className: 'lim-md-ta',
        defaultValue: p.value || '',
        onChange: this.onInput,
        onSelect: this.rememberSelection,
        onKeyUp: this.rememberSelection,
        onClick: this.rememberSelection,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        ref: this.setRef,
        spellCheck: false,
        autoCorrect: 'off',
        autoCapitalize: 'off',
      })
    )
  }

  CMS.registerWidget('markdown', LimMarkdownControl, markdownWidget.preview)
})()
