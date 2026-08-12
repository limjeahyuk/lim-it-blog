import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { AUTHOR_KINDS, PROJECT_IDS } from './consts'

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      /** 어느 프로젝트의 devlog인지. 개인 개발 글이면 비워둡니다. */
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
