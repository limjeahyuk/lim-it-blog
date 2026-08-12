#!/usr/bin/env node
/**
 * 티스토리 글을 이 블로그로 옮깁니다. (2026-08-12 이관용, 한 번 쓰고 끝)
 *
 *   node scripts/import-tistory.mjs --dry      # 안 쓰고 목록만
 *   node scripts/import-tistory.mjs            # 전부 가져오기
 *   node scripts/import-tistory.mjs 122 121    # 글 번호 지정
 *
 * 왜 RSS 가 아니라 sitemap 인가 — /rss 는 최근 10개만 줍니다(설정에서 올려도
 * 50개가 한계). /sitemap.xml 에는 글 주소가 전부 들어 있어서 거기서 목록을
 * 뽑고 각 페이지를 읽습니다.
 *
 * ⚠ 이미지는 반드시 받아옵니다. 티스토리 CDN 주소가 서명된 URL 이라
 *   (`?credential=...&expires=...&signature=...`) 주소만 복사해두면
 *   만료일 뒤에 전부 404 가 됩니다. 서명을 뗀 주소도 404 입니다.
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

const BLOG = 'https://hyuk-todayfeelsogood.tistory.com'
const UA = 'Mozilla/5.0'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const POSTS = join(root, 'src/content/posts')
const IMAGES = join(root, 'public/images')

/** 티스토리 카테고리 → src/consts.ts 의 CATEGORIES id */
const CATEGORY_MAP = {
  Study: 'study',
  'Study/React': 'study/react',
  'Study/React-school': 'study/react-school',
  'Study/React 간단 정리': 'study/react-notes',
  'Study/Javascript': 'study/javascript',
  'Study/Flutter': 'study/flutter',
  'Study/Android-school': 'study/android-school',
  IOS: 'ios',
  'IOS/swiftUI': 'ios/swiftui',
  'IOS/storyboard': 'ios/storyboard',
  'IOS/SDK': 'ios/sdk',
  'IOS/Beep Timer': 'ios/beeptimer',
  'IOS/StudyDiary': 'ios/study-diary',
  Diary: 'diary',
}

/**
 * 티스토리에서 카테고리를 안 달아둔 글 5개. 제목을 보고 손으로 정했습니다.
 * 추측이 섞인 곳이라 여기 모아둡니다 — 틀렸으면 이 표만 고치면 됩니다.
 */
const UNCATEGORIZED = {
  52: 'study/javascript', // express 비동기 동기 promise 사용.
  61: 'ios/storyboard', // [storyboard] swift로 todoList 만들기 #3
  79: 'ios', // swift 모듈화
  90: 'ios/sdk', // pod lib create를 이용한 sdk 코드 작성
  111: 'study', // 간단한 정리 and 막무가내 2
}

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*',
})

// 티스토리 코드블록은 <pre data-ke-language="javascript"> 라 언어가 살아 있습니다.
td.addRule('tistoryCode', {
  filter: (n) => n.nodeName === 'PRE' && n.getAttribute('data-ke-type') === 'codeblock',
  replacement: (_c, n) =>
    `\n\n\`\`\`${n.getAttribute('data-ke-language') ?? ''}\n` +
    `${n.textContent.replace(/\n+$/, '')}\n\`\`\`\n\n`,
})

// 에디터가 넣는 빈 문단(&nbsp; 하나)은 버립니다.
td.addRule('emptyP', {
  filter: (n) => n.nodeName === 'P' && n.textContent.replace(/ |\s/g, '') === '',
  replacement: () => '',
})

const get = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function postIds() {
  const xml = await (await get(`${BLOG}/sitemap.xml`)).text()
  const ids = [...xml.matchAll(/tistory\.com\/(\d+)</g)].map((m) => Number(m[1]))
  return [...new Set(ids)].sort((a, b) => a - b)
}

const extOf = (url) => {
  const m = url.split('?')[0].match(/\.(png|jpe?g|gif|webp|svg)$/i)
  return m ? m[1].toLowerCase() : 'png'
}

