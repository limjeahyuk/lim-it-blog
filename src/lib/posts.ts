import { getCollection, type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>

/**
 * 발행된 글을 최신순으로 반환합니다.
 * draft: true 인 글은 프로덕션 빌드에서만 제외됩니다 (dev 에서는 보입니다).
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  )
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )
}

/** 태그별 글 개수 (많은 순) */
export function countByTag(posts: Post[]): [string, number][] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

/**
 * 카테고리별 글 개수.
 *
 * 자식 글도 부모에 얹습니다 — 'study' 를 누르면 'study/react' 글도 보여야
 * 하니까요. 그래서 합계가 전체 글 수보다 큽니다(부모에서 한 번 더 세므로).
 */
export function countByCategory(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const id = post.data.category
    if (!id) continue
    const parts = id.split('/')
    for (let i = 1; i <= parts.length; i++) {
      const key = parts.slice(0, i).join('/')
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return counts
}

/** 그 카테고리와 그 아래 전부의 글 (최신순) */
export function postsInCategory(posts: Post[], id: string): Post[] {
  return posts.filter(
    (p) => p.data.category === id || p.data.category?.startsWith(`${id}/`),
  )
}

/** 프로젝트별 글 개수 */
export function countByProject(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const post of posts) {
    if (post.data.project) {
      counts.set(post.data.project, (counts.get(post.data.project) ?? 0) + 1)
    }
  }
  return counts
}
