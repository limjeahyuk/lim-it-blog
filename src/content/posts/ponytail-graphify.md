---
author: student
title: ponytail & Graphify
slug: ponytail-graphify
description: AI Agent의 더 나은 결과물을 위한 도구들
pubDate: 2026-09-14
draft: false
secret: false
---
## AI Agent 도구

저는 Claude Code를 주로 사용합니다. 그러면서 여러가지 앱을 만들어봅니다.

종종 정말 간단한 앱인데 어떻게 코딩을 하는 지 코드가 엄청나게 늘어나 있곤 했습니다.

코드를 확인해보면 바로 주면 되는걸 이리갔다가 저리 갔다가....

<img src="https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789347161/l96wa7x0aaonwrpp82ao.png" alt="설명" width="418">



나만 그런가? 하고 찾아보니까 다른 분들도 이런 현상을 많이 겪고 있더라구요.

그러면서 도움을 주는 도구가 있어서 설명을 해볼까 합니다.

---

## Ponytail

<img src="https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789347607/cqj1sj7minahd6mfppkn.webp" alt="설명" width="414">



 AI 에이전트가 코드를 쓰기 전에 아래 순서를 타도록 합니다. 가장 먼저 걸리는 단계에서 멈춥니다.

```
1. 이게 있을 필요가 있나?     → 없다: 건너뛴다 (YAGNI)
2. 이미 이 코드베이스에 있나?  → 다시 짜지 말고 가져다 쓴다
3. 표준 라이브러리로 되나?    → 쓴다
4. 네이티브 플랫폼 기능인가?   → 쓴다
5. 깔려 있는 의존성이 푸나?    → 쓴다
6. 한 줄로 되나?            → 한 줄
```



실제로 측정된 효과로는 다음과 같다고 합니다.


| 스킬 없는 기준선 대비 | 코드량      | 토큰   | 비용   | 시간   | 안전성  |
| ------------ | --------: | ----: | ----: | ----: | ----: |
| ponytail     | **-54%** | -22% | -20% | -27% | 100% |




- 과잉 구현 여지가 큰 곳에서 최대 94% 감소, 이미 최소한인 코드에선 거의 0
- 검증, 에러 처리, 보안, 접근성은 절대 빼지 않습니다.
  - 단순히 한줄로 써 프롬프트는 안전 가드를 놓치는데 반해 ponytail은 100% 유지합니다.
- 참고 단계를 고민하느라 사고 토큰을 많이 쓰는 모델에서는 비용이 오히려 늘 수 있습니다.



#### 사용법

설치하게 되면 매 세션 자동으로 켜져 있습니다. 코딩 작업을 시키면 알아서 적용됩니다.

명령은 강도 조절과 리뷰용입니다.



<div class="table-wrap"><table style="min-width: 294px;"><colgroup><col style="width: 269px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1" colwidth="269"><p>명령</p></th><th colspan="1" rowspan="1"><p>하는 일</p></th></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail</code></p></td><td colspan="1" rowspan="1"><p>현재 강도 표시</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail lite</code> / <code>full</code> / <code>ultra</code></p></td><td colspan="1" rowspan="1"><p>강도 조절 (기본 full). ultra는 정말 최소한만</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail off</code></p></td><td colspan="1" rowspan="1"><p>이번 세션에서 끄기</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail-review</code></p></td><td colspan="1" rowspan="1"><p>현재 diff에서 과잉 구현만 찾아 "삭제 목록" 반환</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail-audit</code></p></td><td colspan="1" rowspan="1"><p>저장소 전체 감사 — 지울 것, 단순화할 것, stdlib로 바꿀 것 순위</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail-debt</code></p></td><td colspan="1" rowspan="1"><p>코드에 남긴 <code>// ponytail: ...</code> 주석(의도적으로 미룬 것)을 장부로 수집</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail-gain</code></p></td><td colspan="1" rowspan="1"><p>벤치마크 스코어보드</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="269"><p><code>/ponytail-help</code></p></td><td colspan="1" rowspan="1"><p>빠른 참조</p></td></tr></tbody></table></div>



