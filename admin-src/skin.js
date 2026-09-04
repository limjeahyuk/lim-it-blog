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
   글 편집 — 쓰는 것은 한 열로, 「발행 설정」은 저장할 때 묻습니다

   ⚠ 나누는 기준은 필드 이름입니다. Decap 이 입력칸마다 `<이름>-field-N`
     으로 id 를 주기 때문에 emotion 해시나 순서에 기대지 않습니다.
     config.yml 에 필드를 더하면 **여기 목록에도 넣으세요** — 빠진 것은
     「발행 설정」 모달로 갑니다.
   ------------------------------------------------------------------- */

/*
  시안 차례. 위에서부터 이대로 세웁니다.
  ⚠ config.yml 에 필드를 더하면 **여기에도 넣으세요.** 안 적힌 것은
    「발행 설정」 모달로 갑니다 — 빠뜨려도 사라지지는 않지만, 글을 쓰는
    동안에는 화면에서 안 보이게 됩니다.
*/
const WRITE_FIELDS = [
  'author',
  'title',
  'slug',
  'description',
  'heroImage',
  'body',
]

/*
  이 칸이 어느 필드인가.

  ⚠ 라벨의 `for` 를 먼저 봅니다. 입력칸의 id 로 찾으면 **사진 위젯을 놓칩니다**
    — 그건 input 을 안 그려서 `<이름>-field-N` id 가 어디에도 없고, 그래서
    커버 사진 칸이 「발행 설정」으로 떨어졌습니다. 라벨은 위젯 종류를 안 가리고
    언제나 `for="<이름>-field-N"` 을 답니다.
*/
function fieldName(box) {
  const label = box.querySelector('label[for*="-field-"]')
  const from = label
    ? label.getAttribute('for')
    : (box.querySelector('[id*="-field-"]') || {}).id
  if (!from) return null
  return from.replace(/-field-\d+$/, '')
}

function layoutForm() {
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
  if (!pane || pane.getAttribute('data-lim') === 'laid') return

  const boxes = []
  for (const c of pane.children) {
    if (c.className && String(c.className).indexOf('ControlContainer') >= 0)
      boxes.push(c)
  }
  /* 필드가 하나도 안 잡히면 손대지 않습니다 (Decap 이 바뀐 경우) */
  if (!boxes.length) return

  const form = el('div', 'lim-form')
  const main = el('div', 'lim-main')
  const meta = el('section', 'lim-meta')
  const grid = el('div', 'lim-meta-grid')
  meta.appendChild(grid)
  form.appendChild(main)
  pane.appendChild(form)
  pane.appendChild(buildSaveModal(meta))

  const byName = new Map()
  for (const box of boxes) {
    const name = fieldName(box)
    if (name) box.setAttribute('data-field', name)
    byName.set(name, box)
  }

  for (const name of WRITE_FIELDS) {
    const box = byName.get(name)
    if (box) {
      main.appendChild(box)
      byName.delete(name)
    }
  }
  /* 남은 것 — 작성일·프로젝트·토글 둘. 전부 「발행 설정」 모달로 갑니다 */
  for (const box of byName.values()) grid.appendChild(box)

  pane.setAttribute('data-lim', 'laid')
}

