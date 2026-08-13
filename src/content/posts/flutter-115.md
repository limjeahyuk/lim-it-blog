---
title: 'Dart 공부 중 마구잡이 정리 2'
pubDate: 2026-01-07
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/115
---
### 변수

#### var

```javascript
void main() {
  var name = '니꼬';
  String name2 = '니꼬2';
  
  name = 'nico';
  name2 = 'nico2';
}
```

dart에서 변수를 지정하는 가장 기본은 var입니다.

var를 사용하면 다들 아시다시피 데이터를 변경이 가능합니다.

그런데 타입 구체화는 굳이 필요하지 않습니다. 왜냐하면 dart에서 자동으로 해주기 때문.

**name 을 1 또는 true 로 변경하면 에러가 나타나게 됩니다.**

그런데 타입을 지정해주고 싶을때는 String 으로 작성해주면 됩니다.

String으로 하더라도 변수에 데이터는 동일하게 변경이 가능합니다.

그럼 각각 언제 쓰는 것인가요?

사실 자기가 원하는 대로 쓰면 되지만.. 그래도 권장하는 것은

-   함수나 매소드 내부에 지역 변수를 선언할 때는 var
-   class에서 변수나 property를 선언할 때는 String

이런 식으로 사용한다고 합니다.

#### dynamic

> dynamic은 여러가지 타입을 가질 수 있는 변수에 쓰이는 키워드

사용을 추천하지는 않지만 때때로는 유용합니다. 주로 json이 들어가게 되면 유용할 때가 많습니다.

```javascript
var name; // dynamic
// dynamic name;

name = 'nico';
name = 1;
name = true;
```

var name; 으로만 하게 되면 dynamic이 되면서 여러가지 값을 넣을 수 있게 됩니다.

또한 dynamic을 명시적으로 설정하려면 String과 동일하게 **dynamic name;** 을 해주면 됩니다.

dynamic 으로 설정하게 되면 불편한 점은 name. 했을 때 자동으로 나오는 함수가 나오지 않습니다.

그 이유는 어떤 타입인지 모르기 때문에..

```javascript
dynamic name;

// name. < 메서드 적음.

if(name is String){
//	name. < 메서드 많음.
}
```

이처럼 if를 이용해서 name의 타입을 지정해주게 되면 name에 사용할 수 있는 함수도 엄청나게 늘어나는 것을 직접 볼 수 있게 됩니다.

하지만 아무 타입이나 쓸 수 있으니 너무 좋다고 막 사용하면 절대 안됩니다. 사용하지 않는 것이 가장 이상적입니다.

#### null safety

> 개발자가 null값을 참조 할수 없도록 하는 것   
> null을 참조하면 런타임 에러가 뜨게 됩니다.

Swift의 nil과 매우 유사했기에 이해가 매우 쉬웠습니다.

```javascript
bool isEmpty(String string) => string.length == 0;

void main(){

  isEmpty(null) // NoSuchMethodError

}
```

String 자리에 null을 넣게 되면 NoSuchMethodError라는 런타임 에러가 나타나게 됩니다.

이런 것을 막기 위해 dart에서는 null safety를 만들었습니다.

```javascript
  String nico = 'nico';
  nico = null; // 불가능.
  
  String? nico = 'nico';
  nico = null // 가능
```

간단하게 ?를 넣어주면 됩니다. Swift의 optional값과 동일합니다.

> nico.isNotEmpty;

nico는 null일 수도 있다는 에러를 보내주게 됩니다.

그렇기에 아래와 같이 작성을 해줘야합니다.

> if (nico != null){  
>   nico.isNotEmpty;  
> }

그런데 이렇게 쓰는 건 좀 귀찮으니까

간단하게 작성을 하면

> nico?.isNotEmpty;

이렇게도 쓸 수 있습니다.

이게 if문과 동일한 성격을 가졌습니다.

#### final

