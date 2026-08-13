---
title: 'pod lib create를 이용한 sdk 코드 작성'
pubDate: 2024-07-15
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/90
---
git까지 적용 완료한 sdk에 내용을 채우기 전에..

pod lib 파일 내부를 좀 살펴보겠습니다.

![](/images/sdk-90/1.png)

-   limTestSDK
    -   Podspec Metadata
        -   pod에 올리게 될때 필요한 정보들이라고 보면 될 듯합니다.  
            아래 Development Pods / Pod 폴더 내부에 똑같이 들어가 있는 것 확인 가능합니다.
    -   Example for limTestSDK
        -   limTestSDK를 돌려보기 위한 app입니다.
        -   사용자 입장의 앱이라고 생각하시면 편할 듯 합니다.
-   Pods
    -   Podfile
        -   현재 sdk는 cocoaPod으로 설치가 되었습니다.  
            그렇기 때문에 podfile을 이용하여 설치를 해야합니다.
    -   Development Pods
        -   개발을 위한 Pods로 podfile에 경로를 폴더로 했을때 Development Pods로 들어가지게 됩니다.
        -   바로바로 고치는 것이 가능하게 됩니다.

```swift
// Podfile

target 'limTestSDK_Example' do
  pod 'limTestSDK', :path => '../'
```

추후에 git에 올려서 path가 아닌 버전을 이용해서 설치를 하게 되면...  
그때는 Development Pods이 아닌 다르게 들어가지게 됩니다.

※ **Podfile / Development Pod**

[https://hyuk-todayfeelsogood.tistory.com/89](https://hyuk-todayfeelsogood.tistory.com/89)

 [CocoaPod / Podfile 관련한 내용 정리

Podfile은 기본적으로 cocoaPod을 사용하기 위한 파일입니다. 그렇다면 cocoaPod이란?라이브러리 의존성 관리 매니저CocoaPods란 Object-C 또는 Swift에서 라이브러리를 사용할 수 있게 도와주는 모듈입니다

hyuk-todayfeelsogood.tistory.com](https://hyuk-todayfeelsogood.tistory.com/89)