const yaml = (s) => `'${String(s).replace(/'/g, "''")}'`

async function convert(id, { dry }) {
  const html = await (await get(`${BLOG}/${id}`)).text()
  const doc = new JSDOM(html).window.document

  const meta = (p) =>
    doc.querySelector(`meta[property="${p}"]`)?.getAttribute('content') ?? ''

  const title = meta('og:title')
  const pubDate = meta('article:published_time').slice(0, 10)

  // 오래된 글은 tt_article_useless_p_margin 없이 contents_style 만 있습니다.
  const body =
    doc.querySelector('.tt_article_useless_p_margin') ??
    doc.querySelector('.contents_style')
  if (!body) throw new Error('본문을 못 찾았습니다')

  const raw = doc.querySelector('.category')?.textContent.trim() ?? ''
  const category = CATEGORY_MAP[raw] ?? UNCATEGORIZED[id]
  if (!category) throw new Error(`카테고리를 못 정했습니다: "${raw}"`)

  const slug = `${category.split('/').pop()}-${id}`

  // 이미지를 먼저 내려받고 본문의 주소를 바꿔치웁니다.
  const imgs = [...body.querySelectorAll('img')]
  let saved = 0
  for (const [i, img] of imgs.entries()) {
    const src = img.getAttribute('src')
    if (!src?.startsWith('http')) continue
    const file = `${i + 1}.${extOf(src)}`
    if (!dry) {
      const dir = join(IMAGES, slug)
      mkdirSync(dir, { recursive: true })
      const buf = Buffer.from(await (await get(src)).arrayBuffer())
      writeFileSync(join(dir, file), buf)
    }
    img.setAttribute('src', `/images/${slug}/${file}`)
    img.removeAttribute('srcset')
    saved++
  }

  const md = td.turndown(body.innerHTML).replace(/\n{3,}/g, '\n\n').trim()

  const front = [
    '---',
    `title: ${yaml(title)}`,
    `pubDate: ${pubDate}`,
    `category: ${category}`,
    'author: me',
    'tags: []',
    'draft: false',
    `# 티스토리에서 옮겨왔습니다: ${BLOG}/${id}`,
    '---',
    '',
  ].join('\n')

  if (!dry) writeFileSync(join(POSTS, `${slug}.md`), front + md + '\n')

  return { id, slug, category, pubDate, title, chars: md.length, images: saved }
}

async function main() {
  const args = process.argv.slice(2)
  const dry = args.includes('--dry')
  const nums = args.filter((a) => /^\d+$/.test(a)).map(Number)
  const ids = nums.length > 0 ? nums : await postIds()

  if (!dry) {
    mkdirSync(POSTS, { recursive: true })
    mkdirSync(IMAGES, { recursive: true })
  }

  const ok = []
  const bad = []
  for (const id of ids) {
    try {
      ok.push(await convert(id, { dry }))
    } catch (e) {
      bad.push({ id, error: e.message })
    }
    await sleep(300) // 예의상 간격
  }

  const byCat = {}
  for (const p of ok) byCat[p.category] = (byCat[p.category] ?? 0) + 1

  console.log(`\n옮긴 글 ${ok.length}개 / 실패 ${bad.length}개${dry ? '  (--dry: 안 씀)' : ''}`)
  console.log(`이미지 ${ok.reduce((n, p) => n + p.images, 0)}장`)
  console.log('\n카테고리별')
  for (const [c, n] of Object.entries(byCat).sort()) console.log(`  ${c.padEnd(22)} ${n}`)
  if (bad.length) {
    console.log('\n실패')
    for (const b of bad) console.log(`  ${b.id}: ${b.error}`)
  }

  if (!dry) {
    const files = readdirSync(POSTS).filter((f) => f.endsWith('.md'))
    console.log(`\nsrc/content/posts 안의 글: ${files.length}개`)
  }
}

main()
