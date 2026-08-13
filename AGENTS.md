# lim-it — 개발 블로그

**게임 devlog 전용이 아닙니다.** 공부한 것, 만든 것, 그냥 일기까지 다 들어오는
개발 블로그입니다. 지금은 게임 개발에 관심이 쏠려 있어서 그쪽 글이 늘고 있을 뿐입니다.

글의 기본은 **왜 그렇게 했는지**를 남기는 것입니다. Astro + MDX,
글 하나가 파일 하나이고, 커밋하면 Vercel이 배포합니다.

> `CLAUDE.md` 는 이 파일을 가리키는 심볼릭 링크입니다. 규약은 여기 한 곳에만 씁니다.

⚠ **"이 블로그는 게임 devlog다" 라고 전제하지 마세요.** 2026-08-12 에
티스토리(`hyuk-todayfeelsogood.tistory.com`)의 글 116개를 옮겨왔고, 지금
전체 글 117개 중 게임 글은 1개입니다. 나머지는 React·Flutter·iOS 학습 정리입니다.

---

## 0. 작업 규칙 — 손대기 전에 읽으세요

**이 블로그를 고칠 때는 항상 이 파일부터 읽고 시작합니다.** 매번 같은 맥락에서
같은 판단을 하기 위해서입니다. 세션이 바뀌어도 결정의 근거는 여기 남아 있습니다.

**작업이 끝나면 — 코드를 고쳤을 때만 — §8 에 한 줄 남깁니다.**

- 남기는 건 **뭐가 불편해서 뭘 했는가** 입니다. 「이랬는데 저래서 이렇게 바꿨습니다」 정도면 충분합니다.
- **코드 설명은 쓰지 않습니다.** 함수 이름, 인자, 구현 방식은 파일을 열면 보입니다. 여기 옮겨 적으면 코드가 바뀔 때 같이 썩습니다.
- 대신 **코드만 봐서는 모르는 것**을 씁니다 — 왜 이 방법이었는지, 뭘 안 하기로 했는지, 어디를 건드리면 안 되는지.
- 규약이 새로 생겼으면 §8 이 아니라 **해당 절(§1~§7)에 직접** 씁니다. §8 은 기록이지 규약이 아닙니다.

**글을 쓴 것은 §8 에 적지 않습니다.** 글은 그 자체로 남습니다. 말투(§1)와
쓰는 방식(§2)만 지키면 됩니다.

**끝나면 커밋하고 push 합니다.** 혼자 하는 저장소라 브랜치를 따로 파지 않고
`main` 에 바로 올립니다. `npm run post` 를 쓰면 빌드가 깨졌을 때 push 를 막아 줍니다.
커밋 메시지는 **왜 고쳤는지가 보이게** 씁니다 — 「BaseHead 수정」이 아니라
「fix: 공유 카드에 이미지가 안 뜨던 것」.

---

## 1. 말투 — 제일 자주 틀리는 부분

**참고 기준:** 티스토리에서 옮겨온 글들 (`src/content/posts/` 의 `# 티스토리에서 옮겨왔습니다:` 주석이 붙은 것들). 원본은 https://hyuk-todayfeelsogood.tistory.com/

글은 전부 **-습니다체 존댓말**로 씁니다. 기술 학습 일지 같은 톤입니다.

| | 이렇게 | 이렇게 말고 |
|---|---|---|
| 종결어미 | 「~했습니다」「~입니다」「~됩니다」 | 「~했다」「~이다」「~한다」 |
| 자기지칭 | **저** | 나, 내가 |
| 독자 | 가끔 질문을 던집니다 —「카드 두 장인 걸까요?」 | 「~해보자」같은 청유·명령 |
| 이모지 | 거의 안 씁니다 | 문단마다 이모지 |

- 부드럽게 풀어도 됩니다: 「~하더라고요」「~거든요」「~같습니다」
- 제목도 존댓말로 맞춥니다. 「상태이상 여섯 개가 하는 일은 셋뿐이었습니다」
- `description` 도 존댓말입니다.
- **코드 주석은 예외입니다.** 원본 코드를 그대로 인용할 때는 손대지 않습니다.

기준 샘플은 `src/content/posts/status-effects-redefined.md` 입니다. **새 글을 쓰기 전에 그것부터 읽으세요.**

---

## 2. 글 쓰는 방식

**이렇게 씁니다**

- **문제부터 씁니다.** 뭐가 불편했고 왜 손대야 했는지가 첫 문단에 있어야 합니다.
- **왜 그 선택인지 씁니다.** 무엇을 했는지는 커밋 로그에도 있습니다. 블로그에 쓸 값어치가 있는 건 판단의 이유입니다.
- **틀렸던 것도 씁니다.** 잘못 짰다가 고친 것, 예상 못 한 부작용, 뒤늦게 발견한 버그. 이게 제일 읽을 만합니다.
- **구체적인 숫자와 이름을 씁니다.** 「밸런스를 조정했습니다」가 아니라 「전사 20에서 50으로, 10시드 × 1200런, 클리어율 33.0%」.
- **끝에 남은 걸 한두 개 씁니다.** 다음에 읽을 사람(=본인)에게 쓸모 있는 문장으로.

