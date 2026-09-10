import rss from '@astrojs/rss'
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts'
import { excerpt, stripControl } from '../lib/excerpt'
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
    /*
      ⚠ 제목과 소개문에도 `stripControl` 을 겁니다. `excerpt` 는 이미
        걷어내지만 frontmatter 로 직접 적은 두 칸은 그쪽을 안 거칩니다 —
        제어문자 한 글자가 섞이면 **피드 전체가 파싱 실패**입니다
        (2026-09-10 · 자세한 건 `stripControl` 위에).
    */
    items: posts.map((post) => ({
      title: stripControl(post.data.title),
      /*
        ⚠ 빈 소개문으로 내보내지 않습니다. `excerpt` 가 코드 블록을 걷어내는데
          본문이 코드 하나뿐인 글이 있어서(`storyboard-63`) 뽑을 글자가
          없습니다 — 네이버는 `description` 이 빈 항목을 형식 오류로 봅니다.
          그때는 제목을 씁니다. **SITE_DESCRIPTION 으로 떨어뜨리지 마세요** —
          지면의 meta 는 그렇게 하지만, 피드에서는 그 글이 딴 이야기인 것처럼
          읽힙니다.
      */
      description: stripControl(
        post.data.description || excerpt(post.body) || post.data.title
      ),
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>ko-kr</language>',
  })
}
