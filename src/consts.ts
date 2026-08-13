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

/**
 * 카테고리 — 글의 1차 분류입니다.
 *
 * 이 블로그는 게임 devlog 전용이 아닙니다. 공부한 것, 일기, 게임 개발이
 * 다 들어옵니다. 그걸 나누는 게 카테고리이고, 태그는 그 위에 얹는
 * 가로 분류입니다 (카테고리 하나 = 글의 자리, 태그 = 여러 개 붙는 꼬리표).
 *
 * id 의 슬래시가 곧 트리입니다. 'study/react' 는 'study' 아래 'react'.
 * 부모를 따로 안 적습니다 — 경로에서 뽑습니다.
 *
 * 순서가 그대로 화면 순서입니다. 부모 바로 뒤에 자식을 두세요.
 * 글이 0개인 카테고리는 사이드바에서 숨습니다 (자리는 미리 잡아둡니다).
 */
export const CATEGORIES = [
  { id: 'game', label: '게임 개발' },

  { id: 'ios', label: 'iOS' },
  { id: 'ios/swiftui', label: 'SwiftUI' },
  { id: 'ios/storyboard', label: 'Storyboard' },
  { id: 'ios/sdk', label: 'SDK' },
  { id: 'ios/beeptimer', label: 'BeepTimer' },
  { id: 'ios/study-diary', label: '학습 일지' },

  { id: 'study', label: '공부' },
  { id: 'study/react', label: 'React' },
  { id: 'study/react-school', label: 'React 수업' },
  { id: 'study/react-notes', label: 'React 간단 정리' },
  { id: 'study/javascript', label: 'JavaScript' },
  { id: 'study/flutter', label: 'Flutter' },
  { id: 'study/android-school', label: 'Android 수업' },

  { id: 'diary', label: '일기' },
] as const

export type Category = (typeof CATEGORIES)[number]
export type CategoryId = Category['id']

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [
  CategoryId,
  ...CategoryId[],
]

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id)
}

/** 'study/react' → [공부, React]. 빵부스러기에 씁니다. */
export function categoryTrail(id: string): Category[] {
  const parts = id.split('/')
  return parts
    .map((_, i) => getCategory(parts.slice(0, i + 1).join('/')))
    .filter((c): c is Category => c !== undefined)
}

/** 자기 글 + 자식 카테고리 글까지 (부모를 눌러도 아래가 다 보이게) */
export function categoryDepth(id: string) {
  return id.split('/').length - 1
}

/**
 * 프로젝트 목록.
 * id는 글 frontmatter의 `project` 값과 일치해야 합니다.
 * 새 프로젝트를 시작하면 여기에 한 줄 추가하세요.
 *
 * ⚠ 만든 것을 전부 올리지 않습니다. 지금 보여줄 수 있는 것 — 앱스토어에
 *   올라가 있거나 웹에서 바로 해볼 수 있는 것 — 만 여기 둡니다.
 *
 * color 는 src/styles/tokens.css 의 Neon Jungle 토큰을 가리킵니다.
 * 전부 limSystem 400 단계라 무게가 비슷합니다.
 * 청록(teal)은 강조색 계열이라 GridBrawl 하나만 씁니다.
 *
 * `active` 는 "지금 받아서 해볼 수 있는가"입니다. LIVE 배지로 보입니다.
 *
 * `summary` · `features` · `links` 는 /projects/<id>/about (소개 페이지)에
 * 쓰입니다. 프로젝트 페이지 상단 카드를 누르면 그리로 갑니다.
 *
 * `links[].kind` 는 소개 페이지 버튼의 아이콘을 정합니다.
 *   web      — 브라우저에서 바로 실행
 *   appstore — App Store 로 이동
 *   support  — 지원/문의 페이지
 */