**이렇게 안 씁니다**

- 커밋 메시지를 그대로 옮기지 않습니다. 변경사항 나열은 changelog지 글이 아닙니다.
- 확인 안 한 코드를 넣지 않습니다. 파일을 안 읽었으면 스니펫을 쓰지 않습니다.
- 과장하지 않습니다. 「혁신적인」「완벽하게 해결」 같은 말은 쓰지 않습니다.
- 튜토리얼처럼 쓰지 않습니다. 남을 가르치는 글이 아니라 **내가 뭘 했는지 남기는 글**입니다.
- 커밋에 없는 동기를 추측해서 채우지 않습니다. 모르면 안 씁니다.

### 단락과 사진

읽는 사람이 스크롤로 지치지 않게 하는 쪽이 우선입니다.

- **한 단락은 서너 줄까지.** 화면에서 글자 벽이 되면 읽다가 놓칩니다. 생각이 바뀌는 자리에서 끊습니다.
- **소제목(`##`)으로 덩어리를 나눕니다.** 긴 글이면 특히. 나중에 본인이 다시 찾아 읽을 때 목차가 됩니다.
- **화면·에러·결과는 글로 설명하지 말고 사진을 붙입니다.** 「이런 화면이 나왔습니다」 다음에 이미지 한 장이 문단 셋보다 낫습니다.
- 이미지는 `public/images/<slug>/` 에 두고 `![설명](/images/<slug>/파일명.png)` 로 씁니다. 티스토리에서 옮겨온 404장이 이 규칙을 따르고 있습니다.
- **alt 는 채웁니다.** 이미지가 안 뜰 때 남는 유일한 단서입니다.
- 코드가 길면 스니펫으로 자릅니다. 파일 전체를 붙여넣지 않습니다.

### 마크다운 함정 하나

한국어에서 `**"따옴표"**여야` 처럼 **닫는 `**` 앞뒤가 문장부호와 한글**이면 강조가 안 먹고 별표가 그대로 나옵니다 (CommonMark 규칙). 닫는 `**` 앞은 한글이나 숫자로 끝내세요.

```
✗  **"이번 라운드에 뭘 하면 안 되는가"**여야 합니다
✓  **이번 라운드에 뭘 하면 안 되는가**여야 합니다
```

---

## 3. frontmatter 규약

```yaml
---
title: 제목 (존댓말)
description: 목록에 보이는 한 줄 요약 (존댓말)   # 선택
pubDate: 2026-08-07
category: game         # 선택. CATEGORIES 와 일치
project: gridbrawl     # 선택. 게임 글에만
author: ai             # me | ai | both  (기본값 me)
tags: [게임설계, 리팩터링]
draft: false
---
```

- **`description` 은 선택입니다.** 없으면 목록 카드에서 그 줄이 통째로 빠집니다. 티스토리에서 옮겨온 116개에는 거의 없습니다 — 억지로 채우지 마세요. 검색엔진에 나갈 meta description 은 없을 때 [`src/lib/excerpt.ts`](src/lib/excerpt.ts) 가 본문 앞부분에서 알아서 뽑습니다 (화면에는 안 보입니다). **SEO 때문에 description 을 채울 필요는 없습니다.**
- `category` 는 `src/consts.ts` 의 `CATEGORIES[].id` 와 **반드시** 일치해야 합니다. 안 맞으면 빌드가 깨집니다 (의도한 것 — 오타를 배포 전에 잡습니다).
- `project` 는 `PROJECTS[].id` 와 일치해야 합니다. **카테고리와 별개입니다** — 게임 devlog 글은 보통 `category: game` + `project: gridbrawl` 둘 다 붙습니다.
- `author` 는 정직하게 적습니다. AI가 초안을 쓰면 `ai`, 사람이 손보면 `both`, 사람이 처음부터 쓰면 `me`.
- 태그에 슬래시(`/`)를 쓰지 않습니다. URL이 깨집니다.
- 파일명이 그대로 URL이 됩니다 (`status-effects-redefined.md` → `/posts/status-effects-redefined`). 영문 소문자 + 하이픈.
- `secret: true` 면 **비밀글**입니다 (§6-3).
- `/admin` 으로 쓴 글에는 `slug:` 키가 하나 더 붙습니다. 파일명을 정하려고 받는 값이고, Astro 스키마는 모르는 키라 그냥 버립니다. 손으로 쓸 때는 안 넣어도 됩니다.
- **빈 문자열은 「값 없음」으로 봅니다.** `category: ''` 는 통과합니다 (`content.config.ts` 의 `blankAsUndefined`). `/admin` 에서 선택을 골랐다 지우면 키가 사라지지 않고 빈 문자열로 남는데, 그것 때문에 빌드가 깨지면 폰에서는 원인을 알 방법이 없습니다. **오타는 여전히 걸립니다** — `category: gaem` 은 그대로 빌드가 깨집니다.

