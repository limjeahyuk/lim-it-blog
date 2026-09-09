/*
  조회수 대시보드 — 머리띠의 「조회수」 탭.

  조회수 숫자는 **읽는 사람한테 안 보입니다** (§6-6). 홈이 인기순으로 줄을
  세우는 데 쓰는 것은 순서뿐이고, 숫자를 늘어놓고 보는 곳은 여기 하나입니다.

  ⚠ **판(모달)이 아니라 지면입니다.** 2026-09-08 에 목록 화면의 「개수」 옆
    작은 단추 + 모달이었던 것을 콘텐츠·미디어와 나란한 탭으로 옮겼습니다 —
    460px 짜리 판에 순위·저자·날짜를 다 넣을 자리가 없었습니다.

  ⚠ **Decap 의 라우터에 길을 새로 내지 않았습니다.** `#/views` 같은 주소를
    쓰면 Decap 이 모르는 길이라 뒤에서 404 를 그립니다. 대신 화면을 덮는
    지면을 우리가 그리고, 콘텐츠·미디어로 넘어가면 걷어냅니다 — 그래서
    **새로고침하면 목록으로 돌아옵니다.**

  ⚠ **열쇠(VIEWS_TOKEN)를 이 브라우저에 남깁니다.** 정적 페이지라 서버에서
    로그인 여부를 물어볼 데가 없습니다. 비밀글 비밀번호와 같은 방식입니다
    (§6-3) — 한 번 넣으면 다음부터 안 묻고, 「열쇠 지우기」로 지웁니다.

  ⚠ **로컬에서는 안 됩니다.** `npm run cms`·`astro dev` 에는 `/api` 가 없어서
    404 입니다. 그때는 그렇게 적어 줍니다 — 열쇠가 틀린 것과 구분이 안 되면
    배포에서 헤맵니다.

  ⚠ **저자마다 색을 주지 않았습니다.** 블로그의 `--who-*` 는 여기 없고,
    옮겨 적으면 저자를 늘릴 때 고칠 곳이 하나 더 생깁니다 (§3 은 세 군데).
    막대는 전부 강조색이고 저자는 글자로만 갈립니다.
*/

const TOKEN_KEY = 'lim.views.token'

/* 「최근 N일」 막대 개수. 폰(375px)에서 이만큼이 한 줄에 들어갑니다. */
const DAYS_SHOWN = 14

function token() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch (e) {
    return ''
  }
}

