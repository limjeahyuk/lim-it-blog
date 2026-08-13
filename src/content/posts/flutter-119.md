---
title: 'Flutter의 동작 원리 및 특징'
pubDate: 2026-01-13
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/119
---
### Flutter를 배우는 이유

한 코드로 모든 것을 커버가 가능하기에 앱을 만드는데 시간이 매우 단축되고 iOS와 AOS 모든 것을 한번에 관리 가능합니다.

또한 요즘에는 앱 뿐만 아니라 웹까지도 가능하기에 모든 것을 한번에 가능하다는 장점이 있습니다.

### Flutter 동작 원리

![](/images/flutter-119/1.png)

#### 1) Framework: “위젯(선언형 UI)”를 트리로 만든다

Flutter에서 UI는 전부 **Widget 트리**로 표현돼요.  
하지만 실제로 화면에 그려지는 건 “Widget” 자체가 아니라, Widget을 기반으로 만들어지는 **Render tree(렌더 트리)** 입니다.

공식 문서 표현을 빌리면:

-   위젯 빌드가 끝까지 내려가면 RenderObjectWidget 단계에서 **render tree 노드**를 만들고
-   이 render tree는 **layout(크기/위치), painting, hit testing(터치 판별)** 등에 쓰이는 “진짜 화면용 데이터 구조”가 됩니다. 여기서 자주 나오는 3단어가 있어요.

#### Widget / Element / RenderObject (개념 정리)

-   **Widget**: “설계도(어떤 UI가 되어야 하는지 선언)”
-   **Element**: Widget의 “실체 인스턴스(트리에서의 위치/상태 연결 담당)”
-   **RenderObject**: “레이아웃/페인트/히트테스트를 실제로 수행하는 객체(그려질 대상)”

> 실무적으로는 “Widget은 선언, RenderObject가 실제 그리는 애”라고 이해하면 제일 편합니다.

* * *

#### 2) Engine: “픽셀을 찍고(GPU) 화면에 뿌린다”

Framework(Dart)가 “무엇을 그릴지”를 만들면, Engine(C/C++)이 그걸 받아서 **GPU를 통해 렌더링**하고 최종 프레임을 화면에 표시합니다.

Flutter는 내부적으로 여러 스레드를 쓰는데, 성능/프레임 관점에서 제일 중요한 건 아래 2개예요.

-   **UI thread**: Dart 코드가 실행되는 곳(위젯 빌드/레이아웃/페인트 명령 구성)
-   **Raster thread**: UI가 만든 “그리기 명령”을 받아 GPU로 실제 렌더링하는 곳

Flutter 공식 성능 문서에서도 “모든 Dart 코드는 UI thread에서 돌고”, UI thread가 **layer tree**를 만든 뒤 raster thread로 넘기며, raster thread에서 **Skia/Impeller 같은 그래픽 라이브러리**가 동작한다고 설명합니다.

* * *

#### 3) Embedder

> 각 프로젝트의 ios/ , android/ 폴더 안에 있는 Runner(호스트 앱) 코드가 “Flutter 엔진을 붙여 실행하는 역할”을 하며,  
> 그 안에서 실제로는 플랫폼별 Flutter embedder 구현(라이브러리/프레임워크) 를 사용합니다.

1) 앱 시작(엔트리 포인트) + 엔진 초기화

-   Flutter 앱이 시작될 때 **entrypoint를 제공**하고
-   **Flutter engine을 초기화**합니다.

2) **그릴 곳** 마련: 렌더링 Surface/Texture 생성

-   엔진이 픽셀을 그려서 내보낼 수 있도록 **OS가 제공하는 렌더링 대상(예: texture/surface)** 를 만들고 연결합니다.

3) 스레드/이벤트 루프/생명주기 관리

-   UI/raster 스레드 등을 얻거나 관리하고
-   앱 생명주기(포그라운드/백그라운드 등)도 OS 규칙에 맞게 전달합니다.

4) 입력 처리: 터치/키보드/마우스 등 이벤트 전달

-   터치, 키보드, 마우스 같은 입력을 받아서 Flutter 엔진/프레임워크로 전달합니다.

5) 플랫폼 메시지/채널(Platform Messages) 처리

-   Dart ↔ Native 통신(Platform Channels)이 가능한 이유가 여기 있어요.  
    embedder가 **플랫폼 메시지 전달 경로**를 제공해서, 플러그인들이 네이티브 API를 호출할 수 있게 됩니다.

* * *

#### 내가 이해한 동작 원리

native앱의 경우 버튼 하나를 만든다고 하면 운영체제에게 버튼 하나를 주세요 라고 서로 대화를 통해서 앱을 만듭니다.

그런데 flutter의 경우에는 flutter만의 c / c++ 엔진을 가동시켜서 그 엔진에서 버튼을 만들어줍니다.

이렇게 되면 flutter로 앱을 만들때 운영체제와 소통을 많이 하지 않습니다.

그렇기 때문에 조금 더 자유로울 수 있습니다.

이 방법이 좋은 점은 자유롭게 커스터마이징이 가능하다는 점이고 안 좋은 점은 다른 순수 native 앱들에 비해 동작이 부자연스러울 수 있습니다.

실제로 flutter에서 제공하는 IOS 버튼 들은 개발자들이 그럴싸하게 꾸며놓은 것 뿐이고 절대 native 기본 버튼은 아닙니다.

엔진 방식이 양날의 검 같은 느낌을 받았습니다.

* * *

### React Native VS Flutter

RN의 경우 자바스크립트를 통해서 운영체제와 소통을 하여 위젯을 만들게 됩니다.

그런데 flutter는 위에서 말한것처럼 엔진을 돌려서 엔진 내부에서 작동하기에 운영체제와는 완전 별개입니다.

그러하기 때문에 아무리 비슷하게 만들더라도 조금씩 부자연스러운 점이 있을 수 있음.

RN에서는 버튼 하나를 만들어도 안드로이드와 iOS 다르게 보임.

#### **RN**

네이티브 앱 운영체제 상에서 가능한 위젯을 사용해야 하는 경우

디자인이 iOS 혹은 Android 앱처럼 보이게끔 만들고 싶은 경우

#### **Flutter**

세밀한 디자인 요구사항이 있거나 100% 커스터마이징하고 싶은 경우

외부 패키지에 의존하지 않고 고수준의 애니메이션을 구현하고 싶은 경우
