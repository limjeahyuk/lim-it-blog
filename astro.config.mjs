// @ts-check

import fs from 'node:fs'
import path from 'node:path'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig, fontProviders } from 'astro/config'

/**
 * 표를 `div.table-wrap` 으로 감싼다.
 * table 자체에 overflow 를 걸면 display:block 이 돼서 폭이 내용 크기로 줄어든다.
 * 래퍼에 걸어야 표가 100% 폭을 쓰면서 좁은 화면에서만 가로 스크롤된다.
 */
function rehypeWrapTables() {
  const walk = (node) => {
    if (!node.children) return
    node.children = node.children.map((child) => {
      walk(child)
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'] },
          children: [child],
        }
      }
      return child
    })
  }
  return (tree) => {
    walk(tree)
  }
}

/**
 * 코드 블록 위에 언어 이름과 「복사」를 답니다 (노션처럼).
 *
 * Shiki 가 뽑은 `<pre class="astro-code" data-language="swift">` 를
 * `<figure class="code">` 로 감싸고 그 위에 한 줄을 답니다.
 *
 * ⚠ **판 안에 겹쳐 놓지 않고 위에 답니다.** Shiki 는 배경색을
 *   `!important` 로 박아서, 머리 줄을 판 안에 넣으면 색을 맞출 수가
 *   없습니다. 코드 첫 줄과 겹치는 것도 피할 수 있습니다.
 * ⚠ 「복사」 단추는 눌러 주는 코드가 따로 있습니다 (PostLayout.astro).
 *   클립보드를 못 쓰는 곳에서는 그 코드가 단추를 감춥니다.
 */
function rehypeCodeChrome() {
  const HIDE_LABEL = ['plaintext', 'text', 'plain', 'txt']

  const wrap = (pre) => {
    const lang = (pre.properties && pre.properties.dataLanguage) || ''
    const head = {
      type: 'element',
      tagName: 'div',
      properties: { className: ['code-head'] },
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['code-lang'] },
          children: HIDE_LABEL.includes(String(lang)) ? [] : [{ type: 'text', value: String(lang) }],
        },
        {
          type: 'element',
          tagName: 'button',
          properties: { type: 'button', className: ['code-copy'], 'data-copy': true },
          children: [{ type: 'text', value: '복사' }],
        },
      ],
    }
    return {
      type: 'element',
      tagName: 'figure',
      properties: { className: ['code'] },
      children: [head, pre],
    }
  }

  const walk = (node) => {
    if (!node.children) return
    node.children = node.children.map((child) => {
      walk(child)
      if (child.type === 'element' && child.tagName === 'pre') return wrap(child)
      return child
    })
  }
  return (tree) => {
    walk(tree)
  }
}

/**
 * 글 주소마다 마지막으로 손댄 날짜를 모읍니다 (사이트맵의 `lastmod`).
 *
 * 안 적으면 검색엔진이 131편을 언제 다시 긁을지 판단할 근거가 없습니다.
 * 값은 `updatedDate ?? pubDate` — **실제로 파일에 적힌 날짜만** 씁니다.
 * 빌드 시각을 넣으면 배포할 때마다 전부 "오늘 바뀜"이 되고, 구글은 그렇게
 * 늘 거짓말하는 lastmod 를 통째로 무시합니다.
 *
 * ⚠ 여기서 frontmatter 를 직접 읽습니다. astro.config 는 `astro:content` 를
 *   못 불러서(설정이 먼저 로드됩니다) 파일을 여는 것 말고 길이 없습니다.
 *   그래서 **주소 모양(`/posts/<slug>/`)을 여기서 한 번 더 알고 있습니다** —
 *   §3 의 slug 규칙이 바뀌면 이 함수도 같이 보세요. 못 찾은 글은 lastmod 만
 *   빠지고 사이트맵에는 그대로 남습니다 (빌드를 깨지 않습니다).
 */
function postLastmod() {
  const dir = './src/content/posts'
  const map = new Map()

  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue

    const head = fs.readFileSync(path.join(dir, file), 'utf-8').split('---')[1]
    if (!head) continue

    const pick = (key) => head.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1].trim()

    const slug = pick('slug')
    const date = pick('updatedDate') ?? pick('pubDate')
    if (!slug || !date) continue

    const d = new Date(date)
    if (!Number.isNaN(d.getTime())) map.set(`/posts/${slug}/`, d.toISOString())
  }

  return map
}

const LASTMOD = postLastmod()

// https://astro.build/config
export default defineConfig({
  site: 'https://lim-it.vercel.app',
  integrations: [
    mdx(),
    sitemap({
      /**
       * ⚠ `/search` 를 뺍니다. 결과가 브라우저에서 채워지는 지면이라
       *   검색엔진이 받아 가는 HTML 에는 빈 입력칸뿐입니다.
       *   `search.astro` 의 noindex 와 한 쌍입니다 — 둘 다 있어야 합니다
       *   (사이트맵에서 빼는 것은 "긁지 말라"가 아니라 "권하지 않는다"입니다).
       */
      filter: (page) => !page.includes('/search'),
      serialize: (item) => {
        const lastmod = LASTMOD.get(new URL(item.url).pathname)
        return lastmod ? { ...item, lastmod } : item
      },
    }),
  ],

  markdown: {
    rehypePlugins: [rehypeWrapTables, rehypeCodeChrome],
    shikiConfig: {
      // 라이트/다크 두 벌을 CSS 변수로 내보내고, global.css에서 테마에 따라 고릅니다.
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      defaultColor: false,
      wrap: false,
    },
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Pretendard',
      cssVariable: '--font-pretendard',
      fallbacks: [
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'sans-serif',
      ],
      options: {
        variants: [
          {
            // 가변 폰트 한 벌로 100~900 전 굵기를 커버합니다.
            // 라이선스: SIL OFL 1.1 — src/assets/fonts/Pretendard-LICENSE.txt
            src: ['./src/assets/fonts/PretendardVariable.woff2'],
            weight: '100 900',
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
})
