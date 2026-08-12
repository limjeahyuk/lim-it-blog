---
title: 'Flutter 공부 중 마구잡이 정리2'
pubDate: 2026-01-18
category: study/flutter
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/121
---
### 만들어 볼 것

![](/images/flutter-121/1.png)

* * *

### Setting

vscode 코드 세팅을 먼저 건드리니 앞으로 쓸 코딩이 매우 수월해졌기에 먼저 소개해보겠습니다.

> command + shift + p  
> open user Setting (JSON)

setting.json 파일을 열어줍니다.

```javascript
"dart.previewFlutterUiGuides": true,
    "[dart]": {
        "editor.formatOnSave": true,
        "editor.formatOnType": true,
        "editor.rulers": [
            80
        ],
        "editor.codeActionsOnSave": {
            "source.fixAll": "explicit"
        },
        "editor.selectionHighlight": false,
        "editor.tabCompletion": "onlySnippets",
        "editor.wordBasedSuggestions": "off",
        "editor.bracketPairColorization.enabled": true,
        "editor.stickyScroll.enabled": true
    }
```

-   previewFlutterUiGuides  
    코드를 아래와 같이 눈으로 어디서부터 어디인지 알아보기 쉽게 보여줍니다.

![](/images/flutter-121/2.png)

-   formatOnSave  
    저장을 하면 자동으로 코드 format을 해줍니다.
-   fixAll  
    warning을 모두 권장하는 방법으로 고쳐줍니다.
-   stickyScroll  
    scroll을 내리면 맨 상단에 함수가 따라옵니다.

그 외에도 여러가지가 있는 데 이것만 해도 많이 도움이 되었습니다.

추가로 Extension으로 Error Lens를 추가해주시면 에러가 났을 때 왜 나는지 마우스를 가져다 대지 않아도 눈으로 보여줍니다.

![](/images/flutter-121/3.png)

예시) Expected to find ';' . 

![](/images/flutter-121/4.png)

* * *

### header

```javascript
return MaterialApp(
      home: Scaffold(
        backgroundColor: Color(0xFF181818),
        body: Column(
          children: [
            SizedBox(height: 80),
            Row(
              children: [
                Column(
                  children: [
                    Text(
                      'Hey, Selena',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    Text(
                      'Welcome back',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.8),
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
```

#### backgroundColor

먼저 backgroundColor는 Scaffold의 속성이기에 Scaffold 내부에 넣어줬습니다.

( Scaffold에 마우스를 가져다 대면 볼 수 있습니다. )

Color의 경우 **Colors.white** 처럼 white , blue 등등 그냥 간단하게 쓸 수 있지만...

회사나 프로젝트를 하다보면 그렇게 간단하게 쓰지 않습니다.

주로 hex 코드를 이용하게 될텐데요.

이럴때는 Color(0xFF + **hex코드**) 를 해주는 방법도 있습니다.

Color(0xFF181818) 인것을 보니까 hex코드로 #181818 인 색상이겠네요

추가로 alpha 값은 withValue(alpha: )를 붙혀주시면 됩니다.

#### Column / Row

flutter에서 화면을 구성하는 것은 마치 Web을 만들때와 비슷하다는 생각을 했습니다.

display flex를 생각하면 매우 쉽게 이해가 될 듯합니다.

**내부 widget들을 가로(수평) 으로 둘 때는 Row**

반대로 **내부 widget들을 세로(수직) 으로 둘 때는 Column**

를 사용해주면 됩니다.

사용법은 위 코드처럼 children을 이용해 내부 widget을 넣어줄 수 있습니다.

> Column(  
>   children:\[  
>     widget들...  
>   \]  
> )

Row 도 마찬가지 입니다.

#### SizedBox

그냥 아무것도 없는 빈 box를 의미합니다.

widget 사이를 빈 공간으로 띄울 때 사용합니다.

위 코드에서는 appBar를 따로 넣지 않았기 때문에 그 부분을 sizedBox로 대체하여 여백을 줬습니다.

#### Text

Text 또한 widget입니다.

Text에 마우스를 가져다 대보면 data는 무조건 받고 그 외 여러가지 속성이 있습니다.

여기서 data는 Text로 사용할 글자를 뜻합니다. ("welcome Back")

해당 Text의 여러 속성은 style: TextStyle 을 이용하면 됩니다.

TextStyle에는 엄청 여러가지 속성들이 있으니 한 번 들어가서 보시면 좋을 듯 합니다.

#### 중간 결과

![](/images/flutter-121/5.png)

여기서 문제는

1\. 글자들이 오른쪽 정렬이 되어야함.

2\. 오른쪽에 padding이 있어야 함.

