import rss from '@astrojs/rss'
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts'
import { excerpt } from '../lib/excerpt'
import { getPublishedPosts } from '../lib/posts'

export async function GET(context) {
  /*
    비밀글은 피드에서 뺍니다. 피드 리더는 자물쇠를 물어봐 주지 않으므로
    제목만 흘리고 본문은 못 읽는 항목이 남습니다. 그럴 바엔 안 내보냅니다.
  */
  const posts = (await getPublishedPosts()).filter((post) => !post.data.secret)

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || excerpt(post.body),
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>ko-kr</language>',
  })
}
