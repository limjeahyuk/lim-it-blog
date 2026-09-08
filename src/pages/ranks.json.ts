import type { APIRoute } from 'astro'
import { getAuthor } from '../consts'
import { coverOf } from '../lib/cover'
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

  ⚠ **최신순입니다.** 홈이 「더 읽을 글」을 다시 채울 때 이 차례를 그대로
    씁니다 — 정렬을 바꾸면 거기가 같이 틀어집니다.

  ⚠ 커버(c)와 저자(n·k)는 2026-09-08 에 더했습니다. 홈의 인기 글이 카드가
    되면서 사진과 저자 이름까지 갈아 끼워야 했습니다. `coverOf` 는 비밀글의
    본문을 안 뒤지므로(§6-3) 그 글은 c 가 빈 문자열입니다.
*/
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()

  const items = posts.map((post) => {
    const cover = coverOf(post)
    const who = post.data.author ? getAuthor(post.data.author) : undefined

    return {
      s: post.id,
      t: post.data.title,
      d: post.data.pubDate.toISOString().slice(0, 10),
      /* 커버는 공개 경로나 Cloudinary 주소입니다 — 없으면 빈 문자열이고,
         받는 쪽이 저자 색 판(.blank)으로 채웁니다 */
      c: cover.kind === 'file' ? cover.src : '',
      n: who?.name ?? '',
      k: who?.color ?? '',
    }
  })

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