### 카테고리 vs 태그

**카테고리는 자리, 태그는 꼬리표입니다.**

| | 카테고리 | 태그 |
|---|---|---|
| 개수 | 글마다 **하나** | 여러 개 |
| 구조 | **트리** (`study/react`) | 평평함 |
| 용도 | 이 글이 어디 사는가 | 가로지르는 주제 |
| 화면 | 왼쪽 사이드바 트리, `/categories/<경로>` | `/tags/<태그>` |

트리는 `id` 의 슬래시로 만듭니다 — 따로 `parent` 를 적지 않습니다. **부모를 누르면 자식 글까지 다 나옵니다** (`study` 를 누르면 `study/react` 글도 보입니다). `countByCategory`·`postsInCategory` 가 그렇게 동작합니다.

지금 있는 카테고리 (`src/consts.ts`):

```
game                게임 개발
ios                 iOS
  ios/swiftui       ios/storyboard   ios/sdk
  ios/beeptimer     ios/study-diary
study               공부
  study/react       study/react-school   study/react-notes
  study/javascript  study/flutter        study/android-school
diary               일기        ← 아직 글 0개 (글이 0개면 사이드바에서 숨습니다)
```

카테고리를 추가할 때 고칠 곳은 **두 군데**입니다 — `src/consts.ts` 의 `CATEGORIES` 와 `public/admin/config.yml` 의 `category` select. 순서가 곧 화면 순서이고, **부모 바로 뒤에 자식을 둬야** 트리가 제대로 보입니다.

---

## 4. 디자인 시스템

### 출처

색·radius·아이콘 전부 **limSystem** 에서 가져왔습니다.

```
색/radius   원본: ~/Develop/React/limSystem/src/util/theme.ts
            사본: src/styles/tokens.css           ← 손으로 옮김
아이콘      원본: ~/Develop/React/limSystem/src/assets/icons/*.svg
            사본: src/assets/icons/*.svg           ← npm run icons
            추가: src/assets/icons-extra/*.svg     ← limSystem 에 없어서 손으로 넣음
```

limSystem 은 별도 Next.js 앱(`private: true`)이라 패키지로 못 가져옵니다. **컴포넌트(React)는 Astro 에서 못 씁니다** — 가져올 수 있는 건 값과 SVG 뿐입니다.

**색은 손으로 옮긴 것이라 원본이 바뀌면 `tokens.css` 도 같이 고쳐야 합니다.** 아이콘은 `npm run icons` 로 다시 긁어오면 됩니다.

### 아이콘 — 이모지 대신 씁니다

목록 머리글·사이드바 제목·버튼에는 **limSystem SVG** 를 씁니다. 이모지는 OS마다 그림이 달라서 다크 테마에서 혼자 튀거든요.

```astro
---
import Icon from '../components/Icon.astro'
---
<span class="title-ico"><Icon name="notebook" size={17} /> All Posts</span>
```

- 이름은 파일명 그대로입니다. 목록은 `src/lib/icon-names.ts` (자동 생성).
- 없는 이름을 쓰면 **빌드가 깨집니다.** 의도한 것입니다 — 오타를 배포 전에 잡습니다.
- 원본 SVG 는 색이 `#3C3E44` 로 박혀 있는데 `Icon.astro` 가 `currentColor` 로 바꿔 줍니다. 그래서 **부모의 `color` 를 따라갑니다** — 아이콘에 색을 직접 주지 말고 부모에 의미 토큰을 주세요.
- 아이콘 + 글자를 한 줄로 놓을 때는 `.title-ico`(global.css)나 `.side-title` 을 씁니다.

지금 쓰는 것들:

| 자리 | 아이콘 | 어디서 |
|---|---|---|
| Tags | `label` | limSystem |
| Works | `book-open` | icons-extra |
| Posts / Devlog | `notebook` | limSystem |
| Profile | `smile` | icons-extra |
| Contact | `chat-circle-dots` | icons-extra |
| 테마 토글 | `moon` / `sun` | icons-extra |
| 웹에서 플레이 | `play-circle` | limSystem |
| App Store 에서 받기 | `download` | limSystem |

### 아이콘이 limSystem 에 없을 때

limSystem 에는 **해·달·말풍선·펼친 책·웃는 얼굴·게임패드·메일·GitHub** 이 없습니다. 두 가지 방법이 있습니다.

1. **뜻이 통하는 다른 아이콘을 고른다** — 있는 걸로 되면 이쪽이 낫습니다.
2. **`src/assets/icons-extra/` 에 넣는다** — 같은 팩(24×24 · `fill="#3C3E44"`)에서 가져온 SVG만 넣으세요. 선 굵기가 다르면 나란히 놨을 때 바로 티가 납니다.