#### 정렬

\- mainAxisAlignment

\- crossAxisAlignment

두 속성 모두 Row 또는 Coulmn 의 속성입니다.

각각 Row 와 Coulmn 어디에 사용하냐에 따라 조금씩 다릅니다.

**mainAxisAlignment**

Row에서 사용할 때는 수평

Coulmn에서 사용할 때는 수직

**crossAxisAlignment**

Row에서 사용할 때는 수직

Coulmn에서 사용할 때는 수평.

그렇다면 아래와 같이 써야 하겠네요

```javascript
SizedBox(height: 80),
Row(
  mainAxisAlignment: MainAxisAlignment.end,
  children: [
    Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          'Hey, Selena',
```

Row에서는 Main을 사용하여 Column widget을 오른쪽 맨 끝으로 보냅니다.

Coumn에서는 cross를 사용하여 Text Widget들을 오른쪽 맨 끝으로 보냅니다.

![](/images/flutter-121/6.png)

#### padding

오른쪽에 여백을 넣기 위해서는 전체적으로 넣어줘야 그 아래 새로운 widget을 넣더라도 자동으로 들어가게 될 것입니다.

그러기 위해서는 아래와 같이 넣어줘야합니다.

```javascript
      home: Scaffold(
        backgroundColor: Color(0xFF181818),
        body: Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
```

symmetric는 vertical 과 horizontal을 묶어서 조정해줄 수 있으며, all의 경우에는 4면 모두 한번에 적용.

등등 여러가지 속성이 있으니 확인 해주시면 됩니다.

그런데 이제까지 만들어 둔 Column을 싹 다 **잘라내기** 하고 Padding을 넣고 다시 **붙여넣기**를 하라고요?

하나라도 잘못 복붙하면 에러 잔뜩 나면서 이거 머리가 너무 아픈걸요???

다행히 Flutter는 이걸 알아서 해주더라구요.

정말 다행이에요. 이 기능은 지금 만들면서 와.. 대박이다 생각을 하고 있어요.

Column을 클릭을 하고 왼쪽을 보면 전구가 있을 것이에요. 클릭해보면 아래처럼 나오겠죠?

![](/images/flutter-121/7.png)

뭐 여러개가 있는데 여기서 Padding을 클릭해보면 자동으로 Padding으로 감싸지게 됩니다.

이거를 여는데 마우스로 쓰는 것 조차 귀찮기 때문에 단축키를 알아두면 정말 빠르게 코딩이 가능해집니다.

맥북 기준 **command + .** 입니다.

이렇게 하면 Header 부분은 정상적으로 나오게 됩니다.

![](/images/flutter-121/8.png)

* * *

### Body

그 이후 Total Balance는 쉽게 만들 수 있을 것입니다.

```javascript
  SizedBox(height: 50),
  Text(
    'Total Balance',
    style: TextStyle(
      fontSize: 22,
      color: Colors.white.withValues(alpha: 0.8),
    ),
  ),
  SizedBox(height: 5),
  Text(
    '\$5 194 482',
    style: TextStyle(
      fontSize: 42,
      fontWeight: FontWeight.w600,
      color: Colors.white,
    ),
  ),
],
```

이렇게만 하면 중앙 정렬일 테니까 Coulmn에 Alignment를 적어서 start로 왼쪽 정렬 해주시면 됩니다.

이제는 Button처럼 생긴 것을 만들어보겠습니다.

### Button

Container를 이용을 할 예정입니다.

container는 간단하게 생각해서 Swift의 View와 같습니다.

box를 하나 만든다고 생각하면 편할 듯 합니다.

자식을 하나만 가지며 여러 속성을 가지고 있습니다.

```javascript
Row(
children: [
  Container(
    decoration: BoxDecoration(
      color: Colors.amber,
      borderRadius: BorderRadius.circular(45),
    ),
    child: Padding(
      padding: EdgeInsets.symmetric(
        vertical: 20,
        horizontal: 50,
      ),
      child: Text(
        'Transfer',
        style: TextStyle(fontSize: 20, color: Colors.black),
      ),
    ),
  ),
```

이런식으로 사용을 하게 되면 button 처럼 나오게 됩니다.

이를 두개를 작성을 해주면 아래처럼 나오게 될 것입니다.

![](/images/flutter-121/9.png)

이제 둘을 서로를 벌려놔야하기에 이 또한 align 을 사용하면 쉽게 됩니다.

