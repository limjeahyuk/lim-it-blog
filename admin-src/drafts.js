/*
  임시저장 — 쓰던 글을 이 브라우저에 남깁니다.

  왜 필요했나: /admin 의 「저장」은 곧 GitHub 커밋입니다. 그 사이에 탭이
  닫히거나(폰에서는 다른 앱으로 넘어가기만 해도 사파리가 화면을 버립니다),
  네트워크가 끊기거나, 저장 자체가 안 나가면(2026-09-07 에 실제로 그랬습니다)
  쓰던 글이 통째로 사라집니다. Decap 은 고치던 것을 아무 데도 안 남깁니다 —
  리덕스 안에만 있어서 새로고침 한 번이면 끝입니다.

  그래서 **글을 커밋하기 전에 한 벌을 localStorage 에 둡니다.**

  ⚠ 이것은 백업이지 저장이 아닙니다. 이 브라우저에만 있고, 다른 기기에서는
    안 보입니다. 사이트에 나가는 것은 여전히 「저장」뿐입니다 — 화면 문구에서
    둘을 헷갈리게 쓰지 마세요.

  ⚠ 저장하는 칸은 **쓰는 것들뿐입니다** (skin.js 의 WRITE_FIELDS 와 같은 줄).
    「발행 설정」(작성일·프로젝트·초안·비밀글)은 저장하기 직전에 정하는
    것이라 되살릴 것이 없습니다.

  ⚠ 값을 읽고 쓰는 길은 **위젯이 직접 등록합니다** (`registerPort`). DOM 에서
    input 을 찾아 값을 넣는 방법은 안 씁니다 — 커버 사진·저자에는 input 이
    아예 없고(§6-2 의 라벨 for 이야기와 같은 자리), React 가 들고 있는 값을
    DOM 으로 밀어 넣는 것은 리덕스와 어긋납니다.
*/

const KEY_PREFIX = 'lim.draft.v1:'

/** 남겨 두는 글 수. 넘치면 오래된 것부터 버립니다. */
const KEEP = 10

/** 글자를 친 뒤 이만큼 잠잠하면 남깁니다. */
const WAIT = 1500

/** 계속 치고 있어도 이만큼 지나면 한 번 남깁니다. */
const MAX_WAIT = 10000

/** 옛 글은 값이 늦게 옵니다. 이만큼까지는 기다렸다 시작합니다. */
const LOAD_GRACE = 10000

const FIELDS = ['author', 'title', 'slug', 'description', 'heroImage', 'body']

/* -------------------------------------------------------------------
   값을 읽고 쓰는 길

   위젯이 mount 될 때 자기 칸을 등록하고, unmount 때 뺍니다.
   `get()` 은 **싸야 합니다** — 화면이 바뀔 때마다 부릅니다.
   ------------------------------------------------------------------- */

const ports = new Map()

export function registerPort(name, port) {
  if (!name || FIELDS.indexOf(name) < 0 || !port) return function () {}
  ports.set(name, port)
  return function () {
    if (ports.get(name) === port) ports.delete(name)
  }
}

function readOne(name) {
  const p = ports.get(name)
  if (!p) return ''
  try {
    const v = p.get()
    return v == null ? '' : String(v)
  } catch (e) {
    return ''
  }
}

function readForm() {
  const out = {}
  for (const name of FIELDS) if (ports.has(name)) out[name] = readOne(name)
  return out
}