⚠ **`npm run icons` 는 `src/assets/icons/` 를 통째로 지웠다 다시 씁니다.** 손으로 넣은 아이콘을 거기 두면 다음 sync 때 사라집니다. 반드시 `icons-extra/` 에 두세요. 이름이 양쪽에 겹치면 sync 스크립트가 오류로 멈춥니다.

⚠ **파일명은 kebab-case 로 바꿔서 넣습니다.** limSystem 규약이라 `Book_Open.svg` → `book-open.svg` 처럼 맞춥니다.

### 토큰 사용 규칙

**컴포넌트에서 `--lim-*` 원시 값을 직접 쓰지 마세요.** 의미 토큰만 씁니다.

| 의미 토큰 | 용도 |
|---|---|
| `--bg` | 페이지 배경 |
| `--card` | 카드 배경 |
| `--surface` | 알약·인라인코드 배경, hover |
| `--surface-2` | 인용문·표 헤더 배경 |
| `--border` | 선, 구분선 |
| `--text` | 본문 글자 |
| `--text-dim` | 보조 글자 |
| `--text-faint` | 날짜·개수 같은 흐린 글자 |
| `--accent` | 강조 (인용문 왼쪽 선) |
| `--accent-text` | 본문 링크 |
| `--pill-fg` | 색 있는 알약 위의 글자 |

radius 도 마찬가지입니다. `--radius-sm/md/lg/full` 은 limSystem 원본이고, `--radius-card`(16px)는 morethan-log 풍 카드를 위해 **블로그에서 추가한 확장값**입니다.

### 강조색과 프로젝트 색 — Neon Jungle

**전부 limSystem 400 단계에서 골랐습니다.** 별도 팔레트가 아니라 limSystem 안의 조합이라, 원본이 바뀌면 같이 따라갑니다.

| hue | 토큰 | limSystem | 프로젝트 | 다크 대비 |
|---|---|---|---|---|
| 0° | `--nj-red` | RED_400 | — (비어 있음) | 6.3:1 |
| 33° | `--nj-amber` | ORANGE_300 | — (비어 있음) | 10.1:1 |
| 34° | `--nj-orange` | ORANGE_400 | **BeepTimer** | 7.7:1 |
| 121° | `--nj-green` | GREEN_400 | **MineApp** | 7.8:1 |
| 181° | `--nj-teal` | TEAL_400 | **GridBrawl** | 10.7:1 |
| 209° | `--nj-blue` | BLUE_400 | — (비어 있음) | 6.2:1 |

토큰 여섯은 그대로 두되 **지금 쓰는 건 셋뿐입니다.** 프로젝트를 늘리면 빈 칸에서 골라 쓰세요.

**강조색은 청록입니다.**

| 토큰 | 값 | 쓰임 | 대비 |
|---|---|---|---|
| `--nj-accent` | TEAL_500 | 다크 인용문 선 | 8.4:1 |
| `--nj-accent-text` | TEAL_300 | 다크 링크 | 12.6:1 |
| `--nj-accent-deep` | TEAL_700 | 라이트 공용 | 4.6:1 (흰 배경) |

**청록은 강조색 계열이라 프로젝트에는 GridBrawl 하나만 씁니다.** 대표 프로젝트가 브랜드 색을 공유하는 건 의도한 것이고, 여기에 하나 더 넣으면 어느 게 강조인지 안 읽힙니다.

⚠ **`--nj-orange`(34°)와 `--nj-amber`(33°)는 색상이 1° 차이입니다.** limSystem 에 보라·분홍 계열이 없어서 6개를 전부 다른 계열로 못 뽑았습니다. 명도로 갈리니(7.7:1 vs 10.1:1) **둘을 목록에서 나란히 두지 마세요.** (지금은 amber 를 안 쓰고 있어서 문제가 없습니다.)

프로젝트가 더 늘면 limSystem 의 300/500 단계에서 뽑되, **기존 색과 hue 가 30° 이상 떨어지거나 명도가 확실히 다른 것**을 고르세요.

### 색을 바꿀 때 반드시 확인할 것

파스텔은 배경에 따라 대비가 확 달라집니다. **눈대중하지 말고 계산하세요.**

- **본문 링크(`--accent-text`)는 4.5:1 이상.** 밝은 청록은 흰 배경에서 2.1:1 밖에 안 나와서, 라이트 테마는 진한 쪽(`--nj-accent-deep`)을 따로 씁니다.
- **색 알약 위 글자(`--pill-fg`)는 두 테마 모두 어두운 색.** 알약 배경이 양쪽 다 밝은 파스텔이라, 흰 글자면 1.5~3.0:1 로 떨어집니다.
- **`.live` 배지는 `--card` 를 글자색으로 씁니다.** `--pill-fg` 를 쓰면 라이트 테마에서 어두운 글자 + 어두운 배경이 됩니다.

새 색이 필요하면 `tokens.css` 에 추가하고, `global.css` 에서 의미 토큰으로 연결하세요.