export const PROJECTS = [
  {
    id: 'gridbrawl',
    name: 'GridBrawl',
    tagline: '그리드 턴제 전투 로그라이크',
    platform: 'Web / iOS / Android',
    stack: ['TypeScript', 'Vite', 'Capacitor', 'Firebase'],
    color: 'var(--nj-teal)', // hue 181° · 대표 프로젝트라 강조색 계열 공유
    active: true,
    summary:
      '한 라운드에 카드 세 장을 골라 순서대로 내고, 두 파이터가 격자 위에서 동시에 움직입니다. 1:1 토너먼트 카드 전투에 로그라이크 런을 얹어서, 이기면 덱과 유물이 자라고 지면 처음부터 다시 시작합니다.',
    features: [
      '6×4 격자에서 한 라운드에 카드 3장. 양쪽 카드가 한 장씩 번갈아 공개되며 펼쳐집니다.',
      '전사(CAIRN)·궁수(SABLE)·마법사(DIRGE) 3직업. 총합 화력은 같고 때리는 모양이 다릅니다.',
      '15층 사다리를 오르는 런. 체력이 전투 사이에 이어지므로 깔끔하게 이길수록 유리합니다.',
      '중독·화상·빙결·기절·속박이 각각 다른 자리를 막습니다. 걸린 것이 곧 "이번 라운드에 뭘 하면 안 되는가"입니다.',
    ],
    links: [
      {
        kind: 'web',
        label: '웹에서 바로 플레이',
        href: 'https://gridbrawl-9073d.web.app',
      },
    ],
  },
  {
    id: 'mineapp',
    name: 'MineApp',
    /** App Store 에 올라간 이름. 저장소 이름과 다릅니다. */
    storeName: '지뢰찾기 아레나',
    tagline: '멀티플레이 실시간 지뢰찾기',
    platform: 'iOS 17.6+',
    stack: ['Swift', 'SwiftUI', 'Firebase'],
    color: 'var(--nj-green)', // hue 121°
    active: true,
    summary:
      '누구나 아는 클래식 지뢰찾기에 실시간 1:1 대전과 협동 모드, 온라인 랭킹을 붙였습니다. 모든 판은 시드로 결정되기 때문에 같은 판을 둘이 동시에 풀 수 있습니다.',
    features: [
      '초급부터 최고급까지 4난이도. 첫 탭과 그 주변 8칸에는 지뢰가 놓이지 않습니다.',
      '실시간 1:1 대전 — 같은 판을 동시에 풀며 누가 더 빠른지 겨룹니다.',
      '협동 모드 「너에게 닿기를」 — 서로 다른 곳에서 시작해 길을 열고 파트너에게 닿습니다.',
      '방 코드 6자리로 친구를 부르거나, 봇과 연습할 수 있습니다.',
      '난이도별·협동 온라인 랭킹. Apple·Google 로 계정을 연동하면 기록이 기기를 옮겨 다닙니다.',
    ],
    links: [
      {
        kind: 'appstore',
        label: 'App Store 에서 받기',
        href: 'https://apps.apple.com/kr/app/id6780933427',
      },
    ],
  },
  {
    id: 'beeptimer',
    name: 'BeepTimer',
    tagline: '인터벌 트레이닝 타이머',
    platform: 'iOS 17+ / watchOS',
    stack: ['Swift', 'SwiftUI', 'WidgetKit'],
    color: 'var(--nj-orange)', // hue  34°
    active: true,
    summary:
      '타바타·HIIT·서킷처럼 시간을 나눠 하는 운동을 위한 타이머입니다. 운동하는 동안 화면을 볼 수 없다는 게 출발점이라, 소리와 진동으로 구간이 바뀌는 걸 알려주는 데 집중했습니다.',
    features: [
      '운동 시간·휴식 시간·세트 수를 자유롭게 설정합니다.',
      '단계마다 이름과 시간을 따로 정하는 상세 타이머 — 버피 40초 → 휴식 20초처럼.',
      '구간이 끝나기 3초 전 카운트다운 비프음과 진동.',
      '잠금화면 Live Activity·다이나믹 아일랜드·홈 화면 위젯으로 남은 시간 확인.',
      'Apple Watch 에서 바로 골라 실행하고, 구간 전환을 손목 진동으로 받습니다.',
    ],
    links: [
      {
        kind: 'appstore',
        label: 'App Store 에서 받기',
        href: 'https://apps.apple.com/kr/app/beeptimer/id6787445381',
      },
    ],
  },
] as const

export type Project = (typeof PROJECTS)[number]
export type ProjectId = Project['id']
export type ProjectLinkKind = Project['links'][number]['kind']

export const PROJECT_IDS = PROJECTS.map((p) => p.id) as [ProjectId, ...ProjectId[]]

export function getProject(id: string) {
  return PROJECTS.find((p) => p.id === id)
}
