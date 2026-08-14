import type { APIRoute } from 'astro'
import { getAuthor, getProject } from '../consts'
import { excerpt } from '../lib/excerpt'
import { getPublishedPosts } from '../lib/posts'

/*
  검색 색인.

  정적 사이트라 서버에서 찾아줄 수가 없습니다. 그래서 빌드할 때 글 목록을
  JSON 한 덩어리로 내보내고, 브라우저가 그걸 받아서 걸러냅니다.

  본문 전체는 넣지 않습니다 — 124편이면 몇 MB가 되고, 검색창을 열 때마다
  그걸 내려받게 됩니다. 제목·소개문·본문 앞부분(240자)까지만 넣습니다.

  ⚠ 비밀글은 본문에서 아무것도 뽑지 않습니다. 잠근 글의 앞부분을 색인에
    실으면 주소만 열어도 다 읽힙니다 (§6-3 과 같은 이유). 제목은 목록에
    이미 보이므로 그대로 둡니다.

  한국어는 형태소 분석 없이 **글자 포함**으로 찾습니다. "지뢰"로 "지뢰찾기"가
  걸립니다. 영어도 소문자로 맞춰서 같은 방식으로 봅니다.
*/
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts()

  const items = posts.map((post) => {
    const who = post.data.author ? getAuthor(post.data.author) : undefined
    const proj = post.data.project ? getProject(post.data.project) : undefined

    return {
      url: `/posts/${post.id}/`,
      title: post.data.title,
      desc: post.data.description ?? '',
      body: post.data.secret ? '' : excerpt(post.body, 240),
      author: who?.name ?? '',
      authorId: who?.id ?? '',
      color: who?.color ?? '',
      project: proj?.name ?? '',
      date: post.data.pubDate.toISOString().slice(0, 10),
      secret: post.data.secret === true,
    }
  })

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
