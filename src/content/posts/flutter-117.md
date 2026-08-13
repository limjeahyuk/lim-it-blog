---
title: 'Dart 공부 중 마구잡이 정리 4'
pubDate: 2026-01-07
category: study/flutter
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/117
---
### Function

```javascript
void sayHello(String name){

  print("Hello $name nice to meet you");
  
}

sayHello("lim"); // Hello lim nice to meet you
```

여기서 void는 해당 function은 return을 하지 않겠다는 뜻입니다.

그렇다는 말은 void main 또한 return을 하지 않는 다는 말입니다.

그러면 return을 해줘야하는 함수를 만들때는?

```javascript
String returnHello(String potato){
  return "Hello $potato nice to meet you";
}

print(returnHello("ppp")); // Hello ppp nice to meet you
```

return하는 타입을 void 대신 작성해주면 됩니다.

그 이후에는 다른 코딩과 동일하게 작성하면 되는 데 **fat arrow syntax** 라는 문법이 있습니다.

> String returnHello(String potato) => "Hello $potato nice to meet you";

이 문장은 위 returnHello{}과 동일한 역할을 합니다.

만약 function이 한줄짜리라면 fat arrow syntax를 이용하여 간단하게 써도 좋습니다.

아주 좋은 예시를 들면 

> num plus(num a, num b) => a + b;

이런 것이 있겠네요.

#### name argument

function에 여러가지 parameter를 넣을 수도 있습니다.

```javascript
String sayHello(
  String name,
  int age,
  String country
){
  return "Hello $name, you ar $age, and you come from $country";
}
```

이 함수를 사용하기 위해서는 다들 아래와 같이 사용할 것 입니다. ( **positinal parameter** )

사용할 때 순서를 지키는게 중요합니다.

> sayHello("lim", 12, "korea"); // Hello lim, you ar 12, and you come from korea

그런데 함수의 parameter가 엄청나게 많아지게 되면? 또는 이런 함수가 엄청나게 많아지면?

그 내부에 parameter의 순서를 다 외울 수 없지 않을까요?

항상 쓸 때마다 순서를 보고 사용해야하는 엄청 귀찮은 작업이 들어가게 됩니다.

이런식으로 많이 사용하다보면 함수가 어떤 함수들인지 확인하기 어렵고 딱 봤을때 코드가 복잡해집니다.

그리고 해석할때도 왔다갔다 해야하는 번거로움이 있습니다.

그럴때 사용하는 것이 **name argument** 입니다.

name argument를 사용하기 위해서는 parameter에 {}를 넣어주면 됩니다.

```javascript
String sayHello({
  String name,
  int age,
  String country
}){
  return "Hello $name, you ar $age, and you come from $country";
}
```

이러면 엄청난 에러가 나타납니다 :)

name argument를 사용하게 되면 사용자가 parameter를 다 넣지 않는 상황을 고려해야합니다.

null safety를 고려하여 두가지 방법이 있습니다.

**1\. default value**

**2\. required**

default value는 swift에서도 많이 사용했던 기본값을 넣어주는 방식입니다.

```javascript
String sayHello({
  String name = "Lim",
  int age = 99,
  String country = "korea"
}){
  return "Hello $name, you ar $age, and you come from $country";
}
```

이런식으로 사용자가 parameter를 넣지 않았을 경우에 기본값을 채워서 return 해줍니다.

> sayHello() // Hello Lim, you ar 99, and you come from korea

required는 사용자에게 반드시 넣어줘야한다고 사용할때 말 해주는 것입니다.

사용법은 아래와 같습니다.

```javascript
String sayHello({
  required String name,
  required int age,
  required String country
}){
  return "Hello $name, you ar $age, and you come from $country";
}
```

parameter에 required를 다 붙혀주면 됩니다.

그렇게 되면 사용자가 함수를 사용할 때 넣지 않으면 에러메세지로 타입과 name을 알려줍니다.

**함수 생성법은 알았고 그러면 사용할 때는 어떤 식으로 해야하나요?**

> sayHello( age: 12, country: 'cici', name: 'lim' )

이런식으로 사용하면 됩니다.

순서는 전혀 상관없이 그냥 마구잡이로 넣되 내부 parameter만 잘 맞춰서 넣어주기만 하면 됩니다.

#### optional positional parameter

positional parameter는 가장 기본적인 함수 틀입니다.

```javascript
String sayHello(
  String name, 
  int age, 
  String country
) => 
  'Hello $name you $age from $country';
```

postitional parameter를 사용하게 되면 순서를 꼭 지켜야하며, 모든 parameter를 꼭 작성을 해야합니다.

그런데 여기서 optional로 만드는 방법이 있습니다.

```javascript
String sayHello(
  String name, 
  int age, 
  [String? country = 'cuba']
) => 
  'Hello $name you $age from $country';
```

이렇게 작성을 하게 되면 사용할 때 country를 넣지 않더라도 문제없이 함수가 작성이 됩니다.

optional로 할 parameter에 \[\]와 ?, default value 세가지 장치를 해줘야합니다.

> sayHello("Lim", 12);

그런데 이렇게 까지 할 바에 그냥 named parameter가 더 나은 방법으로 보여집니다.

이런게 있구나 하고 아는 정도면 될 듯합니다 :)

#### QQ Operator

만약 name을 대문자로 바꾸는 그런 함수가 있다면 아래처럼 작성을 할 것입니다.

> String capitalizeName(String name) => name.toUpperCase();

그런데 name을 null도 넣고 싶다면? 그리고 null일때는 'ANON' 으로 처리를 할 거라면?

> String capitalizeName(String? name){  
>   if name != null {  
>    return 'ANON';  
>   }  
> return name.toUpperCase();  
> }

이런 식으로 쓰는 게 보통일 것입니다.

그런데 이것도 좀 줄일 수 있을 것 같습니다.

> String capitalizeName(String? name) => name != null ? name.toUpperCase() : 'ANON';

유명한 삼항연산자를 사용하여 한 줄로 깔끔하게 할 수 있습니다.

그런데 Dart는 여기서 조금 더 나아갈 수 있습니다.

> String capitalizeName(String? name) => name?.toUpperCase() ?? 'ANON';

**??** 를 사용하게 되면 왼쪽이 null이면 오른쪽으로 실행을 시켜줍니다.

현재 코드에서 name?.toUpperCase() 가 null이면 'ANON'을 반환해야하기에 정확히 맞아 떨어집니다.

?? 와 비슷한 느낌의 ??= 도 있습니다.

> String? name;  
> name ??= 'nico';  
> name ??= 'another';  
>   
> print(name); // nico

name이 null이면 넣어주는 코드입니다.

중간에 null처리를 해야 another로 들어가질 것입니다.

#### typedef

type을 작성하는 데 같은 type이 반복되어서 생략을 하고 싶을 경우가 있을 수 있습니다.

> List<int> reverseListOfNumbers(List<int> list){  
>   var reversed = list.reversed;  
>   return reversed.toList();  
> }

이렇게 있을 때, List<int>를 하나로 묶고 싶을 수 있습니다.

> typedef ListOfInts = List<int>;

이렇게 작성해주면 List<int>를 ListOfInts로 변경이 가능합니다.

그래도 작동은 동일합니다.

typedef를 사용하는 것도 좋지만, 구조화된 data의 형태를 지정하고 싶다면 class를 만드는 것이 올바른 방법일 것입니다.

typedef는 좀 더 간단한 데이터의 alias(별명)을 만들 때 사용합니다.

ex) List<int>, Map, Set 처럼 간단한 녀석들.