기본 강도를 바꾸려면 `~/.config/ponytail/config.json` 또는 환경변수 `PONYTAIL_DEFAULT_MODE`.

#### 언제 유용한가

- 새 기능 추가 시 불필요한 의존성·추상화·보일러플레이트가 자꾸 생길 때
- 기존 프로젝트 정리: `/ponytail-audit`로 지울 것 찾기
- PR 전 `/ponytail-review`로 정말 필요한지 점검

---

## Graphify

<img src="https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789347916/jlzafzmgw1vuox565r6u.png" alt="설명" width="454">



> 코드 베이스를 그래프로 변경



폴더의 코드, 문서, SQL, 스키마, 설정, PDF, 이미지까지 파싱해서 노드와 엣지로 이루어진 그래프를 만듭니다.

tee-sitter 기반 AST 파싱이라 로컬에서 동작합니다.

<mark>노드 : 함수, 클래스, 파일... / 엣지 : 호출, 임포트, 참조 ...</mark> 



효과

- Claude가 매번 `grep/glob`으로 파일을 뒤지는 대신 그래프를 먼저 조회합니다.
  - 토큰 절약, 큰 코드베이스에서 정확도 향상 효과
- 세션이 바뀌어도 그래프가 유지되어 코드베이스 이해가 누적됩니다
- 커뮤니티 탐지로 이 모듈들이 한 덩어리라는 구조가 드러나고, 가장 많이 연결된 허브로 아키텍처 핵심을 파악합니다.
- 어떤 것을 바꾸면 뭐가 이상해지는지 영향을 분석 가능합니다.



#### 사용법

1. 그래프 생성 ( 프로젝트 루트에서, Claude Code 세선 안에서 )

```
/graphify .
```

`graphify-out/`에 세가지 파일이 생깁니다.

- `graph.html` 인터렉티브 시각화
- `GRAPH_REPORT.md` 사람용 리포트
- `graph.json` 질의용



2. 질문하기

그래프가 있으면 `/graphify` 에 자연어 질문을 하면 재빌드 없이 바로 조회합니다.

```
/graphify 인증 흐름이 어떻게 동작해?
/graphify query 결제 모듈이 어딩서 호출되나 --dfs
/graphify path "A" "B"            # A 와 B 사이 최단 경로
/graphify explain "UserService"   # 노드와 이웃을 평문으로 설명
```



3. 터미널 CLI

```
graphify god-nodes --top 10          # 아키텍처 허브
graphify affected "UserService"      # 이걸 바꾸면 영향받는 것들
graphify update .                    # 변경 파일만 재추출 (LLM 불필요)
graphify watch .                     # 파일 변경 시 자동 재빌드
```



4. 항상 켜기

```
graphify claude install
```

`CLAUDE.md` 지시문, `PreToolUse` 훅이 설치되며, Claude가 `Grep/Glob/Read` 전에 그래프를 먼저 참조하고 코드 변경 후 자동 갱신합니다.

```
graphify hook install
```

`git post-commit / post-checkout` 훅 → 커밋·브랜치 전환마다 그래프 자동 재빌드.



**기타 옵션**

- `/graphify https://github.com/owner/repo` — 외부 저장소 클론 후 그래프화
- `--mode deep` — 더 풍부한 추론 엣지
- `--wiki` / `--obsidian` — 커뮤니티별 위키 문서 / Obsidian 볼트 생성
- `--neo4j`, `--graphml`, `--svg` — 외부 도구용 내보내기
- `--mcp` — MCP 서버로 띄워 다른 에이전트에서 접근

#### 언제 유용한가

- 처음 보는 / 큰 코드베이스 온보딩
- 영향 분석
- 코드, 설계문서, DB 스키마를 한 그래프에서 연결해 보고 싶을 때
- 세션마다 같은 파일을 다시 읽느라 토큰이 새는 것을 줄이고 싶을 때



&nbsp;
