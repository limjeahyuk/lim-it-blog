---
title: 'CSS 단위 정리'
slug: study-108
pubDate: 2026-01-03
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/108
---
CSS에서 크기를 줄때 여러 단위를 쓰게 됩니다.

단위를 맞춰서 잘 써야 반응형 / 접근성 / 레이아웃 안정성에 큰영향을 줍니다.

절대 단위

\- px

\- 화면에서 픽셀처럼 보이게 고정되는 값  
  

상대단위

\- %, vm, vh, rem, em

\- **부모 / 뷰포트 / 글자 크기** 같은 기준에 따라 값이 달라집니다.

* * *

#### px

> css에서 가장 직관적인 단위  
> 고정 크기를 표현할 때 사용

**사용**

테두리, 구분선, 그림자 같은 정밀한 디테일

버튼 테두리, 라인 같은 것들.

**주의점**

px만 많이 쓰면 작은 화면에서 깨지기 쉽습니다.

또한 모바일 같은 작은 화면에서는 엄청난 문제가 생깁니다.

> .card { border: 1px solid #111; }  
> .icon { width: 36px; height: 36px; }

* * *

#### % ( 퍼센트 )

> 부모 요소 크기를 기준으로 계산 됩니다.  
> **width: 50%** = 부모 너비의 절반.

**사용**

레이아웃에서 **부모에 맞춰 늘어나는 요소**

이미지/ 박스를 부모 폭에 맞추고 싶을 때

**주의점**

% 높이는 부모 높이가 명확할 때만 제대로 작동합니다.

부모가 **height:auto** 면 자식의 **% height**가 기대대로 안 먹는 경우가 많습니다.

> .container { width: 100%; }  
> .img { max-width: 100%; height: auto; }

* * *

#### vm / vh ( 뷰포트 단위 )

> 화면(뷰포트) 크기 기준  
> 1vm = 화면 너비의 1%  
> 1vh = 화면 높이의 1%

**사용**

hero 섹션처럼 화면을 꽉 채우는 영역

화면 크기에 따라 자연스럽게 변해야 하는 요소

**주의점**

모바일은 주소창 / 하단바 때문에 vh가 흔들릴 수 있습니다

요즘은 dvh(dynamic viewport height)도 같이 사용합니다.

> .hero { min-height: 95vh; }  
> .title { font-size: 4vw; }

* * *

#### rem (루트 기준 단위)

> html의 font-size 기준  
> 기본 설정에서 1rem ≈ 16px

사용자가 브라우저에서 글자 크기를 키우면 rem 기반 요소도 같이 커지게 됩니다.

즉, 접근성 측면에서 매우 유리합니다.

**사용**

주로 폰트 크기, padding / margin, gap 등 전체 스케일이 자연스럽게 변해야 하는 값일 때

> html { font-size: 16px; }  
>   
> body { font-size: 1rem; } /\* 16px \*/  
> h1 { font-size: 2rem; } /\* 32px \*/  
> .section { padding: 2rem; } /\* 32px \*/

* * *

#### em (현재 요소 기준 단위)

> 현재 요소의 font-size 기준  
> padding: 1em 이면 현재 글자 크기만큼의 padding

**사용**

버튼처럼 텍스트 크기에 따라 여백에 같이 커지면 좋은 UI

**주의점**

em은 중첩되면 누적 계산이 되어 예상과 달라질 수 있습니다.

부모도 em, 자식도 em 쓰면 커졌다 작아졌다 할 수 있습니다.

> .button{  
>       font-size: 16px;  
>       padding: 0.5em 1em; /\* 글자 크기에 비례해서 여백이 변함 \*/  
> }

* * *

#### 반응형 필살기: min(), max(), clamp()

요즘 퍼블리싱에서 가장 많이 쓰는 패턴이 이거다.  
“최대는 고정, 작은 화면에서는 자동으로 줄어들게”를 **한 줄로** 끝낼 수 있다.

**min(a, b)**

-   두 값 중 더 작은 값을 선택

예: “가능하면 750px, 근데 화면이 작으면 화면폭만큼 줄이기”

> .logo { width: min(750px, 100vw); }

**max(a, b)**

-   두 값 중 더 큰 값을 선택

**clamp(min, preferred, max)**

-   최소~최대 사이에서 preferred 값으로 자연스럽게 변화

예: 폰트 크기를 화면에 따라 부드럽게

> .title { font-size: clamp(14px, 2vw, 20px); }
