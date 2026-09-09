// 사이트 전역 설정. 여기만 고치면 사이트 전체에 반영됩니다.
//
// ⚠ 저자(에디터)만 예외입니다 — 값은 src/data/authors.json 에 있고
//   /admin 의 「에디터」에서 고칩니다. 아래 AUTHORS 는 그 파일을 읽어
//   화면이 쓰는 모양으로 바꿔 놓기만 합니다.

import authorsData from './data/authors.json'

export const SITE_TITLE = 'lim-it'

/**
 * 홈 `<title>` 과 홈 화면 아이콘 이름에만 붙는 설명.
 *
 * ⚠ **사이트 이름이 아닙니다.** `og:site_name` 과 JSON-LD 의 `name` 은
 *   `SITE_TITLE` 만 씁니다 — 구글이 검색 결과에 사이트 이름을 표시할 때
 *   도메인(`lim-it`)과 같은 값이어야 그대로 씁니다.
 *
 * 홈만 붙이는 이유: 이름이 여섯 글자뿐이라 `<title>` 이 `lim-it` 하나면
 * 검색 결과에서 뭐 하는 곳인지 알 수가 없습니다. 글 지면은 제목이 이미
 * 그 일을 하고 있어서 안 붙입니다 (`<글 제목> — lim-it`).
 */
export const SITE_TAGLINE = '개발 매거진'
export const SITE_DESCRIPTION =
  '만들면서 부딪힌 것들을 적어둡니다. 왜 그렇게 고쳤는지, 그래서 뭐가 터졌는지.'
export const SITE_URL = 'https://lim-it.vercel.app'

/**
 * 검색엔진 소유확인 코드. 각 도구에서 받은 문자열만 여기 적으면
 * `BaseHead` 가 메타태그를 답니다. **빈 값이면 태그를 아예 안 답니다** —
 * 빈 태그가 붙어 있으면 확인이 실패한 것으로 잡힙니다.
 *
 * ⚠ **확인이 끝나도 지우지 마세요.** 세 곳 다 주기적으로 다시 확인하고,
 *   사라져 있으면 속성이 해제되어 색인 현황과 검색어 데이터를 못 봅니다.
 *   `vercel.app` 서브도메인이라 DNS 방식을 못 써서 이 태그가 유일한 끈입니다.
 *   커스텀 도메인으로 옮기면 그때는 DNS 로 갈아타고 빼도 됩니다.
 *
 * 받는 곳:
 *   google — search.google.com/search-console (이미 확인됨)
 *   naver  — searchadvisor.naver.com  → 웹마스터 도구 → 사이트 등록
 *   bing   — bing.com/webmasters      → Google Search Console 에서 가져오기
 */
export const SITE_VERIFICATION = {
  google: 'Ffob80AWXLpXej-uyeBIuTQ0gZaRF8ifUQQuxlJBjhM',
  naver: '',
  bing: '',
}

/**
 * 사이트 주인. 글의 저자(AUTHORS)와는 다른 것입니다.
 *
 * 화면에 남은 건 Contact 의 링크 두 개와 맨 아래 저작권 줄뿐입니다 —
 * 얼굴과 소개를 띄우던 Profile 카드는 뺐습니다 (§4).
 */
