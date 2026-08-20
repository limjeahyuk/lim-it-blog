---
title: '여러가지 방법으로 sdk를 직접 배포해보자'
slug: sdk-88
pubDate: 2024-07-14
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/88
---
### SDK를 만들고 배포하는 것에는 여러가지 방법이 있습니다.

예를 들면, library를 cocoaPod에 배포하는 것, xcframework로 만들어서 배포하는 것, SPM 을 사용하는 것

그 외에도 cloudsmith 같은 cocoaPod이지만 도움을 주는 것도 여러가지가 있습니다.

간단하게 SDK를 만들어서 배포를 해보도록 하겠습니다.

먼저 sdk를 만드는 것을 해보겠습니다.

먼저 **Pod lib create**를 이용해서 library를 만들어 줍니다.

```swift
pod lib create limTestSDK
```

![](/images/sdk-88/1.png)

SDK를 만들었으면 이제 git에 올려보도록 하겠습니다.

![](/images/sdk-88/2.png)

git repository 생성 후 pod lib create로 생성한 파일을 추가하였습니다.

```swift
git init

git remote add orgin [git repository 주소]

git remote -v // 정상적으로 들어갔는지 확인.

git branch -M main

git pull orgin main

git add .

git commit -m "faet: limTestSDK git init "

git push
```

git 코드 추가하는 다른 참고 블로그는 아래에 링크를 달아두도록 하겠습니다.

이제 간단한 sdk 를 만들어보도록 하겠습니다.

1\. console에 간단한 로그를 띄울수 있는 함수.

2\. 이미지가 나타나는 함수.

3\. 그 외...

점점 추가해보도록 하겠습니다

※ **Pod Lib Create**

\-> [https://hyuk-todayfeelsogood.tistory.com/87](https://hyuk-todayfeelsogood.tistory.com/87)

 [Pod lib create

swift Library 또는 framework를 생성하는 데는 여러가지 방법이 있습니다.기본적으로 Framework & Library 라고 xcode에서 도움을 주고 있습니다.그런데 막상 도움을 받아서 만들게 되면.. 엄청나게 막막하

hyuk-todayfeelsogood.tistory.com](https://hyuk-todayfeelsogood.tistory.com/87)

※ **git code 추가**

\-> [https://velog.io/@gooriiie/Github-Github%EC%97%90-%EC%BD%94%EB%93%9C-%EC%98%AC%EB%A6%AC%EA%B8%B0](https://velog.io/@gooriiie/Github-Github%EC%97%90-%EC%BD%94%EB%93%9C-%EC%98%AC%EB%A6%AC%EA%B8%B0)

 [\[Github\] Github에 코드 올리기

Github에 처음 코드 올리기

velog.io](https://velog.io/@gooriiie/Github-Github%EC%97%90-%EC%BD%94%EB%93%9C-%EC%98%AC%EB%A6%AC%EA%B8%B0)
