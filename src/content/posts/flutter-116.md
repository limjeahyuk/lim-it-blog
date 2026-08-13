---
title: 'Dart 공부 중 마구잡이 정리 3'
pubDate: 2026-01-07
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/116
---
## Dart의 자료형

> String name = 'nico';  
> bool alive = true;  
> int age = 12;  
> double money = 69.99;  
>   
> num x = 12;  
> x = 1.1;

이런 여러가지 자료형이 있습니다.

여기서 중요한 점은 위 자료형들 뿐만 아니라 dart의 거의 모든 것은 object로 되어있습니다.

function도 object입니다. -> dart가 객체 지향 언어인 이유.

String 이나 int 같은 것을 우클릭하여 내부로 들어가보면 모두 class로 되어있습니다.

int와 double는 num의 부모class를 상속 받고 있는 것을 볼 수 있습니다.

그렇기에 **name.** 를 하게 되면 여러 사용 가능한 메서드가 쫙 나오는 것을 볼 수 있습니다.

### List

> var numbers = \[1,2,3,4,\];  
> // List<int> numbers = \[1,2,3,4,\];

var 또는 List<type>으로 생성을 해줄 수 있습니다.

Dart의 List는 신기한 기능이 있다고 합니다.

collection if 와 collection for 입니다. 

#### collection if

> var numbers = \[1, 2, 3, 4, \];

numbers에 5를 추가하고 싶을 때는 **numbers.add(5);** 를 해주면 됩니다.

그러면 만약 어느 변수 하나를 추가해서 그 변수가 true일때만 5를 추가하고 싶다면?

아래 처럼 작성하면 되겠죠?

> var giveMeFive = true;  
> var numbers = \[1, 2, 3, 4,\];  
>   
> if (giveMeFive) {  
>   numbers.add(5);  
> }

그런데 이걸 엄청나게 축약을 시켜줄 수 있다고 합니다.

> var giveMeFive = true;  
> var numbers = \[  
>   1,  
>   2,  
>   3,  
>   4,  
>   if(giveMeFive) 5,  
> \];

이렇게 사용하는 방식을 collection if라고 합니다.

#### collection for

collection if와 동일하게 list 내부에 요소를 추가할 때 조금 더 쉽게 추가하기 위한 문법입니다.

예제로 바로 가겠습니다.

> var oldFriends = \['nico', 'lynn'\];  
> var newFriends = \[ 'lewis', 'relph', 'darren', \];

두 개의 list가 있습니다.

여기에 newFriends에 oldFriends들을 추가하려 합니다.

그런데 💝를 추가해서 넣는다고 할 때, 기본적으로는 아래와 같이 써야합니다.

> for(var friends in oldFriends){  
>   newFriends.add("💝 $friends");  
> }  
>   
> print(newFriends) // \[lewis, relph, darren, 💝 nico, 💝 lynn\]

이걸 collection for를 사용하게 되면

> var newFriends = \[  
>   'lewis',  
>   'relph',  
>   'darren',  
>   for(var friend in oldFriends) "💝 $friend",  
> \];  
>   
> print(newFriends) // \[lewis, relph, darren, 💝 nico, 💝 lynn\]

이렇게 사용을 할 수 있습니다.

엄청나게 간단해지는 것을 볼 수 있습니다.

### string interpolation

> text에 변수를 추가하고 싶을 때

> var name = 'nico';  
> var age = 10;  
>   
> var greeting = "Hello everyone, my name is $name and I'm ${age+2}";  
> // Hello everyone, my name is nico and I'm 12

변수 자체를 텍스트에 추가할 때는 달러기호 뒤에 바로 넣으면 됩니다.

만약 계산이 필요하다면 달러 기호 뒤에 {}를 넣어주고 그 안에 넣어주면 됩니다.

#### Map

> javaScript, TypeScript 에서 object  
> python의 dictionary 와 동일합니다.

> var player = { 'name': 'nico',  
>                         'xp': 19.99,  
>                         'superpower': false,  
> };  
> // Map<String, Object>

이렇게 만들면 자동으로 컴파일러가 타입을 지정해줍니다.

**Map<String, Object>**

var대신 확실한 타입을 지정할 때는 역시나 Map<>을 사용해주면 됩니다.

Object : 어떤 자료형이 될 수도 있는 타입.

any와 동일하다고 보면 될 듯합니다.

Map을 이용해서 엄청 복잡한 형태도 만들 수 있습니다.

> Map<List<int>, bool> player = { \[1,2,3,4\]: true, };

또는 

> List<Map<String, Object>> player = \[  
>   {  
>     "name" : 'nico,  
>     "age" : 12,  
>     "xp" : 19999.99,  
>   }  
> \];

이런식으로 다양하게 짤 수 있습니다.

만약 Object를 만드는데 JS나 TypeScript에서 Object를 만드는 방식으로 만든다면

Map 대신 Class를 만드는 게 더 합리적이라고 합니다.

key와 value로 이루어진 타입을 만든다면, Dart에서 Map 보다는 class가 더 나은 방법이라고 합니다.

#### Set 

> var numbers = {1, 2, 3, 4};  
> Set<int> num = {1, 2, 3, 4};

list와 동일한 느낌인데 다른 점은 list는 \[\] 로 감싸져있고 set은 {}로 감싸져있다는 점입니다.

가장 큰 차이점은 set은 요소가 항상 하나씩만 있습니다.

> Set<int> num = {1, 2, 3, 4};  
> num.add(1);  
> num.add(1);  
> num.add(1);  
> print(num); // {1, 2, 3, 4}

1이 있는 상태에서 1을 몇 번을 넣어도 1은 더 추가 되지 않는 것을 볼 수 있습니다.

요소가 하나씩만 있어야 하는 상황에는 Set 그 외에 상황에는 List를 사용하면 될 듯 합니다.
