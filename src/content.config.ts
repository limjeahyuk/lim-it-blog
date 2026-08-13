import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { AUTHOR_IDS, PROJECT_IDS } from './consts'

/**
 * 빈 문자열을 「값 없음」으로 봅니다.
 *
 * /admin 에서 선택 필드를 골랐다가 지우면 키가 사라지지 않고 `category: ''`
 * 로 남습니다. 그대로 두면 enum 검증에서 걸려 빌드가 통째로 깨지는데,
 * 폰에서 게시한 사람은 Vercel 로그를 볼 방법이 없어서 왜 글이 안 올라오는지
 * 알 수가 없습니다. 오타는 여전히 잡히고, 「비어 있음」만 통과시킵니다.
 */
const blankAsUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema)

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),

      /**
       * 목록 카드에 보이는 한 줄 요약. 없으면 카드에서 그 줄이 빠집니다.
       * 티스토리에서 옮겨온 글에는 대부분 없습니다 — 있으면 좋고, 없어도 됩니다.
       */
      description: blankAsUndefined(z.string().optional()),

      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      /**
       * 누가 쓴 글인가. consts.ts 의 AUTHORS 와 일치해야 합니다.
       * 이 사이트의 **유일한 분류**입니다 — 카테고리와 태그는 없앴습니다.
       */
      author: blankAsUndefined(z.enum(AUTHOR_IDS).optional()),

      /** 어느 프로젝트의 devlog인지. 저자와 별개입니다(만든 것 글에만 붙습니다). */
      project: blankAsUndefined(z.enum(PROJECT_IDS).optional()),

      /** 초안 상태. true면 빌드에서 제외됩니다. */
      draft: z.boolean().default(false),

      /**
       * 비밀글. 본문을 빌드할 때 잠그고 비밀번호를 넣어야 열립니다.
       *
       * **제목·날짜·요약·저자는 그대로 보입니다.** 목록에 자물쇠만 붙습니다.
       * 감춰야 할 내용은 본문에만 쓰세요.
       */
      secret: z.boolean().default(false),

      heroImage: z.optional(image()),
    }),
})

export const collections = { posts }
