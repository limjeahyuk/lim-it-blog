/*
  /admin 껍데기 — Decap 화면을 시안 모양으로 고쳐 앉히는 곳.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 `public/admin/editor.js` 로
    묶인 것입니다. 고쳤으면 `npm run admin` 을 돌리세요.

  왜 CSS 만으로 안 되냐:

  - Decap 은 목록 한 줄을 `<h2>제목 · 저자 · 날짜 · 초안</h2>` **글자 한 덩어리**
    로 그립니다. 시안의 네 칸(제목·작성자·날짜·상태)으로 가르려면 그 글자를
    쪼개서 span 으로 다시 놓아야 합니다.
  - 편집 화면은 필드 아홉 개가 **한 줄로 쭉** 놓입니다. 시안처럼 왼쪽(제목·주소·
    본문) / 오른쪽 카드(나머지)로 가르려면 감싸는 상자가 있어야 하는데,
    grid 로는 본문이 세로로 길어서 오른쪽 칸이 같이 늘어납니다.
  - 머리글의 "lim's World | Admin" 과 테마 단추는 Decap 에 아예 없습니다.

  ⚠ React 가 그린 DOM 을 옮깁니다. 지켜야 할 것 두 가지:

    1. **옮기는 건 한 번뿐입니다.** 데이터 플래그(dataset)로 막습니다. 안 그러면
       글자를 칠 때마다(리덕스가 매번 다시 그립니다) 다시 옮기게 됩니다.
    2. **React 가 들고 있는 노드를 지우지 않습니다.** 목록의 제목 글자도
       지우지 않고 CSS 로 감추기만 합니다 — 지우면 정렬을 바꿨을 때 React 가
       화면에 없는 노드에 새 제목을 써서 줄이 안 바뀝니다.

  전부 try/catch 안에서 돕니다. 여기가 죽어도 Decap 은 제 모양으로 굴러갑니다.
*/

/* 목록 요약(config.yml 의 summary)을 이 글자로 이어 붙여 놨습니다.
   ⚠ 여기를 고치면 config.yml 의 summary 도 같이 고쳐야 합니다.
   제목 128개에 이 글자가 들어간 것은 없습니다 (세어 봤습니다). */
const SEP = ' · '

const AUTHORS = { student: 'study Lim', developer: '임데브' }

const THEME_KEY = 'theme' /* ⚠ 블로그와 같은 열쇠입니다 (BaseHead.astro).
                             같은 주소라 localStorage 를 나눠 씁니다 —
                             블로그에서 고른 테마가 여기에도 옵니다. */

/* -------------------------------------------------------------------
   테마

   블로그처럼 <html data-theme> 로 정하고 localStorage 에 남깁니다.
   고른 적이 없으면 OS 를 따릅니다 (블로그와 같은 규칙 — 밝게 쓰고 있지
   않으면 어둡게).
   ------------------------------------------------------------------- */

function savedTheme() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch (e) {
    return null
  }
}