function setToken(value) {
  try {
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    /* 사생활 보호 창 — 이번 지면에서만 쓰고 맙니다 */
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

function num(n) {
  return Number(n || 0).toLocaleString('ko-KR')
}

/** `2026-09-08` → `2026.09.08` */
function dot(d) {
  return typeof d === 'string' && d.length === 10 ? d.replace(/-/g, '.') : ''
}

/*
  오늘 (한국 시각).

  ⚠ **`api/views.js` 의 `today()` 와 같은 규칙이어야 합니다.** 서버는 UTC 로
    도는 Vercel 함수라 9시간을 더해 날을 가르는데, 여기서 브라우저의 날짜를
    그냥 쓰면 시차가 있는 곳에서 「오늘」 칸이 하루 어긋납니다.
*/
function todayKST() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

/** `2026-09-08` 에서 하루씩 뒤로 — 막대의 빈 날을 채우는 데 씁니다. */
function shift(day, back) {
  const t = Date.parse(day + 'T00:00:00Z') - back * 86400000
  return new Date(t).toISOString().slice(0, 10)
}

/**
 * 글 편집 화면 주소. 컬렉션 이름은 머리띠의 「글」 탭에서 뽑습니다.
 *
 * ⚠ **아무 컬렉션 링크나 잡으면 안 됩니다.** 머리띠에 탭이 둘이고
 *   (글·에디터 — 2026-09-09) 사이드바에도 같은 링크가 남아 있어서,
 *   차례가 바뀌면 조용히 **에디터 화면으로 가는 링크**가 됩니다. 여기
 *   목록은 언제나 글이니 「글」 탭을 집어서 씁니다.
 * ⚠ 못 찾으면 빈 문자열입니다 — 그때 제목은 링크가 아니라 글자로만 나옵니다.
 *   조회수를 보는 일이 글을 여는 것 때문에 막히면 안 됩니다.
 */
function entryHref(slug) {
  const a =
    document.querySelector(".lim-ctab[data-lim-c='posts']") ||
    document.querySelector("a[href*='#/collections/']")
  const m = a && /#\/collections\/([^/]+)/.exec(a.getAttribute('href') || '')
  return m ? '#/collections/' + m[1] + '/entries/' + slug : ''
}

/**
 * 숫자와 제목을 같이 받아옵니다.
 *
 * 조회수 API 는 주소만 들고 있어서 제목을 모릅니다 — 빌드할 때 나가는
 * `/ranks.json` 에서 찾습니다 (홈의 인기 글이 쓰는 것과 같은 파일).
 * 거꾸로 **아직 아무도 안 읽은 글**은 API 에 아예 없으므로, 그쪽도 이
 * 표에서 뽑아냅니다.
 */
async function load() {
  /* ⚠ 로컬에는 `/api` 가 없습니다. 게다가 Vite 는 `/api/views` 를 물으면
     **함수 소스를 그대로** 내줍니다(재 보고 확인) — 404 로 걸리지 않으므로
     주소를 보고 먼저 끊습니다. 안 그러면 "응답을 읽지 못했습니다" 가 떠서
     열쇠가 틀린 것과 구분이 안 됩니다. */
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
    return { error: '로컬에서는 조회수를 볼 수 없습니다 — 배포된 주소에서 열어 주세요.' }
  }

  const key = token()
  if (!key) return { need: 'token' }

  let res
  try {
    res = await fetch('/api/views?full=1', {
      headers: { Authorization: 'Bearer ' + key },
    })
  } catch (e) {
    return { error: '조회수를 받아오지 못했습니다 — ' + (e.message || e) }
  }

  if (res.status === 403) return { need: 'token', bad: true }
  if (res.status === 404) {
    return { error: '여기서는 /api 가 안 돕니다. 배포된 주소에서 열어 주세요.' }
  }
  if (!res.ok) return { error: '조회수 서버가 ' + res.status + ' 을 냈습니다.' }

  const data = await res.json().catch(() => null)
  if (!data || !data.views) return { error: '응답을 읽지 못했습니다.' }

  let posts = []
  try {
    const rows = await fetch('/ranks.json').then((r) => (r.ok ? r.json() : null))
    if (Array.isArray(rows)) posts = rows
  } catch (e) {
    /* 제목을 못 찾으면 주소를 그대로 보여 줍니다 */
  }

  const known = new Map(posts.map((p) => [p.s, p]))

  const rows = Object.keys(data.views).map((slug) => {
    const post = known.get(slug)
    return {
      slug,
      n: data.views[slug],
      title: (post && post.t) || slug,
      date: (post && post.d) || '',
      who: (post && post.n) || '',
      /* ranks.json 에 없는 주소 — 지웠거나 주소를 바꾼 글입니다.
         홈은 이런 것을 버리는데(§6-6), 여기서는 보여 줍니다. 해시에 남은
         쓰레기 열쇠를 알아볼 자리가 여기밖에 없습니다. */
      gone: !post,
    }
  })

  /* 아직 아무도 안 읽은 글. API 에는 없고 `/ranks.json` 에만 있습니다. */
  const unread = posts
    .filter((p) => !(p.s in data.views))
    .map((p) => ({ slug: p.s, title: p.t, date: p.d, who: p.n, n: 0 }))

  return {
    rows,
    unread,
    posts: posts.length,
    total: data.total || 0,
    days: data.days || {},
    store: data.store !== false,
  }
}

/* -------------------------------------------------------------------
   그리기
   ------------------------------------------------------------------- */

/** 숫자 칸 하나 (모두 · 오늘 · 읽힌 글 · 평균) */
function stat(label, value, unit, note) {
  const box = el('div', 'lim-stat')
  box.appendChild(el('span', 'lim-stat-k', label))
  const line = el('div', 'lim-stat-v')
  line.appendChild(el('b', null, value))
  if (unit) line.appendChild(el('i', null, unit))
  box.appendChild(line)
  box.appendChild(el('span', 'lim-stat-note', note || ''))
  return box
}

function section(title, extra) {
  const box = el('section', 'lim-dcard')
  const head = el('div', 'lim-dcard-head')
  head.appendChild(el('h3', null, title))
  if (extra) head.appendChild(extra)
  box.appendChild(head)
  return box
}

/** 제목 줄 — 누르면 그 글 편집 화면으로 갑니다 */
function titleNode(row, onGo) {
  const href = row.gone ? '' : entryHref(row.slug)
  const node = el(href ? 'a' : 'b', 'lim-drow-t', row.title)
  if (href) {
    node.href = href
    node.addEventListener('click', onGo)
  }
  return node
}

/** 막대 하나 (칸 전체에서 차지하는 몫) */
function bar(share) {
  const rail = el('div', 'lim-bar')
  const fill = el('i')
  fill.style.width = Math.max(share * 100, 1.5) + '%'
  rail.appendChild(fill)
  return rail
}

/**
 * 최근 며칠 — 막대.
 *
 * ⚠ **날짜별은 2026-09-08 부터 쌓입니다.** 그전 조회수는 합계에만 있고
 *   날짜가 없습니다 — 여기 막대의 합과 「모두」가 다른 것이 정상입니다.
 */
function daysCard(days) {
  const today = todayKST()
  const list = []
  for (let i = DAYS_SHOWN - 1; i >= 0; i -= 1) {
    const key = shift(today, i)
    list.push({ key, n: Number(days[key]) || 0 })
  }

  const sum = list.reduce((a, b) => a + b.n, 0)
  const max = list.reduce((a, b) => Math.max(a, b.n), 0)

  const card = section('최근 ' + DAYS_SHOWN + '일')
  if (!Object.keys(days).length) {
    card.appendChild(
      el(
        'p',
        'lim-dnote',
        '날짜별은 아직 하루치도 없습니다 — 세기 시작한 날부터 쌓입니다. ' +
          '그전에 센 것은 날짜 없이 합계에만 있습니다.',
      ),
    )
    return card
  }

  const chart = el('div', 'lim-days')
  for (const d of list) {
    const col = el('div', 'lim-day')
    col.title = dot(d.key) + ' · ' + num(d.n) + '번'
    const rail = el('div', 'lim-day-rail')
    const fill = el('i')
    /* 0 인 날도 자리는 남깁니다 — 빈 자리가 곧 "그날은 없었다" 입니다 */
    fill.style.height = max ? Math.max((d.n / max) * 100, d.n ? 4 : 0) + '%' : '0'
    rail.appendChild(fill)
    col.appendChild(rail)
    col.appendChild(el('span', null, String(Number(d.key.slice(8)))))
    if (d.key === today) col.classList.add('is-today')
    chart.appendChild(col)
  }
  card.appendChild(chart)
  card.appendChild(
    el(
      'p',
      'lim-dnote',
      DAYS_SHOWN + '일 동안 ' + num(sum) + '번 · 하루 평균 ' +
        num(Math.round(sum / DAYS_SHOWN)) + '번',
    ),
  )
  return card
}

/** 저자별 묶음 */
function whoCard(rows, total) {
  const sums = new Map()
  for (const r of rows) {
    const key = r.gone ? '목록에 없는 주소' : r.who || '저자 없음'
    sums.set(key, (sums.get(key) || 0) + r.n)
  }
  const list = [...sums.entries()].sort((a, b) => b[1] - a[1])

  const card = section('저자별')
  for (const [name, n] of list) {
    const row = el('div', 'lim-wrow')
    row.appendChild(el('span', 'lim-wrow-n', name))
    row.appendChild(bar(total ? n / total : 0))
    row.appendChild(
      el(
        'span',
        'lim-wrow-v',
        num(n) + '번 · ' + (total ? Math.round((n / total) * 100) : 0) + '%',
      ),
    )
    card.appendChild(row)
  }
  return card
}

/** 글별 순위 — 검색과 정렬은 여기서만 씁니다 */
function listCard(rows, top, onGo) {
  const state = { q: '', sort: 'n' }

  const tools = el('div', 'lim-dtools')
  const search = el('input', 'lim-dsearch')
  search.type = 'search'
  search.placeholder = '제목·주소로 찾기'
  const sortBox = el('div', 'lim-dsort')
  const buttons = [
    ['n', '많이 읽힌 순'],
    ['d', '최신순'],
  ].map(([key, label]) => {
    const b = el('button', 'lim-dsort-b', label)
    b.type = 'button'
    b.addEventListener('click', () => {
      state.sort = key
      paint()
    })
    sortBox.appendChild(b)
    return [key, b]
  })
  tools.appendChild(search)
  tools.appendChild(sortBox)

  const card = section('글별', tools)
  const body = el('div', 'lim-drows')
  card.appendChild(body)

  function paint() {
    for (const [key, b] of buttons) b.classList.toggle('is-on', key === state.sort)

    const q = state.q.trim().toLowerCase()
    const shown = rows
      .filter(
        (r) =>
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q),
      )
      .sort((a, b) =>
        state.sort === 'n' ? b.n - a.n : (b.date || '').localeCompare(a.date || ''),
      )

    body.textContent = ''
    if (!shown.length) {
      body.appendChild(el('p', 'lim-dnote', '찾는 글이 없습니다.'))
      return
    }

    shown.forEach((r, i) => {
      const row = el('div', 'lim-drow')
      row.appendChild(el('span', 'lim-drow-i', String(i + 1)))

      const mid = el('div', 'lim-drow-m')
      mid.appendChild(titleNode(r, onGo))
      const meta = el('div', 'lim-drow-meta')
      if (r.gone) meta.appendChild(el('span', 'lim-drow-gone', '목록에 없는 주소'))
      if (r.who) meta.appendChild(el('span', null, r.who))
      if (r.date) meta.appendChild(el('span', null, dot(r.date)))
      meta.appendChild(el('span', 'lim-drow-s', r.slug))
      mid.appendChild(meta)
      row.appendChild(mid)

      row.appendChild(bar(top ? r.n / top : 0))
      row.appendChild(el('span', 'lim-drow-v', num(r.n)))
      body.appendChild(row)
    })
  }

  search.addEventListener('input', () => {
    state.q = search.value
    paint()
  })
  paint()
  return card
}