/* -------------------------------------------------------------------
   「발행 설정」 모달 — 저장을 누르면 묻습니다

   왜 모달이냐: 작성일·프로젝트·초안·비밀글은 **글을 쓰는 동안에는 볼 일이
   없고, 저장하기 직전에만 정하는 것들**입니다. 본문 아래에 늘 펼쳐 두면
   폰에서 스크롤만 길어지고, 정작 저장할 때는 위 띠만 보고 눌러서 초안
   토글을 그냥 지나칩니다.

   Decap 의 「저장」은 사실 **드롭다운**입니다 (`PublishButton`). 눌러야
   메뉴가 열리고 거기서 "지금 게시" 를 한 번 더 눌러야 합니다. 그 첫 번째
   누름을 가로채 모달을 열고, 모달의 「저장」이 원래 순서(단추 → 첫 메뉴
   항목)를 대신 밟습니다.

   ⚠ **`PublishButton` 일 때만 가로챕니다.** 고칠 것이 없는 글에서는 같은
     자리가 `PublishedToolbarButton`(메뉴에 「복제」뿐)이라, 그때까지
     가로채면 복제를 못 하게 됩니다. 두 이름은 서로 부분문자열이 아닙니다.
   ⚠ **`document` 의 캡처 단계에서 잡습니다.** React 는 루트 컨테이너에
     듣기 때문에 그보다 먼저 걸립니다 — 여기서 stopPropagation 을 해야
     드롭다운이 안 열립니다.
   ⚠ **모달은 `pane` 안에 둡니다** (자리는 `position: fixed`). 밖으로 옮기면
     글 화면이 언마운트될 때 React 가 `pane` 만 걷어가고 모달은 남습니다 —
     안에 든 것이 React 가 그린 필드 칸이라 유령이 됩니다.

   ⚠ **드롭다운의 나머지 둘(「게시하고 새로 만들기」·「게시하고 복제」)은
     이제 못 누릅니다.** 혼자 쓰는 저장소에서 쓸 일이 없다고 보고 버렸습니다.
     되살리려면 모달 아래에 줄로 다세요 — 가로채기를 푸는 쪽은 안 됩니다.
   ------------------------------------------------------------------- */

const SAVE_BUTTON = "[class*='ToolbarSectionMain'] [class*='PublishButton']"

/** 모달을 거치지 않고 통과시키는 동안만 켭니다 (모달의 「저장」이 켭니다). */
let passingThrough = false

function buildSaveModal(meta) {
  const back = el('div', 'lim-modal-back')
  back.addEventListener('click', closeSaveModal)

  const card = el('div', 'lim-modal-card')
  card.setAttribute('role', 'dialog')
  card.setAttribute('aria-modal', 'true')
  card.setAttribute('aria-label', '발행 설정')
  card.setAttribute('tabindex', '-1')
  card.appendChild(el('h3', 'lim-modal-title', '발행 설정'))
  card.appendChild(meta)

  const foot = el('div', 'lim-modal-foot')
  const cancel = el('button', 'lim-modal-cancel', '취소')
  cancel.type = 'button'
  cancel.addEventListener('click', closeSaveModal)
  const save = el('button', 'lim-modal-save', '저장')
  save.type = 'button'
  save.addEventListener('click', confirmSave)
  foot.appendChild(cancel)
  foot.appendChild(save)
  card.appendChild(foot)

  const modal = el('div', 'lim-modal')
  modal.appendChild(back)
  modal.appendChild(card)
  return modal
}

function openSaveModal() {
  const modal = document.querySelector('.lim-modal')
  if (!modal) return false
  modal.classList.add('is-open')
  const card = modal.querySelector('.lim-modal-card')
  if (card) card.focus()
  return true
}

function closeSaveModal() {
  const modal = document.querySelector('.lim-modal')
  if (modal) modal.classList.remove('is-open')
  /* 눌렀던 자리로 초점을 돌려줍니다 — 키보드로 다니는 사람이 길을 잃습니다 */
  const btn = document.querySelector(SAVE_BUTTON)
  if (btn && btn.focus) btn.focus()
}

/*
  모달의 「저장」. 원래 순서를 대신 밟습니다 — 단추를 눌러 드롭다운을 열고,
  첫 항목(「지금 게시」)을 누릅니다.

  ⚠ 메뉴는 React 가 그리고 나서야 생깁니다. 한 번 보고 없으면 잠깐씩 더
    봅니다 — 그래도 없으면 **메뉴를 열어 둔 채 손을 뗍니다.** 저장이 안 된
    것을 됐다고 알리는 것보다, 사용자가 한 번 더 누르는 편이 낫습니다.
*/
function confirmSave() {
  const btn = document.querySelector(SAVE_BUTTON)
  if (!btn) return
  closeSaveModal()

  passingThrough = true
  btn.click()
  passingThrough = false

  let tries = 0
  const pick = () => {
    const item = document.querySelector("[class*='DropdownList'] [role='menuitem']")
    if (item) {
      item.click()
      return
    }
    if (++tries < 12) {
      setTimeout(pick, 30)
      return
    }
    if (window.console) {
      console.warn('[lim admin skin] 저장 메뉴를 못 찾았습니다 — 직접 골라 주세요')
    }
  }
  setTimeout(pick, 0)
}

