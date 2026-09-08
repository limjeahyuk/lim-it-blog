// 조회수.
//
// 정적 사이트라 숫자를 셀 데가 없습니다. 그래서 Upstash Redis 해시 하나
// (`views`)에 slug 별로 세어 두고, 이 함수가 그 앞을 지킵니다.
//
//   POST /api/views          {slug}      → 하나 올리고 **올린 뒤의 값**
//   GET  /api/views?slug=<s>             → 그 글 하나의 조회수
//   GET  /api/views                      → 인기순 slug 목록 (숫자 없음)
//   GET  /api/views?full=1               → 전체 표. 토큰이 있어야 합니다
//
// ⚠ **2026-09-08 에 규칙이 바뀌었습니다.** 그전에는 숫자를 아무에게도 안
//   주고(POST 는 204, 공개 GET 은 순서만) `/admin` 에서 열쇠를 넣어야 볼 수
//   있었습니다. 시안이 글 머리에 조회수를 찍어 놔서, **글 한 편의 숫자**는
//   공개로 열었습니다.
//
// ⚠ **여전히 전체 표는 안 줍니다.** `full=1` + 토큰만 `views`(주소별 숫자
//   전부)와 `total` 을 받습니다. 한 편씩 물어보는 것과 131편을 통째로 받아
//   가는 것은 다른 이야기입니다.
//
// 필요한 환경변수 (Vercel):
//   KV_REST_API_URL   / KV_REST_API_TOKEN      ← Vercel 마켓플레이스 Upstash
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  ← Upstash 콘솔에서 직접
//   VIEWS_TOKEN                                ← 숫자를 보는 열쇠 (/admin)

import { timingSafeEqual } from 'node:crypto'

const HASH = 'views'

/* config.yml 의 「주소」 칸과 같은 규칙입니다. 아무 글자나 받으면 해시에
   쓰레기 열쇠가 쌓입니다. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function creds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ''), token }
}

/** Upstash 는 REST 로 명령 하나를 배열로 받습니다 — SDK 를 넣을 필요가 없습니다. */
async function redis(command) {
  const c = creds()
  if (!c) return null

  const res = await fetch(c.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  const body = await res.json().catch(() => null)
  if (!res.ok || !body || body.error) {
    throw new Error(`upstash ${res.status} ${(body && body.error) || ''}`.trim())
  }
  return body.result
}

/* HGETALL 은 [열쇠, 값, 열쇠, 값…] 로 옵니다. 버전에 따라 객체로 오기도 해서
   둘 다 받습니다. */
function toCounts(raw) {
  const out = {}
  if (!raw) return out
  if (Array.isArray(raw)) {
    for (let i = 0; i + 1 < raw.length; i += 2) {
      out[String(raw[i])] = Number(raw[i + 1]) || 0
    }
    return out
  }
  for (const k of Object.keys(raw)) out[k] = Number(raw[k]) || 0
  return out
}

/** 길이가 다르면 timingSafeEqual 이 던지므로 먼저 거릅니다. */
function sameToken(given, want) {
  const a = Buffer.from(String(given))
  const b = Buffer.from(String(want))
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function slugOf(req) {
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return ''
    }
  }
  const slug = body && typeof body.slug === 'string' ? body.slug : ''
  return slug.length <= 80 && SLUG.test(slug) ? slug : ''
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const slug = slugOf(req)
      if (!slug) {
        res.status(400).json({ error: '주소가 올바르지 않습니다.' })
        return
      }
      if (!creds()) {
        res.status(501).json({ error: 'Upstash 환경변수가 없습니다.' })
        return
      }
      /* HINCRBY 는 올린 뒤의 값을 돌려줍니다 — 한 번 더 물어볼 필요가 없습니다. */
      const views = Number(await redis(['HINCRBY', HASH, slug, 1])) || 0
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ views })
      return
    }

    if (req.method === 'GET') {
      const query = req.query || {}
      const full = query.full === '1'

      /*
        글 한 편의 숫자. 오늘 이미 센 기기가 숫자만 물어볼 때 씁니다
        (PostLayout 의 script). 없는 글이면 0 입니다 — 함수는 글 목록을
        모르기 때문에 "없는 주소"와 "아직 아무도 안 읽은 글"을 구분할
        방법이 없습니다.
      */
      const one = typeof query.slug === 'string' ? query.slug : ''
      if (one) {
        if (one.length > 80 || !SLUG.test(one)) {
          res.status(400).json({ error: '주소가 올바르지 않습니다.' })
          return
        }
        const raw = creds() ? await redis(['HGET', HASH, one]) : null
        /* 홈의 순위표와 같은 5분 캐시입니다 — 조회수가 5분 늦게 움직이는
           것은 아무 문제가 없고, 글마다 Redis 를 깨우지 않습니다. */
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=300, stale-while-revalidate=3600',
        )
        res.status(200).json({ views: Number(raw) || 0 })
        return
      }

      if (full) {
        const want = process.env.VIEWS_TOKEN
        const given = String(req.headers.authorization || '').replace(
          /^Bearer\s+/i,
          '',
        )
        if (!want || !given || !sameToken(given, want)) {
          res.setHeader('Cache-Control', 'no-store')
          res.status(403).json({ error: '열쇠가 맞지 않습니다.' })
          return
        }
      }

      /* ⚠ 환경변수가 없으면 빈 목록입니다 — 홈이 최신순 그대로 남습니다.
         500 을 내면 홈 콘솔에 빨간 줄이 남는데, 여기서는 "아직 세는 곳이
         없다" 가 맞는 상태입니다. */
      const counts = toCounts(creds() ? await redis(['HGETALL', HASH]) : null)
      const order = Object.keys(counts).sort((a, b) => counts[b] - counts[a])

      if (full) {
        res.setHeader('Cache-Control', 'no-store')
        res.status(200).json({
          order,
          views: counts,
          total: order.reduce((sum, k) => sum + counts[k], 0),
          /* ⚠ **"아직 아무도 안 읽었다" 와 "셀 데가 없다" 는 다릅니다.**
             둘 다 빈 표로 오기 때문에, `/admin` 이 그걸 구분해서 말할 수
             있게 저장소가 붙어 있는지를 같이 보냅니다. 열쇠를 넣은
             사람에게만 나가는 응답이라 여기에 둡니다. */
          store: !!creds(),
        })
        return
      }

      /* 홈이 매번 Redis 를 깨우지 않게 5분 캐시합니다. 순위가 5분 늦게
         움직이는 것은 아무 문제가 없습니다. */
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=300, stale-while-revalidate=3600',
      )
      res.status(200).json({ order })
      return
    }

    res.setHeader('Allow', 'GET, POST')
    res.status(405).end()
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(500).json({ error: String((e && e.message) || e) })
  }
}