/**
 * 값을 붙들고 있는 위젯에게 "지금 것을 내놓으라" 고 합니다.
 *
 * ⚠ **`get()` 은 글자를 칠 때마다 불립니다** (skin.js 의 손질 한 바퀴가
 *   DOM 이 바뀔 때마다 도는데, 본문을 치는 것이 곧 DOM 이 바뀌는 것입니다).
 *   그래서 본문의 `get()` 은 tiptap 을 다시 훑지 않고 **마지막으로 내보낸
 *   것**을 돌려줍니다 — 긴 글에서 글자마다 마크다운으로 옮기면 눌립니다.
 *
 * 그 대신 **남기기 직전에 한 번만** 이걸 불러 값을 지금 것으로 맞춥니다.
 * 안 그러면 마지막 150ms(본문이 모아서 내보내는 간격) 안에 친 글자가
 * 빠진 채로 남습니다 — 탭이 죽기 직전에 남기는 자리라 그게 제일 아깝습니다.
 *
 * ⚠ 없는 위젯이 대부분입니다. 글자 칸들은 칠 때마다 바로 내보내서
 *   맞출 것이 없습니다.
 */
function flushPorts() {
  for (const p of ports.values()) {
    if (!p || typeof p.flush !== 'function') continue
    try {
      p.flush()
    } catch (e) {
      /* 한 칸이 안 내놔도 나머지는 남깁니다 */
    }
  }
}

function same(a, b) {
  if (!a || !b) return false
  for (let i = 0; i < FIELDS.length; i += 1) {
    const n = FIELDS[i]
    if ((a[n] || '') !== (b[n] || '')) return false
  }
  return true
}

function restore(fields) {
  for (let i = 0; i < FIELDS.length; i += 1) {
    const n = FIELDS[i]
    const p = ports.get(n)
    if (!p || !(n in fields)) continue
    try {
      p.set(fields[n] || '')
    } catch (e) {
      if (window.console) console.warn('[lim admin drafts] 되살리기', n, e)
    }
  }
}

/* -------------------------------------------------------------------
   어느 글인가 — 주소에서 뽑습니다
   ------------------------------------------------------------------- */

function entryKey() {
  const hash = (typeof location !== 'undefined' && location.hash) || ''
  const m = /^#\/collections\/([^/?]+)\/(new|entries\/[^/?#]+)/.exec(hash)
  return m ? m[1] + '/' + m[2] : null
}

function isNewEntry(k) {
  return !!k && /\/new$/.test(k)
}

/* -------------------------------------------------------------------
   localStorage

   ⚠ 블로그와 같은 주소라 localStorage 를 나눠 씁니다 (테마·비밀글 열쇠가
     이미 있습니다). 접두어를 반드시 붙이세요.
   ------------------------------------------------------------------- */

function load(key) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key)
    if (!raw) return null
    const o = JSON.parse(raw)
    return o && o.fields ? o : null
  } catch (e) {
    return null
  }
}

function store(key, fields) {
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify({ at: Date.now(), fields: fields }))
  } catch (e) {
    /* 용량이 찼거나 사파리 비공개 모드입니다. 오래된 것을 버리고 한 번만
       다시 해 봅니다 — 그래도 안 되면 조용히 포기하지 말고 알립니다. */
    prune(1)
    try {
      localStorage.setItem(KEY_PREFIX + key, JSON.stringify({ at: Date.now(), fields: fields }))
    } catch (e2) {
      return false
    }
  }
  prune(KEEP)
  return true
}

function drop(key) {
  try {
    localStorage.removeItem(KEY_PREFIX + key)
  } catch (e) {
    /* 못 지워도 다음 저장 때 덮어씁니다 */
  }
}

function prune(keep) {
  try {
    const rows = []
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i)
      if (!k || k.indexOf(KEY_PREFIX) !== 0) continue
      let at = 0
      try {
        at = (JSON.parse(localStorage.getItem(k)) || {}).at || 0
      } catch (e) {
        at = 0
      }
      rows.push({ k: k, at: at })
    }
    if (rows.length <= keep) return
    rows.sort((a, b) => b.at - a.at)
    for (let i = keep; i < rows.length; i += 1) localStorage.removeItem(rows[i].k)
  } catch (e) {
    /* 정리하다 죽어도 글쓰기를 막지 않습니다 */
  }
}

/* ------------------------------------------------------------------- */

