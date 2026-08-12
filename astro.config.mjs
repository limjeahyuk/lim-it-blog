// @ts-check

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

// https://astro.build/config
export default defineConfig({
  site: 'https://lim-it-blog.vercel.app',
  integrations: [mdx(), sitemap()],

  markdown: {
    rehypePlugins: [rehypeWrapTables],
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