/** 아직 아무도 안 읽은 글 — 접어 둡니다 */
function unreadCard(unread, onGo) {
  const card = section('아직 안 읽힌 글 ' + unread.length + '편')
  /* 백 편이 넘을 수 있어서 카드 안에서만 흐릅니다 — 지면이 이것 때문에
     한없이 길어지면 위의 순위표로 되돌아오기가 어렵습니다. */
  const box = el('div', 'lim-drows is-scroll')
  for (const r of unread) {
    const row = el('div', 'lim-drow')
    /* 순위 칸은 비웁니다 — 순위가 없는 글입니다. 숫자는 오른쪽에 0 으로
       놓아서 위의 순위표와 줄이 맞습니다. */
    row.appendChild(el('span', 'lim-drow-i', ''))
    const mid = el('div', 'lim-drow-m')
    mid.appendChild(titleNode(r, onGo))
    const meta = el('div', 'lim-drow-meta')
    if (r.who) meta.appendChild(el('span', null, r.who))
    if (r.date) meta.appendChild(el('span', null, dot(r.date)))
    meta.appendChild(el('span', 'lim-drow-s', r.slug))
    mid.appendChild(meta)
    row.appendChild(mid)
    row.appendChild(el('span', 'lim-drow-v', '0'))
    box.appendChild(row)
  }
  card.appendChild(box)
  return card
}

