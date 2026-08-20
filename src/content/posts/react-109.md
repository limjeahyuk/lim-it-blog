---
title: 'CRA 지원 종료 그 이후..'
slug: react-109
pubDate: 2026-01-04
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/109
---
iOS 쪽으로 공부하다가 다시 React로 넘어와서 다시금 공부 중인데..

변한 것도 많고 까먹은 것도 너무너무 많습니다.

그리하여 프로젝트 생성을 하면서 만들면서 배우던 중 만들자마자 에러가 생겨버렸따..!!!

> npx create-react-app 프로젝트명

엥??? 뭐가 이상한가하고 봤더니 CRA가 지원 종료되었다구?????

공식 홈페이지 조차도 

> Create React App은 더 이상 사용되지 않습니다. 최신 옵션을 사용하려면 react.dev를 방문하세요.

라고 하는 군요..

[https://create-react-app.dev/](https://create-react-app.dev/)

 [Create React App is deprecated.

Create React App is deprecated. Please see react.dev for modern options.

create-react-app.dev](https://create-react-app.dev/)

그리 하여 왜 종료되었고 이제는 뭐 써야하는 지 알아야하지 않겠어요?

* * *

### CRA(Create React App) “지원 종료”의 정확한 의미

CRA는 **완전히 작동을 멈췄다**가 아니라,

-   **새 프로젝트 생성용으로는 더 이상 권장하지 않음(Deprecated)**
-   **장기 정체/유지보수 모드(maintenance mode)** 로 계속 동작은 하되, 적극적인 발전은 기대하기 어려움

이라는 의미에 가깝습니다.

React 공식 문서 / CRA 공식 사이트 / CRA GitHub 모든 곳에서 CRA를 사용에 대해서 부정적입니다.

### 왜 CRA를 지원 종료(신규 권장 종료) 했을까?

아래 글에서 매우 자세하게 알려주고 있습니다.

[https://react.dev/blog/2025/02/14/sunsetting-create-react-app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)

 [Sunsetting Create React App – React

The library for web and native user interfaces

react.dev](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)

#### 1) “고성능 프로덕션 앱” 만들기에 한계가 커졌음

CRA는 “처음 시작하기”는 쉬운데, 요즘 웹앱이 요구하는 기본 기능(라우팅/데이터 패칭/코드 스플리팅/SSR/메타 프레임워크 수준의 통합)을 **기본 제공하지 않아서** 규모가 커질수록 한계가 드러난다고 설명해요.

결국 CRA를 계속 발전시키려면 **사실상 프레임워크로 진화**해야 하는데, 그 방향은 이미 다른 프레임워크들이 잘 해결하고 있다는 맥락입니다.

#### 2) “활동적인 메인테이너가 없다”

React 팀은 CRA를 deprecated 하기로 결정한 직접 이유 중 하나로 **“현재 active maintainers가 없다”** 를 명시합니다.  
즉, CRA를 현대 요구사항에 맞게 크게 개편/진화시키기 어려운 프로젝트 상태라는 뜻이에요.

#### 3) 이미 대안(프레임워크/빌드툴)이 성숙했고, React도 그쪽을 권장

React 팀은 신규 앱은 **프레임워크로 시작하는 걸 권장**하고, 특수한 케이스나 “직접 셋업을 배우고 싶은 경우”엔 Vite/Parcel/Rsbuild 같은 **빌드툴로 구성**하라고 안내합니다.  
CRA GitHub README도 “프로덕션 앱을 CRA 기반으로 새로 시작하는 건 권하지 않는다”는 톤으로 정리되어 있어요.

#### 4) (현실적인 이유) 최신 생태계(예: React 19)와의 마찰 비용이 커짐

React 팀은 CRA deprecated 공지에서, deprecated 하면서도 “React 19에서 동작하도록 CRA 새 버전도 냈다”고 언급합니다.  
다만 **‘신규 권장 종료’** 결정을 내린 배경 자체가, CRA를 계속 ‘현대 기준’으로 끌고 가는 비용이 크고 프로젝트 상태가 그걸 감당하기 어렵다는 의미로 읽을 수 있어요(공식 글의 ‘maintainers 부재’ + ‘프레임워크로 진화 필요’ 맥락).

* * *

### Vite로 시작하면 뭐가 더 좋은가?

Vite 공식 문서가 말하는 핵심은 **개발 서버 구조 자체가 다르다**입니다.

#### 1) 개발 서버 시작이 빠름(Cold Start 개선)

번들러 기반(dev에서 미리 전부 빌드/번들링) 방식은 서버 시작 시 앱 전체를 크롤링/빌드해야 해서 느려지는데, Vite는 **의존성(deps)과 소스코드**를 나눠 접근합니다.

#### 2) 필요한 것만 즉시 변환(On-demand Transform)

Vite는 브라우저의 **native ESM**을 활용해서, 실제로 브라우저가 요청한 파일만 변환/서빙하는 방식이라 개발 중 체감이 빠릅니다. (라우트 기반 코드 분할처럼 **당장 안 쓰는 코드**는 처리 자체가 뒤로 밀릴 수 있음)

#### 3) 의존성 프리번들링(Pre-bundling) + esbuild 활용

Vite는 의존성을 **esbuild로 pre-bundle**해서 빠르게 처리한다고 설명합니다(개발 체감 속도에 큰 영향).

#### 4) “현대 React 권장 흐름”에 맞춰 가기 쉬움

React 팀이 프레임워크 우선을 권하긴 하지만, 프레임워크가 맞지 않는 경우에는 Vite 같은 빌드툴로 구성하라고 공식 안내에 포함되어 있어요.  
즉, **새 프로젝트 기준으로 문서/생태계의 기본값이 Vite 쪽으로 이동**한 상태라고 보면 됩니다.

* * *

### Vite로 갈 때 주의할 점(단점/차이)

CRA에서 Vite로 갈 때 차이점

-   **npm start** 대신 **npm run dev** (스크립트 이름 차이)
-   환경변수 프리픽스 규칙(CRA는 **REACT\_APP\_**, Vite는 **VITE\_**)
-   빌드 결과물/설정 파일 구조 차이(**webpack 기반** vs **Vite 설정**)
-   절대경로 alias, proxy, SVG/이미지 처리 방식 등 일부 설정이 달라 똑같이 옮기려면 약간 손봐야 함

하지만 새로 시작 이라면 이건 거의 문제가 안 되고, 오히려 Vite 쪽이 설정도 더 단순하게 느끼는 경우가 많습니다.

* * *

#### 공식 페이지 주소 모음

> \[React 공식 - CRA 신규 권장 종료 공지\] [https://react.dev/blog/2025/02/14/sunsetting-create-react-app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)  
> \[React 공식 문서 - Installation / "Should I use CRA? No. Deprecated."\] [https://react.dev/learn/installation](https://react.dev/learn/installation)  
> \[CRA 공식 사이트 - "Create React App is deprecated"\] [https://create-react-app.dev/](https://create-react-app.dev/)  
> \[CRA GitHub 저장소 - README의 Deprecated 섹션\] [https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app)  
> \[Vite 공식 문서 - Why Vite\] [https://vite.dev/guide/why](https://vite.dev/guide/why)

* * *

> CRA는 “갑자기 망해서 못 쓰는 도구”라기보다, React 생태계의 기본 요구사항이 커지면서 프레임워크/현대 빌드툴이 담당해야 할 영역이 늘어났고, CRA는 메인테이너 부재와 구조적 한계 때문에 신규 추천에서 내려온 케이스다.   
> 새 프로젝트는 React 공식 가이드 흐름대로 프레임워크(또는 Vite 같은 빌드툴)로 시작하는 편이, 설치 이슈/개발 속도/장기 유지보수 면에서 더 안전하다.
