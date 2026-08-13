---
title: '[swiftUI] 사이드 메뉴 , TextField 꾸미기'
pubDate: 2023-01-24
category: ios/swiftui
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/75
---
#### **사이드 메뉴 띄우기**

![](/images/swiftui-75/1.png)

이런 식으로 햄버거 버튼을 눌렀을 때 왼쪽에서 오른쪽으로 절반정도 나오는 메뉴를 띄워보도록 하겠습니다.

먼저 SideMenu.swift 와 MainView.swift를 만들었습니다.

우선 띄우는 것만 할 것이기에 대충 만들어주도록 하겠습니다.

![](/images/swiftui-75/2.png)

그 후 ContentView.swift에서 사이드메뉴 구현을 하도록 하겠습니다.

먼저 sideMenu가 나오기 위해 showMenu를 Bool 값으로 상태를 설정해줬습니다.

```swift
    @State var showMenu = false
```

showMenu가 true일 때 sideMenu.swift가 나올 수 있도록

ContentView 의 body 안에 구현해줬습니다.

```swift
if self.showMenu {
	SideMenu()
	.background(Color(.green))
}
```

그러면 showMenu가 false와 true가 되는 toggle은??

MainView.swift에서 햄버거 버튼을 이용해서 구현했습니다.

```swift
struct MainView: View {
    @Binding var showMenu : Bool
    
    var body: some View {
    Button {
        withAnimation {
    	    showMenu.toggle()
        }
    } label: {
    	Label("Toggle", systemImage: "line.horizontal.3")
      	    .labelStyle(.iconOnly)
            .foregroundColor(.gray)
            .imageScale(.large)
    }
}
```

Button 안에 withAnimation을 넣어주므로써 클릭했을 때 그에 맞는 animation을 주게 됩니다.

저희의 경우 button 클릭시 사이드 메뉴가 왼쪽에서 오른쪽으로 이동하는 animation이 나타나게 되겠죠?

아무튼 withAnimation은 조금있다가 실험 해보도록 하고 ContentView에서 MainView의 showMenu를 연결해줘야합니다.

```swift
MainView(showMenu: $showMenu)
```

side메뉴가 나오게 되면 이미 있는 view 위에 떠야하기에 ZStack으로 묶어줬습니다.

그리고 화면 전체 크기를 알아내서 SideMenu의 크기를 절반으로 조절을 해야했기에 GeometryReader를 사용했습니다.

```swift
GeometryReader{ geometry in
	ZStack(alignment: .leading){
		MainView(showMenu: $showMenu)
			.frame(width: geometry.size.width, height: geometry.size.height)
			.offset(x: showMenu ? geometry.size.width/2 : 0)
                
	if self.showMenu {
		SideMenu()
			.frame(width: geometry.size.width/2)
			.transition(.move(edge: .leading))
			.background(Color(.green))
		}
	}
}
```

GeometryReader는 컨텐츠의 크기와 위치를 함수로 나타내는 컨테이너라고 합니다..

Geometry 자체가 기하학이라는 뜻이기에... 좀 찾아봤는 데 어렵네요..

**GeommetryReader에 대한 자세한 내용은 따로 좀 더 찾아봐야겠어요!!**

아무튼 크기를 알아낼 수 있습니다. 그걸 이용해서 frame에 width와 heigth를 넣어줬습니다.

만약 showMenu가 true가 되어서 SideMenu가 나타나게 되면

MainMenu의 위치도 이동하게끔 offset을 삼항연산자로 지정해줬습니다.

SideMenu가 이동할때 왼쪽에서 애니메이션처럼 이동하게 transition을 지정해줬습니다.

transition은 뷰가 나타나거나 사라질때 애니메이션을 지정해줍니다.

이제 아까 봤던 MainView의 withAnimation 을 빼보도록하겠습니다.

그러면 그냥 나타나고 사라지고 합니다... animation이 아예 사라졌기에 넣어주도록 할께요!

이제 사이드메뉴를 Drag를 통해서 닫기 위해서 ContentView에 구현했습니다.

![](/images/swiftui-75/3.png)

DragGesture()를 이용해서 -100만큼 이동하면 닫히도록 구현했습니다.

여기까지 사이드 메뉴를 띄우고 닫아봤습니다.

* * *

#### **검색창 구현**

![](/images/swiftui-75/4.png)

검색창 안에 돋보기 icon이 있어야 하며 기본적으로 크기도 적당히 커야합니다.

우선 textField를 사용해야하기에 만들려니 쉽지만은 않았습니다.

![](/images/swiftui-75/5.png)

먼저 textField와 image를 배치 후 HStack으로 묶어줍니다.

그 후 HStack에 여러 속성을 넣어줘서 마치 textField 안에 icon이 있는 것처럼 만들었습니다.

처음에는 textField에 속성을 넣으려고 하니 매우 어려웠는 데 하고 나니 간단한 문제였네요 ^^..

* * *

#### **문제점**

사이드 메뉴를 닫을 때 드래그가 사이드 메뉴를 드래그 해야 닫힘. > mainView 에서 드래그 하면 안 닫힘.

추가로 mainView 어디든 클릭해도 닫히게 하고 싶음.

사이드 메뉴가 열릴 때 좀 더 스무스하게 열렸으면 함.

사이드 메뉴와 메인 뷰 사이에 그림자 효과를 통해 좀 더 다른 것이라는 것을 보여줄 필요가 있음.

* * *

#### **★도움 받은 Blog★**

[사이드 메뉴 Bolg](https://velog.io/@jhchoo/SwiftUI-%EC%82%AC%EC%9D%B4%EB%93%9C-%EB%A9%94%EB%89%B4-%EB%A7%8C%EB%93%A4%EA%B8%B0)
