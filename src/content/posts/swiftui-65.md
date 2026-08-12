---
title: '[swiftUI] stack ( VStack / HStack / ZStack )'
pubDate: 2022-12-25
category: ios/swiftui
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/65
---
swiftUI를 처음 시작하면 가장 먼저 배우고 ui를 배치하는 데 가장 기초적인 것 같아요!

swiftUI에는 stack이라는 개념이 있습니다.

3가지가 있습니다. VStack / HStack / ZStack

**VStack**

vertical ( 수직 )의 V를 따서 VStack입니다.  
객체들을 수직으로 배치합니다.

```swift
VStack{
	Text("hello")
	Text("혁쨩")
}
```

![](/images/swiftui-65/1.png)

**  
HStack**

Horizontal ( 수평 )의 H를 따서 HStack입니다.  
객체들을 수평으로 배치합니다.

```swift
HStack{
	Text("hello")
	Text("혁쨩")
}
```

![](/images/swiftui-65/2.png)

  
**ZStack**

x축 y축  **z축** 의 z를 따서 ZStack이 아닐까 싶습니다.  
말 그래도 3차원의 z 축까지 사용을 합니다.

```swift
let colors: [Color] =
    [.red, .orange, .yellow, .green, .blue, .purple]

var body: some View {
    ZStack {
        ForEach(0..<colors.count) {
            Rectangle()
                .fill(colors[$0])
                .frame(width: 100, height: 100)
                .offset(x: CGFloat($0) * 10.0,
                        y: CGFloat($0) * 10.0)
        }
    }
}
```

![](/images/swiftui-65/3.png)

이런 식으로 겹치는 부분이 발생하도록 할 때 사용합니다.

기본적인 3가지 stack들을 어느 정도 봤습니다.

저는 react를 공부했었기 때문에 flex를 생각하니 이해가 잘 되더라고요!  
혹시 react를 모르시는 분은 그냥 그런 게 있구나 하고 넘어가주세요...  
괜히 헷갈리게 찾아볼 필요 없어요!

그럼 이제 도대체 저걸로 배치는 어떻게 하는 건가??? 

* * *

#### VStack / HStack 의 배치

**Spacer()**

spacer()라는 것을 사용합니다.  
설명보다는 예시를 보는 것이 이해가 빠르겠지요?

```swift
var body: some View {
        VStack {
            Text("hello~")
            Spacer()
            Text("혁쨩")
        }
```

![](/images/swiftui-65/4.png)

이런 식으로 배치가 되게 됩니다.  
요소 사이에 최대로 띄어주게 됩니다.  
이렇게 되면 거의 모든 것을 원하는 대로 배치가 가능할 것 같네요!  
HStack 도 동일 합니다.

이해가 잘 안 가시는 분들은 한 번 이리저리 코드를 수정해보고 해 보시면 훨씬 이해가 쉬울 것이에요!

* * *

#### ZStack

그렇다면 ZStack은??? 어떻게 배치를 하죠?

ZStack은 **offset**이라는 것을 사용하더라고요.

```swift
ZStack {
	Text("hello~")
		.offset(x: 0,y: 50)
	Text("혁쨩")
		.offset(x: 0, y: 100)
    }
```

![](/images/swiftui-65/5.png)

이런 식으로 offset을 사용해서 직접 위치를 설정해주는 방식입니다.

그럼 배치는 어쩌저찌 알겠는데..  
UI요소들은 왜 다 중간 정렬이고 간격은 항상 저렇게 크게 크게 해야 하나요???

* * *

#### 정렬 및 간격 설정

**정렬 ( alignment : )**

정렬은 생각해보면 오른쪽 정렬, 왼쪽 정렬 이기 때문에  
HStack은 굳이 필요가 없습니다.

**alignment는 VStack과 ZStack 만 사용 가능합니다.**

```swift
VStack (alignment: .leading){
            Text("hello~")
            Spacer()
            Text("혁쨩")
        }
```

![](/images/swiftui-65/6.png)

왼쪽 정렬은 **alignment: .leading**  
중간 정렬은 **alignment: .center**  
오른쪽 정렬은 **alignment: .trailing**  
을 사용하면 됩니다.

* * *

**간격 ( spacing : )  
**

기본적인 최소의 간격을 지정해주는 것입니다.  
역시 조금만 생각해보면 spacing을 지정해주는 것이므로 spacing을 사용할 수 있는  
**VStack 이랑 HStack 만 사용할 수 있습니다.**

```swift
VStack (alignment: .leading, spacing: 50){
            Text("hello~")
            Text("혁쨩")
        }
```

![](/images/swiftui-65/7.png)

spacing()을 사용하지도 않았는 데 떨어져 있는 것을 볼 수 있습니다.

기본적인 간격을 지정해줌으로써 더욱 세세한 ui 구성이 가능해졌습니다.

오케이! 그럼 마지막 가장 끝 쪽에도 간격을 주고 싶은 데 그것은 어떻게 안될까요??

* * *

#### padding

padding은 css를 조금이라도 아신다면 기본적으로 알고 있는 기초적인 개념입니다.  
모르셔도 괜찮아요! 지금부터 알면 되니까요 ^ㅁ^

spacing은 ui구성요소와 요소 사이의 간격이라면  
padding은 하나의 구성요소 자체의 모든 간격 ( ? )이라고 보면 될 것 같아요...

제가 설명을 잘 못하는 것 같네요,.. 그냥 예제 보면서 이해해보도록 하죠!

```swift
    var body: some View {
        VStack (alignment: .leading){
            Text("hello~")
                .padding(50)
            Text("혁쨩")
        }
```

![](/images/swiftui-65/8.png)

**hello~** 에다가 padding 50을 줬습니다.  
**hello~** 에 해당하는 네모칸이 아무것도 주지 않은 **혁쨩에** 비해 커진 것을 볼 수 있습니다.

제가 물어본 거는 가장 끝에만 간격을 주고 싶은 거였는 데요???

위나 아래만 주고 싶다면

```swift
    var body: some View {
        VStack (alignment: .leading){
            Text("hello~")
                .padding(.top,50)
            Spacer()
            Text("혁쨩")
                .padding(.bottom, 30)
        }
```

![](/images/swiftui-65/9.png)

이런 모양이 맞지요??

원하는 부분에 이런 식으로 알맞게 사용하면 웬만한 UI 구성은 어렵지 않게 할 수 있을 거라고 보입니다.
