#!/usr/bin/env node
/**
 * limSystem 아이콘을 블로그로 가져옵니다.
 *
 *   node scripts/sync-icons.mjs          # 기본 경로에서
 *   node scripts/sync-icons.mjs <경로>    # limSystem 저장소 경로 지정
 *
 * limSystem 은 별도 Next.js 앱(private: true)이라 패키지로 못 가져옵니다.
 * 컴포넌트(React)는 Astro 에서 못 쓰지만 SVG 는 그대로 쓸 수 있어서,
 * 아이콘만 복사하고 이름 목록을 타입으로 뽑아 둡니다.
 *
 * 폴더가 둘입니다.
 *   src/assets/icons/        ← limSystem 사본. 이 스크립트가 통째로 갈아엎습니다.
 *   src/assets/icons-extra/  ← limSystem 에 없어서 손으로 넣은 것. 건드리지 않습니다.
 *
 * 원본이 바뀌면 이걸 다시 돌리세요. tokens.css 는 손으로 맞춰야 합니다.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir } from 'node:os'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')

const src =
  process.argv[2] ??
  join(homedir(), 'Develop/React/limSystem/src/assets/icons')

const dest = join(root, 'src/assets/icons')
const extra = join(root, 'src/assets/icons-extra')
const typeFile = join(root, 'src/lib/icon-names.ts')

const svgsIn = (dir) => {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.svg'))
      .sort()
  } catch {
    return []
  }
}

const files = svgsIn(src)

if (files.length === 0) {
  console.error(`limSystem 아이콘 폴더에서 SVG 를 못 찾았습니다: ${src}`)
  console.error('경로를 인자로 넘겨보세요: node scripts/sync-icons.mjs <경로>')
  process.exit(1)
}

rmSync(dest, { recursive: true, force: true })
mkdirSync(dest, { recursive: true })

for (const file of files) {
  writeFileSync(join(dest, file), readFileSync(join(src, file)))
}

const limNames = files.map((f) => f.replace(/\.svg$/, ''))
const extraNames = svgsIn(extra).map((f) => f.replace(/\.svg$/, ''))

// 같은 이름이 양쪽에 있으면 Icon.astro 가 어느 걸 그릴지 애매해집니다.
const clash = extraNames.filter((n) => limNames.includes(n))
if (clash.length > 0) {
  console.error(
    `이름이 겹칩니다: ${clash.join(', ')}\n` +
      `limSystem 에 같은 이름이 생겼습니다. icons-extra 쪽을 지우세요.`,
  )
  process.exit(1)
}

const line = (n) => `  '${n}',`

writeFileSync(
  typeFile,
  `// 이 파일은 자동 생성됩니다. 직접 고치지 마세요.
// 만드는 곳: scripts/sync-icons.mjs  (npm run icons)

/** limSystem 사본 — src/assets/icons/ (${limNames.length}개) */
export const LIM_ICON_NAMES = [
${limNames.map(line).join('\n')}
] as const

/** limSystem 에 없어서 손으로 넣은 것 — src/assets/icons-extra/ (${extraNames.length}개) */
export const EXTRA_ICON_NAMES = [
${extraNames.map(line).join('\n')}
] as const

export const ICON_NAMES = [...LIM_ICON_NAMES, ...EXTRA_ICON_NAMES] as const

export type IconName =
  | (typeof LIM_ICON_NAMES)[number]
  | (typeof EXTRA_ICON_NAMES)[number]
`,
)

console.log(`limSystem 아이콘 ${limNames.length}개 → ${dest}`)
console.log(`직접 넣은 아이콘 ${extraNames.length}개는 그대로 뒀습니다 → ${extra}`)
console.log(`이름 목록: ${typeFile}`)
