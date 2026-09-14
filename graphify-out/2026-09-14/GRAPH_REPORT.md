# Graph Report - blog  (2026-09-14)

## Corpus Check
- 203 files · ~2,370,936 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .css 3, (none) 2, .woff2 2)

## Summary
- 1454 nodes · 1896 edges · 176 communities (136 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afde34a8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Header.astro
- skin.js
- editor.js
- GripLayer
- editors.js
- drafts.js
- SizeLayer
- 8. 고친 것 기록
- package.json
- sync-authors.mjs
- check-md-roundtrip.mjs
- sync-icons.mjs
- devDependencies
- scripts
- [...slug].astro
- api/views.js
- pager.ts
- dependencies
- tsconfig.json
- astro.config.mjs
- consts.ts
- post.sh
- 쿼리문
- 4. 디자인 시스템
- 본문 편집기 — tiptap 입니다
- flutter-112.md
- Dart의 장점
- header
- upload.js
- getPublishedPosts
- posts.ts
- [project]/index.astro
- Claude.md
- Vite로 시작하면 뭐가 더 좋은가?
- **MainActivity.java**
- KVO (Key-Value Observing)
- lim-it — 개발 매거진
- 중괄호가 있는 JSX
- 컴포넌트에 props 전달하기
- study-106.md
- study-56.md
- Class
- Flutter 동작 원리
- magazine-plan.md
- react-school-22.md
- registerWidget
- Next.js
- SHAPER SPIDER
- ShapeSpider 세팅
- shortcuts.js
- mineapp-shared-board.md
- react-32.md
- react-school-20.md
- Redirect &amp; Rewrite
- study-107.md
- android-school-23.md
- blog-magazine-remake.md
- Dart 언어
- 변수
- Dart의 자료형
- mineapp-treasure-hunt.md
- ponytail-graphify.md
- react-42.md
- react-47.md
- react-school-14.md
- react-school-24.md
- **한줄 요약**
- study-97.md
- BaseLayout.astro
- blog-rebuild-notes.md
- android-school-17.md
- mineapp-solo-board.md
- mineapp-speed-race.md
- mineapp-touch-coop.md
- react-46.md
- **React 구성요소**
- **\- WebStorage**
- status-effects-redefined.md
- study-100.md
- study-108.md
- study-111.md
- study-98.md
- swiftui-68.md
- 6-6. 조회수
- 배포 (최초 1회)
- beeptimer-92.md
- beeptimer-93.md
- Function
- flutter-122.md
- react-36.md
- react-38.md
- react-41.md
- SEO AEO GEO
- study-101.md
- study-96.md
- swiftui-67.md
- swiftui-71.md
- swiftui-73.md
- 1. 말투 — 제일 자주 틀리는 부분
- android-school-21.md
- android-school-28.md
- android-school-6.md
- javascript-7.md
- react-37.md
- react-53.md
- react-school-16.md
- react-school-25.md
- storyboard-62.md
- storyboard-69.md
- study-99.md
- study-diary-83.md
- study-diary-84.md
- swiftui-65.md
- swiftui-66.md
- swiftui-75.md
- swiftui-80.md
- 6-7. 검색엔진
- 3. frontmatter 규약
- 6-5. 사진은 Cloudinary 로 올라갑니다
- android-school-26.md
- flutter-120.md
- ios-72.md
- ios-76.md
- javascript-12.md
- javascript-3.md
- javascript-9.md
- React가 좋은 이유
- react-29.md
- react-31.md
- react-33.md
- react-34.md
- react-35.md
- react-40.md
- react-school-5.md
- storyboard-60.md
- storyboard-61.md
- study-57.md
- study-diary-86.md
- 2. 글 쓰는 방식
- ios-79.md
- ios-82.md
- javascript-10.md
- javascript-11.md
- javascript-52.md
- react-30.md
- react-39.md
- sdk-89.md
- Xcode 설치 및 프로젝트 생성.
- study-102.md
- study-49.md
- study-50.md
- study-95.md
- study-diary-103.md
- study-diary-85.md
- javascript-13.md
- react-55.md
- sdk-88.md
- study-48.md

## God Nodes (most connected - your core abstractions)
1. `8. 고친 것 기록` - 62 edges
2. `el()` - 39 edges
3. `GripLayer` - 28 edges
4. `SizeLayer` - 22 edges
5. `4. 디자인 시스템` - 22 edges
6. `getPublishedPosts()` - 21 edges
7. `openViewsPage()` - 19 edges
8. `lim-it — 개발 매거진` - 18 edges
9. `registerWidget()` - 17 edges
10. `pass()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `getStaticPaths()` --calls--> `getPublishedPosts()`  [EXTRACTED]
  src/pages/posts/[...slug].astro → src/lib/posts.ts
- `registerWidget()` --calls--> `blockAt()`  [EXTRACTED]
  admin-src/editor.js → admin-src/blocks.js
- `registerWidget()` --calls--> `setBlock()`  [EXTRACTED]
  admin-src/editor.js → admin-src/blocks.js
- `registerWidget()` --calls--> `registerPort()`  [EXTRACTED]
  admin-src/editor.js → admin-src/drafts.js
- `finishSave()` --calls--> `draftSaved()`  [EXTRACTED]
  admin-src/save.js → admin-src/drafts.js

## Import Cycles
- None detected.

## Communities (176 total, 22 thin omitted)

### Community 0 - "Header.astro"
Cohesion: 0.16
Nodes (9): width, IconName, Project, EXTRA_ICON_NAMES, ICON_NAMES, IconName, LIM_ICON_NAMES, countByProject() (+1 more)

### Community 1 - "skin.js"
Cohesion: 0.07
Nodes (77): listDrafts(), registerPort(), buildSaveModal(), closeSaveModal(), confirmSave(), finishSave(), leaveToList(), onSaveIntent() (+69 more)

### Community 2 - "editor.js"
Cohesion: 0.12
Nodes (20): Align, ALIGNS, EXTENSIONS_FOR_HTML, htmlExtensions(), setAlignExtensions(), attrOf(), BUTTONS, CODE_LANGS (+12 more)

### Community 3 - "GripLayer"
Cohesion: 0.09
Nodes (15): cellPos(), COL_MENU, COMMANDS, GripLayer, key, LimTable, repCell(), ROW_MENU (+7 more)

### Community 4 - "editors.js"
Cohesion: 0.13
Nodes (31): AUTHOR_COUNTS, AUTHOR_LIST, AUTHOR_NAMES, addEditor(), avatar(), byId(), card(), clearCards() (+23 more)

### Community 5 - "drafts.js"
Cohesion: 0.15
Nodes (29): ago(), draftAgo(), draftSaved(), draftsPass(), drop(), dropDraft(), entryKey(), FIELDS (+21 more)

### Community 6 - "SizeLayer"
Cohesion: 0.15
Nodes (7): anchorOf(), boxWidth(), ImageGrips, key, posOfImage(), selectedImage(), SizeLayer

### Community 7 - "8. 고친 것 기록"
Cohesion: 0.03
Nodes (62): 2026-08-13 · `/admin` 본문에 툴바를 붙였습니다, 2026-08-13 · `/admin` 토글이 빈 상자를 하나씩 차지하던 것, 2026-08-13 · `/admin` 편집기를 tiptap 으로 바꿨습니다, 2026-08-13 · 검색엔진에 글이 제대로 안 잡히던 것, 2026-08-13 · 글 상세에 사이드바를 붙였다가 뺐습니다, 2026-08-13 · 글쓴이 표시를 뺐습니다, 2026-08-13 · 카테고리·태그를 없애고 저자로 합쳤습니다 (매거진화), 2026-08-13 · 카테고리·프로젝트 값의 첫 글자가 잘리던 것 (+54 more)

### Community 8 - "package.json"
Cohesion: 0.13
Nodes (14): engines, node, name, type, version, esbuild, sharp, @tiptap/extension-image (+6 more)

### Community 9 - "sync-authors.mjs"
Cohesion: 0.14
Nodes (13): authors, begin, config, configFile, counts, dataFile, end, genFile (+5 more)

### Community 10 - "check-md-roundtrip.mjs"
Cohesion: 0.18
Nodes (7): jsdom, changed, dom, editor, files, lost, showDiff

### Community 11 - "sync-icons.mjs"
Cohesion: 0.18
Nodes (8): clash, dest, extra, extraNames, files, limNames, root, typeFile

### Community 12 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, esbuild, jsdom, @tiptap/core, @tiptap/extension-image, @tiptap/extension-list, @tiptap/extension-table, @tiptap/markdown (+2 more)

### Community 13 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, admin, astro, authors, build, cms, dev, icons (+2 more)

### Community 14 - "[...slug].astro"
Cohesion: 0.29
Nodes (9): deriveKey(), getSecretPassword(), ITERATIONS, requireSecretPassword(), SealedContent, sealHtml(), te, toBase64() (+1 more)

### Community 15 - "api/views.js"
Cohesion: 0.47
Nodes (8): creds(), handler(), pipeline(), redis(), sameToken(), slugOf(), toCounts(), today()

### Community 16 - "pager.ts"
Cohesion: 0.39
Nodes (7): Options, PER_PAGE, sequence(), setupPager(), apply(), draw(), go()

### Community 17 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, astro, @astrojs/rss, @astrojs/sitemap, sharp, @vercel/analytics, @vercel/speed-insights

### Community 18 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): astro/tsconfigs/strict, compilerOptions, strictNullChecks, exclude, extends, include

### Community 20 - "consts.ts"
Cohesion: 0.13
Nodes (18): canonicalURL, ogImage, person, AUTHOR_COLORS, AUTHOR_IDS, AuthorColor, AuthorId, OWNER (+10 more)

### Community 24 - "쿼리문"
Cohesion: 0.07
Nodes (27): CONVERT\_TZ, DATE, DECLARE CONTINUE GANDLER FOR SQLEXCEPTION, DECLARE EXIT HANDLER FOR SQLEXCEPTION, DECLARE ... HANDLER 구문 분석, FIND\_IN\_SET, SELECT INTO, SQL Security 옵션 (+19 more)

### Community 25 - "4. 디자인 시스템"
Cohesion: 0.09
Nodes (22): 4. 디자인 시스템, 강조색과 프로젝트 색 — Neon Jungle, 검색, 글이 많아서 생긴 규칙, 레이아웃 — 이제 3열 지면이 없습니다, 로고 — 글자가 아니라 그림입니다 (2026-09-10), 색을 바꿀 때 반드시 확인할 것, 서고 (`/posts`) 와 저자 지면 (`/authors/<id>`) — 한 쌍입니다 (+14 more)

### Community 26 - "본문 편집기 — tiptap 입니다"
Cohesion: 0.11
Nodes (19): 6-2. 폰에서 쓰는 `/admin`, 그 밖에, 단축키 — 하니 매거진에서 옮겨온 것, 두 화면을 다시 그립니다 — `admin-src/editors.js`, 문단 정렬 — `admin-src/align.js`, 「발행 설정」은 저장할 때 묻습니다, 본문 편집기 — tiptap 입니다, 사진 크기 손잡이 — `admin-src/resize.js` (+11 more)

### Community 27 - "flutter-112.md"
Cohesion: 0.11
Nodes (17): 1) “완전한 네이티브 대체”는 아님, 1) 위젯 중심 UI, 1) 한 번 개발 → 여러 플랫폼 생산성, 2) UI/애니메이션 구현이 강함, 2) 앱 용량 증가 가능성, 2) 자체 렌더링 엔진 기반 (플랫폼 의존 UI가 낮음), 3) Hot Reload / 빠른 개발 사이클, 3) 일관된 UI/동작 (+9 more)

### Community 28 - "Dart의 장점"
Cohesion: 0.12
Nodes (16): 1) Dart 를 쓰는 곳이 Flutter 말고는 적습니다., 1) Flutter를 위해 “딱 맞게” 설계된 언어, 1) 타입 안정성이 있는 언어(Statically typed) + 타입 추론, 2) Null Safety(널 안정성), 2) 개발 경험이 좋다 (Hot Reload의 기반), 2) 패키지 품질 편차가 있습니다., 3) async/await 기반의 비동기 처리, 3) 문법이 비교적 친숙하다 (+8 more)

### Community 29 - "header"
Cohesion: 0.12
Nodes (16): backgroundColor, Body, Button, Card, Column / Row, header, icon, padding (+8 more)

### Community 30 - "upload.js"
Cohesion: 0.20
Nodes (13): firstTransform(), guardMediaLibrary(), healAsset(), imagesIn(), ImageUpload, key, placeholderAt(), readCloudinary() (+5 more)

### Community 31 - "getPublishedPosts"
Cohesion: 0.30
Nodes (10): astro, @astrojs/rss, getAuthor(), getProject(), excerpt(), stripControl(), getPublishedPosts(), GET() (+2 more)

### Community 32 - "posts.ts"
Cohesion: 0.22
Nodes (10): tabs, Author, AUTHORS, colorVar(), toVoice(), countByAuthor(), Post, postsByAuthor() (+2 more)

### Community 33 - "[project]/index.astro"
Cohesion: 0.28
Nodes (9): PROJECTS, ALLOWED_HOSTS, Cover, coverOf(), firstBodyImage(), postsByProject(), leadSentence(), cards (+1 more)

### Community 34 - "Claude.md"
Cohesion: 0.13
Nodes (14): 1. 200줄을 넘기지 않기., 2. `@import`는 토큰을 아껴주지 않습니다, 3. path-scoped rules, 4. 유지보수 메모는 HTML 주석으로, 5. 모노레포라면 `claudeMdExcludes`, 6. 구체성이 곧 토큰 절약, Claude.md, CloudeCode Token 절약 (+6 more)

### Community 35 - "Vite로 시작하면 뭐가 더 좋은가?"
Cohesion: 0.14
Nodes (13): 1) 개발 서버 시작이 빠름(Cold Start 개선), 1) “고성능 프로덕션 앱” 만들기에 한계가 커졌음, 2) 필요한 것만 즉시 변환(On-demand Transform), 2) “활동적인 메인테이너가 없다”, 3) 의존성 프리번들링(Pre-bundling) + esbuild 활용, 3) 이미 대안(프레임워크/빌드툴)이 성숙했고, React도 그쪽을 권장, 4) “현대 React 권장 흐름”에 맞춰 가기 쉬움, 4) (현실적인 이유) 최신 생태계(예: React 19)와의 마찰 비용이 커짐 (+5 more)

### Community 36 - "**MainActivity.java**"
Cohesion: 0.15
Nodes (12): **1\. 먼저 화면에 만들어놓은 버튼들을 사용하기 위해 지정해줍니다.**, **2\. 숫자 버튼을 누르면 textview에 숫자가 나타나게 만들어줍니다.**, **3\. 숫자 버튼마다 click를 넣어줍니다.**, **4\. 숫자를 누르기 전 textview가 깨끗해야 합니다.**, **5\. 연산자를 눌렀을 때 값과 누른 연산자를 저장해줘야 합니다.**, **6\. 연산자 버튼에 o\_clik을 넣어줍니다.**, **7\. 예외처리**, **8\. 문제점** (+4 more)

### Community 37 - "KVO (Key-Value Observing)"
Cohesion: 0.15
Nodes (12): KVC (Key-Value Coding), KVC 예제, KVC 장단점, KVO (Key-Value Observing), KVO 또한 마찬가지, KVO 예제, KVO 장단점, 단점 (+4 more)

### Community 38 - "lim-it — 개발 매거진"
Cohesion: 0.17
Nodes (12): 0. 작업 규칙 — 손대기 전에 읽으세요, 5-2. 티스토리에서 옮겨온 글, 5. 게임 저장소에서 devlog 뽑기 (게임 글을 쓸 때만), 6-3. 비밀글, 6-4. 폰으로 보는 블로그, 6. 프로젝트 추가, 7. 명령어, graphify (+4 more)

### Community 39 - "중괄호가 있는 JSX"
Cohesion: 0.17
Nodes (11): 1\. 단일 루트 요소 반환, 2\. 모든 태그 닫기, 3\. camelCase, ※ css 스타일에 관하여 ※, JSX로 마크업 작성하기, JSX의 규칙, 문자열은 따옴표로 전달합니다., 요약 (+3 more)

### Community 40 - "컴포넌트에 props 전달하기"
Cohesion: 0.17
Nodes (11): 1\. 자식 구성 요소에 props 전달, 2\. 자식 구성 요소 내부의 props 읽기, JSX를 자식으로 전달, props 전달하는 방법, props를 사용하게 된다면?, props의 구조화, props의 기본값 지정, 스프레드 구문을 사용하여 props 전달. (+3 more)

### Community 41 - "study-106.md"
Cohesion: 0.17
Nodes (11): 1px에 몇 바이트?, frame vs bounds 간단 비교, Segmentation Fault / Segmentation Crash란?, Swift에서 Final 이란?, Swift에서는, UIKit에서 frame를 작성을 할때 그 frame에 넣는 width와 height값은 뭔가요?, 개발할 때 어떻게 쓰이나?, 대표적인 포맷과 바이트 수 (+3 more)

### Community 42 - "study-56.md"
Cohesion: 0.17
Nodes (11): **<Account.GetTestUser>**, **api**, **Controller**, **database**, **Filter sp**, **next? node?**, **Next 파일 기반 라우트**, **pages** (+3 more)

### Community 43 - "Class"
Cohesion: 0.18
Nodes (10): Abstract Classes (추상화 클래스), Cascade Notation, Class, Constructors ( 생성자 ), Enums, Inheritance (상속), Mixins, Named constructor (+2 more)

### Community 44 - "Flutter 동작 원리"
Cohesion: 0.18
Nodes (10): 1) Framework: “위젯(선언형 UI)”를 트리로 만든다, 2) Engine: “픽셀을 찍고(GPU) 화면에 뿌린다”, 3) Embedder, **Flutter**, Flutter 동작 원리, Flutter를 배우는 이유, React Native VS Flutter, **RN** (+2 more)

### Community 45 - "magazine-plan.md"
Cohesion: 0.18
Nodes (10): 밝힐 것인가, 순서, 쓰는 방식이 뒤집힙니다, 안 하기로 제안하는 것, 이름을 어떻게 쓸 것인가, 저자 초안, 저자 파일 하나가 말투까지 정합니다, 정해주셔야 하는 것 (+2 more)

### Community 46 - "react-school-22.md"
Cohesion: 0.18
Nodes (10): **async / await**, **axios**, **code**, **Http Methods**, https://localhos:8080/api/1.0/boards, https://localhos:8080/api/1.0/boards/10, **OpenWeatherMap**, **Promise** (+2 more)

### Community 47 - "registerWidget"
Cohesion: 0.20
Nodes (6): draftField(), hasImageFile(), isRoundTripSafe(), normalizeMarkdown(), registerWidget(), slugStamp()

### Community 48 - "Next.js"
Cohesion: 0.20
Nodes (9): AEO (답변 엔진 최적화) 측면의 강점, GEO (생성형 엔진 최적화) 측면의 강점, Next.js, **Next.js의 구동 방식 (사전 렌더링, SSR/SSG)**, Nextjs - AEO GEO, NextJS - SEO, **Q. 왜 크롤러에게 Next.js가 압도적으로 유리한가요?**, 다른 것 들 과 다른 점 (+1 more)

### Community 49 - "SHAPER SPIDER"
Cohesion: 0.20
Nodes (9): SHAPER SPIDER, UI/UX 레이아웃, 게임 개요, 게임 구성 요소, 게임 룰, 게임 플레이 플로우, 난이도, 조작 (+1 more)

### Community 50 - "ShapeSpider 세팅"
Cohesion: 0.20
Nodes (9): AI 세팅, Claude.md, Q. 우선 문서로 정리해주시고요 그리고 프로젝트 생성만 먼저 해주세요 그 내부에 코딩은 하지마시고요. 그 프로젝트에 [Claude.md](http://Claude.md) 파일 하나만 만들어주세요 제가 룰을 먼저 쭉 작성하고 그 이후에 코딩을 시킬것입니다., ShapeSpider 세팅, 결과물, 디자인, 렌더링 방식, 어떤 것을 사용할 것인지? (+1 more)

### Community 51 - "shortcuts.js"
Cohesion: 0.31
Nodes (7): blockAt(), BLOCKS, HEADING_LEVELS, setBlock(), BlockShortcuts, ImeShortcuts, ToolShortcuts

### Community 52 - "mineapp-shared-board.md"
Cohesion: 0.22
Nodes (8): 깃발에 색상을 추가했습니다, 내 깃발은 서버 값으로 덮지 않습니다, 봇은 진짜로 판을 풉니다, 정리, 지뢰를 밟아도 죽지 않습니다, 터진 지뢰 때문에 주변 일괄 열기가 안 됐습니다, 합동은 고급·최고급에서만 됩니다, 합동은 승패를 상대에게 물어보면 안 됐습니다

### Community 53 - "react-32.md"
Cohesion: 0.22
Nodes (8): **\- concat ( )**, **\-  filter ( )**, **\- find ( )**, **\- findIndex ( )**, **\- map ( )**, **\- reduce ( )**, **\- slice ( )**, **\- splice ( )**

### Community 54 - "react-school-20.md"
Cohesion: 0.22
Nodes (8): **\- Dark Mode**, **\- export**, **\- hooks**, **\- PageNation**, **\- Random , ceil , floor**, **\- useEffect**, **※ 이해하기 너무 어려움 ※**, **\- 페이지 최적화**

### Community 55 - "Redirect &amp; Rewrite"
Cohesion: 0.22
Nodes (8): Redirect &amp; Rewrite, 동작 흐름, 동작 흐름, 리다이렉트, 리라이트, 리라이트가 빠르고 더 좋은 거 아닌가요?, 장단점, 장단점

### Community 56 - "study-107.md"
Cohesion: 0.22
Nodes (8): absolute, css를 이용한 간단한 애니메이션, Fixed, Header 부분, postion의 속성, relative, static, sticky

### Community 57 - "android-school-23.md"
Cohesion: 0.25
Nodes (7): **CheckBox ( Java )**, **CheckBox ( Xml )**, **ImageView**, **RadioButton ( Java )**, **RadioButton ( Xml )**, **과제**, **완 전 재 미 있 음**

### Community 58 - "blog-magazine-remake.md"
Cohesion: 0.25
Nodes (7): 검색을 붙였습니다, 남은 것, 디자인 벤치마킹, 시안을 여러개 뽑아봤습니다., 약간의 블로그 색깔, 차이점 ?, 헤더는 버튼 하나로 접었습니다

### Community 59 - "Dart 언어"
Cohesion: 0.25
Nodes (8): ;, Dart - Flutter, Dart Native, Dart 언어, Dart 특징, main 함수, null Safety, 두 개의 컴파일러

### Community 60 - "변수"
Cohesion: 0.25
Nodes (7): const, dynamic, final, late, null safety, var, 변수

### Community 61 - "Dart의 자료형"
Cohesion: 0.25
Nodes (7): collection for, collection if, Dart의 자료형, List, Map, Set, string interpolation

### Community 62 - "mineapp-treasure-hunt.md"
Cohesion: 0.25
Nodes (7): 기획에서 지운 것, 대전에서는 되돌리지 않습니다, 보드 크기가 홀수인 이유, 이미 연 칸 옆만 열 수 있습니다, 정리, 지뢰를 밟으면 주변 5×5가 닫힙니다, 지뢰보다 길을 먼저 팠습니다

### Community 63 - "ponytail-graphify.md"
Cohesion: 0.25
Nodes (7): AI Agent 도구, Graphify, Ponytail, 사용법, 사용법, 언제 유용한가, 언제 유용한가

### Community 64 - "react-42.md"
Cohesion: 0.25
Nodes (7): **\- Clean up**, **\- Effect 사용 예시**, **\- localStorage**, **Render > Clean up > Effect**, **\- useEffect**, **\- useEffect  요약**, **\- 사이드 이펙트**

### Community 65 - "react-47.md"
Cohesion: 0.25
Nodes (7): **\- DB 데이터 수정 ( UPDATE )**, **\- DB 데이터 해당 id 조회하기 ( READ )**, **\- DB에 값 삭제하기 ( DELETE )**, **\- DB에 값 추가하기 ( CREATE )**, **\- DB의 data 값 전체 조회 ( READ )**, **설명**, 여기까지 NodeJs와 React를 합치고 간단한 CRUD를 만들어본 프로젝트입니다.

### Community 66 - "react-school-14.md"
Cohesion: 0.25
Nodes (7): **Const**, **Datas**, **Faker**, **Key**, **Props**, **Return 반환**, **Script 분리**

### Community 67 - "react-school-24.md"
Cohesion: 0.25
Nodes (7): **기본값 프로퍼티**, **불리언 프로퍼티**, **컴포넌트 개념**, **컴포넌트 구성요소**, **컴포넌트 추가하는 방식**, **프로퍼티**, **필수 프로퍼티**

### Community 68 - "**한줄 요약**"
Cohesion: 0.25
Nodes (7): **JPG (Joint Photographic Experts Group)**, **PNG (Portable Network Graphics)**, **간단 정리**, **성능 / 최적화 관점**, **압축 방식 & 품질 차이**, **용도/상황별 추천**, **한줄 요약**

### Community 69 - "study-97.md"
Cohesion: 0.25
Nodes (7): **ARC (Automatic Reference Counting)**, **ARC 예제**, **Garbage Collection의 단점 / 트레이드오프**, **Garbage Collection의 장점**, **Heap 메모리의 구조**, **Mark & Sweep**, **왜 Garbage Collection이 필요할까?**

### Community 71 - "blog-rebuild-notes.md"
Cohesion: 0.29
Nodes (4): 되돌리기를 살리려다 띄어쓰기를 잃었습니다, 붙였다가 되돌린 것, 판단의 근거를 파일 하나에 모았습니다, 폰에서 글을 쓰려다 정말 UI가 최악인 것을 확인.

### Community 72 - "android-school-17.md"
Cohesion: 0.29
Nodes (6): **Layout**, **Margin  & Padding**, **trim()**, **안드로이드 Activity 생명주기**, **알림 창**, **앱 이름.**

### Community 73 - "mineapp-solo-board.md"
Cohesion: 0.29
Nodes (6): 난이도는 네 개입니다, 앱을 껐다 켜도 판이 남습니다, 정리, 죽어도 이어서 할 수 있게 했습니다, 첫 탭에서는 지뢰를 밟지 않습니다, 판 코드 — 시드를 사람이 읽을 수 있게

### Community 74 - "mineapp-speed-race.md"
Cohesion: 0.29
Nodes (6): 매칭 직후 바로 시작하지 않습니다, 봇이 너무 빨라서 이길 수가 없었습니다, 서버가 내려보내는 건 이게 전부입니다, 정리, 진행률은 0.5초에 한 번만 보냅니다, 판이 끝나지 않는 경우를 막았습니다

### Community 75 - "mineapp-touch-coop.md"
Cohesion: 0.29
Nodes (6): 만남은 상하좌우로만 인정합니다, 시작점은 30칸 이상 떨어뜨렸습니다, 안개가 상대를 알려 줍니다, 정리, 지뢰를 밟으면 파트너가 손해를 봅니다, 혼자 확인할 수 있는 시뮬을 만들었습니다

### Community 76 - "react-46.md"
Cohesion: 0.29
Nodes (6): **express란?**, **proxy란?**, \- 기본 틀, \- 동기, \- 소개, **\- 연결**

### Community 77 - "**React 구성요소**"
Cohesion: 0.29
Nodes (6): 1 단계. 내보내기, 2단계. 함수 정의, 3 단계. 마크업 추가, **React 구성요소**, **React 시작**, 요약

### Community 78 - "**\- WebStorage**"
Cohesion: 0.29
Nodes (6): **Api**, localStorage **vs** sessionStorage, **\- WebStorage**, **데이터가 여러 개 라면?**, **\- 사용 예제**, **\- 사용 예제. 2**

### Community 79 - "status-effects-redefined.md"
Cohesion: 0.29
Nodes (6): 그런데 고치다 보니 용어가 틀려 있었습니다, 기준을 하나 정했습니다, 덤으로 잡힌 버그, 유물이 규칙을 늘리자 안전장치가 필요해졌습니다, 정리, 함정 하나가 규칙째로 사라졌습니다

### Community 80 - "study-100.md"
Cohesion: 0.29
Nodes (6): 대칭 암호화 (Symmetric), 비대칭 암호화 (Asymmetric), 비대칭 암호화 알고리즘, 비대칭 암호화 예시, 암호화, 하이브리드 방식.

### Community 81 - "study-108.md"
Cohesion: 0.29
Nodes (5): em (현재 요소 기준 단위), px, rem (루트 기준 단위), vm / vh ( 뷰포트 단위 ), % ( 퍼센트 )

### Community 82 - "study-111.md"
Cohesion: 0.29
Nodes (6): array / object 변경., Destructuring, state 변경 방법, state 변경함수 특징., state를 사용해야하는 이유., useState

### Community 83 - "study-98.md"
Cohesion: 0.29
Nodes (6): **그러면 어떤 데이터를 캐시에 저장?**, **예제**, 왜 캐시가 필요한가?, **캐시의 단점**, **캐시의 장점**, **캐시의 종류**

### Community 84 - "swiftui-68.md"
Cohesion: 0.29
Nodes (6): **Landmark 목록 만들기**, **List 클릭시 Detal 페이지 이동**, **List를 동적으로 만들기**, **랜드 마크 모델 만들기**, **리스트에 들어갈 Row 만들기**, **하위 뷰에 데이터 전달**

### Community 85 - "6-6. 조회수"
Cohesion: 0.33
Nodes (6): 6-6. 조회수, `/admin` 의 대시보드 — 글·에디터·미디어 옆 탭, 세는 규칙, 숫자를 아무에게나 주지 않습니다, 왜 이렇게 했나, 저장소는 Upstash Redis 입니다

### Community 86 - "배포 (최초 1회)"
Cohesion: 0.33
Nodes (6): 1. GitHub 저장소 만들기, 2. Vercel 연결, 3. 폰에서 글 쓰기 (Decap CMS) — 선택, lim-it, 배포 (최초 1회), 참고

### Community 87 - "beeptimer-92.md"
Cohesion: 0.33
Nodes (5): Live Activity의 생성 및 업데이트에 대해서, Live Activty 활용, 기본 설정, 아이콘, 타이머

### Community 88 - "beeptimer-93.md"
Cohesion: 0.33
Nodes (5): 결론, 실사용 기준 비교, 왜 “Background 진입 시에만 update” 하는게 최고인가?, 최적의 방식은? (애플 권장), 포그라운드에서 Live Activity 업데이트를 자주 하면 왜 안 좋을까?

### Community 89 - "Function"
Cohesion: 0.33
Nodes (5): Function, name argument, optional positional parameter, QQ Operator, typedef

### Community 90 - "flutter-122.md"
Cohesion: 0.33
Nodes (4): context, Widget, widget lifecycle, 예제

### Community 91 - "react-36.md"
Cohesion: 0.33
Nodes (5): **\- event**, **\- Submit**, **\- useState 사용법**, **\- 양방향 바인딩**, **\- 자식에서 부모로 (상향식)**

### Community 92 - "react-38.md"
Cohesion: 0.33
Nodes (5): **\- css 클래스 추가하는 스타일**, **\- inline 스타일**, **\- styled components**, **\- 문제점**, **인라인 스타일은**

### Community 93 - "react-41.md"
Cohesion: 0.33
Nodes (5): **\- div 수프**, **\- ref**, **\- State vs Ref**, **\- 리액트 포털**, **\- 프래그먼트 ( Fragment )**

### Community 94 - "SEO AEO GEO"
Cohesion: 0.33
Nodes (5): **AEO**, **GEO**, SEO, SEO AEO GEO, 개발 단에서 SEO AEO GEO를 향상 시키는 방법

### Community 95 - "study-101.md"
Cohesion: 0.33
Nodes (5): DRAM, HDD, HDD, SSD, DRAM, SSD, “데이터 하나 읽을 때” 실제로 벌어지는 일

### Community 96 - "study-96.md"
Cohesion: 0.33
Nodes (5): Virtual Memory 가 필요한 이유, **단점 / 주의할 점**, 앱 개발자가 이거 알아야하나요?, **장점**, **테스트**

### Community 97 - "swiftui-67.md"
Cohesion: 0.33
Nodes (5): **사용자 지정 이미지 보기 만들기**, **상세 보기 구성**, **새 프로젝트 및 탐색**, **새로운 프레임워크를 사용해보기. ( mapKit )**, **스택을 사용한 뷰 결합**

### Community 98 - "swiftui-71.md"
Cohesion: 0.33
Nodes (5): **각 랜드마크에 즐겨찾기 버튼 만들기**, **목록 필터링**, **사용자가 좋아하는 랜드마크 표시**, **상태를 전환하는 컨트롤러 만들기**, **저장소에 Observable Object 사용**

### Community 99 - "swiftui-73.md"
Cohesion: 0.33
Nodes (5): **Category 별 List에 들어갈 행 만들기**, **Featured 띄우기 & Detail 페이지 이어 주기**, **Grouping을 통해 Category 목록을 만들기.**, **Tab 바 구현**, **새로운 리스트 만들기**

### Community 100 - "1. 말투 — 제일 자주 틀리는 부분"
Cohesion: 0.40
Nodes (5): 1. 말투 — 제일 자주 틀리는 부분, ⚠ 사람이 쓰는 말투는 이것보다 헐겁습니다, 인용 부호는 큰따옴표만 씁니다, 저자마다 다른 것과 같은 것, 직관적인 단어를 씁니다

### Community 101 - "android-school-21.md"
Cohesion: 0.40
Nodes (4): **\- androidManifest**, **\- Handler**, **\- splashActivity**, **\- StartActivityforResult \[ ※ 세상 어렵 ※ \]**

### Community 102 - "android-school-28.md"
Cohesion: 0.40
Nodes (4): **\- AlretDialog**, **\- Data**, **\- SharedPreference**, **\- values**

### Community 103 - "android-school-6.md"
Cohesion: 0.40
Nodes (4): **Activity**, **\- Android Application 구성 요소 -**, **★결과물★**, **★ 실전 ★**

### Community 104 - "javascript-7.md"
Cohesion: 0.40
Nodes (4): ◎ CSS, ◎ Javascript, ◎ 결과, ◎ 매핑 주소 설정.

### Community 105 - "react-37.md"
Cohesion: 0.40
Nodes (4): **\- My code**, **\- Other code**, **\- 문제**, **\- 연산자**

### Community 106 - "react-53.md"
Cohesion: 0.40
Nodes (4): **useReducer**, **useReducer 사용.**, **useState**, **총평**

### Community 107 - "react-school-16.md"
Cohesion: 0.40
Nodes (4): **grid 컨테이너**, **UI 라이브러리**, **결과창**, **추가로...**

### Community 108 - "react-school-25.md"
Cohesion: 0.40
Nodes (4): **Find 함수**, **Icon**, **lat & lon**, **setInterval 함수**

### Community 109 - "storyboard-62.md"
Cohesion: 0.40
Nodes (4): false인 값을 세서 나타내기, 작동을 해보면, 진행 상황, 클릭 시 icon 변경

### Community 110 - "storyboard-69.md"
Cohesion: 0.40
Nodes (4): Bridge란?, **Front -> iOS**, **iOS -> Front**, **전체 코드**

### Community 111 - "study-99.md"
Cohesion: 0.40
Nodes (4): **요약**, **인덱스 구조**, 인덱스의 단점, **인덱스의 장점**

### Community 112 - "study-diary-83.md"
Cohesion: 0.40
Nodes (4): Commit / Branch, Xcode Git 연동., 목표, 새로운 레포지토리 GitHub 추가

### Community 113 - "study-diary-84.md"
Cohesion: 0.40
Nodes (4): Double Slide, 기본 설정., 디자인, 문제

### Community 114 - "swiftui-65.md"
Cohesion: 0.40
Nodes (4): padding, VStack / HStack 의 배치, ZStack, 정렬 및 간격 설정

### Community 115 - "swiftui-66.md"
Cohesion: 0.40
Nodes (4): @Biniding, @State, 만약 여러 View에서 다 접근해야 한다면?, **변수**

### Community 116 - "swiftui-75.md"
Cohesion: 0.40
Nodes (4): **검색창 구현**, **★도움 받은 Blog★**, **문제점**, **사이드 메뉴 띄우기**

### Community 117 - "swiftui-80.md"
Cohesion: 0.40
Nodes (4): @State, 기타, 클릭을 했을 때 이벤트, 화면 이동

### Community 118 - "6-7. 검색엔진"
Cohesion: 0.50
Nodes (4): 2026-09-10 에 실제로 재 본 것 — 구글은 이미 다 먹었습니다, 6-7. 검색엔진, 검색에 안 나올 때 보는 순서, 사이트 이름은 `lim-it` 입니다 (2026-09-09)

### Community 119 - "3. frontmatter 규약"
Cohesion: 0.50
Nodes (4): 3. frontmatter 규약, 저자 얼굴, 저자 — 이 사이트의 유일한 분류, 저자를 늘리는 것은 `/admin` 에서 합니다 (2026-09-09)

### Community 120 - "6-5. 사진은 Cloudinary 로 올라갑니다"
Cohesion: 0.50
Nodes (4): 6-5. 사진은 Cloudinary 로 올라갑니다, `upload_preset` — 떨어뜨리기·붙여넣기에만 쓰는 값, 사진 창을 열면 콘솔에 뜨는 CORS·404 — 우리 것이 아닙니다, 「이미지 선택」으로 넣을 때 터지던 것 — Decap 을 감쌌습니다

### Community 121 - "android-school-26.md"
Cohesion: 0.50
Nodes (3): **CustomListView**, **Inflate**, **ListView**

### Community 122 - "flutter-120.md"
Cohesion: 0.50
Nodes (3): Flutter 설치, 실행, 조금 다른 화면 만들어보기

### Community 123 - "ios-72.md"
Cohesion: 0.50
Nodes (3): **Delegate**, **배열**, **프로그래밍 언어 특징**

### Community 124 - "ios-76.md"
Cohesion: 0.50
Nodes (3): Framework, Library, Library와 framework

### Community 125 - "javascript-12.md"
Cohesion: 0.50
Nodes (3): **\- CSS -**, **\- JavaScript -**, **\- JSP -**

### Community 126 - "javascript-3.md"
Cohesion: 0.50
Nodes (3): \- ajax를 사용하여 api를 가지고 와서 정보 입력해주기., \- Hover 좀 어렵게 하기..?, \- 현재 날짜와 시간 가져오기.

### Community 127 - "javascript-9.md"
Cohesion: 0.50
Nodes (3): \- Css -, \- Html -, \- JS -

### Community 128 - "React가 좋은 이유"
Cohesion: 0.50
Nodes (3): App.jsx, React가 좋은 이유, 처음 시작할때 CRA.

### Community 129 - "react-29.md"
Cohesion: 0.50
Nodes (3): **\- export & import**, **\- 변수 선언**, **\- 화살표 함수**

### Community 130 - "react-31.md"
Cohesion: 0.50
Nodes (3): **\- Destructuring ( 구조 분할 )**, **\- map 함수**, **\- 참조형과 기본형 자료 ( 매우 중요 ★ )**

### Community 131 - "react-33.md"
Cohesion: 0.50
Nodes (3): **\- JSX**, **\- React = component**, **\- React 소소한 규칙?**

### Community 132 - "react-34.md"
Cohesion: 0.50
Nodes (3): **\- Props**, **\- props.children**, **\- props 예제**

### Community 133 - "react-35.md"
Cohesion: 0.50
Nodes (3): **\- jsx의 작동 방식**, **\- State**, **\- 이벤트 리스너**

### Community 134 - "react-40.md"
Cohesion: 0.50
Nodes (3): **\- Modal?**, **\- Modal 구현**, **\- 유효성 검사**

### Community 135 - "react-school-5.md"
Cohesion: 0.50
Nodes (3): faker, JSX, map 함수

### Community 136 - "storyboard-60.md"
Cohesion: 0.50
Nodes (3): tableView와 tableViewCell 추가 및 관리., 결과물, 화면 구성

### Community 137 - "storyboard-61.md"
Cohesion: 0.50
Nodes (3): list 삭제, list 추가, 전 포스팅 진행 상황

### Community 138 - "study-57.md"
Cohesion: 0.50
Nodes (3): 1\. 서버측 렌더링 지원, **2\. 파일 기반 라우팅**, **3\. 풀스택 프레임워크**

### Community 139 - "study-diary-86.md"
Cohesion: 0.50
Nodes (3): TitleSlide, 개선할 점, 문제해결

### Community 140 - "2. 글 쓰는 방식"
Cohesion: 0.67
Nodes (3): 2. 글 쓰는 방식, 단락과 사진, 마크다운 함정 하나

## Knowledge Gaps
- **852 isolated node(s):** `EXTENSIONS_FOR_HTML`, `HEADING_LEVELS`, `FIELDS`, `ports`, `COLORS` (+847 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 914 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `num()` connect `skin.js` to `[project]/index.astro`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `astro` connect `getPublishedPosts` to `package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `@tiptap/core` connect `editor.js` to `GripLayer`, `SizeLayer`, `package.json`, `shortcuts.js`, `upload.js`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `EXTENSIONS_FOR_HTML`, `HEADING_LEVELS`, `FIELDS` to the rest of the system?**
  _852 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `skin.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06944444444444445 - nodes in this community are weakly interconnected._
- **Should `editor.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Should `GripLayer` be split into smaller, more focused modules?**
  _Cohesion score 0.09413067552602436 - nodes in this community are weakly interconnected._