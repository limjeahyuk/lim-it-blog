---
title: 'Dart 공부 중 마구잡이 정리'
pubDate: 2026-01-06
category: study/flutter
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/114
---
### Dart 언어

-   객체 지향 언어
-   UserInterface 만드는 데 최적화 되어 있음.

* * *

#### Dart 특징

-   UI에 최적화 되어 있음.
-   생산적인 개발 환경을 가지고 있음.
-   모든 플랫폼에서 빠름.

#### 두 개의 컴파일러

![](/images/flutter-114/1.png)

Dart 언어로 코드를 짰을 때,

Dart 코드를 여러 CPU의 아키텍쳐에 맞게 변환할 때는 **Dart Native**,

Dart 코드를 JS로 변환할 때는 **Dart Web** 각각 맞는 컴파일러로 구동을 할 수 있습니다.

즉, Dart 하나로 모든 것으로 처리가 가능합니다. / 모든 곳에서 컴파일 가능.

* * *

#### Dart Native

-   JIT (Just-In-Time)
-   AOT (Ahead-of-Time)

앱을 배포할 때는 arm64 , x86\_64 여러 아키텍쳐로 컴파일이 필요합니다. 그런데 이 작업이 개발 중에 작은 코드 변경마다 할 필요는 없습니다. 그렇기 때문에 개발 할때는 dartVM, dart 가상머신을 이용하여 코드 짠 곳을 개발자한테 빠르게 보여주도록 합니다. 그렇기에 조금 느리지만 화면은 바로 볼 수 있습니다. - JIT

반대로 배포할 때는 가상 머신에서 돌리는 것이 아니라 직접 앱에 배포를 하여 빠른 성능으로 보여줄 수 있게 됩니다. - AOT

* * *

#### null Safety

Dart는 **null Safety**를 사용합니다. 아마 Swift의 nil 처리와 비슷한 것으로 보여집니다.

개발자가 null을 참조하면 생기는 여러 버그들을 막고자 null을 안전하게 처리합니다.

* * *

#### Dart - Flutter

google이 flutter에 dart언어를 선택한 이유 중 하나입니다.

dart와 flutter 모두 google에서 개발 했기에 flutter의 최적화를 위해서 언어 자체에서 변경을 해줄 수 있습니다.

이 말이 무엇이냐면, ReactNative의 경우에는 ReactNative의 최적화를 위해서 JS를 고칠 수는 없고

최대한 JS를 사용하여 극대화의 퍼포먼스를 보여줘야합니다.

하지만 Flutter는 Flutter의 최적화를 위해서 Dart 팀에 제안을 하여 더 쉽고 좋게 만들 수 있습니다.

실제로 AOT의 경우 원래는 없던 기능이지만 Flutter 팀이 Dart 팀에게 요청하여 만들어진 기능이라고 합니다.

* * *

####  main 함수

모든 Dart 프로그램의 Entry Point

main 함수가 없으면 애초에 컴파일 자체가 되지 않습니다.

실제로 뭔가를 하는 코드는 반드시 main 안에 넣어야합니다.

#### ;

dart 언어에서는 ;를 반드시 적어줘야합니다.

요즘 js에서는 ;를 자동으로 넣어줘서 작성하지 않아서 귀찮으실텐데 dart에서는 ;를 반드시 넣어줘야하는 이유는

추후에 배울 ;를 작성하지 않는 문법도 존재하기 때문.

[https://nomadcoders.co/dart-for-beginners](https://nomadcoders.co/dart-for-beginners)

 [Dart 시작하기 – 노마드 코더 Nomad Coders

Flutter 앱 개발을 위한 Dart 배우기

nomadcoders.co](https://nomadcoders.co/dart-for-beginners)
