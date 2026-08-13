---
title: 'Flutter 공부 중 마구잡이 정리 part.1'
pubDate: 2026-01-17
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/120
---
아래 강의를 듣고 따라서 작성하는 블로그 입니다.

[https://nomadcoders.co/flutter-for-beginners/lectures/4178](https://nomadcoders.co/flutter-for-beginners/lectures/4178)

 [All Courses – 노마드 코더 Nomad Coders

초급부터 고급까지! 니꼬쌤과 함께 풀스택으로 성장하세요!

nomadcoders.co](https://nomadcoders.co/flutter-for-beginners/lectures/4178)

* * *

### Flutter 설치

flutter를 설치하기 위해서는 우선 vscode / flutter / dart / xcode / android studio 모두를 설치를 해야합니다.

모든 것이 처음 개발 환경 설치할때가 가장 힘든 것 같아요.

그래도 저는 mac이니까 homeBrew를 이용해서 싹 다 설치를 진행했습니다.

Xcode는 AppStore에서 다운을 받았고 cocoaPod를 homebrew를 이용했습니다.

그 외에 다른 것들은 그냥 brew를 이용해서 다 설치를 진행하니 수월하게 다 끝났습니다.

android studio가 세팅이 좀 해야할 것이 있었습니다.

먼저 현재 flutter를 할 수 있는 상황인지는 아래 명령어를 이용하니 수월하게 설치가 가능했습니다.

> flutter doctor -v

여기서 x가 된 것을 ai 씨의 도움을 받으니 매우 쉽게 해결 되었구요.

그 후 flutter create 앱이름 으로 설치 후 vscode로 열었습니다.

* * *

### 실행

vscode로 프로젝트를 열게 되면 오른쪽 하단에 어떤 기기로 열것인지 알 수 있습니다.

선택하면 여러개가 있는데...

iOS 실제 기기는 xcode에서 직접 설정을 해줘야하지 않나..? 라는 생각이 들고 역시 에러가 나타납니다.

음.. 이 부분은 추후에 해보는 것로 하고요

그냥 시뮬레이터를 이용해서 틀었습니다.

![](/images/flutter-120/1.png)

이후에 귀여운 벌레 모양의 재생 버튼을 눌러주니 앱 화면이 나타나는 것을 볼 수 있었습니다.

![](/images/flutter-120/2.png)

> command + shipt + p  
> \> open devTools  
> Open Widget Inspector ... 

를 해주게 되면 widget inspector가 열리게 되는 데 여기가 현재 앱 화면의 구성요소를 볼 수 있는 화면입니다.

꽤나 좋은 기능인 듯하니 추후에 쓰면 될 듯 합니다.

iOS xcode에서 앱을 구현할 때는 매번 실행을 해서 보는 것이 조금 귀찮았습니다.

뭐 preview가 있긴 했지만.. 그거는 너무 렉이 걸리고..

사실 제가 하는 법을 잘 몰라서 그랬을 수도...

그런데 flutter는 저장하면 바로 시뮬레이션에서 바뀐점이 보여지더라구요.

이게 예전에 배운 디버깅 모드 인가? 싶었습니다.

* * *

#### 조금 다른 화면 만들어보기

현재 main.dart를 보면 너무너무 많은 코드가 있어서 뭐가 뭔지 보기 힘들고 어디를 건드려야할지 감도 안옵니다.

이럴땐 그냥 처음부터 시작하는 게 좋지 않을까...

그냥 다 날리기로 했습니다.

```javascript
import 'package:flutter/material.dart';

void main() {
  runApp(App());
}
```

여기서 main 함수는 가장 기초가 됩니다.

runApp을 command 클릭으로 들어가보면 아래처럼 나오게 됩니다.

```javascript
void runApp(Widget app) {
  final WidgetsBinding binding = WidgetsFlutterBinding.ensureInitialized();
  _runWidget(binding.wrapWithDefaultView(app), binding, 'runApp');
}
```

여기서 봐야할 건

runApp 함수는 Void 함수니까 return은 없을 테고... Widget 타입을 받는 구나..

그럼 Widget 타입은 뭐지?

> widget은 앱을 구성하는 UI 블럭 같은 것

Widget은 component같은 것으로 보여집니다.

그냥 ios에서 쓰던 view와 같은 것들이 아닐까 싶습니다.

Layout, input, text 등등 모든 것이 widget임.

앞으로도 widget이 엄청나게 나올 것이고 그냥 거의 모든 것이 widget이기에 하면서 알아가면 되지 않을 까 싶습니다.

```javascript
import 'package:flutter/material.dart';

void main() {
  runApp(App());
}

class App extends StatelessWidget {

}
```

App class를 만들고 가장 기초가 되는 Widget인 StatelessWidget으로 만들기 위해 extends를 해줬습니다.

그러니까 당연히 에러가 나타납니다.

> Missing concrete implementation of 'abstract class StatelessWidget extends Widget.build'.  
> Try implementing the missing method, or make the class abstract.

StatelessWidget을 상속 받기 위해서는 build를 꼭 만들어주세요. 라고 합니다.

그러면 build를 만들어줘보겠습니다.

```javascript
class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    throw UnimplementedError();
  }
}
```

build만 하게 되면 자동으로 완성 됩니다.

여기서 알아야할 점이 있습니다.

RootApp에 return widget을 해야하는데

여기에서 어떤 widget을 return 해야할까?

앱의 root Widget은 두개의 옵션 중 하나를 return 해야합니다.

-   Meterial 앱.
    -   구글 ( AOS )의 디자인 시스템
    -   return MaterialApp()
-   Cupertino 앱
    -   애플 ( iOS )의 디자인 시스템
    -   return CupertinoApp()

해당 앱이 어떤 디자인 시스템을 따라갈 것인지 정해줘야합니다.

AOS는 제가 정확히 모르지만 iOS의 경우에는 확실한 디자인 시스템이 있습니다.

애플에서 권장하는 디자인들.. 그것을 최대한 비슷하게 만들어서 사용을 할 때 사용합니다.

그런데 flutter는 자기 마음대로 꾸밀 수 있다면서요?

넵! 아무리 자유롭게 하더라도 처음에는 정해주긴 해야 앱에서 초기값을 그걸로 설정을 하기에

필요하다고 합니다.

추후에 느낌을 빼는 것은 간단하다고 합니다.

그러면 return MaterialApp()을 해주겠습니다.

그 후 MaterialApp() 내부에 값을 넣기 위해서 커서를 위에 두면

이처럼 나타나게 됩니다.

> (new) MaterialApp({  
> Key? key,  
> GlobalKey<NavigatorState>? navigatorKey,  
> GlobalKey<ScaffoldMessengerState>? scaffoldMessengerKey,  
> Widget? home,  
> Map<String, Widget Function(BuildContext)> routes = const <String, WidgetBuilder>{},  
> String? initialRoute,  
> Route<dynamic>? Function(RouteSettings)? onGenerateRoute,  
> List<Route<dynamic>> Function(String)? onGenerateInitialRoutes,  
> Route<dynamic>? Function(Ro...(생략)

뭐가 많은데... 대충 home을 return 해보겠습니다.

```javascript
@override
  Widget build(BuildContext context) {
    return MaterialApp(home: Text("hello world!"));
  }
```

이러고 돌려보면.,..?

![](/images/flutter-120/3.png)

흐음... 나오긴 했네요...

그런게 이게 뭐지? 싶습니다.

이제 flutter에서 화면을 구성할때는 어떤 식으로 하는 지를 좀 알아야할 필요가 있을 것 같습니다.

flutter에서는 화면을 구성할때 scaffold를 가져야만 합니다.

scaffold란 화면의 틀 이라고 생각하면 될 듯합니다.

음.. html에서 body 와 head 부분 이런식으로 나눠져있는 것 처럼 scaffold를 설정해줘야하는 것으로 보여집니다.

```javascript
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text("hello Flutter!")),
        body: Center(child: Text("Hello world!")),
      ),
    );
  }
```

갑자기 진도가 확 나간것 같긴한데..

아무튼 home에 Scaffold로 잡아주고 Scaffold 또한 마우스 커서를 위에 가져다 대면 내부에 어떤 값들을 넣어야하는 지 나옵니다.

appBar는 네비게이션 bar로 보여지구요

body는 몸통이니까 내용이겠죠?

그 안에 Center는 child를 중앙에 보여지게 해줍니다.

그런데 보면 **MaterialApp의 home 의 타입도 Widget이구요**

**AppBar의 title? Widget이구요**

**body 또한 Widget 타입입니다.**

이는 flutter의 모든 것은 widget으로 이루어져있다~ 이정도를 알 수 있겠군요.

이런식으로 구조를 잡아두면

![](/images/flutter-120/4.png)

이렇게 화면이 나타나는 것을 볼 수 있습니다.