/** 열쇠를 묻는 줄. 넣으면 그 자리에서 다시 받아옵니다. */
function askToken(body, bad) {
  const box = el('div', 'lim-dask')
  box.appendChild(
    el(
      'p',
      'lim-dnote',
      bad
        ? '열쇠가 맞지 않습니다. 다시 넣어 주세요 (Vercel 의 VIEWS_TOKEN).'
        : 'Vercel 에 넣어 둔 VIEWS_TOKEN 을 한 번만 넣으면 됩니다.',
    ),
  )

  const input = el('input', 'lim-dkey')
  input.type = 'password'
  input.placeholder = '열쇠'
  input.autocomplete = 'off'

  const go = el('button', 'lim-dgo', '확인')
  go.type = 'button'
  const submit = () => {
    const value = input.value.trim()
    if (!value) return
    setToken(value)
    openViewsPage()
  }
  go.addEventListener('click', submit)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit()
  })

  const line = el('div', 'lim-daskline')
  line.appendChild(input)
  line.appendChild(go)
  box.appendChild(line)
  body.appendChild(box)
  setTimeout(() => input.focus(), 0)
}

/* -------------------------------------------------------------------
   지면 열고 닫기
   ------------------------------------------------------------------- */

export function closeViewsPage() {
  const page = document.querySelector('.lim-dash')
  if (page && page.parentNode) page.parentNode.removeChild(page)
  document.documentElement.classList.remove('lim-dash-on')
}