export function currentTheme() {
  if (typeof document === 'undefined') return 'dark'
  const now = document.documentElement.getAttribute('data-theme')
  if (now) return now
  const saved = savedTheme()
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

/* 블로그 사이드바에 쓰는 해·달과 같은 그림입니다 (src/assets/icons-extra).
   여기서는 아이콘을 빌드로 못 끌어와서 path 만 옮겨 적었습니다 —
   ⚠ 원본을 바꾸면 여기도 같이 고치세요. 색은 currentColor 로 바꿔서
   단추의 글자색을 따라갑니다. */
const ICON = {
  moon: 'M11.0553 4.05519C7.08225 4.52259 4 7.90134 4 12C4 16.4183 7.58172 20 12 20C16.0987 20 19.4774 16.9177 19.9448 12.9447C19.6347 12.9812 19.3194 13 19 13C14.5817 13 11 9.41828 11 5C11 4.6806 11.0188 4.3653 11.0553 4.05519ZM2 12C2 6.47715 6.47715 2 12 2C12.107 2 12.2137 2.00169 12.32 2.00503C12.6299 2.01479 12.9178 2.16776 13.0993 2.41915C13.2808 2.67053 13.3354 2.99189 13.2472 3.28913C13.0866 3.83011 13 4.40407 13 5C13 8.31371 15.6863 11 19 11C19.5959 11 20.1699 10.9134 20.7109 10.7528C21.0081 10.6646 21.3295 10.7192 21.5809 10.9007C21.8322 11.0822 21.9852 11.3701 21.995 11.68C21.9983 11.7863 22 11.893 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z',
  sun: 'M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12ZM12 1C12.5523 1 13 1.44772 13 2V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V2C11 1.44772 11.4477 1 12 1ZM12 19C12.5523 19 13 19.4477 13 20V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V20C11 19.4477 11.4477 19 12 19ZM4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711C6.31658 7.09763 5.68342 7.09763 5.29289 6.70711L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289ZM17.2929 17.2929C17.6834 16.9024 18.3166 16.9024 18.7071 17.2929L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L17.2929 18.7071C16.9024 18.3166 16.9024 17.6834 17.2929 17.2929ZM1 12C1 11.4477 1.44772 11 2 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H2C1.44772 13 1 12.5523 1 12ZM19 12C19 11.4477 19.4477 11 20 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H20C19.4477 13 19 12.5523 19 12ZM6.70711 17.2929C7.09763 17.6834 7.09763 18.3166 6.70711 18.7071L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L5.29289 17.2929C5.68342 16.9024 6.31658 16.9024 6.70711 17.2929ZM19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L18.7071 6.70711C18.3166 7.09763 17.6834 7.09763 17.2929 6.70711C16.9024 6.31658 16.9024 5.68342 17.2929 5.29289L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289Z',
}

function paintThemeButton(theme) {
  const btn = document.querySelector('.lim-theme')
  if (!btn) return
  const d = theme === 'dark' ? ICON.moon : ICON.sun
  btn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="' +
    d +
    '"></path></svg>'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  paintThemeButton(theme)
  /*
    편집기는 손댈 것이 없습니다 — 색을 전부 `--a-*` 토큰과
    `html[data-theme]` 로 받기 때문에 루트 속성만 바꾸면 따라옵니다.
    (Toast 를 쓰던 동안에는 여기서 클래스를 켰다 꺼야 했습니다.)
  */
}

function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch (e) {
    /* 사파리 비공개 모드 — 이번 화면에서만 바뀝니다 */
  }
  applyTheme(next)
}

/* ------------------------------------------------------------------- */

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

/** 지금 열려 있는 컬렉션 이름. 주소(#/collections/posts/...)에서 뽑습니다. */
let collectionName = null
function findCollection() {
  if (collectionName) return collectionName
  const a = document.querySelector("a[href*='#/collections/']")
  if (!a) return null
  const m = /#\/collections\/([^/]+)/.exec(a.getAttribute('href') || '')
  if (m) collectionName = m[1]
  return collectionName
}

/* -------------------------------------------------------------------
   머리글 — 이름 · 테마 단추 · 새 글
   ------------------------------------------------------------------- */

function decorateHeader() {
  const content = document.querySelector("[class*='AppHeaderContent']")
  if (!content || content.querySelector('.lim-brand')) return

  const brand = el('div', 'lim-brand')
  brand.appendChild(el('b', null, "lim's World"))
  brand.appendChild(el('i'))
  brand.appendChild(el('span', null, 'Admin'))
  content.insertBefore(brand, content.firstChild)

  const actions = content.querySelector("[class*='AppHeaderActions']")
  if (!actions) return

  const themeBtn = el('button', 'lim-theme')
  themeBtn.type = 'button'
  themeBtn.setAttribute('aria-label', '테마 전환')
  themeBtn.addEventListener('click', toggleTheme)
  actions.insertBefore(themeBtn, actions.firstChild)
  paintThemeButton(currentTheme())
}

/*
  "새 글" 은 Decap 의 "빠른 추가" 단추입니다. 원래는 눌러서 메뉴가 열리고
  거기서 컬렉션을 한 번 더 골라야 하는데, 컬렉션이 하나뿐이라 두 번 누르는
  것이 됩니다. 곧장 새 글로 보냅니다.

  ⚠ 컬렉션 이름을 못 찾으면 아무것도 안 합니다 — Decap 의 메뉴가 그대로
    열립니다. 주소 규칙이 바뀌어도 글을 못 쓰게 되지는 않습니다.
*/
function quickNew(e) {
  const btn = e.target.closest && e.target.closest("[class*='QuickNewButton']")
  if (!btn) return
  const name = findCollection()
  if (!name) return
  e.preventDefault()
  e.stopPropagation()
  window.location.hash = '#/collections/' + name + '/new'
}

/* -------------------------------------------------------------------
   글 목록 — 한 줄을 네 칸으로

   Decap 이 그리는 제목 글자는 config.yml 의 summary 입니다:
     제목 · 저자 · 날짜 · 초안여부
   ------------------------------------------------------------------- */

const COLS = ['제목', '작성자', '날짜', '상태']