function onSaveIntent(e) {
  if (passingThrough) return
  const target = e.target && e.target.closest ? e.target.closest(SAVE_BUTTON) : null
  if (!target) return
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
  if (!document.querySelector('.lim-modal')) return /* 못 세웠으면 Decap 것 그대로 */
  e.preventDefault()
  e.stopPropagation()
  openSaveModal()
}

function onEscape(e) {
  if (e.key !== 'Escape') return
  const modal = document.querySelector('.lim-modal.is-open')
  if (modal) closeSaveModal()
}

/*
  본문 아래 한 줄 — 글자 수와 저장 여부.

  긴 글을 쓰다 보면 위 띠가 화면 밖으로 나가서 저장이 됐는지 안 됐는지
  안 보입니다. Decap 이 위에 적어 두는 그 글자를 그대로 읽어서 아래에도
  놓습니다 — 두 곳이 어긋날 일이 없습니다.

  ⚠ 편집기 알맹이(tiptap·textarea)를 이름으로 찾지 않습니다. 본문 칸 안의
    `contenteditable` 이나 `textarea` 아무거나 잡습니다 — 편집기를 갈아끼워도
    (지금까지 두 번 갈았습니다) 이 줄은 그대로 굴러갑니다.

  ⚠ 다만 **보이는 쪽**을 잡아야 합니다. 원문 모드에서는 tiptap 이 화면에서
    빠지고 textarea 만 남는데, 문서 차례로는 tiptap 이 먼저라 그냥 첫 번째를
    잡으면 **안 보이는 쪽의 글자 수**가 나옵니다. 옛 글은 원문으로 열리므로
    (128편 중 119편) 거의 늘 틀린 수가 됩니다.
*/
function editorFoot() {
  const box = document.querySelector('[data-field="body"]')
  if (!box) return

  let foot = box.querySelector('.lim-foot')
  if (!foot) {
    foot = el('div', 'lim-foot')
    foot.appendChild(el('span', 'lim-chars'))
    foot.appendChild(el('span', 'lim-saved'))
    /* 힌트 **위**, 편집기 바로 밑입니다 — 세는 것이 무엇인지 붙어 있어야
       읽힙니다. 힌트가 없으면 맨 뒤로 갑니다. */
    box.insertBefore(foot, box.querySelector("[class*='ControlHint']") || null)
  }

  /* textarea 는 글자를 쳐도 DOM 이 안 바뀌어서 위의 MutationObserver 가
     안 깨어납니다 — 원문 모드에서 글자 수가 멈춰 있던 이유입니다.
     본문 칸에 한 번만 걸어 둡니다. */
  if (!box.dataset.limFoot) {
    box.dataset.limFoot = '1'
    box.addEventListener('input', () => {
      try {
        editorFoot()
      } catch (e) {
        /* 세는 줄 하나 때문에 글쓰기를 막지 않습니다 */
      }
    })
  }

  const areas = box.querySelectorAll('[contenteditable="true"], textarea')
  let area = null
  for (let i = 0; i < areas.length; i++) {
    /* display:none 이면 offsetParent 가 없습니다 */
    if (areas[i].offsetParent) {
      area = areas[i]
      break
    }
  }
  if (!area) area = areas[0] || null

  let text = ''
  if (area) text = area.value != null ? area.value : area.innerText || ''
  const chars = text.trim().length + '자'
  const charBox = foot.firstChild
  if (charBox.textContent !== chars) charBox.textContent = chars

  /* 위 띠의 "변경사항 저장됨 / 저장되지 않음" 을 그대로 씁니다 */
  const status = document.querySelector("[class*='BackStatus']")
  const dirty =
    !!status && String(status.className).indexOf('BackStatusChanged') >= 0
  const word = !status ? '' : dirty ? '저장 안 됨' : '저장됨'
  const saved = foot.lastChild
  if (saved.textContent !== word) saved.textContent = word
  saved.className = 'lim-saved' + (dirty ? ' is-dirty' : '')
}

