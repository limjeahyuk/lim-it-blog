---
title: 'Dart 공부 중 마구잡이 정리 5'
slug: flutter-118
pubDate: 2026-01-11
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/118
---
## Class

Flutter에서 가장 중요하고 거의 모든 요소를 구성하고 있는 class입니다.

먼저 Class를 만들어 보겠습니다.

추가로 **Class에는 var 보다는 확실한 타입을 적어줘야합니다.**

```javascript
class Player {
  String name = 'nico';
  int xp = 1500;
  
  void sayHello(){
    print("Hi my name is $name");
  }
}
```

Player Class를 만든 후에 main에서 사용을 하면

> var player = Player();

이러면 인스턴스가 생성되게 됩니다.

이후 player.name 으로 name을 바꿀 수도 있고 name을 출력 할 수도 있습니다.

만약 name을 못 바꾸게 하고 싶다면?

> final String name = 'nico';

final를 앞에 넣어주시면 됩니다.

sayHello함수에서 name에 this를 안 붙혀도 되나요?

Flutter에서는 name이 중복 되는 것이 아니라면 따로 안 붙혀도 됩니다.

```javascript
class Player {
  final String name = 'nico';
  int xp = 1500;
  
  void sayHello(){
    var name = "121";
    print("Hi my name is $name"); // Hi my name is 121
    print("Hi my name is ${this.name}"); // Hi my name is nico
  }
}
```

이렇게 name이 중복 된 것이 아니라면 this는 굳이 안 넣어줘도 됩니다.

#### Constructors ( 생성자 )

Player에 값이 정해져 있으니까 너무 뻔합니다.

그렇다고 계속 **player.name = "Lim";** 이런 식으로 넣어줄 순 없고 인스턴스 생성하는 시점에 값을 넣어줬으면 좋겠습니다.

```javascript
class Player {
  late final String name;
  late int xp;
  
Player(String name, int xp){
  this.name = name;
  this.xp = xp;
}
```

name과 xp에 값이 추후에 들어온다는 class에서 정말 유용하게 쓸 수 있는 late를 넣어주고

생성자를 만들어줬습니다.

이렇게 만들어도 되는데... 타입이 너무 반복되고 너무 복잡하다는 생각이 듭니다.

그렇기에 Flutter에서는 다른 방법을 사용합니다.

```javascript
class Player {
  final String name;
  int xp;
  
  Player(this.name, this.xp); // 생성자 constructors
}
```

아주 깔끔해졌습니다. 순서를 잘 맞춰서 작성을 해줘야합니다.

#### named constructor Parameters

그런데 위 방식으로 하니까 뭐가 생각나지 않나요?

function의 positional과 비슷한 것 같은데..