### 레이아웃

morethan-log 를 참고한 3열 구조입니다. 이 구조를 유지하세요.

```
[ Categories ]   [ 글 목록 ]   [ Profile / Works / Contact ]
[ Tags      ]
    span 2         span 7               span 3
```

- 12열 그리드, `gap: 1.5rem`, 컨테이너 `max-width: 1120px`
- 1024px 미만에서는 사이드바가 숨고 **카테고리·태그만 가로 스크롤 한 줄**로 본문 위에 남습니다 (`.tags-mobile`)
- 헤더는 `height: 3rem` sticky

### 글이 많아서 생긴 규칙

글이 117개라 목록을 그냥 다 그리면 페이지가 감당이 안 됩니다.

| 화면 | 무엇을 |
|---|---|
| `/` | **최근 20개**만 카드로. 끝에 「전부 보기」 |
| `/posts` | **서고.** 카드가 아니라 한 줄씩, 연도로 묶어서 |
| `/categories/<경로>` | 그 카테고리(+아래) 글 전부, 카드로 |

`/` 의 `RECENT` 상수를 건드릴 때는 서고가 있다는 걸 잊지 마세요 — 첫 화면을 늘리는 것보다 카테고리로 좁히는 쪽이 낫습니다.

### 폰트

**Pretendard Variable** 한 벌만 씁니다 (`src/assets/fonts/PretendardVariable.woff2`, 100~900).

라이선스는 **SIL OFL 1.1** 이고 `src/assets/fonts/Pretendard-LICENSE.txt` 에 동봉돼 있습니다. **이 파일을 지우지 마세요.** OFL은 폰트를 재배포할 때 라이선스 사본을 같이 넣도록 요구합니다.

---

## 5. 게임 저장소에서 devlog 뽑기 (게임 글을 쓸 때만)

게임 소스는 이 저장소에 없습니다. 전부 별도 비공개 저장소이고, 로컬에서는 형제 디렉토리에 있습니다.

```
~/Develop/Claude/
  ├── blog/            ← 여기
  ├── GridBrawl/       ← 사이트에 올라가 있음 (진행 중)
  ├── MineApp/         ← 사이트에 올라가 있음 (App Store 출시)
  ├── BeepTimer/       ← 사이트에 올라가 있음 (App Store 출시)
  ├── CoupleApp/       ← 안 올림. git 저장소도 아님
  ├── MiniGame_Speeder/  ← 안 올림
  └── TossTreasureHunt/  ← 안 올림
```

⚠ **만든 걸 전부 사이트에 올리지 않습니다.** 지금 보여줄 수 있는 셋(GridBrawl · MineApp · BeepTimer)만 `PROJECTS` 에 있습니다. 나머지 저장소의 글을 쓰려면 먼저 프로젝트를 추가해야 합니다 (§6).

글을 쓸 때는 해당 게임 저장소를 세션에 추가합니다.

```
/add-dir ~/Develop/claude/GridBrawl
```

### 절차

1. **커밋을 읽습니다.** 기억이 아니라 diff에서 출발합니다.
   ```bash
   git -C ~/Develop/claude/GridBrawl log --format='%ad | %s' --date=short -20
   git -C ~/Develop/claude/GridBrawl show <hash>
   ```
2. **글감이 되는 커밋을 하나 고릅니다.** 여러 커밋을 한 글에 욱여넣지 않습니다. "왜"가 있는 커밋 하나가 글 하나입니다.
3. **코드를 실제로 읽습니다.** 스니펫을 넣을 거면 파일을 열어서 확인합니다. **절대 지어내지 않습니다.**
4. `src/content/posts/<slug>.md` 로 씁니다. `category: game` · `project: <id>` · `author: ai`.
5. 사람이 읽고 고친 뒤 `author: both` 로 바꿉니다.

---

## 5-2. 티스토리에서 옮겨온 글

2026-08-12 에 `hyuk-todayfeelsogood.tistory.com` 의 글 **116개**를 옮겨왔습니다
(2022-03 ~ 2026-01). 파일 맨 위에 원본 주소가 주석으로 붙어 있습니다.

```
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/122
```

- 옮긴 도구는 [`scripts/import-tistory.mjs`](scripts/import-tistory.mjs) 입니다. 한 번 쓰고 끝이지만, 다시 긁어야 할 때를 위해 남겨뒀습니다.
- 파일명은 **`<카테고리 잎>-<티스토리 글번호>`** 입니다 (`flutter-122`, `swiftui-68`, `sdk-90`).
- 이미지 404장은 `public/images/<slug>/` 에 **받아서** 넣었습니다 (48MB).
  ⚠ **티스토리 CDN 주소를 그대로 쓰면 안 됩니다.** 서명된 URL 이라 `expires` 가 지나면 전부 404 가 되고, 서명을 뗀 주소도 404 입니다. 그래서 받아온 것입니다.