/*
  빈 칸 안내글.

  Decap 은 placeholder 를 안 붙입니다 — 라벨만 있고 칸은 텅 비어 있어서,
  시안처럼 "무엇을 적는 칸인지" 가 칸 안에서 안 읽힙니다.

  ⚠ 값이 아니라 속성이라 리덕스와 부딪히지 않습니다. React 가 다시 그려도
    없어지지 않게 손질할 때마다 확인합니다.
*/
const PLACEHOLDER = {
  title: '제목을 입력하세요',
  description: '목록에서 제목 아래 보이는 한 문장',
}

function placeholders() {
  for (const name in PLACEHOLDER) {
    const node = document.querySelector('[id^="' + name + '-field-"]')
    if (!node) continue
    if (node.tagName !== 'INPUT' && node.tagName !== 'TEXTAREA') continue
    if (node.placeholder === PLACEHOLDER[name]) continue
    node.placeholder = PLACEHOLDER[name]
  }
}

/*
  위 띠의 이름. Decap 은 새 글도 옛 글도 "글 컬랙션에 작성하는 중" 하나로
  적습니다 — 시안처럼 갈라 놓습니다. 글자는 index.html 의 ::before 가
  넣고, 여기서는 어느 쪽인지만 알려 줍니다.
*/
function routeFlag() {
  const isNew = /#\/collections\/[^/]+\/new/.test(window.location.hash)
  const now = isNew ? 'new' : 'edit'
  if (document.documentElement.getAttribute('data-lim-route') !== now) {
    document.documentElement.setAttribute('data-lim-route', now)
  }
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
    routeFlag()
    decorateHeader()
    decorateList()
    layoutForm()
    statusPill()
    editorFoot()
    placeholders()
  } catch (e) {
    /* 화면 하나가 안 고쳐지는 것보다 CMS 가 죽는 게 나쁩니다 */
    if (window.console) console.warn('[lim admin skin]', e)
  }
}

/* -------------------------------------------------------------------
   고르는 칸 둘 — 저자(알약) · 프로젝트(라디오)

   Decap 의 select 는 눌러야 펴지는 목록(react-select)입니다. 저자가 둘,
   프로젝트가 셋뿐이라 "눌러서 펴고 → 고르고 → 접힘" 이 매번 세 동작이
   됩니다. 늘어놓고 한 번에 고르게 바꿉니다.

   | 이름 | 모양 | 비우는 법 |
   |---|---|---|
   | `author` | 알약 | 고른 것을 다시 누릅니다 |
   | `project` | 라디오 | 「없음」을 고릅니다 |

   ⚠ **둘 다 `required: false` 라 "안 고름" 도 값입니다.** 되돌릴 길이 없으면
     한 번 고른 뒤로는 영영 못 비웁니다. 알약은 다시 누르기로, 라디오는
     「없음」 칸으로 그 길을 냅니다 — 라디오는 눌러서 끄는 것이 없습니다.

   ⚠ 등록 이름은 **select 그대로**입니다. config.yml 에 없는 위젯 이름을 적으면
     이 파일이 안 떴을 때 폼이 통째로 깨집니다 (주소 칸과 같은 이유 — §6-2).
     아는 이름이 아니면 Decap 것을 그대로 돌려줍니다.

   ⚠ 감싼 div 에 `id={forID}` 를 그대로 답니다. layoutForm() 이 필드 이름을
     `<이름>-field-N` 에서 뽑기 때문에, 이걸 빼면 그 칸이 갈 곳을 잃습니다.
   ------------------------------------------------------------------- */

/** `study Lim — 배운 것` 에서 이름만. 알약은 좁아서 뒷말이 들어갈 자리가 없습니다. */
function pillLabel(text) {
  return String(text).split(' — ')[0]
}

function fieldOptions(field) {
  const raw = field && field.get ? field.get('options') : null
  if (!raw) return []
  const list = raw.toJS ? raw.toJS() : raw
  return list.map((o) =>
    o && typeof o === 'object' ? o : { label: String(o), value: o },
  )
}