지금까지 배운 변수 (var or String) 등등은 모두 수정이 가능했습니다.

그러면 변경되지 않도록 하고 싶을 때는? ex) js의 const

```javascript
  final name = 'nico';
  // final String name = 'nico';
  
  name = 'nini'; // only be set once
```

var 대신 final을 사용해주면 됩니다.

그러면 추후에 name을 변경하려고 하면 **only be set once** 에러가 나타나게 됩니다.

final 에 타입을 추가하고 싶다면 **final String name = 'nico';** 이런 식으로 넣어주면 됩니다.

#### late

> late는 초기 데이터 없이 변수를 만들 수 있게 해줍니다.

```javascript
  late final String name;

  // do something, go to api
  
  print(name); // is definitely unassigned at this point 에러
  
  name = 'nico';
  
  print(name); // 정상 작동.
```

late를 사용해주면 초기 데이터를 넣지 않더라도 변수를 지정할 수 있게 해줍니다.

주로 api를 통해 데이터를 가져오고 data fetting 작업을 할 때 많이 사용합니다.

late를 사용하고 데이터를 넣지 않은 상태에서 name을 사용하게 되면

**name is definitely unassigned at this point 에러가 나타나게 됩니다.**

이는 name에 값을 넣기 전에는 접근하지 않아야 한다는 것을 알립니다.

이처럼 실수를 막아줄 수도 있습니다.  
  

#### const

final 있는데 const도 있어?

**final**

-   변수에 **딱 한 번만** 값을 넣을 수 있음
-   값은 **실행 중(runtime)** 에 결정돼도 됨

**const**

-   값이 **컴파일 시점(compile-time)** 에 이미 결정되어 있어야 함
-   그래서 **진짜 상수** 느낌

이렇게 적기만 해도 final과 const의 차이를 잘 모르겠습니다

저는 그랬어요 ;ㅁ;

이럴때는 예제를 봐야합니다.

**final은 런타임 값이 가능합니다.**

> final now = DateTime.now(); // 실행할 때 시간이 정해짐 (ok)  
> final list = \[1, 2, 3\]; // ok

**const는 런타임 값 불가**

> const now = DateTime.now(); // ERROR: 컴파일 타임 상수가 아님

움... 최대한 이해해보자면 그냥 앱이 실행되는 중간에 받는 값들.

예를 들면, api 값 / 사용자가 input창 안에 넣는 값들 / 날짜 등등 런타임에 결정되는 값들은 const에 넣을 수 없다는 뜻인가..

그러면 const는 진짜진짜 절대 바뀌지 않고 하드코딩하는 값들만 넣을 수 있는 건가요?

정도로 이해되는 것 같아요... 다른 예제를 찾아보면

**final 컬렉션: 참조는 고정 이지만 내용은 바꿀 수 있음**

> final nums = \[1, 2, 3\];  
> nums.add(4); // ok (내용 변경 가능)  
> nums = \[9, 9, 9\]; // error (다른 리스트로 재대입 불가)

**const 컬렉션: “내용 자체가 불변”**

> const nums = \[1, 2, 3\];  
> nums.add(4); // error (불변)

-   final은 **박스(변수)** 를 다른 박스로 바꾸진 못하지만, 박스 안 내용은 바뀔 수 있음
-   const는 **박스도 고정 + 내용도 고정**

이 정도 차이가 있는 것 같습니다.

그러니까 절대 절대 안 바뀌는 값은 const / 한번 넣고 안 바뀌는 값은 final인가봐요. 

그런데 final이라고 절대 안바뀌는 것은 아니고 배열 같은 경우에는 값이 추가는 가능하고요....

어렵네요.. 실전에서 만들면서 익혀야 할 것 같아요.

아 그리고 이것도 차이점이네요

> final late;  
> late = '123'; // ok  
>   
> const lim; // error

final은 런타임에 넣기만 하면 되기에 안에 변수 선언만 가능하지만

const는 그게 불가능합니다.