- `description` 과 `tags` 는 대부분 비어 있습니다. 원본에 없었기 때문입니다 — 지어내지 말고, 손볼 때 채우세요.
- 티스토리에서 카테고리가 안 달려 있던 글 5개는 제목을 보고 정했습니다. 근거가 약한 곳이라 `import-tistory.mjs` 의 `UNCATEGORIZED` 표에 모아뒀습니다.

---

## 6. 프로젝트 추가

**고칠 곳은 두 군데입니다.**

1. `src/consts.ts` 의 `PROJECTS` 배열
2. `public/admin/config.yml` 의 `project` select — 같은 `id` 를 넣습니다

`PROJECTS` 항목 하나가 페이지 두 개를 만듭니다.

| 경로 | 무엇 | 쓰는 필드 |
|---|---|---|
| `/projects/<id>` | 그 프로젝트의 devlog 목록 | `name` `tagline` `platform` `stack` `color` `active` |
| `/projects/<id>/about` | **소개 페이지** — 받는 곳·플레이하는 곳 | 위 + `summary` `features` `links` |

devlog 페이지 **상단 카드를 누르면 소개 페이지로 갑니다.** 그래서 `summary`·`features`·`links` 를 비워두면 소개 페이지가 껍데기가 됩니다 — 새 프로젝트를 넣을 때 같이 채우세요.

- `summary` — 두세 문장. 뭘 하는 물건인지 + 왜 그렇게 만들었는지.
- `features` — 4~5줄. **구체적으로** 씁니다. 「멀티플레이 지원」이 아니라 「방 코드 6자리로 친구를 부르거나, 봇과 연습할 수 있습니다」.
- `links` — `kind` 는 `web` | `appstore` | `support`. 버튼 아이콘이 여기서 갈립니다.
- `storeName` — App Store 이름이 저장소 이름과 다를 때만 (예: MineApp → 「지뢰찾기 아레나」).
- `active` — "지금 받아서 해볼 수 있는가". LIVE 배지가 붙습니다.
- `color` — 카드의 카테고리 알약, Works 목록의 점, 소개 페이지 버튼 배경.

**소개 문구는 지어내지 마세요.** 해당 저장소의 `README.md` 나 App Store 설명을 읽고 씁니다. 출시된 앱이면 번들 ID로 스토어 메타데이터를 그대로 확인할 수 있습니다.

```bash
curl -s "https://itunes.apple.com/lookup?bundleId=com.LimJH.BeepTimer&country=kr"
```

---

## 6-2. 폰에서 쓰는 `/admin`

글은 대부분 폰에서 `/admin` 으로 씁니다. Decap CMS 는 데스크톱 기준으로 만들어져 있어서,
폰에 맞추는 건 `public/admin/index.html` 의 `<style>` 한 덩어리가 전부입니다.
클래스 이름은 emotion 이 만든 해시(`css-1fehwpo-AppMainContainer`)라 뒤의 컴포넌트 이름만
부분 일치로 잡습니다 — **Decap 버전을 올리면 여기부터 확인하세요.**

지금 걸려 있는 것들과 그 이유:

| 무엇 | 왜 |
|---|---|
| 입력칸 글자 `16px` | iOS 사파리는 16px 미만 입력칸을 탭하면 화면을 확대합니다. Decap 기본값이 15px 이라 필드마다 확대됐습니다 |
| 사이드바 대신 검색창만 | 검색이 사이드바 안에 있습니다. 사이드바를 통째로 숨기면 검색도 같이 사라집니다 — 글이 117개라 검색 없이는 못 찾습니다 |
| 필드 간격 36 → 18px | 필드가 열 개라 기본 간격이면 스크롤이 한참입니다 |
| 본문 `min-height: 60vh` | 기본 300px 이면 대여섯 줄 만에 차고, 그때부터 작은 창 안에서 스크롤하며 쓰게 됩니다 |
| 툴바 숨김 + `margin-top: 0` | raw 모드에서 툴바 버튼이 전부 비활성입니다. 그런데 편집기가 `margin-top: -100px` 으로 툴바 밑에 끼워져 있어서, 툴바만 지우면 위 필드를 덮습니다 |
| `white-space: nowrap` | 「콘텐 츠」「빠른 추 가」「현재시 각」처럼 두 줄로 꺾였습니다 |

색과 폰트는 블로그에서 그대로 옮겨왔습니다 (`tokens.css` 의 값을 손으로 적었습니다).
**limSystem 원본이 바뀌면 `tokens.css` 와 `admin/index.html` 둘 다 고쳐야 합니다.**
폰트도 마찬가지로 `public/fonts/PretendardVariable.woff2` 에 한 벌 더 있습니다 —
`src/assets/fonts/` 쪽은 Astro 가 해시 붙은 주소로 내보내서 정적 파일인 `/admin` 에서는
못 가져옵니다. 폰트를 갈아끼우면 두 곳 다 바꾸세요 (라이선스 사본도 같이 뒀습니다).

