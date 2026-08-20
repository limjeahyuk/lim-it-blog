---
title: '[swiftUI] 기초 시작'
slug: swiftui-67
pubDate: 2023-01-15
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/67
---
#### **새 프로젝트 및 탐색**

![](/images/swiftui-67/1.png)

swiftui로 만들고 나면 이렇게 파일이 있을 것 입니다.

@main이 있는 앱의 윈도우를 담당하고 있습니다.

ContentView를 부르고 있습니다.

불려진 ContentView를 보게 되면

![](/images/swiftui-67/2.png)

이런식으로 화면과 코드가 나오게 됩니다.

아마도 오른쪽 왼쪽으로 나오게 될 텐데

아래로 하고 싶으신 분은 오른쪽 상단의 아이콘 3개가 있을 텐데 두번째 누른 후 Layout > canvas on Button 클릭 하시면

조절 가능합니다.

![](/images/swiftui-67/3.png)

이런식으로 Text 안에 있는 것을 변경 해서 app 화면을 변경도 가능합니다.

* * *

SwiftUI 또한 StoryBoard 처럼 inspector를 이용해서 font와 size 를 변경 가능한 것 같지만...

저는 많이 불편하더라구요.. 그냥 코드로 하는 것이 훨씬 편한 것 같아요

* * *

#### **스택을 사용한 뷰 결합**

![](/images/swiftui-67/4.png)

SwiftUI는 Text / Image 같은 큼지막한 요소들 이후에 속성값은 .font 로 붙혀줍니다.

속성 붙히는 것들은 너무 다양하기도 하고 저도 잘 모르기에 속성값을 넣어주고 싶을 때마다 구글링 해야할 것 같네요...;;

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(alignment: .leading) {
            Text("Turtle Rock")
                .font(.title)
            HStack{
                Text("Joshua Tree National Park")
                    .font(.subheadline)
                Spacer()
                Text("California")
                    .font(.subheadline)
            }
        }
        .padding()
    }
}
```

![](/images/swiftui-67/5.png)

코드를 이용해서 간단한 화면 구성을 했습니다.

* * *

#### **사용자 지정 이미지 보기 만들기**

![](/images/swiftui-67/6.png)

공식 홈페이지에서 다운 받은 Resources 파일 안에 있는 Image를 Assets에 Drag&Drop 해줍니다.

그렇게 되면 자연스럽게 만들어지게 됩니다.

![](/images/swiftui-67/7.png)

SwiftUI View파일을 하나 만들어줍니다. CircleImage.swift

Image 는 Assets에 넣어준 이름을 적기만 하면 바로 불러옵니다.

![](/images/swiftui-67/8.png)

그럴듯한 동그란 이미지를 만들기 위해 여러 속성을 추가했습니다.

* * *

#### **새로운 프레임워크를 사용해보기. ( mapKit )**

지도를 보이게 하기 위해서 mapKit이라는 프레임워크를 사용할 것 입니다.

새로운 SwiftUI View 파일을 만들어 주시고요 mapView.swift

```swift
import SwiftUI
import MapKit

struct MapView: View {
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 34.011_286, longitude: -116.166_868),
        span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)
    )
    
    var body: some View {
        Map(coordinateRegion: $region)
    }
}
```

-   **import Mapkit** 해주는 것은 잊지 말자구요!
-   지도에 대한 정보를 보유하는 전용 상태 변수를 만들어줍니다. ( region )
-   그 후 Map()에 넣어줍니다.
    -   Map(coordinateRegion: **<Binding<MKCoordinateRegion>>**) 이라고 뜨게 될 것입니다.
    -   MKCoordinateRegion으로 바인딩 해주세요 라는 것인데 우리가 마침 MKCoordinateRegion으로 region을 만들었네요!
    -   넣어줄 때는 $region 으로 넣어줍니다.

![](/images/swiftui-67/9.png)

뭐... 이 지역이 맞는지는 모르겠지만 아무튼 지도가 나왔습니다!!

* * *

#### **상세 보기 구성**

위에 만든 3가지를 합칠 예정입니다.

1\. **스택을 이용한 뷰결합** 2. **동그라미 이미지** 3. **맵**

가장 처음 건드렸던 ContentView에 가서 추가하도록 할께요

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack{
            MapView()
                .ignoresSafeArea(edges: .top)
                .frame(height: 300)
            
            CircleImage()
                .offset(y: -130)
                .padding(.bottom, -130)
            
            VStack(alignment: .leading) {
                Text("Turtle Rock")
                    .font(.title)
                HStack{
                    Text("Joshua Tree National Park")
                    Spacer()
                    Text("California")
                }
                .font(.subheadline)
                .foregroundColor(.secondary)
                Divider()
                
                Text("Turtle Rock")
                    .font(.title)
                HStack{
                    Text("Joshua Tree National Park")
                        .font(.subheadline)
                    Spacer()
                    Text("California")
                        .font(.subheadline)
                }
                
            }
            .padding()
            
            Spacer()
        }
    }
}
```

화면 구성을 하고 나면

![](/images/swiftui-67/10.png)

이런 화면이 나올 것 입니다.

화면 구성 같은 것은 하나하나 직접 해보면서 알아야할 것 같아서 큰 설명은 하지 않았어요!

swiftUI는 화면 구성을 코드로 이렇게 하는 구나 정도 알면 되지 않을까 싶네요!
