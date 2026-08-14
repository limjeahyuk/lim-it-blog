import type { Post } from './posts'

/**
 * 글의 커버 사진.
 *
 * `heroImage` 를 따로 지정한 글이 하나도 없습니다. 그런데 티스토리에서
 * 받아온 사진 420장이 `public/images/<주소>/` 에 있고, 124편 중 91편이
 * 본문에 사진을 씁니다 — 커버로 쓸 것이 이미 있는 셈입니다.
 *
 * 그래서 순서대로 찾습니다.
 *
 *   1. frontmatter 의 `heroImage`  (손으로 고른 것)
 *   2. 본문에 나오는 첫 사진
 *   3. 없음 — 그리는 쪽에서 저자 색 판으로 채웁니다
 *
 * ⚠ 비밀글은 본문을 뒤지지 않습니다. 잠긴 본문에서 뽑은 사진을 목록에
 *   띄우면 잠근 의미가 없습니다 (§6-3 과 같은 이유).
 */
/** 마크다운 `![alt](주소)` 와 본문에 직접 쓴 `<img src="주소">` 둘 다 봅니다. */
const MD_IMAGE = /!\[[^\]]*\]\(\s*([^)\s]+)/
const HTML_IMAGE = /<img[^>]+src\s*=\s*["']([^"']+)["']/i

export function firstBodyImage(body: string | undefined): string | undefined {
  if (!body) return undefined

  // 코드 블록 안의 예제는 사진이 아닙니다.
  const text = body.replace(/```[\s\S]*?```/g, ' ')

  const url = MD_IMAGE.exec(text)?.[1] ?? HTML_IMAGE.exec(text)?.[1]
  if (!url) return undefined

  // 바깥 주소는 안 씁니다 — 티스토리 CDN 주소는 만료되면 404 입니다 (§5-2).
  return url.startsWith('/') ? url : undefined
}

export type Cover =
  | { kind: 'asset'; src: ImageMetadata }
  | { kind: 'file'; src: string }
  /** 쓸 사진이 없습니다. 그리는 쪽에서 색 판으로 채웁니다. */
  | { kind: 'none' }

export function coverOf(post: Post): Cover {
  if (post.data.heroImage) {
    return { kind: 'asset', src: post.data.heroImage }
  }
  if (!post.data.secret) {
    const found = firstBodyImage(post.body)
    if (found) return { kind: 'file', src: found }
  }
  return { kind: 'none' }
}