export const OWNER = {
  name: 'Lim Jeahyuk',
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
 * ⚠ **값은 여기 없습니다.** `src/data/authors.json` 에 있고 `/admin` 의
 *   「에디터」에서 고칩니다 (2026-09-09). 예전에는 이 파일에 손으로 적어서,
 *   에디터를 하나 늘리려면 노트북을 열어야 했습니다 — 글은 폰에서 쓰는데
 *   쓰는 사람을 늘리는 것만 폰에서 안 되는 것이 이상했습니다.
 *
 * ⚠ 그래서 색도 이름으로 고릅니다. 예전에는 `--who-<저자id>` 를 저자마다
 *   global.css 에 두 줄씩 손으로 넣었는데, 그러면 `/admin` 에서 에디터를
 *   더해도 색이 없어서 이름이 안 보입니다. 지금은 **팔레트에서 고르는
 *   것**이고 그 다섯은 global.css 에 미리 깔려 있습니다 (§4).
 *
 * ⚠ `voice` 는 화면에 안 나옵니다 — 그 저자로 글을 쓸 때 지키는 말투입니다.
 *   보이는 것과 같은 파일에 두는 이유는, 소개만 바꾸고 말투는 그대로 두는
 *   일이 생기기 때문입니다.
 *
 * 순서가 그대로 화면 순서입니다 (「에디터」 화면에서 끌어 옮깁니다).
 */

/**
 * 저자 색 팔레트. 값은 global.css 의 `--who-<이름>` 이고 테마마다 다릅니다.
 *
 * ⚠ 여기를 늘리려면 global.css 의 두 블록(다크·라이트)에 한 줄씩 같이
 *   넣고 대비를 계산해 보세요. 400 단계 파스텔은 라이트에서 거의 항상
 *   떨어집니다 (§4).
 * ⚠ `public/admin/config.yml` 의 「색」 목록도 같이 늘립니다.
 */
export const AUTHOR_COLORS = ['blue', 'red', 'green', 'orange', 'teal'] as const

export type AuthorColor = (typeof AUTHOR_COLORS)[number]

export type Author = {
  id: string
  name: string
  bio: string
  /** `--who-*` 를 가리키는 CSS 값 */
  color: string
  /** 사진이 없을 때 아바타에 들어가는 글자 */
  initial: string
  /** 얼굴 사진 주소. 없으면 `initial` 로 글자 아바타를 그립니다 */
  avatar: string | undefined
  /** AI 에게 주는 말투 지시문. 화면에는 안 나옵니다 */
  voice: string[]
}

export type AuthorId = string

/**
 * ⚠ 모르는 색이 와도 빌드를 깨지 않습니다. 이 값은 `/admin` 의 목록에서
 *   고르는 것이라 오타가 날 자리가 아니고, 폰에서 저장한 것 때문에 사이트가
 *   통째로 안 나가는 쪽이 훨씬 나쁩니다 (§3 의 blankAsUndefined 와 같은
 *   판단입니다). 이름 오타는 여전히 걸립니다 — `author` 는 enum 입니다.
 */
function colorVar(name: string): string {
  const key = (AUTHOR_COLORS as readonly string[]).includes(name)
    ? name
    : AUTHOR_COLORS[0]
  return `var(--who-${key})`
}

function toVoice(v: unknown): string[] {
  const lines = Array.isArray(v) ? v : String(v ?? '').split('\n')
  return lines.map((l) => String(l).trim()).filter(Boolean)
}

export const AUTHORS: Author[] = (authorsData.authors ?? [])
  .filter((a) => a && a.id)
  .map((a) => ({
    id: a.id,
    name: a.name || a.id,
    bio: a.bio || '',
    color: colorVar(a.color),
    /* 사진이 없을 때 쓰는 글자. 비어 있으면 이름 첫 글자입니다 */
    initial: a.initial || (a.name || a.id).slice(0, 1),
    /* /admin 에서 지우면 키가 사라지지 않고 빈 문자열로 남습니다 (§3) */
    avatar: a.avatar || undefined,
    /* `/admin` 은 여러 줄 칸이라 줄바꿈 하나로 옵니다. 손으로 쓴 배열도
       그대로 받습니다 — 2026-09-09 이전 파일이 그 모양이었습니다. */
    voice: toVoice(a.voice),
  }))

/**
 * `content.config.ts` 의 `z.enum()` 에 넘기는 목록입니다 — 글의 `author` 가
 * 여기 없는 이름이면 빌드가 깨집니다 (의도한 것 — 오타를 배포 전에 잡습니다).
 *
 * ⚠ 그래서 **글이 딸린 에디터를 지우면 빌드가 깨집니다.** 지우기 전에 그
 *   이름으로 쓴 글을 옮기세요.
 */
export const AUTHOR_IDS = (AUTHORS.length
  ? AUTHORS.map((a) => a.id)
  : ['']) as [AuthorId, ...AuthorId[]]

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
 *
 * `stats` 는 /projects/<id> 위쪽 숫자 띠에 들어갑니다. 플랫폼과 최근
 * 업데이트는 코드가 알아서 채우므로 **여기에는 그 프로젝트에서만 나오는
 * 것**을 씁니다.
 *
 * ⚠ 지어내지 마세요. summary·features 나 devlog 에 이미 있는 사실만
 *   옮겨 적습니다 — 숫자 띠는 화면에서 제일 단정적으로 읽히는 자리라
 *   틀리면 바로 티가 납니다.
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
    stats: [
      // features 의 "15층 사다리를 오르는 런"
      { value: '15층', label: '런 구조' },
      // devlog: 런 난이도 4단계 추가 (초급→중급→고급→최고급)
      { value: '4단계', label: '난이도' },
    ],
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
    stats: [
      // features 의 "초급부터 최고급까지 4난이도"
      { value: '4난이도', label: '보드' },
      // features 의 실시간 1:1 대전 + 협동 모드
      { value: '1:1 · 협동', label: '멀티플레이' },
    ],
    summary:
      '누구나 아는 클래식 지뢰찾기에 실시간 1:1 대전과 협동 모드, 온라인 랭킹을 붙였습니다. 모든 판은 시드로 결정되기 때문에 같은 판을 둘이 동시에 풀 수 있습니다.',
    features: [
      '초급부터 최고급까지 4난이도. 첫 탭과 그 주변 8칸에는 지뢰가 놓이지 않습니다.',
      '실시간 1:1 대전 — 같은 판을 동시에 풀며 누가 더 빠른지 겨룹니다.',
      '협동 모드 "너에게 닿기를" — 서로 다른 곳에서 시작해 길을 열고 파트너에게 닿습니다.',
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
    stats: [
      // summary 의 "타바타·HIIT·서킷처럼 시간을 나눠 하는 운동"
      { value: '타바타 · HIIT', label: '운동 방식' },
      // features 의 "Apple Watch 에서 바로 골라 실행"
      { value: 'Apple Watch', label: '연동' },
    ],
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
