// 사이트 전역 설정. 여기만 고치면 사이트 전체에 반영됩니다.

export const SITE_TITLE = 'lim-it'
export const SITE_DESCRIPTION =
  '만들면서 부딪힌 것들을 적어둡니다. 왜 그렇게 고쳤는지, 그래서 뭐가 터졌는지.'
export const SITE_URL = 'https://lim-it.vercel.app'

/**
 * 사이트 주인. 글의 저자(AUTHORS)와는 다른 것입니다 —
 * 이쪽은 오른쪽 Profile 카드와 저작권 표시에 쓰입니다.
 */
export const OWNER = {
  name: 'Lim Jeahyuk',
  role: 'Developer',
  /** Profile 카드에 보이는 한 줄 소개 */
  bio: 'I develop everything using node.',
  github: 'limjeahyuk',
  email: 'lim0202jh@gmail.com',
}

/**
 * 저자 — 글의 유일한 분류입니다.
 *
 * 이 사이트는 매거진처럼 굴러갑니다. 예전에는 카테고리(트리)와 태그가
 * 따로 있었는데, 둘 다 없애고 **저자 하나**로 합쳤습니다. 글 하나는
 * 저자 한 명에게 속하고, 그게 전부입니다.
 *
 * ⚠ 저자는 화면 요소가 아니라 **글의 규약**입니다. 그래서 항목 하나가
 *   보이는 것(name·tagline·bio·color)과 안 보이는 것(voice)을 같이 들고
 *   있습니다. 두 개를 다른 파일에 두면 소개는 바꿨는데 말투는 그대로인
 *   일이 생깁니다.
 *
 * 순서가 그대로 화면 순서입니다.
 * 저자를 늘리려면 여기 한 덩어리 + public/admin/config.yml 의 select.
 */
export const AUTHORS = [
  {
    id: 'student',
    name: '임 Student',
    tagline: '배우는 사람',
    bio: '수업에서 받아적고, 공부하다 막힌 것을 정리합니다. React·JavaScript·Flutter·iOS 를 처음 익히던 기록이 대부분입니다.',
    color: 'var(--who-student)', // 파랑 — 다크 400 / 라이트 700
    /**
     * AI 에게 주는 말투 지시문. 화면에는 안 나옵니다.
     * 공통 규약(-습니다체·"저"·이모지 없음)은 CLAUDE.md §1 에 있고,
     * 여기에는 **저자마다 다른 것만** 적습니다.
     */
    voice: [
      '배우는 중에 적는 필기입니다. 결론을 내리지 말고 이해한 데까지만 씁니다.',
      '문장이 짧습니다. 코드와 화면을 먼저 놓고 설명을 붙입니다.',
      '모르는 것은 모른다고 씁니다 — "왜 이렇게 되는지는 아직 모르겠습니다".',
      '남을 가르치지 않습니다. 다시 볼 사람은 본인입니다.',
    ],
  },
  {
    id: 'developer',
    name: '임 Developer',
    tagline: '만드는 사람',
    bio: '만든 것을 두고 왜 그렇게 했는지 적습니다. 틀렸다가 고친 것, 안 하기로 한 것, 되돌린 것까지 남깁니다.',
    color: 'var(--who-developer)', // 빨강 — 다크 400 / 라이트 700
    voice: [
      '문제부터 씁니다. 뭐가 불편했고 왜 손대야 했는지가 첫 문단에 옵니다.',
      '무엇을 했는지보다 왜 그 선택이었는지를 씁니다.',
      '구체적인 숫자와 이름을 씁니다 — "밸런스 조정"이 아니라 "20에서 50으로".',
      '틀렸던 것과 되돌린 것을 반드시 씁니다. 그게 제일 읽을 만합니다.',
      '끝에 다음에 읽을 사람(=본인)에게 쓸모 있는 문장을 한두 개 남깁니다.',
    ],
  },
] as const

export type Author = (typeof AUTHORS)[number]
export type AuthorId = Author['id']

export const AUTHOR_IDS = AUTHORS.map((a) => a.id) as [AuthorId, ...AuthorId[]]

export function getAuthor(id: string) {
  return AUTHORS.find((a) => a.id === id)
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