function decorateList() {
  const grid = document.querySelector("[class*='CardsGrid']")
  if (!grid) return

  /* 칸 이름 줄. ul 바깥에 형제로 붙입니다 — React 는 자기가 만든 노드만
     지우므로 여기 끼워 넣은 것은 건드리지 않습니다. */
  const parent = grid.parentNode
  if (parent && !parent.querySelector('.lim-thead')) {
    const head = el('div', 'lim-thead')
    for (const c of COLS) head.appendChild(el('span', null, c))
    parent.insertBefore(head, grid)
  }

  let count = 0
  for (const li of grid.children) {
    count += 1
    const h2 = li.querySelector('h2')
    if (!h2) continue

    /* summary 는 h2 의 글자 노드입니다 (그 뒤에 아이콘 div 가 붙습니다) */
    let raw = ''
    for (const n of h2.childNodes) if (n.nodeType === 3) raw += n.nodeValue
    if (!raw) continue
    if (li.getAttribute('data-lim') === raw) continue
    li.setAttribute('data-lim', raw)
    li.classList.add('lim-row')

    const parts = raw.split(SEP)
    const cells = [
      parts[0] || '',
      AUTHORS[(parts[1] || '').trim()] || (parts[1] || '').trim(),
      (parts[2] || '').trim(),
      (parts[3] || '').trim() === 'true' ? '초안' : '게시됨',
    ]

    let box = h2.querySelector('.lim-cells')
    if (!box) {
      box = el('div', 'lim-cells')
      for (let i = 0; i < 4; i += 1) box.appendChild(el('span'))
      h2.appendChild(box)
    }
    const spans = box.children
    for (let i = 0; i < 4; i += 1) spans[i].textContent = cells[i]
    spans[3].className = cells[3] === '초안' ? 'lim-draft' : 'lim-live'
  }

  /* "128개" — 정렬 단추 옆. 목록이 걸러지면 같이 줄어듭니다. */
  const controls = document.querySelector("[class*='CollectionControlsContainer']")
  if (controls) {
    let n = controls.querySelector('.lim-count')
    if (!n) {
      n = el('span', 'lim-count')
      controls.appendChild(n) /* 정렬 단추 뒤 */
    }
    const text = count + '개'
    if (n.textContent !== text) n.textContent = text
  }

  /* 사이드바 컬렉션 줄에도 같은 숫자를 답니다 */
  const link = document.querySelector("[class*='SidebarNavLink']")
  if (link) {
    let b = link.querySelector('.lim-n')
    if (!b) {
      b = el('span', 'lim-n')
      link.appendChild(b)
    }
    const text = String(count)
    if (b.textContent !== text) b.textContent = text
  }
}

/* -------------------------------------------------------------------
   글 편집 — 왼쪽(쓰는 것) / 오른쪽 카드(분류)

   ⚠ 나누는 기준은 필드 이름입니다. Decap 이 입력칸마다 `<이름>-field-N`
     으로 id 를 주기 때문에 emotion 해시나 순서에 기대지 않습니다.
     config.yml 에 필드를 더하면 **여기 목록에도 넣으세요** — 빠진 것은
     왼쪽(본문 쪽)에 남습니다.
   ------------------------------------------------------------------- */

const MAIN_FIELDS = ['title', 'slug', 'body']

function fieldName(box) {
  const node = box.querySelector('[id*="-field-"]')
  if (!node) return null
  return node.id.replace(/-field-\d+$/, '')
}

function splitForm() {
  /*
    ⚠ ControlPaneContainer 라는 이름이 두 겹입니다 — 바깥
      (PreviewPaneContainer-ControlPaneContainer)과 필드를 담은 안쪽.
      바깥을 잡으면 자식이 하나뿐이라 아무것도 못 가릅니다.
      **필드가 들어 있는 쪽**을 찾습니다.
  */
  let pane = null
  for (const p of document.querySelectorAll("[class*='ControlPaneContainer']")) {
    for (const c of p.children) {
      if (c.className && String(c.className).indexOf('ControlContainer') >= 0) {
        pane = p
        break
      }
    }
    if (pane) break
  }
  if (!pane || pane.getAttribute('data-lim') === 'split') return

  const boxes = []
  for (const c of pane.children) {
    if (c.className && String(c.className).indexOf('ControlContainer') >= 0)
      boxes.push(c)
  }
  /* 필드가 하나도 안 잡히면 손대지 않습니다 (Decap 이 바뀐 경우) */
  if (!boxes.length) return

  const form = el('div', 'lim-form')
  const main = el('div', 'lim-main')
  const side = el('div', 'lim-side')
  form.appendChild(main)
  form.appendChild(side)
  pane.appendChild(form)

  for (const box of boxes) {
    const name = fieldName(box)
    if (name) box.setAttribute('data-field', name)
    ;(name && MAIN_FIELDS.indexOf(name) < 0 ? side : main).appendChild(box)
  }

  pane.setAttribute('data-lim', 'split')
}