⚠ `/admin` 은 **OS 다크모드만 따라갑니다.** 블로그처럼 테마를 직접 고르는 토글은
없습니다 — Decap 이 만드는 DOM 이라 버튼을 붙일 자리가 없습니다.

`config.yml` 쪽에서 알아둘 것:

- **본문은 마크다운 원문(`modes: ['raw']`)만 씁니다.** 리치 텍스트는 폰에서 한글 입력이 끊기고 코드펜스를 망칩니다. `modes` 의 순서로는 기본 모드를 못 정합니다 — 둘 다 적으면 무조건 리치 텍스트로 열립니다.
  ⚠ 대신 raw 모드에서는 툴바가 전부 비활성이라 **이미지 삽입이 막힙니다.** `public/uploads` 는 지금까지 쓴 적이 없어서 버린 것이고, 필요해지면 `rich_text` 를 도로 넣으세요.
- **`주소`(slug) 필드가 필수입니다.** 제목에서 파일명을 뽑으면 한글 주소가 나옵니다. `^[a-z0-9]+(-[a-z0-9]+)*$` 로 막아 뒀습니다.
- **기본 정렬은 `index.html` 의 인라인 스크립트가 정합니다.** Decap 3.9 는 `sortable_fields` 에 `default` 를 넣으면 「must be an array」로 설정을 통째로 안 읽습니다. `decap-cms.entries.sort` 를 처음 한 번만 채워 최신 글이 위로 오게 합니다.
- **폼을 고쳤는데 폰에서 안 바뀌면** `index.html` 의 `config.yml?v=` 숫자를 올리세요.

---

## 6-3. 비밀글

`secret: true` 를 붙이면 **본문이 잠깁니다.** `/admin` 에는 「비밀글로 두기」 토글이 있습니다.

**제목·날짜·요약·태그는 그대로 보입니다.** 목록에 자물쇠만 붙습니다. 티스토리 보호글과
같은 규칙이고, 감출 내용은 **본문에만** 쓰라는 뜻입니다. RSS 에서는 통째로 빠집니다 —
피드 리더는 비밀번호를 물어봐 주지 않으니 제목만 흘리는 항목이 남기 때문입니다.

### 비밀번호

글마다 다르지 않습니다. `SECRET_POST_PASSWORD` 하나로 전부 잠급니다 — 글마다 다르면
어딘가에 적어둬야 하고, 그러면 저장소에 비밀번호가 남습니다.

배포는 **Vercel → Settings → Environment Variables** 에 `SECRET_POST_PASSWORD` 로 넣습니다
(Production · Preview · Development 전부). 환경변수는 새 빌드부터 적용되니 넣은 뒤 한 번
다시 배포해야 합니다.

로컬에서도 비밀글을 보려면 저장소 맨 위에 `.env` 를 만들고 **배포와 같은 값**을 적습니다.
값이 다르면 로컬에서 잠근 글을 배포본에서 못 엽니다. `.env` 는 gitignore 돼 있습니다.

```bash
echo 'SECRET_POST_PASSWORD=여기에비밀번호' > .env
```

⚠ **비밀글이 있는데 이 값이 없으면 빌드가 멈춥니다.** 그냥 넘어가면 「비밀글」이라고
써놓고 본문은 다 보이는 상태로 배포됩니다. 그게 제일 나쁩니다.

### 어떻게 잠기는가

「JS로 가려두기」는 비밀글이 아닙니다 — 페이지 소스에 본문이 그대로 있습니다. 정적
사이트라 서버에서 막을 수가 없으니, **본문 자체를 암호문으로 내보냅니다.**

| 단계 | 어디 |
|---|---|
| 빌드할 때 잠금 (PBKDF2-SHA256 20만 회 → AES-GCM) | [`src/lib/secret.ts`](src/lib/secret.ts) |
| 읽는 사람 브라우저에서 풀기 | [`SecretGate.astro`](src/components/SecretGate.astro) 의 `<script>` |

잠글 대상은 `post.rendered.html` 입니다 — Astro 가 마크다운을 렌더해 엔트리에 담아둔
것으로, 코드 하이라이팅까지 끝난 상태입니다. 컨테이너 API 로 다시 그릴 필요가 없습니다.

- **비밀번호 확인 코드가 따로 없습니다.** 틀리면 AES-GCM 이 인증 태그에서 걸려
  예외를 던집니다. 못 풀면 틀린 겁니다.
- 한 번 열면 브라우저 `localStorage` 에 남아서 다음부터 안 묻습니다. 본문 아래
  「이 기기에서 비밀번호 지우기」로 지웁니다. 비밀번호를 바꾸면 옛 값은 자동으로 지워집니다.
- `crypto.subtle` 은 **보안 컨텍스트(https·localhost)에서만** 있습니다. 배포는 https 라 괜찮습니다.