function ago(at) {
  const s = Math.max(0, Math.round((Date.now() - at) / 1000))
  if (s < 45) return '방금'
  const m = Math.round(s / 60)
  if (m < 60) return m + '분 전'
  const h = Math.round(m / 60)
  if (h < 24) return h + '시간 전'
  return Math.round(h / 24) + '일 전'
}

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

/* -------------------------------------------------------------------
   상태

   글 하나를 열 때마다 처음부터 다시 시작합니다.

   `armed` 는 "이제 남겨도 된다" 는 뜻입니다. 켜지기 전에는 **아무것도 안
   씁니다** — 옛 글은 값이 늦게 오기 때문에, 그 전에 남기면 빈 폼이 멀쩡한
   임시저장본을 덮어씁니다.
   ------------------------------------------------------------------- */

let key = null
/** 열었을 때의 값. 여기로 돌아오면 남길 것이 없습니다. */
let baseline = null
let armed = false
let routeAt = 0
/** 되살릴 수 있는 것. 이게 있는 동안에는 **남기지 않습니다** (아래 참고). */
let offer = null
let lastFields = null
/** 지난 바퀴에 본 값. "방금 바뀌었나" 를 여기에 견줍니다 (draftsPass 참고). */
let seen = null
let savedAt = 0
let full = false
let timer = null
let pendingSince = 0

function reset(next) {
  /*
    새 글을 저장하면 주소가 `new` → `entries/<주소>` 로 바뀝니다. 그때
    `new` 자리에 남은 것은 이미 파일이 됐다는 뜻이라 버립니다.

    ⚠ **주소가 맞아떨어질 때만입니다.** "new 에서 나갔다" 만 보고 버리면,
      쓰다 만 새 글을 두고 옛 글을 한 번 열어 보는 것만으로 남겨 둔 것이
      사라집니다 (실제로 그랬습니다). 저장돼서 옮겨 간 것이면 도착한 주소가
      그 글의 `slug` 와 같습니다 — 다르면 그냥 딴 데 보러 간 것입니다.

    ⚠ 저장이 잘 끝났으면 `draftSaved()` 가 이미 버렸습니다. 여기는 그보다
      주소가 먼저 바뀌는 경우를 받는 자리라, 없으면 조용히 지나갑니다.
  */
  if (key && isNewEntry(key) && next && !isNewEntry(next)) {
    const snap = load(key)
    const slug = snap && snap.fields ? snap.fields.slug : ''
    if (slug && next === key.replace(/\/new$/, '/entries/' + slug)) drop(key)
  }
  key = next
  baseline = null
  armed = false
  offer = null
  lastFields = null
  seen = null
  savedAt = 0
  full = false
  pendingSince = 0
  routeAt = Date.now()
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  removeBar()
}

/**
 * 폼이 다 차려졌는가.
 *
 * ⚠ 본문·제목 칸이 등록되기 전에 시작하면 안 됩니다. 옛 글은 GitHub 에서
 *   값이 늦게 오는데, 그 사이의 빈 폼을 남기면 임시저장본이 날아갑니다.
 */
function ready() {
  if (!ports.has('body') || !ports.has('title')) return false
  if (!document.querySelector('.lim-form')) return false
  if (isNewEntry(key)) return true
  /* 옛 글: 제목이 들어올 때까지. 정말 제목이 빈 글도 있을 수 있어서
     오래 기다리면 그냥 시작합니다. */
  if (!readOne('title') && Date.now() - routeAt < LOAD_GRACE) return false
  return true
}

function settle() {
  baseline = readForm()
  lastFields = baseline
  seen = baseline
  const snap = load(key)
  if (snap && !same(snap.fields, baseline)) {
    offer = snap
  } else {
    /* 파일과 같아졌으면 남겨 둘 이유가 없습니다 */
    if (snap) drop(key)
    offer = null
  }
  armed = true
  paint()
}

/* -------------------------------------------------------------------
   남기기
   ------------------------------------------------------------------- */

