/*
  조회수 판 — /admin 목록 화면.

  조회수는 **읽는 사람한테 안 보입니다** (§6-6). 홈이 인기순으로 줄을 세우는
  데 쓰는 것은 순서뿐이고, 숫자를 보는 곳은 여기 하나입니다.

  ⚠ **머리띠에 단추를 더 달지 않았습니다.** 폰(375px)에서 머리띠는 이미
    이름·쓰다 만 글·해달·새 글·아바타로 꽉 차 있습니다 (§6-2). 그래서
    목록 화면의 「128개」 옆에 답니다 — 어차피 글 목록을 보다가 누르는
    것이라 자리가 맞습니다.

  ⚠ **열쇠(VIEWS_TOKEN)를 이 브라우저에 남깁니다.** 정적 페이지라 서버에서
    로그인 여부를 물어볼 데가 없습니다. 비밀글 비밀번호와 같은 방식입니다
    (§6-3) — 한 번 넣으면 다음부터 안 묻고, 「열쇠 지우기」로 지웁니다.

  ⚠ **로컬에서는 안 됩니다.** `npm run cms`·`astro dev` 에는 `/api` 가 없어서
    404 입니다. 그때는 그렇게 적어 줍니다 — 열쇠가 틀린 것과 구분이 안 되면
    배포에서 헤맵니다.
*/

const TOKEN_KEY = 'lim.views.token'

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
    /* 사생활 보호 창 — 이번 판에서만 쓰고 맙니다 */
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

/**
 * 숫자와 제목을 같이 받아옵니다.
 *
 * 조회수 API 는 주소만 들고 있어서 제목을 모릅니다 — 빌드할 때 나가는
 * `/ranks.json` 에서 찾습니다 (홈의 인기 글이 쓰는 것과 같은 파일).
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

  let titles = new Map()
  try {
    const rows = await fetch('/ranks.json').then((r) => (r.ok ? r.json() : null))
    if (Array.isArray(rows)) for (const row of rows) titles.set(row.s, row.t)
  } catch (e) {
    /* 제목을 못 찾으면 주소를 그대로 보여 줍니다 */
  }

  const rows = Object.keys(data.views)
    .map((slug) => ({
      slug,
      n: data.views[slug],
      title: titles.get(slug) || '',
    }))
    .sort((a, b) => b.n - a.n)

  return { rows, total: data.total || 0, store: data.store !== false }
}

function closeViewsPanel() {
  const panel = document.querySelector('.lim-views')
  if (panel && panel.parentNode) panel.parentNode.removeChild(panel)
}

/** 열쇠를 묻는 줄. 넣으면 그 자리에서 다시 받아옵니다. */
function askToken(list, bad) {
  const box = el('div', 'lim-views-ask')
  box.appendChild(
    el(
      'p',
      'lim-views-empty',
      bad
        ? '열쇠가 맞지 않습니다. 다시 넣어 주세요 (Vercel 의 VIEWS_TOKEN).'
        : 'Vercel 에 넣어 둔 VIEWS_TOKEN 을 한 번만 넣으면 됩니다.',
    ),
  )

  const input = el('input', 'lim-views-key')
  input.type = 'password'
  input.placeholder = '열쇠'
  input.autocomplete = 'off'

  const go = el('button', 'lim-views-close', '확인')
  go.type = 'button'
  const submit = () => {
    const value = input.value.trim()
    if (!value) return
    setToken(value)
    openViewsPanel()
  }
  go.addEventListener('click', submit)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit()
  })

  const line = el('div', 'lim-views-askline')
  line.appendChild(input)
  line.appendChild(go)
  box.appendChild(line)
  list.appendChild(box)
  setTimeout(() => input.focus(), 0)
}

export function openViewsPanel() {
  closeViewsPanel()

  const panel = el('div', 'lim-views')
  const back = el('div', 'lim-views-back')
  back.addEventListener('click', closeViewsPanel)

  const card = el('div', 'lim-views-card')
  card.setAttribute('role', 'dialog')
  card.setAttribute('aria-modal', 'true')
  card.setAttribute('aria-label', '조회수')
  card.setAttribute('tabindex', '-1')
  card.appendChild(el('h3', 'lim-views-title', '조회수'))
  const hint = el(
    'p',
    'lim-views-hint',
    '읽는 사람한테는 안 보입니다. 홈의 「인기 글」 순서에만 씁니다.',
  )
  card.appendChild(hint)

  const list = el('div', 'lim-views-list')
  list.appendChild(el('p', 'lim-views-empty', '받아오는 중…'))
  card.appendChild(list)

  const foot = el('div', 'lim-views-foot')
  const forget = el('button', 'lim-views-del', '열쇠 지우기')
  forget.type = 'button'
  forget.hidden = !token()
  forget.addEventListener('click', () => {
    setToken('')
    openViewsPanel()
  })
  const close = el('button', 'lim-views-close', '닫기')
  close.type = 'button'
  close.addEventListener('click', closeViewsPanel)
  foot.appendChild(forget)
  foot.appendChild(close)
  card.appendChild(foot)

  panel.appendChild(back)
  panel.appendChild(card)
  document.body.appendChild(panel)
  card.focus()

  load().then((data) => {
    /* 그새 닫혔으면 그립니다 말고 그냥 둡니다 */
    if (!document.body.contains(card)) return
    list.textContent = ''

    if (data.need === 'token') {
      askToken(list, data.bad)
      forget.hidden = true
      return
    }
    if (data.error) {
      list.appendChild(el('p', 'lim-views-empty', data.error))
      return
    }
    if (!data.rows.length) {
      /* ⚠ 빈 표에는 두 가지가 섞여 있습니다 — 아직 아무도 안 읽은 것과,
         셀 데(Upstash)가 아예 안 붙어 있는 것. 뒤엣것을 "안 읽었습니다" 로
         적으면 홈이 왜 「최신 글」에 머물러 있는지 알 방법이 없습니다. */
      list.appendChild(
        el(
          'p',
          'lim-views-empty',
          data.store
            ? '아직 아무도 안 읽었습니다.'
            : '셀 데가 안 붙어 있습니다 — Vercel 에 Upstash 환경변수' +
                '(KV_REST_API_URL · KV_REST_API_TOKEN)를 넣고 다시 배포하세요.',
        ),
      )
      return
    }

    hint.textContent =
      '읽는 사람한테는 안 보입니다. 모두 ' +
      data.total.toLocaleString('ko-KR') +
      '번 · 글 ' +
      data.rows.length +
      '편'

    for (const row of data.rows) {
      const item = el('div', 'lim-views-row')
      const left = el('div', 'lim-views-name')
      left.appendChild(el('b', null, row.title || row.slug))
      left.appendChild(el('span', null, row.slug))
      item.appendChild(left)
      item.appendChild(el('span', 'lim-views-n', row.n.toLocaleString('ko-KR')))
      list.appendChild(item)
    }
  })
}

/** Esc 로 닫습니다 (쓰다 만 글 판과 같습니다 — skin.js 의 키 처리). */
export function viewsPanelOpen() {
  return !!document.querySelector('.lim-views')
}

export { closeViewsPanel }
