---
title: 'KVC 와 KVO'
pubDate: 2025-12-20
category: ios/study-diary
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/104
---
### KVC (Key-Value Coding)

> 문자열로 프로퍼티 이름을 넘겨서, 런타임에 값을 접근하는 기능.

최근에 개발을 할 때 Swift에서는 객체에 접근할때 이렇게 합니다.

> person.name = "혁쨩"  
> print(person.name) // 혁쨩

하지만 KVC는 아래와 같이 합니다.

> person.setValue("혁쨩", forKey: "name")  
> let name = person.value(forKey: "name") // name = 혁쨩

-   "name"이라는 **문자열로 프로퍼티에 접근**
-   컴파일 타임에 어떤 프로퍼티에 접근할지 몰라도,  
    런타임에 문자열 키로 동적으로 접근 가능

> 즉, **키(String)** + **값(Value)** 구조로 객체 프로퍼티를 다루는 코딩 방식.

* * *

그런데 요즘 Swift 코딩하면서 setValue를 이용해서 값에 접근하고 변경을 하지는 않습니다.

오히려 맨 첫번째 예제 처럼 쉽게 person.name 이런식으로 접근하고 변경도 합니다.

이렇게 된 이유는 KVC는 Objective-C 시절에 있던 방식이고 Swift가 나오고 Swift의 철학과는 맞지 않기 때문입니다.

Swift는 타입 안전 + KeyPath를 선호하고 가능하면 직접 프로퍼티, Swift KeyPath, Codable을 사용합니다.

그럼에도 알아야하는 이유는 아직 Objective-C로 되어있는 라이브러리나 호환성을 위해서는 알아두기는 해야합니다.

아직 사용중인 곳도 있고요.

* * *

#### KVC 예제

```swift
// Key
// set
person.setValue("혁쨩", forKey: "name")
person.setValue(27, forKey: "age")

// get
if let name = person.value(forKey: "name") as? String {
    print("이름:", name) // 이름: 혁쨩
}

if let age = person.value(forKey: "age") as? Int {
    print("나이:", age) // 나이: 27
}

// KeyPath
let user = User()
user.setValue("서울시", forKeyPath: "address.city")
user.setValue("01234", forKeyPath: "address.zipCode")

if let city = user.value(forKeyPath: "address.city") as? String {
    print(city) // 서울시
}
```

* * *

#### KVC 장단점

#### 장점

1.  **동적 접근 / 리플렉션 느낌**
    -   모델의 필드 이름을 문자열로 받아서 처리해야 할 때 유용
    -   예: JSON / 딕셔너리 → 모델 바인딩, 폼 자동 매핑, generic form builder 등
2.  **Cocoa 프레임워크 호환**
    -   KVO, Cocoa Bindings 등의 기반 기술
    -   Objective-C 시절부터 다양한 API들이 KVC 기반으로 설계되어 있음
3.  **재사용성 높은 코드**
    -   특정 키 집합에 대해 반복 작업을 할 때,  
        if-else 분기 없이 루프 + 문자열 키만으로 처리 가능

#### 단점

1.  **타입 안전성 부족**
    -   "name" 오타 내면 → 컴파일 에러가 아니라 **런타임 크래시**
    -   타입 캐스팅도 직접 해줘야 해서 실수 가능성↑
2.  **리팩토링에 취약**
    -   프로퍼티 이름을 바꿔도 "name" 같은 문자열은 자동 변경 안 됨
3.  **Swift스럽지 않음**
    -   Swift는 타입 안전 + KeyPath(정적) 선호
    -   최근 코드에서는 가능한 **직접 프로퍼티, Swift KeyPath, Codable** 등을 쓰고,  
        KVC는 “불가피할 때만 사용하는 구식 기술” 느낌에 가깝습니다.

* * *

### KVO (Key-Value Observing)

> 객체의 특정 프로퍼티 값이 바뀌는 것을 자동으로 감지해서, 콜백을 받는 옵저버 패턴

예를 들어서 person.name의 값이 바뀔 때마다 로그를 찍거나 UI를 업데이트 하고 싶다.

이럴 때 사용을 합니다.

* * *

#### KVO 예제

```swift
class Person: NSObject {
    @objc dynamic var name: String = ""
}

let person = Person()

// NSKeyValueObservation를 잡아둘 프로퍼티
var observation: NSKeyValueObservation?

observation = person.observe(\.name, options: [.old, .new]) { object, change in
    print("이름이 변경됨: \(change.oldValue ?? "") -> \(change.newValue ?? "")")
}

person.name = "혁쨩"
// 출력: 이름이 변경됨:  -> 혁쨩

person.name = "재혁"
// 출력: 이름이 변경됨: 혁쨩 -> 재혁
```

* * *

#### KVO 장단점

#### 장점

1.  **자동 감지**
    -   특정 프로퍼티가 변경될 때마다  
        별도의 didSet 없이도 콜백을 받을 수 있음
    -   UIKit 일부, AVFoundation, WebView 등 **시스템 프레임워크에서 KVO를 사용**하는 경우가 많음
2.  **Model ↔ UI 바인딩에 유용**
    -   값 변경 → UI 업데이트 같은 패턴에 잘 맞음

#### 단점

1.  **문법/사용이 복잡하고, 디버깅이 어려움**
    -   옛날 addObserver/removeObserver 방식은 특히  
        해제를 깜빡하면 크래시, 해제 순서 꼬이면 크래시
    -   어떤 프로퍼티를 누가 옵저빙하고 있는지 코드만 봐서는 파악이 쉽지 않음
2.  **런타임 의존 + 문자열 의존(구 버전)**
    -   keyPath 문자열 오타 → 런타임 문제
    -   Objective-C 런타임 동작(isa-swizzling 등)에 의존 → 변화에 취약
3.  **Swift 철학과는 다소 안 맞음**
    -   Swift는 **타입 안전, 명시적 흐름**을 선호하는데  
        KVO는 “마법처럼 뒤에서 자동으로 일어나는” 느낌이라  
        요즘엔 Combine, Property Wrapper, RxSwift, delegate 등으로 대체하는 방향.

* * *

#### KVO 또한 마찬가지

-   예전:
    -   addObserver(\_:forKeyPath:options:context:)
    -   observeValue(forKeyPath:of:change:context:)
-   Swift 4+:
    -   person.observe(\\.name, options: ...) (그래도 Objective-C 런타임 기반)
-   SwiftUI/Combine 시대:
    -   ObservableObject + @Published + @State + @ObservedObject 등

```swift
class MyViewModel: ObservableObject {
    @Published var title: String = "Hello"
}

struct MyView: View {
    @ObservedObject var vm: MyViewModel

    var body: some View {
        Text(vm.title) // title이 바뀌면 자동으로 UI 업데이트
    }
}
```

이처럼 더 나은 방식이 생겨나가고 있습니다.

새 코드에서는 굳이 KVO KVC를 직접 사용하지는 않는 느낌입니다.

* * *

#### 총정리

KVC/KVO는 Objective-C 시절부터 있는 Key-Value 기반 동적 접근/옵저빙 메커니즘이고,  
Swift에서는 타입 안전성과 가독성 이유로 새로운 코드에서는 대체 기법을 우선적으로 쓰겠지만,  
AVFoundation이나 UIKit 일부에서 여전히 KVO 패턴을 사용하므로  
개념과 기본 사용법은 이해하고 있어야합니다.
