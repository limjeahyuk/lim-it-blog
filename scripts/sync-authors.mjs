#!/usr/bin/env node
/**
 * 에디터 목록을 `/admin` 쪽으로 옮겨 적습니다.
 *
 *   node scripts/sync-authors.mjs
 *
 * 값의 원본은 `src/data/authors.json` 하나입니다 (`/admin` 의 「에디터」가
 * 고치는 파일). 블로그는 그 파일을 그대로 읽지만, `/admin` 쪽 둘은 읽을
 * 방법이 없어서 여기서 채워 넣습니다.
 *
 *   public/admin/config.yml   글의 「저자」 목록 (알약이 여기서 나옵니다)
 *   admin-src/authors.gen.js  목록 화면의 「작성자」 칸에 쓰는 id → 이름
 *
 * 왜 읽을 방법이 없나 — `config.yml` 의 select 는 **정적**입니다. Decap 은
 * options 를 다른 파일에서 끌어오지 못합니다. relation 위젯이면 되는데,
 * 그러면 저자 알약(skin.js 가 select 위젯을 갈아끼운 것)이 통째로 안
 * 그려집니다. 목록 화면은 아예 위젯이 없는 자리입니다.
 *
 * ⚠ 그래서 **폰에서 에디터를 더하면 그 다음 배포까지는 글에 못 붙입니다.**
 *   `npm run admin` 이 dev·build 앞에 붙어 있어서 배포 한 번이면 따라옵니다
 *   (Vercel 은 package.json 의 build 를 부릅니다).
 *
 * ⚠ 이 스크립트는 config.yml 을 통째로 다시 쓰지 않습니다. 아래 표시
 *   사이만 갈아 끼웁니다 — 그 파일에는 손으로 적은 설명이 훨씬 많습니다.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')

const dataFile = resolve(root, 'src/data/authors.json')
const configFile = resolve(root, 'public/admin/config.yml')
const genFile = resolve(root, 'admin-src/authors.gen.js')

const BEGIN = '# <lim:authors> — scripts/sync-authors.mjs 가 채웁니다. 손으로 고치지 마세요.'
const END = '# </lim:authors>'

const authors = (JSON.parse(readFileSync(dataFile, 'utf8')).authors ?? []).filter(
  (a) => a && a.id,
)

if (!authors.length) {
  /* 한 명도 없으면 글에 저자를 못 고릅니다. 지우고 배포되는 것보다
     여기서 멈추는 편이 낫습니다 — 되돌릴 자리가 이 파일 하나입니다. */
  console.error('에디터가 한 명도 없습니다 — src/data/authors.json 을 확인하세요.')
  process.exit(1)
}

/** YAML 한 줄에 안전하게 넣습니다. 이름에 따옴표·콜론이 들어올 수 있습니다. */
const q = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'

/* ── 1. config.yml 의 「저자」 목록 ─────────────────────────────────── */

const options = authors
  .map((a) => `          - { label: ${q(a.name || a.id)}, value: ${q(a.id)} }`)
  .join('\n')

const config = readFileSync(configFile, 'utf8')
const begin = config.indexOf(BEGIN)
const end = config.indexOf(END)

if (begin < 0 || end < 0 || end < begin) {
  console.error(`${configFile} 에서 <lim:authors> 표시를 못 찾았습니다.`)
  process.exit(1)
}

const next =
  config.slice(0, begin + BEGIN.length) +
  '\n' +
  options +
  '\n          ' +
  config.slice(end)

if (next !== config) writeFileSync(configFile, next)

/* ── 2. 목록 화면이 쓰는 id → 이름 ─────────────────────────────────── */

writeFileSync(
  genFile,
  `/* 자동 생성 — scripts/sync-authors.mjs. 손으로 고치지 마세요.
   원본은 src/data/authors.json 이고 /admin 의 「에디터」가 고칩니다. */

export const AUTHOR_NAMES = {
${authors.map((a) => `  ${JSON.stringify(a.id)}: ${JSON.stringify(a.name || a.id)},`).join('\n')}
}
`,
)

console.log(
  `에디터 ${authors.length}명 → public/admin/config.yml · admin-src/authors.gen.js`,
)