function schedule() {
  if (!armed || !key || offer) return
  if (!pendingSince) pendingSince = Date.now()
  if (Date.now() - pendingSince >= MAX_WAIT) {
    saveNow(false)
    return
  }
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => saveNow(false), WAIT)
}

/**
 * @param force 손으로 「임시저장」을 눌렀을 때. 바뀐 게 없어도 알립니다.
 */
function saveNow(force) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  pendingSince = 0
  if (!armed || !key) return
  /* ⚠ 되살릴지 안 물어봤으면 남기지 않습니다 — 답하기 전에 덮으면
     되살릴 것이 없어집니다. */
  if (offer) return

  flushPorts()
  const fields = readForm()
  const dirty = !same(fields, baseline)
  if (!dirty) {
    /* 되돌려서 파일과 같아졌습니다 */
    if (savedAt) drop(key)
    savedAt = 0
    lastFields = fields
    full = false
    paint()
    return
  }
  if (!force && same(fields, lastFields)) return

  lastFields = fields
  seen = fields
  if (store(key, fields)) {
    savedAt = Date.now()
    full = false
  } else {
    full = true
  }
  paint()
}

/**
 * 저장(커밋)이 끝났습니다 — 남겨 둔 것을 버리고 기준을 지금으로 옮깁니다.
 * skin.js 가 Decap 의 "항목 저장됨" 알림을 보고 부릅니다.
 */
export function draftSaved() {
  if (!key) return
  drop(key)
  baseline = readForm()
  lastFields = baseline
  savedAt = 0
  full = false
  paint()
}

/* -------------------------------------------------------------------
   화면 — 되살리기 줄 · 본문 아래 한 줄
   ------------------------------------------------------------------- */

function removeBar() {
  const bar = document.querySelector('.lim-draftbar')
  if (bar && bar.parentNode) bar.parentNode.removeChild(bar)
}

function paintBar() {
  const form = document.querySelector('.lim-form')
  if (!form) return
  if (!offer) {
    removeBar()
    return
  }

  let bar = form.querySelector('.lim-draftbar')
  if (!bar) {
    bar = el('div', 'lim-draftbar')
    bar.setAttribute('role', 'status')
    const text = el('p', 'lim-draftbar-text')
    text.appendChild(el('b', null, '쓰다 만 글이 있습니다'))
    text.appendChild(el('span', 'lim-draftbar-when'))
    bar.appendChild(text)

    const acts = el('div', 'lim-draftbar-acts')
    const yes = el('button', 'lim-draftbar-yes', '되살리기')
    yes.type = 'button'
    yes.addEventListener('click', () => {
      const snap = offer
      offer = null
      removeBar()
      if (snap) restore(snap.fields)
      /* 되살린 것은 파일과 다르니 바로 다시 남깁니다 */
      lastFields = null
      savedAt = snap ? snap.at : 0
      paint()
      schedule()
    })
    const no = el('button', 'lim-draftbar-no', '버리기')
    no.type = 'button'
    no.addEventListener('click', () => {
      offer = null
      drop(key)
      removeBar()
      lastFields = readForm()
      paint()
    })
    acts.appendChild(no)
    acts.appendChild(yes)
    bar.appendChild(acts)

    /* 폼 맨 위 — 제목 칸보다 먼저 보여야 합니다 */
    form.insertBefore(bar, form.firstChild)
  }

  const when = bar.querySelector('.lim-draftbar-when')
  const text = ago(offer.at) + ' · 이 브라우저에만 남아 있습니다'
  if (when.textContent !== text) when.textContent = text
}

