---
title: 'Flutter 공부 중 마구잡이 정리 3'
pubDate: 2026-01-18
category: study/flutter
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/122
---
### Widget

이전까지 사용했던 widget은 **stateless widget** 입니다.

Stateless widget은 가장 기본이 되는 widget으로써

Build 메서드를 통해 단지 UI를 출력해주는 widget입니다.

그런데 저희는 데이터에 의해 변경이 되는 ui를 만들고 싶습니다.

그럴때 사용하는 widget은 **stateful widget** 입니다

stateful widget은 상태를 가지고 있는 widget으로써

데이터가 변경 될 때 이 변화를 UI에 반영 할 수 있습니다.

그러면 직접 해보도록 하겠습니다.

#### 예제

간단하게 버튼을 누르면 숫자가 올라가는 화면을 만들겠습니다.

\- 아마 flutter 앱을 처음 만들면 나오는 예제 화면과 동일 할 것입니다.

![](/images/flutter-122/1.png)

```javascript
import 'package:flutter/material.dart';

void main() {
  runApp(App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  int count = 0;

  void onClicked() {
    count++;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Color(0xFFF4EDDB),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Click Count', style: TextStyle(fontSize: 30)),
              Text('$count', style: TextStyle(fontSize: 30)),
              IconButton(
                iconSize: 40,
                onPressed: onClicked,
                icon: Icon(Icons.add_box_rounded),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

stateless Widget에서 stateful Widget으로 쉽게 바꾸는 방법은

역시 command + . 를 누르면 자동으로 바뀌더라구요

진짜 모든 것을 자동으로 다 해줘요..

count를 만들고 count가 증가하는 void 함수를 만들었습니다.

그리고 IconButton 의 onPressed 속성에 넣어줬습니다.

이러고 실행을 해보면 화면이 count가 바뀌지 않습니다.

print(count)를 해보면 console에는 count가 변경되는 것을 볼 수 있습니다.

#### setState()

저는 코드를 처음 보자마자 React의 useState가 생각났습니다.

현재 값은 변경되고 있지만 UI가 업데이트가 되고 있지 않습니다.

UI를 최신 데이터로 업데이트를 해줘라는 함수가 존재했습니다.

```javascript
  void onClicked() {
    setState(() {
      count++;
    });
  }
```

setState() 는 지금 state가 변경된다는 것을 알려주는 함수입니다.

setState를 돌리게 되면 아래 build 메서드를 다시 돌려서 화면 업데이트를 진행합니다.

useState와 완전 동일하죠?

setState 함수 안에 꼭 count++ 를 넣을 필요? 전혀 없습니다

> void onClicked() {  
>   count++;  
>   setState(() {});  
> }

이렇게 해도 동일하게 작동하는 것을 볼 수 있습니다.

내부에 넣는 이유는 간단하게 가독성이 좋아지기 때문이라고 합니다.

setState 함수를 부르면 build 메소드를 다시 실행시켜서 최신 데이터로 UI에 반영한다는 점만 알면 될 듯합니다.

### context

> Widget build(BuildContext context) {

build 메서드를 만들면 항상 나오는 context가 있습니다.

App을 보면 Widget들이 모여서 만들어져있습니다.

그 widget들을 보면 그 들끼리도 상하 관계로 되어있습니다.

이를 widget Tree라고 불리기도 합니다.

![](/images/flutter-122/2.png)

그러면 맨 밑에 Text widget이 위 Column에 접근하려면?

Column에서 만들어둔 Theme에 접근해서 쉽게쉽게 작성하려면?

이 때 사용하는 것이 context입니다.

```javascript
    return MaterialApp(
      theme: ThemeData(
        textTheme: TextTheme(titleLarge: TextStyle(color: Colors.red)),
      ),
```

MaterialApp에 ThemeData를 만들었습니다.

지금은 하나 뿐이지만 추후에 엄청 여러가지 디자인시스템을 만들어 둘 수 있겠죠?

이 theme를 맨 마지막 Text에 속성을 넣고 싶다면?

```javascript
  @override
  Widget build(BuildContext context) {
    return Text(
      'My Large Title',
      style: TextStyle(
        fontSize: 30,
        color: Theme.of(context).textTheme.titleLarge?.color,
      ),
    );
```

이처럼 context를 이용하여 쉽게 접근이 가능합니다.

context는 부모 / 상위 widget들에 접근을 할 수 있도록 도와주는 친구라고 생각하면 될 듯합니다.

* * *

### widget lifecycle

코딩을 하다보면 항상 나오고 항상 생각 해야하는 것이 lifecycle 인 것 같습니다.

flutter 또한 역시 있습니다.

그런데 flutter에서는 **stateful widget** 에 존재합니다.

다른 것들과 그냥 동일한데 그 중 많이 사용되는 것은

-   initState
-   build
-   dispose

widget이 build되기 전 **initState.**

initState 대신 그냥 변수만 작성해줘도 init과 동일하긴 하지만 그래도 종종 써야하는 상황도 존재합니다.

> int count = 0;  
>   
> @override  
> void initState() {  
>   super.initState();  
>   print('hello');  
> }

이처럼 count를 그냥 0으로 초기화 하는 것도 init과 동일합니다.

꼭 init 안에다 하지 않아도 상관없습니다.

**가장 많이 본 build 메서드.**

widge이 build 될 때 불리는 것입니다.

return을 해줘야하는 것이 특징입니다.

**dispose**

widget이 스크린에서 사라질 때 불립니다.

```javascript
  @override
  void dispose() {
    super.dispose();
  }
```
