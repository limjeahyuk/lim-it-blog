// 사이트 전역 설정. 여기만 고치면 사이트 전체에 반영됩니다.

export const SITE_TITLE = 'lim-it'
export const SITE_DESCRIPTION =
  '만들면서 부딪힌 것들을 적어둡니다. 왜 그렇게 고쳤는지, 그래서 뭐가 터졌는지.'
export const SITE_URL = 'https://lim-it.vercel.app'

export const AUTHOR = {
  name: 'Lim Jeahyuk',
  role: 'Developer',
  /** Profile 카드에 보이는 한 줄 소개 */
  bio: 'I develop everything using node.',
  github: 'limjeahyuk',
  email: 'lim0202jh@gmail.com',
}

/** 글쓴이 구분. AI 초안과 직접 쓴 글을 나눠서 표시합니다. */
export const AUTHOR_KINDS = ['me', 'ai', 'both'] as const
export type AuthorKind = (typeof AUTHOR_KINDS)[number]

export const AUTHOR_LABEL: Record<AuthorKind, string> = {
  me: '직접 씀',
  ai: 'AI 초안',
  both: 'AI 초안 + 직접 손봄',
}

/**
 * 프로젝트 목록.
 * id는 글 frontmatter의 `project` 값과 일치해야 합니다.
 * 새 프로젝트를 시작하면 여기에 한 줄 추가하세요.
 */
export const PROJECTS = [
  {
    id: 'gridbrawl',
    name: 'GridBrawl',
    tagline: '그리드 턴제 전투 로그라이크',
    platform: 'Web / iOS / Android',
    stack: ['TypeScript', 'Vite', 'Capacitor', 'Firebase'],
    color: '#8b5cf6',
    active: true,
  },
  {
    id: 'beeptimer',
    name: 'BeepTimer',
    tagline: '인터벌 타이머',
    platform: 'iOS / watchOS',
    stack: ['Swift', 'SwiftUI', 'WidgetKit'],
    color: '#f59e0b',
    active: false,
  },
  {
    id: 'mineapp',
    name: 'MineApp',
    tagline: '멀티플레이 실시간 지뢰찾기',
    platform: 'iOS',
    stack: ['Swift', 'Firebase'],
    color: '#10b981',
    active: false,
  },
  {
    id: 'coupleapp',
    name: 'CoupleApp',
    tagline: '커플 앱',
    platform: 'iOS',
    stack: ['Swift', 'XcodeGen'],
    color: '#ec4899',
    active: false,
  },
  {
    id: 'speeder',
    name: 'MiniGame Speeder',
    tagline: '속도 미니게임',
    platform: 'Web',
    stack: ['TypeScript', 'Vite'],
    color: '#3b82f6',
    active: false,
  },
  {
    id: 'tosstreasure',
    name: 'TossTreasureHunt',
    tagline: '토스 미니앱 보물찾기',
    platform: 'Toss Mini App',
    stack: ['TypeScript', 'Granite'],
    color: '#06b6d4',
    active: false,
  },
] as const

export type ProjectId = (typeof PROJECTS)[number]['id']

export const PROJECT_IDS = PROJECTS.map((p) => p.id) as [ProjectId, ...ProjectId[]]

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id)
}