/*
  본문 아래 한 줄에 붙습니다 (skin.js 의 editorFoot 이 만드는 `.lim-foot`).
  긴 글에서는 위 띠가 화면 밖으로 나가서, 여기가 쓰는 동안 늘 보이는
  유일한 자리입니다.
*/
function paintFoot() {
  const foot = document.querySelector('.lim-foot')
  if (!foot) return

  let box = foot.querySelector('.lim-draft')
  if (!box) {
    box = el('div', 'lim-draft')
    const btn = el('button', 'lim-draft-now', '임시저장')
    btn.type = 'button'
    btn.addEventListener('click', () => saveNow(true))
    box.appendChild(btn)
    box.appendChild(el('span', 'lim-draft-when'))
    /* 「저장됨」 앞. 오른쪽 끝은 진짜 저장 자리입니다. */
    foot.insertBefore(box, foot.querySelector('.lim-saved'))
  }

  const btn = box.querySelector('.lim-draft-now')
  const when = box.querySelector('.lim-draft-when')

  let text = ''
  let bad = false
  if (offer) {
    text = '위에서 고를 때까지 멈춤'
    bad = true
  } else if (full) {
    text = '자리가 없어 못 남겼습니다'
    bad = true
  } else if (savedAt) {
    text = ago(savedAt)
  }
  if (when.textContent !== text) when.textContent = text
  when.classList.toggle('is-bad', bad)
  const off = !armed || !!offer
  if (btn.disabled !== off) btn.disabled = off
}

function paint() {
  paintBar()
  paintFoot()
}

/* -------------------------------------------------------------------
   바깥에서 부르는 것
   ------------------------------------------------------------------- */

/**
 * skin.js 의 손질 한 바퀴(pass)에서 같이 불립니다. 화면이 바뀔 때마다
 * 돌아가므로 **싸야 합니다** — 값을 여섯 개 읽어 견주는 것이 전부입니다.
 */
export function draftsPass() {
  const now = entryKey()
  if (now !== key) reset(now)
  if (!key) return
  if (!armed) {
    if (!ready()) return
    settle()
    return
  }
  /*
    ⚠ **방금 바뀐 것이 있을 때만** 타이머를 다시 겁니다.

    이 함수는 화면이 바뀔 때마다 불립니다 — 글자 하나에 여러 번입니다.
    여기서 그냥 `schedule()` 을 부르면 1.5초 타이머가 매번 처음으로
    되감겨서 **영영 안 터집니다.** 실제로 그랬습니다: 10초 천장(MAX_WAIT)
    에 걸릴 때만 남아서, 모든 임시저장이 10초씩 늦었습니다.

    그래서 "남겨 둔 것과 다른가" 가 아니라 "**지난 바퀴에 본 것과
    다른가**" 로 가릅니다. 손을 멈추면 아무도 타이머를 안 건드리고,
    그제야 1.5초를 세고 터집니다.
  */
  if (!offer) {
    const fields = readForm()
    if (!same(fields, seen)) {
      seen = fields
      schedule()
    }
  }
  paint()
}

export function startDrafts() {
  /* 원문 모드의 textarea 는 글자를 쳐도 DOM 이 안 바뀝니다 — skin.js 의
     감시자가 안 깨어나는 자리라 따로 듣습니다 (글자 수 줄과 같은 사정). */
  document.addEventListener('input', () => schedule(), true)

  /*
    ⚠ 탭이 죽기 직전에 한 번 밀어 넣습니다. 폰에서는 다른 앱으로 넘어가는
      것만으로 사파리가 화면을 버리는데, 그때 `beforeunload` 는 안 옵니다 —
      `pagehide` 와 `visibilitychange` 를 씁니다.
  */
  const flush = () => {
    try {
      saveNow(false)
    } catch (e) {
      /* 나가는 길이라 알릴 자리가 없습니다 */
    }
  }
  window.addEventListener('pagehide', flush)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })

  /* "3분 전" 이 멈춰 있지 않게. 화면이 안 바뀌어도 시간은 갑니다. */
  setInterval(() => {
    try {
      if (key && armed) paint()
    } catch (e) {
      /* 시계 하나 때문에 글쓰기를 막지 않습니다 */
    }
  }, 30000)
}