/*
  오른쪽 위 상태 알약.

  Decap 의 "게시" 단추는 눌러서 저장하는 자리라 지금 상태를 안 알려 줍니다.
  시안의 초록 "게시됨" 은 그 자리인데, 이 블로그에서 게시 여부를 정하는 건
  **초안 토글**입니다. 그래서 토글을 그대로 읽어서 보여줍니다 — 목록의
  "상태" 칸과 같은 값입니다.
*/
function statusPill() {
  const main = document.querySelector("[class*='ToolbarSectionMain']")
  if (!main) return
  const draft = document.querySelector('[id^="draft-field-"]')
  if (!draft) return

  let pill = main.querySelector('.lim-status')
  if (!pill) {
    pill = el('span', 'lim-status')
    main.insertBefore(pill, main.firstChild)
  }
  const isDraft = draft.getAttribute('aria-checked') === 'true'
  const text = isDraft ? '초안' : '게시됨'
  if (pill.textContent !== text) pill.textContent = text
  pill.classList.toggle('is-draft', isDraft)
}

/* -------------------------------------------------------------------
   지켜보기

   ⚠ **observer 를 모듈 변수에 담아 둬야 합니다.** 지역 변수에 두면
     브라우저가 수거해 갑니다 — DOM 표준이 "다른 곳에서 참조하지 않고
     밀린 기록도 없는 MutationObserver 는 지워도 된다"고 허용합니다.
     Decap 이 뜨는 동안 메모리를 많이 쓰는데, 그때 수거돼서 **처음 한 번만
     손질되고 그 뒤로는 아무 일도 안 일어났습니다** (한참 찾았습니다 —
     화면을 새로 그릴 때마다 옛 모습으로 돌아왔습니다).
   ------------------------------------------------------------------- */

let observer = null
let queued = false

function pass() {
  try {
    decorateHeader()
    decorateList()
    splitForm()
    statusPill()
  } catch (e) {
    /* 화면 하나가 안 고쳐지는 것보다 CMS 가 죽는 게 나쁩니다 */
    if (window.console) console.warn('[lim admin skin]', e)
  }
}

export function startSkin() {
  applyTheme(currentTheme())

  /* 고른 적이 없으면 OS 를 계속 따라갑니다 */
  if (!savedTheme() && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => {
      if (!savedTheme()) applyTheme(mq.matches ? 'light' : 'dark')
    }
    if (mq.addEventListener) mq.addEventListener('change', onChange)
  }

  document.addEventListener('click', quickNew, true)

  /*
    Decap 은 화면을 통째로 다시 그립니다(라우팅·저장·정렬). 언제 끝나는지
    알 방법이 없어서 DOM 을 지켜보다 한 번씩 손봅니다.

    ⚠ 글자를 칠 때마다 알림이 옵니다(본문 편집기도 이 안에 있습니다).
      requestAnimationFrame 으로 한 번만 모아서 돌리고, 각 손질은 이미
      해 놓은 것이면 바로 빠져나옵니다.
  */
  /*
    ⚠ requestAnimationFrame 으로 모으지 마세요. 화면이 안 보이는 동안
      (다른 앱으로 넘어갔거나 탭이 뒤에 있을 때) rAF 는 아예 안 돕니다 —
      "한 번 모으는 중" 표시만 켜진 채 멈춰서, 돌아왔을 때까지 화면이
      옛 모습으로 남습니다. 타이머는 숨어 있어도 돕니다.
  */
  observer = new MutationObserver(() => {
    if (queued) return
    queued = true
    setTimeout(() => {
      queued = false
      pass()
    }, 0)
  })
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-checked', 'class'],
    characterData: true,
  })

  /* 주소가 바뀌는 것(목록 ↔ 글 ↔ 검색결과)도 따로 챙깁니다 */
  window.addEventListener('hashchange', () => setTimeout(pass, 0))

  pass()
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  /* 테마는 기다리지 않고 바로 씌웁니다 — 한 번 밝게 그렸다 어두워지면
     눈에 띕니다. (index.html 의 <head> 스크립트가 먼저 하지만, 그게
     없어도 되게 여기서도 합니다.) */
  applyTheme(currentTheme())

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSkin)
  } else {
    startSkin()
  }
}
