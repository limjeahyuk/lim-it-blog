# lim-it — devlog 블로그

게임을 만들면서 **왜 그렇게 고쳤는지, 그래서 뭐가 터졌는지**를 남기는 블로그입니다.
Astro + MDX. 글 하나가 파일 하나이고, 커밋하면 Vercel이 배포합니다.

> `CLAUDE.md` 는 이 파일을 가리키는 심볼릭 링크입니다. 규약은 여기 한 곳에만 씁니다.

---

## 1. 말투 — 제일 자주 틀리는 부분

**참고 기준:** https://hyuk-todayfeelsogood.tistory.com/

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
description: 목록에 보이는 한 줄 요약 (존댓말)
pubDate: 2026-08-07
project: gridbrawl     # 선택. 개인 개발 글이면 생략
author: ai             # me | ai | both  (기본값 me)
tags: [게임설계, 리팩터링]
draft: false
---
```

- `project` 는 `src/consts.ts` 의 `PROJECTS[].id` 와 **반드시** 일치해야 합니다. 안 맞으면 빌드가 깨집니다 (의도한 것 — 오타를 배포 전에 잡습니다).
- `author` 는 정직하게 적습니다. AI가 초안을 쓰면 `ai`, 사람이 손보면 `both`, 사람이 처음부터 쓰면 `me`.
- 태그에 슬래시(`/`)를 쓰지 않습니다. URL이 깨집니다.
- 파일명이 그대로 URL이 됩니다 (`status-effects-redefined.md` → `/posts/status-effects-redefined`). 영문 소문자 + 하이픈.

---

## 4. 디자인 시스템

### 출처

색과 radius 는 **limSystem** 에서 가져왔습니다.

```
원본: ~/Develop/React/limSystem/src/util/theme.ts
사본: src/styles/tokens.css
```

limSystem 은 별도 Next.js 앱(`private: true`)이라 패키지로 못 가져옵니다. 값을 옮겨온 것이라 **원본이 바뀌면 `tokens.css` 도 같이 고쳐야 합니다.**

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
| 0° | `--nj-red` | RED_400 | CoupleApp | 6.3:1 |
| 33° | `--nj-amber` | ORANGE_300 | TossTreasureHunt | 10.1:1 |
| 34° | `--nj-orange` | ORANGE_400 | BeepTimer | 7.7:1 |
| 121° | `--nj-green` | GREEN_400 | MineApp | 7.8:1 |
| 181° | `--nj-teal` | TEAL_400 | GridBrawl | 10.7:1 |
| 209° | `--nj-blue` | BLUE_400 | MiniGame Speeder | 6.2:1 |

**강조색은 청록입니다.**

| 토큰 | 값 | 쓰임 | 대비 |
|---|---|---|---|
| `--nj-accent` | TEAL_500 | 다크 인용문 선 | 8.4:1 |
| `--nj-accent-text` | TEAL_300 | 다크 링크 | 12.6:1 |
| `--nj-accent-deep` | TEAL_700 | 라이트 공용 | 4.6:1 (흰 배경) |

**청록은 강조색 계열이라 프로젝트에는 GridBrawl 하나만 씁니다.** 대표 프로젝트가 브랜드 색을 공유하는 건 의도한 것이고, 여기에 하나 더 넣으면 어느 게 강조인지 안 읽힙니다.

⚠ **`--nj-orange`(34°)와 `--nj-amber`(33°)는 색상이 1° 차이입니다.** limSystem 에 보라·분홍 계열이 없어서 6개를 전부 다른 계열로 못 뽑았습니다. 명도로 갈리니(7.7:1 vs 10.1:1) **목록에서 나란히 두지 마세요.**

프로젝트가 더 늘면 limSystem 의 300/500 단계에서 뽑되, **기존 색과 hue 가 30° 이상 떨어지거나 명도가 확실히 다른 것**을 고르세요.

### 색을 바꿀 때 반드시 확인할 것

파스텔은 배경에 따라 대비가 확 달라집니다. **눈대중하지 말고 계산하세요.**

- **본문 링크(`--accent-text`)는 4.5:1 이상.** 티파니 원색은 흰 배경에서 3.4:1 밖에 안 나와서, 라이트 테마는 진한 쪽(`--rc-tiffany-deep`)을 따로 씁니다.
- **색 알약 위 글자(`--pill-fg`)는 두 테마 모두 어두운 색.** 알약 배경이 양쪽 다 밝은 파스텔이라, 흰 글자면 1.5~3.0:1 로 떨어집니다.
- **`.live` 배지는 `--card` 를 글자색으로 씁니다.** `--pill-fg` 를 쓰면 라이트 테마에서 어두운 글자 + 어두운 배경이 됩니다.

새 색이 필요하면 `tokens.css` 에 추가하고, `global.css` 에서 의미 토큰으로 연결하세요.

### 레이아웃

morethan-log 를 참고한 3열 구조입니다. 이 구조를 유지하세요.

```
[ 🏷️ Tags ]  [ 📚 글 목록 ]  [ 💻 Profile / 🎮 Works / 💬 Contact ]
   span 2         span 7                  span 3
```

- 12열 그리드, `gap: 1.5rem`, 컨테이너 `max-width: 1120px`
- 1024px 미만에서는 사이드바가 숨고 태그만 가로 스크롤로 남습니다
- 헤더는 `height: 3rem` sticky

### 폰트

**Pretendard Variable** 한 벌만 씁니다 (`src/assets/fonts/PretendardVariable.woff2`, 100~900).

라이선스는 **SIL OFL 1.1** 이고 `src/assets/fonts/Pretendard-LICENSE.txt` 에 동봉돼 있습니다. **이 파일을 지우지 마세요.** OFL은 폰트를 재배포할 때 라이선스 사본을 같이 넣도록 요구합니다.

---

## 5. 게임 저장소에서 devlog 뽑기

게임 소스는 이 저장소에 없습니다. 전부 별도 비공개 저장소이고, 로컬에서는 형제 디렉토리에 있습니다.

```
~/Develop/claude/
  ├── blog/            ← 여기
  ├── GridBrawl/       ← 커밋 79개, 진행 중
  ├── BeepTimer/       ← 커밋 67개
  ├── MineApp/         ← 커밋 50개
  ├── CoupleApp/       ← git 저장소 아님
  ├── MiniGame_Speeder/
  └── TossTreasureHunt/
```

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
4. `src/content/posts/<slug>.md` 로 씁니다. `author: ai`.
5. 사람이 읽고 고친 뒤 `author: both` 로 바꿉니다.

---

## 6. 프로젝트 추가

`src/consts.ts` 의 `PROJECTS` 배열에 한 줄 추가하고, `public/admin/config.yml` 의 `project` select 에도 같은 값을 추가합니다. **두 군데입니다.**

`color` 는 카드의 카테고리 알약과 Works 목록의 점 색으로 쓰입니다.

---

## 7. 명령어

```bash
npm run dev       # http://localhost:4321
npm run build     # 빌드 (frontmatter 스키마 검증 포함)
npm run preview   # 빌드 결과 확인

npm run post                     # 빌드 검증 → 커밋 → push
npm run post -- "넉백 버그 수정"    # 커밋 메시지 지정

npm run cms       # Decap 로컬 서버 (GitHub 없이 /admin 테스트)
```

`draft: true` 인 글은 `dev` 에서는 보이고 `build` 에서는 빠집니다.

`npm run post` 는 **빌드가 깨지면 push 하지 않습니다.** frontmatter 오타가 배포된 뒤에 발견되는 걸 막기 위해서입니다.