⚠ `src/lib/secret.ts` 를 클라이언트 코드에서 import 하지 마세요. 비밀번호가 번들에
박혀서 나갑니다. `<script>` 안에는 암호문만 넘어갑니다.

---

## 6-4. 폰으로 보는 블로그

- **오른쪽 열(Profile·Works·Contact)은 폰에서 글 목록 아래로 갑니다.** 예전에는 1024px
  미만에서 통째로 숨겼는데, 그러면 폰으로 들어온 사람은 이 블로그가 누구 것인지 볼 방법이
  없었습니다. `FeedLayout.astro` 의 `.rt` — sticky 관련 속성은 데스크톱 미디어쿼리 안에만 둡니다.
- **카테고리·태그 한 줄은 화면 양끝까지 흘립니다** (`margin-inline: -1rem`). 안쪽에서 딱
  끊기면 그게 끝인 줄 알거든요. 잘린 항목이 보여야 옆으로 더 있다는 게 읽힙니다.
- **본문 리듬은 640px 아래에서 좁힙니다** (`global.css`). 티스토리에서 옮겨온 글은 한 줄이
  곧 한 문단이라, 데스크톱 간격을 그대로 쓰면 한 화면에 열 줄쯤밖에 안 들어갑니다.

---

## 7. 명령어

```bash
npm run dev       # http://localhost:4321
npm run build     # 빌드 (frontmatter 스키마 검증 포함)
npm run preview   # 빌드 결과 확인

npm run post                     # 빌드 검증 → 커밋 → push
npm run post -- "넉백 버그 수정"    # 커밋 메시지 지정

npm run cms       # Decap 로컬 서버 (GitHub 없이 /admin 테스트)

npm run icons     # limSystem 아이콘 다시 긁어오기

node scripts/import-tistory.mjs --dry    # 티스토리 이관 (한 번 쓰고 끝났습니다)
```

`npm run icons` 는 `~/Develop/React/limSystem/src/assets/icons` 를 `src/assets/icons` 로 통째로 덮어쓰고 `src/lib/icon-names.ts` 를 다시 만듭니다. `src/assets/icons-extra/` 는 건드리지 않습니다. 경로가 다르면 인자로 넘기세요 — `node scripts/sync-icons.mjs <경로>`.

`draft: true` 인 글은 `dev` 에서는 보이고 `build` 에서는 빠집니다.

`npm run post` 는 **빌드가 깨지면 push 하지 않습니다.** frontmatter 오타가 배포된 뒤에 발견되는 걸 막기 위해서입니다.

---

## 8. 고친 것 기록

새 항목은 **위에** 붙입니다. 한 작업에 서너 줄이면 충분합니다 — 자세한 건 커밋에 있습니다.

### 2026-08-13 · 검색엔진에 글이 제대로 안 잡히던 것

글 117개 중 116개에 `description` 이 없어서, meta description 이 전부
`SITE_DESCRIPTION` 하나로 채워지고 있었습니다. 검색 결과에서 어느 글인지
구분이 안 되는 상태였습니다.

- **없는 소개문을 지어내지 않기로 했습니다.** 대신 본문 앞부분에서 뽑아 `<head>` 에만 씁니다 — 화면 카드에는 여전히 안 나옵니다. 소개문이 없는 글은 없는 채로 보이는 게 맞다고 봤습니다. RSS 설명도 같은 값을 씁니다.
- **공유 카드가 텅 비던 것** — `heroImage` 가 없는 글이 대부분이라 OG 이미지가 아예 안 붙었습니다. 없으면 프로필 이미지로 떨어지게 했습니다.
- **구조화 데이터(JSON-LD)를 넣었습니다.** 글이면 `BlogPosting`, 나머지는 `WebSite`. ⚠ 여기 넣는 값은 **화면에도 있는 것**만 씁니다. 안 보이는 정보를 구조화 데이터에만 넣으면 스팸으로 봅니다.
- `robots.txt` 를 넣고 sitemap 위치를 알렸습니다. 막은 건 `/admin/` 뿐입니다.

⚠ **`BaseHead.astro` 의 `google-site-verification` 태그를 지우지 마세요.** Search Console 소유권 확인용인데, 확인이 끝난 뒤에도 구글이 주기적으로 다시 봅니다 — 사라져 있으면 속성이 해제되고 색인 현황·검색어 데이터를 못 봅니다. `lim-it.vercel.app` 은 서브도메인이라 DNS 확인 방식을 못 써서 이 태그가 유일한 끈입니다. **커스텀 도메인으로 옮기면** 그때는 DNS 방식으로 갈아타고 이 태그를 빼도 됩니다.

⚠ **비밀글(§6-3)에는 요약을 뽑지 않습니다.** 본문을 잠가 놓고 meta description
으로 앞부분을 흘리면 잠근 의미가 없습니다. RSS 는 비밀글을 아예 빼고 있어서
괜찮지만, **본문에서 뭔가를 뽑아 쓰는 코드를 새로 넣을 때는 `secret` 을 같이
확인하세요.**