> Row(  
> mainAxisAlignment: MainAxisAlignment.spaceBetween,

이러면 예제화면처럼 나오는 것을 볼 수 있습니다.

그런데 여기서 멈추면 좀 그렇죠?

똑같은 버튼이 있으면 widget 화 시켜두는 게 인지상정.

새로운 파일을 만들어서 button.dart 을 만들었습니다.

```javascript
import 'package:flutter/material.dart';

class Button extends StatelessWidget {
  final String text;
  final Color bgColor;
  final Color textColor;

  const Button({
    super.key,
    required this.text,
    required this.bgColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(45),
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(vertical: 20, horizontal: 50),
        child: Text(text, style: TextStyle(fontSize: 20, color: textColor)),
      ),
    );
  }
}
```

이전에 배운 것처럼 똑같이 class를 만들었으며 모두 동일하게 했습니다.

대신 color와 text만 새롭게 받았습니다.

이렇게 하고 main.dart를 변경을 하면 매우매우 깔끔해졌습니다.

```javascript
  Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      Button(
        text: 'Transfer',
        bgColor: Colors.amber,
        textColor: Colors.black,
      ),
      Button(
        text: 'Request',
        bgColor: Color(0xFF1F2123),
        textColor: Colors.white,
      ),
    ],
```

### Card

```javascript
Container(
    decoration: BoxDecoration(
      color: Color(0xFF1F2123),
      borderRadius: BorderRadius.circular(25),
    ),
    child: Padding(
      padding: const EdgeInsets.all(30),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Euro',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: 10),
              Row(
                children: [
                  Text(
                    '6 428',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                    ),
                  ),
                  SizedBox(width: 5),
                  Text(
                    'EUR',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8),
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Icon(Icons.euro_rounded, color: Colors.white, size: 88),
        ],
      ),
    ),
)
```

Button과 동일하게 Container를 이용하여 backgroundColor와 내부 내용을 넣고 Rounded를 적용해줬습니다.

여기서 Icon이 조금 신기했습니다.

Flutter에서 제공하는 Icon을 간단하게 사용을 할 수 있었습니다.

![](/images/flutter-121/10.png)

이처럼 미리보기로 간단하게 보고 사용을 할 수 있었습니다.

미리보기가 안나오시는 분은 선택하려는 것 오른쪽 끝에 > 를 눌러주시면 그 이후부터는 잘 나올 것입니다.

위 코드를 사용하면 이렇게 나오게 됩니다.

![](/images/flutter-121/11.png)

이제 고쳐야하는 점은 세가지 정도 있을 것입니다.

1\. 아이콘이 더 커져야합니다.

2\. 아이콘이 카드 밖을 삐져나와서 그 외에는 잘려야합니다.

3\. 카드 여러가지를 만들어서 그 카드들이 이전 카드들을 살짝 덮어져야합니다.

#### icon

아이콘이 커지기 위해서는 당연히 Icon에 size를 건드리면 될 것 같지만 size를 키우면 카드 크기도 커지게 됩니다.

끄응... 이 때부터 머리가 아파지는데요.

이때는 Transform 을 사용해주면 **아이콘의 크기만** 키울 수가 있습니다.

```javascript
  Transform.scale(
    scale: 2.2,
    child: Icon(Icons.euro, color: Colors.white, size: 88),
  ),
```

이것도 잘라내기를 할 필요 없이 command + . 을 이용해서 widget을 추가해주고 widget대신 Transform을 넣어주면

쉽게 고칠 수 있습니다.

이렇게 하면 결과물은 아래와 같습니다.

![](/images/flutter-121/12.png)

아이콘이 너무 중앙인데 이것도 조금 아래로 움직여줄 필요가 있을 것 같은데요?

아이콘만 움직이는 것도 Transform을 사용해주면 됩니다.

```javascript
  Transform.scale(
    scale: 2.2,
    child: Transform.translate(
      offset: Offset(-5, 12),
      child: Icon(
        Icons.euro,
        color: Colors.white,
        size: 88,
      ),
    ),
  ),
```

#### Transform

Transform에 여러가지 속성이 있는데

scale의 경우에는 해당 widget의 크기를 배로 늘려주는 것입니다.

scale 만큼 키워줍니다. 위 코드를 보면 2.2배 키워주는 것이겠죠?

translate의 경우에는 해당 widget의 위치를 offset만큼 움직여주는 것입니다.

absoulte라고 생각을 하면 좋을 것 같습니다.

고정적으로 움직여주는 것이기에 그 외와는 상호작용을 따로 안합니다.

이렇게 하면 결과물은 아래와 같습니다.

![](/images/flutter-121/13.png)

이제 삐져나와 있는 부분을 잘라줘야겠죠?

> Container(  
>    clipBehavior: Clip.hardEdge,

clipBehavior 속성을 이용해주면 삐져나와 있는 부분을 지워줄 수 있습니다.

이렇게 카드가 완성되었습니다.

그러면 그 외에 3가지를 복붙 해보겠습니다.

![](/images/flutter-121/14.png)

여기서 또 flutter가 정말 신기했습니다.

Bottom에 4 pixels 만큼 더 나왔다는 것을 저렇게 보여주더라구요

지금 화면에 문제가 있다는 것을 보여주는 것 같습니다.

이거는 작은 화면의 휴대폰이라면 더 크게 문제가 생겼겠죠?

이럴때는 넘어서는 부분은 스크롤을 할 수 있게 해주면 될 듯합니다.

```javascript
      home: Scaffold(
        backgroundColor: Color(0xFF181818),
        body: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
```

SingleChildScrollView 속성을 넣어주면 쉽게 해결이 됩니다.

( 이것도 command + . 의 widget으로 추가해주면 쉽게 변경이 됩니다. )

이제는 아래 카드들의 위치를 좀 수정해서 겹쳐줘보도록 하겠습니다.

아이콘에서 써던 것 처럼 전체적으로 Transform.translate를 넣어주면 될듯합니다.

```javascript
    Transform.translate(
      offset: Offset(0, -20),
      child: Container(
```

이제 버튼처럼 새로운 class로 만들어봐야겠죠?

```javascript
import 'package:flutter/material.dart';

class CurrencyCard extends StatelessWidget {
  final String name, code, amount;
  final IconData icon;
  final bool isInverted;
  final int order;

  // private
  final _blackColor = const Color(0xFF1F2123);

  const CurrencyCard({
    super.key,
    required this.name,
    required this.code,
    required this.amount,
    required this.icon,
    required this.isInverted,
    required this.order,
  });

  double offsetOrder(int order) {
    switch (order) {
      case 0:
        return 0;
      case 1:
        return -20;
      case 2:
        return -40;
      default:
        return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Transform.translate(
      offset: Offset(0, offsetOrder(order)),
      child: Container(
        clipBehavior: Clip.hardEdge,
        decoration: BoxDecoration(
          color: isInverted ? Colors.white : Color(0xFF1F2123),
          borderRadius: BorderRadius.circular(25),
        ),
        child: Padding(
          padding: const EdgeInsets.all(30),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: TextStyle(
                      color: isInverted ? _blackColor : Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  SizedBox(height: 10),
                  Row(
                    children: [
                      Text(
                        amount,
                        style: TextStyle(
                          color: isInverted ? _blackColor : Colors.white,
                          fontSize: 20,
                        ),
                      ),
                      SizedBox(width: 5),
                      Text(
                        code,
                        style: TextStyle(
                          color: isInverted
                              ? _blackColor.withValues(alpha: 0.8)
                              : Colors.white.withValues(alpha: 0.8),
                          fontSize: 20,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Transform.scale(
                scale: 2.2,
                child: Transform.translate(
                  offset: Offset(-5, 12),
                  child: Icon(
                    icon,
                    color: isInverted ? _blackColor : Colors.white,
                    size: 88,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

저는 order을 사용해서 0이면 offset 0 / 1이면 offset -20 / 2이면 offset -40 을 해줬습니다.

그 후 아래처럼 코드를 바꿔주니

```javascript
    CurrencyCard(
      name: "Euro",
      code: 'EUR',
      amount: '6 428',
      icon: Icons.euro_rounded,
      isInverted: false,
      order: 0,
    ),
    CurrencyCard(
      name: "Bitcoin",
      code: 'BTC',
      amount: '9 785',
      icon: Icons.currency_bitcoin_rounded,
      isInverted: true,
      order: 1,
    ),
    CurrencyCard(
      name: "Dollar",
      code: 'USD',
      amount: '428',
      icon: Icons.attach_money_rounded,
      isInverted: false,
      order: 2,
    ),
```

원하는 대로 잘 나왔습니다.

![](/images/flutter-121/15.png)

좀 더 코드를 보기 좋게 하려면... 단위같은거는 enum으로 해줘도 좋을 것 같습니다.

flutter의 기초 틀을 배우기에 매우 좋은 시간이였던 것 같습니다 :)

* * *

### 참고

아래 강의를 보고 따라하며 작성한 블로그 글입니다.

[https://nomadcoders.co/flutter-for-beginners/lectures/4178](https://nomadcoders.co/flutter-for-beginners/lectures/4178)

 [All Courses – 노마드 코더 Nomad Coders

초급부터 고급까지! 니꼬쌤과 함께 풀스택으로 성장하세요!

nomadcoders.co](https://nomadcoders.co/flutter-for-beginners/lectures/4178)
