import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { AUTHOR_KINDS, CATEGORY_IDS, PROJECT_IDS } from './consts'

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),

      /**
       * 목록 카드에 보이는 한 줄 요약. 없으면 카드에서 그 줄이 빠집니다.
       * 티스토리에서 옮겨온 글에는 대부분 없습니다 — 있으면 좋고, 없어도 됩니다.
       */
      description: z.string().optional(),

      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      /** 글의 1차 분류. consts.ts 의 CATEGORIES 와 일치해야 합니다. */
      category: z.enum(CATEGORY_IDS).optional(),

      /** 어느 프로젝트의 devlog인지. 카테고리와 별개입니다(게임 글에만 붙습니다). */
      project: z.enum(PROJECT_IDS).optional(),

      /** 누가 썼는지. 기본값은 직접 쓴 글. */
      author: z.enum(AUTHOR_KINDS).default('me'),

      tags: z.array(z.string()).default([]),

      /** 초안 상태. true면 빌드에서 제외됩니다. */
      draft: z.boolean().default(false),

      heroImage: z.optional(image()),
    }),
})

export const collections = { posts }
