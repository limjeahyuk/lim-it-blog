---
title: 'Pod lib create'
pubDate: 2024-07-14
category: ios/sdk
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/87
---
swift Library 또는 framework를 생성하는 데는 여러가지 방법이 있습니다.

![](/images/sdk-87/1.png)

기본적으로 Framework & Library 라고 xcode에서 도움을 주고 있습니다.

그런데 막상 도움을 받아서 만들게 되면..

![](/images/sdk-87/2.png)

엄청나게 막막하게 다가오기도 합니다. 저는 일단 그랬어요…

당연하게도 저런 방법도 있겠지만 cocoaPod을 이용하는 방법을 소개해보도록 하겠습니다.

먼저 cocoaPod을 다운을 받아야겠죠?

```
# cocoapods를 설치하기 위한 명령어
sudo gem install cocoapods
```

터미널에서 pod lib create \[라이브러리 명\] 을 사용합니다.

![](/images/sdk-87/3.png)

작성을 하게 되면 몇가지 질문들이 날라오게 됩니다.

-   무슨 플랫폼을 사용할 것인가요? \[ **iOS** / macOC \]
-   무슨 언어를 사용할 것 인가요? \[ **Swift** / Objc \]
-   Demo 앱을 만들 것 인가요? \[ **Yes** / NO \]
-   어떤 test 프레임워크를 사용할 것인가요? \[ Quick / **None** \]
-   뷰 기반 테스트를 할 것인가요? \[ Yes / **No** \]

답변을 올바르게 다 하게 되면 아래와 같은 파일이 만들어 지게 됩니다.

![](/images/sdk-87/4.png)

이 중에서 가장 중요하다고 보여지는 파일은 podspec 파일입니다.

이 파일의 명세가 정확히 되어있지 않으면 CocoaPods에 등록을 할 수 없기 때문입니다. 그러한 의미로 .podspec 내 작성되는 항목에 대해 알아보고자 합니다.

-   **name** 라이브러리의 이름을 정의 합니다.
-   **version** 라이브러리의 버전 **(GitLab or GitHub의 Tag 이름과 동일해야 합니다. Tag 값의 매칭을 통해 배포가 이루어지기 때문입니다.)**
-   **summary** 라이브러리의 간략한 설명을 작성합니다.
-   **description** 라이브러리의 자세한 설명 및 가이드 라인을 작성합니다.
-   **homepage** 라이브러리를 홍보 혹은 가이드 라인을 알려주는 사이트의 주소를 작성합니다. (현재는 회사 홈페이지)
-   **license** 라이브러리의 라이센스가 어떻게 되는지 작성합니다. (MIT or Apache)
-   **author** github or gitlap 계정 정보를 작성합니다. (닉네임, 이메일)
-   **source** 라이브러리가 저장되어 있는 GitLab or GitHub의 Remote 주소를 작성합니다.
-   **ios.deployment\_target** 사용 가능한 미니멈 iOS Version을 작성합니다.
-   **source\_files** 개발된 기능이 저장되어 있는 소스 파일의 경로를 작성합니다.
-   **swift\_version** 컴파일된 Swift Version을 기입합니다.
-   **frameworks** 라이브러리를 만들면서 사용된 Framework를 작성합니다.
-   **pod\_target\_xcconfig** Pods Project Setting 추가할 설정들을 작성합니다.
-   **user\_target\_xcconfig** 추가되는 메인 프로젝트 설정들을 작성합니다.
-   **info\_plist** pod info.plist에 설정 값을 작성합니다.
-   **resource\_bundles** 라이브러리를 만들면서 사용되는 리소스들의 파일경로를 작성합니다. (파일을 bundle 파일로 만들어 제공 됩니다.)
-   **dependency** 해당 라이브러리를 설치할 때 같이 설치가 되는 라이브러리 라이브러리를 실행하기 위해서 필요한 라이브러리.

Example 파일 에서는 앱에 보여지는 화면. + Library를 사용하는 입장.

Development Pods 파일에는 사용자에게 주는 Library.

작업을 진행하면 되겠습니다.