/*
  프로젝트 라디오.

  ⚠ 「없음」이 맨 뒤에 하나 더 붙습니다 — config.yml 의 options 에는 없는,
    여기서만 만드는 칸입니다. 값은 빈 문자열이고 스키마가 그걸 "값 없음"
    으로 봅니다 (content.config.ts 의 blankAsUndefined, §3). options 에
    넣지 않는 이유는 **`project: ''` 가 파일에 남는 것과 키가 아예 없는 것을
    구분하지 않기 때문**입니다 — 굳이 고를 수 있는 값처럼 보일 필요가 없습니다.

  ⚠ `name` 은 `forID` 를 씁니다. 라디오는 name 이 같은 것끼리 한 묶음이라,
    고정 문자열을 주면 폼에 프로젝트 칸이 둘 이상 뜰 때 서로를 끕니다.
*/
function renderRadios(h, p, options) {
  const rows = options.concat([{ label: '없음', value: '' }])
  return h(
    'div',
    { className: 'lim-radios', id: p.forID },
    rows.map((o) =>
      h(
        'label',
        {
          key: o.value || '__none',
          className: 'lim-radio' + (p.value === o.value ? ' is-on' : ''),
        },
        h('input', {
          type: 'radio',
          name: p.forID,
          value: o.value,
          /* 빈 값일 때 undefined·null 도 「없음」으로 봅니다 — 손으로 쓴 글에는
             project 키가 아예 없습니다 */
          checked: (p.value || '') === o.value,
          onChange: () => p.onChange(o.value),
        }),
        h('span', null, o.label),
      ),
    ),
  )
}

function registerAuthorPills(CMS, h) {
  const selectWidget = CMS.getWidget('select')
  if (!selectWidget || !selectWidget.control) return

  /* React.Component. Decap 이 React 를 밖으로 안 내보내서 이미 등록된 위젯
     컨트롤의 부모 클래스에서 꺼냅니다 (editor.js 와 같은 방법). */
  const Base = Object.getPrototypeOf(selectWidget.control)
  if (!Base || !Base.prototype || !Base.prototype.setState) return

  const Original = selectWidget.control

  function LimSelectControl(props) {
    Base.call(this, props)
  }

  LimSelectControl.prototype = Object.create(Base.prototype)
  LimSelectControl.prototype.constructor = LimSelectControl

  LimSelectControl.prototype.render = function () {
    const p = this.props
    const name = p.field && p.field.get ? p.field.get('name') : null
    if (name !== 'author' && name !== 'project') return h(Original, p)

    const options = fieldOptions(p.field)
    if (!options.length) return h(Original, p)

    if (name === 'project') return renderRadios(h, p, options)

    return h(
      'div',
      { className: 'lim-pills', id: p.forID },
      options.map((o) =>
        h(
          'button',
          {
            key: o.value,
            type: 'button',
            className: 'lim-pill' + (p.value === o.value ? ' is-on' : ''),
            title: o.label,
            /* 고른 것을 다시 누르면 비웁니다 — 저자는 required: false 라
               "안 고름" 도 값입니다. 목록 없이는 되돌릴 방법이 없습니다. */
            onClick: () => p.onChange(p.value === o.value ? '' : o.value),
          },
          pillLabel(o.label),
        ),
      ),
    )
  }

  CMS.registerWidget('select', LimSelectControl, selectWidget.preview)
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

  /* 「저장」을 가로채 발행 설정을 먼저 묻습니다 — 캡처 단계여야 React 보다
     먼저 걸립니다. 모달이 없으면 아무것도 안 하고 지나갑니다. */
  document.addEventListener('click', onSaveIntent, true)
  document.addEventListener('keydown', onSaveIntent, true)
  document.addEventListener('keydown', onEscape, true)

  pass()
}

if (typeof window !== 'undefined' && window.CMS && window.h) {
  try {
    registerAuthorPills(window.CMS, window.h)
  } catch (e) {
    /* 못 갈아끼우면 Decap 의 목록이 그대로 나옵니다 — 고를 수는 있습니다 */
    if (window.console) console.warn('[lim admin skin] author pills', e)
  }
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