export function viewsPageOpen() {
  return !!document.querySelector('.lim-dash')
}

export function openViewsPage() {
  closeViewsPage()

  const page = el('div', 'lim-dash')
  page.setAttribute('tabindex', '-1')
  const inner = el('div', 'lim-dash-in')

  const top = el('div', 'lim-dash-top')
  const heads = el('div')
  heads.appendChild(el('h2', 'lim-dash-h', '조회수'))
  const sub = el(
    'p',
    'lim-dash-sub',
    '읽는 사람한테는 안 보입니다. 홈의 「인기 글」 순서에만 씁니다.',
  )
  heads.appendChild(sub)
  top.appendChild(heads)

  const acts = el('div', 'lim-dash-acts')
  const again = el('button', 'lim-dghost', '다시 받아오기')
  again.type = 'button'
  again.addEventListener('click', openViewsPage)
  const forget = el('button', 'lim-dghost', '열쇠 지우기')
  forget.type = 'button'
  forget.hidden = !token()
  forget.addEventListener('click', () => {
    setToken('')
    openViewsPage()
  })
  acts.appendChild(again)
  acts.appendChild(forget)
  top.appendChild(acts)
  inner.appendChild(top)

  const body = el('div', 'lim-dash-body')
  body.appendChild(el('p', 'lim-dnote', '받아오는 중…'))
  inner.appendChild(body)

  page.appendChild(inner)
  document.body.appendChild(page)
  /* 뒤의 목록이 같이 스크롤되지 않게 잠급니다 */
  document.documentElement.classList.add('lim-dash-on')
  page.focus()

  /* 글로 건너가면 지면을 걷습니다 — 주소만 바뀌고 대시보드가 덮고 있으면
     아무 일도 안 일어난 것처럼 보입니다. */
  const onGo = () => closeViewsPage()

  load().then((data) => {
    /* 그새 닫혔으면 그리지 말고 그냥 둡니다 */
    if (!document.body.contains(page)) return
    body.textContent = ''

    if (data.need === 'token') {
      askToken(body, data.bad)
      forget.hidden = true
      return
    }
    if (data.error) {
      body.appendChild(el('p', 'lim-dnote', data.error))
      return
    }
    if (!data.rows.length) {
      /* ⚠ 빈 표에는 두 가지가 섞여 있습니다 — 아직 아무도 안 읽은 것과,
         셀 데(Upstash)가 아예 안 붙어 있는 것. 뒤엣것을 "안 읽었습니다" 로
         적으면 홈이 왜 「최신 글」에 머물러 있는지 알 방법이 없습니다. */
      body.appendChild(
        el(
          'p',
          'lim-dnote',
          data.store
            ? '아직 아무도 안 읽었습니다.'
            : '셀 데가 안 붙어 있습니다 — Vercel 에 Upstash 환경변수' +
                '(KV_REST_API_URL · KV_REST_API_TOKEN)를 넣고 다시 배포하세요.',
        ),
      )
      return
    }

    const top4 = data.rows.reduce((a, b) => (b.n > a.n ? b : a), data.rows[0])
    const stats = el('div', 'lim-stats')
    stats.appendChild(stat('모두', num(data.total), '번', '세기 시작한 뒤 전부'))
    stats.appendChild(
      stat(
        '오늘',
        num(data.days[todayKST()] || 0),
        '번',
        dot(todayKST()) + ' (한국 시각)',
      ),
    )
    stats.appendChild(
      stat(
        '읽힌 글',
        num(data.rows.length),
        '편',
        data.posts ? '전체 ' + num(data.posts) + '편 중' : '',
      ),
    )
    stats.appendChild(
      stat(
        '글 하나 평균',
        num(Math.round(data.total / data.rows.length)),
        '번',
        '읽힌 글 기준',
      ),
    )
    body.appendChild(stats)

    body.appendChild(daysCard(data.days))
    body.appendChild(whoCard(data.rows, data.total))
    body.appendChild(listCard(data.rows, top4.n, onGo))
    if (data.unread.length) body.appendChild(unreadCard(data.unread, onGo))

    body.appendChild(
      el(
        'p',
        'lim-dfoot',
        '같은 기기는 하루에 한 번만 세고 로컬에서는 안 셉니다. ' +
          '광고 차단기와 봇은 못 거르니 정확한 숫자가 아니라 대충 이 정도입니다.',
      ),
    )
  })
}
