import type { APIRoute } from 'astro'
import { getPublishedPosts } from '../lib/posts'

/*
  인기 글 목록을 그리는 데 쓰는 최소한의 표.

  홈의 「인기 글」은 조회수 순인데, 어느 글이 올라올지는 빌드할 때 알 수가
  없습니다 (128편 중 아무거나입니다). 그래서 주소·제목·날짜만 뽑아 둡니다 —
  브라우저가 `/api/views` 로 순서를 받아 이 표에서 제목을 찾습니다.

  ⚠ **`/search.json` 을 쓰지 않습니다.** 그쪽은 본문 앞부분까지 들어 있어
    83KB 입니다. 홈은 순서만 세우면 되므로 이 파일은 그것의 1/6 입니다.

  ⚠ 본문에서 아무것도 뽑지 않습니다 — 비밀글이 섞여 있어도 여기 나가는 것은
    이미 목록에 보이는 것(제목·날짜)뿐입니다 (§6-3 과 같은 규칙).

  `/admin` 의 조회수 판도 이 파일로 제목을 찾습니다 (§6-6). 조회수 API 는
  주소만 들고 있어서 제목을 알 방법이 없습니다.
*/
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()

  const items = posts.map((post) => ({
    s: post.id,
    t: post.data.title,
    d: post.data.pubDate.toISOString().slice(0, 10),
  }))

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
