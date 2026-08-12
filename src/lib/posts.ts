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