> class Player {  
>   final String name;  
>   int xp;  
>   String team;  
>   int age;

만약 Player 인스턴스를 만든다면 아래와 같을 것입니다.

**var player = Player('Lim', 1200, 'red', 12);**

player를 보면 중간에 1200은 뭐고 12는 뭐지??

코드를 처음 보는 사람은 매우 헷갈릴 것 같네요

function의 positional처럼 순서를 매우 중요하기에 뭐가 뭔지 그리고 순서를 항상 생각을 해야합니다.

그렇기에 착안한 named 방식이 생성자를 만들때도 동일합니다.

```javascript
class Player {
  final String name;
  int xp;
  String team;
  int age;
  
  Player({this.name, this.xp, this.team, this.age});
}

void main(){
 var player = Player(
    name : 'Lim',
    xp: 1200,
    team: 'red',
    age: 12,
 );
}
```

이렇게 만들면 flutter에서 에러가 엄청나게 나올 것입니다.

function과 동일한 맥락이죠.

argument들이 null이면 어떡할 건지 에러를 통해 물어보는 것입니다.

그러면 똑같이 두가지 방법이 있습니다.

**기본값을 설정해주는 것**과 **required**

class에서는 기본값을 설정하는 것보다는 required가 더 좋을 듯하니

```javascript
  Player({
    required this.name,
    required this.xp,
    required this.team,
    required this.age
  });
```

이렇게 작성해주면 정상적으로 동작합니다.

위 방식을 **Named constructor parameter** 라고 합니다.

#### Named constructor

만약 위처럼 team을 blue로 하고 xp를 0으로 고정하는 생성자를 만들고 싶다면?

물론 그냥 Player 기본 생성자로 다 작성을 해도 되지만 여러명이라면 공통되는 건 빼는 것이 좋지 않을까요

```javascript
  var player = Player.createBluePlayer(
    name: "nico",
    age: 21,
  );
```

예를 들어서 이런식으로

이럴때는 좀 색다른 방식으로 사용할 수 있습니다.

```javascript
  Player.createBluePlayer({
    required String name,
    required int age
  }) : this.age = age,
       this.name = name,
       this.team = 'blue',
       this.xp = 0;
```

**:** 를 사용하는 문법입니다.

name과 age는 반드시 받아야 하며, age와 name를 추가해주고 team과 xp는 고정값을 초기화를 시켜주는 것입니다.

이것을 사용하기 위해서는 위 예제를 이용하면 됩니다.

또 다른 방식으로는 굳이 parameter가 2개인데 name을 사용해야하나요?

다른 방식도 있습니다.

```javascript
  Player.createRedPlayer(String name, int age) :
    this.age = age,
    this.name = name,
    this.team = 'red',
    this.xp = 0;
    
  var redPlayer = Player.createRedPlayer("nico",21);
```

이런 방법도 있습니다.

#### Named constructor EX

```javascript
  var apiData = [
    {
      "name": "nico",
      "team": "red",
      "xp": 0,
    },
    {
      "name": "lim",
      "team": "red",
      "xp": 0,
    },
    {
      "name": "son",
      "team": "blue",
      "xp": 0,
    },
  ];
```

이런 data가 넘어온다고 생각을 했을 때,

구조체에 forJson 형식으로 변경을 해서 저장을 하려고 합니다.

```javascript
class Player {
  final String name;
  int xp;
  String team;
  
  Player.fromJson(Map<String, dynamic> playerJson) 
    : name = playerJson['name'],
      xp = playerJson['xp'],
      team = playerJson['team'];
  
  void sayHello(){
    print("Hi my name is $name");
  }
}
```

playerJson을 받습니다. 해당 타입은 Map타입에 key는 String, data 는 dynamic 타입입니다.

각 내용들을 name , xp, team 에 알맞게 넣어주도록 만들어줬습니다.

```javascript
  apiData.forEach((playerJson) {
    var player = Player.fromJson(playerJson);
    player.sayHello();
  });
```

사용은 이렇게 해주게 되면 콘솔에 아래와 같이 나타나게 됩니다.

> Hi my name is nico  
> Hi my name is lim  
> Hi my name is son

#### Cascade Notation

```javascript
class Player {
  String name;
  int xp;
  String team;
  
  
  Player({
    required this.name,
    required this.xp,
    required this.team,
  });
```

간단한 Player class가 있습니다.

여기서 Player 인스턴스를 하나 생성하고 그 이후에 값을 다 바꾸겠습니다.

```javascript
var nico = Player(name: 'nico', xp: 1200, team: 'red');
nico.name = 'las';
nico.xp = 12000;
nico.team = 'blue';
```

그런데 nico가 너무너무 겹치지 않나요??

중복되서 사용하는 게 너무 귀찮은 걸요??

Dart에서는 좀 더 단축해서 사용할 수 있습니다.

```javascript
  var nico = Player(name: 'nico', xp: 1200, team: 'red')
  ..name = 'las'
  ..xp = 12000
  ..team = 'blue';
```

이렇게 사용하게 되면 위 문법과 아예 동일합니다.

Player 인스턴스를 만들고 거기에 값을 다 새롭게 넣어주고 있는 문법입니다.

그럼 꼭 만들자 마자 해야하는 건가요?

또는 함수는 사용안되나요?

```javascript
  var nico = Player(name: 'nico', xp: 1200, team: 'red');
  var potat = nico
  ..name = 'las'
  ..xp = 12000
  ..team = 'blue'
  ..sayHello();
```

이렇게도 충분히 가능합니다.

;의 유무를 잘 확인해서 사용을 해야합니다.

#### Enums

Swift에서도 정말 많이 사용했던 enum이 나왔습니다.

enum은 정해진 값들에서 개발자가 정할 수 있도록 해줍니다.

그렇게 실수를 줄여주는 역할을 합니다.

```javascript
enum Team {red, blue}
enum XPLevel {beginner, medium, pro}

class Player {
  String name;
  XPLevel xp;
  Team team;
}
```

team을 String으로 하게되면 'red', 'blue' 이렇게 타이밍으로 직접 작성을 했어야 했습니다.

그러면 뭐... bleu라던가? rde라던가? 타이핑 실수가 날 수도 있고 team은 두가지 뿐인데 막 'gray'가 생겨버릴 수도 있고

엄청 난잡해지기도 합니다.

그런데 enum으로 하게 되면 작성이 아니라 선택을 할 수 있어서 확실해집니다.

사용은 아래와 같습니다.

```javascript
  var nico = Player(name: 'nico', xp: .beginner, team: Team.red);
  var potat = nico
  ..name = 'las'
  ..xp = .pro
  ..team = Team.blue
  ..sayHello();
```

Team.red / Team.blue / .beginner / .pro

이런식으로 선택을 할 수 있게 됩니다.

enum의 이름을 써도 되고 아니면 그냥 .으로 생략도 가능합니다.

#### Abstract Classes (추상화 클래스)

추상화 클래스는 그냥 클래스와 다르게 객체를 생성할 수 없습니다.

다른 클래스들이 직접 구현해야하는 메소드를 작성해두는 클래스입니다.

예시를 보시죠

```javascript
abstract class Human {
  void walk();
}
```

Human이라는 추상화 클래스를 만들 때 walk에 대한 동작은 내부에 작성하지 않습니다.

그냥 Human class를 사용하면 walk라는 void 함수가 무조건 있다 라는 것만 알 수 있습니다.

그러면 Human class는 어떻게 사용하나요?

> class Player extends Human{

class에 extends를 이용하여 추가하면 됩니다.

이렇게만 하면 에러가 나타납니다.

walk()가 없기 때문이죠.

그러면 walk()를 만들어주겠습니다.

```javascript
  void walk(){
    print('im walking');
  }
```

이렇게 해주면 정상동작을 하게 됩니다.

또 다른 coach class를 만들었을때

```javascript
class Coach extends Human {
  void walk(){
    print('the coach is walking');
  }
}
```

Human class를 상속받아서 player와 동일하게 walk 함수가 있는 것을 볼 수 있습니다.

그런데 내부 동작 코드는? 다르게 할 수 있다는 것을 볼 수 있습니다.,

walk함수가 있는 것은 확실하지만 그 내부 print는 다릅니다.

#### Inheritance (상속)

부모 class와 자식 class를 만들면 상속에 대해서 가장 먼저 나오게 됩니다.

예시를 들면서 말해보겠습니다,

```javascript
class Human {
  final String name;
  
  Human(this.name);
  
  void sayHello(){
    print("hi my name is $name");
  }
}
```

Human이라는 class가 있습니다.

name을 받고 sayHello라는 함수를 가지고 있습니다.

그리고 Human class를 상속하는 player class를 만들겠습니다.

```javascript
enum Team {blue, red}

class Player extends Human {
  final Team team;
}
```

상속은 extends를 이용하여 하면 됩니다.

이러면 Player는 team과 Human의 name 두 개를 가지게 됩니다.

그러면 당연하게 생성자를 만들어줘야겠죠?

team은 그냥 받으면 되지만 name의 경우 부모 class의 Human(this.name)을 호출을 해야합니다.

```javascript
  Player({
    required this.team,
    required String name
  }) : super(name);
```

부모 클래스에 접근을 할 때는 직접 접근하는게 아니라 Super키워드를 이용하여 부모클래스와 상호작용을 합니다.

이런식으로 name을 부모클래스 생성자에 접근시켜 넘겨줄 수 있습니다.

player를 만들때는 아래와 같습니다.

> var player = Player(team: .red, name: 'nico');

이렇게 하니까 named도 가능한지 궁금해집니다.

당연히 가능합니다.

```javascript
class Human {
  final String name;
  
  Human({required this.name});
  
  void sayHello(){
    print("hi my name is $name");
  }
}

enum Team {blue, red}

class Player extends Human {
  final Team team;
  
  Player({
    required this.team,
    required String name
  }) : super(name: name);
  
}
```

사용할때 그러면 human class의 sayHello 함수도 당연하게 사용이 가능해집니다.

근데 player에서는 좀 다르게 sayHello를 하고 싶습니다.

그럴때는 override를 사용하면 됩니다.

```javascript
  @override
  void sayHello(){
    super.sayHello();
    print('and I play for ${team}');
  }
```

먼저 부모클래스의 sayHello함수를 부르고 싶으니까 super를 이용하여 부르면 됩니다.

굳이 똑같은 코드를 한 번 더 쓸 필요는 없으니깐요

그러면 player객체에서 sayHello를 부르게 되면 override한 sayHello가 불리게 됩니다.

#### Mixins

생성자가 없는 클래스.

클래스에 프로퍼티들을 추가할 때 사용합니다.

```javascript
mixin Strong {
  final double strenghtLevel = 1500.99;
}

mixin QuickRunner {
  void runQuick() {
    print("ruuuuuuuuun!");
  }
}

mixin Tall {
  final double height = 1.99;
}
```

mixin을 사용할때는 class 대신 이렇게 사용을 하면 됩니다.

추가로 가장 중요한 것은 생성자가 없이 초기값까지 확실하게 만들어져있어야합니다.

반드시 생성자가 없어야합니다.

player안에 3가지 다 추가를 할 때는

```javascript
class Player with Strong, QuickRunner, Tall {
  final Team team;
  
  Player({
    required this.team,
  });
    
}
```

with를 이용하면 됩니다.

그러면 Strong, QuickRunner, Tall의 프로퍼티들을 다 사용할 수 있게 됩니다.

이렇게만 하니까 이게 굳이 필요한가 싶을 수 있습니다.

만약 class가 여러개라면?

```javascript
class Horse with Strong, QuickRunner {}

class Kid with QuickRunner {}
```

이렇게 했을때는 with하나로 각각 class의 특징을 mixin을 이용하여 쉽게 넣을 수 있습니다.
