---
title: '[swiftUI] 사용자입력 처리'
pubDate: 2023-01-21
category: ios/swiftui
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/71
---
#### **사용자가 좋아하는 랜드마크 표시**

![](/images/swiftui-71/1.png)

위의 그림처럼 Row를 만들어보도록 하겠습니다.

![](/images/swiftui-71/2.png)

이런 식으로 Favorite가 true라면 star를 넣어줬습니다.

![](/images/swiftui-71/3.png)

결과는 이런 식으로 나오게 됩니다.

좀 더 이쁘게 꾸며본다면...

```swift
if landmark.isFavorite {
                Image(systemName: "star.fill")
                    .foregroundColor(.yellow)
            }
```

이 정도로 할 수 있겠네요!

![](/images/swiftui-71/4.png)

* * *

#### **목록 필터링**

![](/images/swiftui-71/5.png)

isFavorite가 true인 것들만 화면에 보이도록 변경할 예정입니다.

그러기 위해서 먼저 LandmarkList.swift 에 

```swift
@State private var showFavoritesOnly = false
```

를 추가해줍니다.

초기값이 설정되어 있는 상태 속성을 만들어 줍니다.

![](/images/swiftui-71/6.png)

-   filteredLandmarks를 설정해 줘서 showFavoritesOnly가 변경될 때마다 화면이 바뀌도록 만듭니다.

위의 코드를 쓰고 결과화면을 보게 되면

![](/images/swiftui-71/7.png)

이렇게 별이 있는 것들만 보이게 됩니다.

이제 showFavoritesOnly가 변경될 수 있도록 상태 전환 컨트롤러를 만들도록 할게요!

* * *

#### **상태를 전환하는 컨트롤러 만들기**

![](/images/swiftui-71/8.png)

Toggle 버튼을 이용해서 상태를 전환하는 컨트롤러를 만들 예정입니다.

사진을 보면 리스트에 첫 번째에 toggle 버튼이 있고 나머지는 저희가 만들어 놓은 Row로 들어가 있습니다.

여기서 좀 신기하더라고요.

storyboard에서는 List를 구현할 때 한 칸만 다르게 하려면 Delegate다 뭐다 꽤나 복잡했는 데...

swiftUI는 꽤나 쉽게 구현할 수 있게 되어 있더라고요!!

List의 첫 번째만 다른 것으로 하고 그 이후에는 Row들로 구성했다는 것을 잊지 말고 작업 시작하도록 할게요!

먼저 LandmarkList.swift를 고치도록 할게요

```swift
  var body: some View {
        NavigationView{
            List{
                ForEach(filteredLandmarks){landmark in
                    NavigationLink{
                        LandmarkDetail(landmark: landmark)
                    }label: {
                        LandmarkRow(landmark: landmark)
                    }
                }
            }
            .navigationTitle("Landmarks")
        }
    }
}
```

List (filteredLandmarks){} 로 되어 있던 것을 ForEach 문을 추가해 줬습니다.

이렇게 해줘도 전과 동일한 화면이 나올 것입니다.

그 후 Toggle을 추가해 주도록 할게요

```swift
var body: some View {
        NavigationView{
            List{
                Toggle(isOn: $showFavoritesOnly) {
                    Text("Favorites only")
                }
                
                ForEach(filteredLandmarks){landmark in
                    NavigationLink{
                        LandmarkDetail(landmark: landmark)
                    }label: {
                        LandmarkRow(landmark: landmark)
                    }
                }
            }
            .navigationTitle("Landmarks")
        }
    }
```

이렇게 코드를 구현하게 되면

![](/images/swiftui-71/9.png)

원하는 대로 잘 구현된 것을 볼 수 있습니다.

코드를 보면 List 안에 먼저 Toggle을 구현하고 그다음에 ForEach문을 실행합니다.

그렇기 때문에 Toggle이 제일 먼저 나오고 그 이후에 ForEach 문으로 Row들이 쭈욱 나오게 됩니다.

만약 Toggle을 ForEach문 뒤에 넣는 다면?

Row들이 다 나오고 나서 맨 밑에 Toggle이 나올 것입니다!

SwiftUI의 List 구현 방식을 잘 알아두면 나중에 편할 듯하네요!

* * *

#### **저장소에 Observable Object 사용**

![](/images/swiftui-71/10.png)

사용자가 어떤 랜드마크를 즐겨찾기인지 제어할 수 있도록 구현하겠습니다.

현재는 즐겨찾기를 사용자가 마음대로 추가하고 없애고는 불가능하기에 할 수 있도록 만들어 보겠습니다.

그전에, Observable Object가 뭔데?

사용한 몇몇 언어를 소개를 먼저 해드리겠습니다.

**1\. ObservableObject**

class에서 ObservableObject를 class에 채택하면 해당 class의 인스턴스를 관찰하고 있다가 **값이 변경되면**

**뷰를 업데이트합니다.**

저희가 즐겨찾기 값을 변경할 때마다 view를 업데이트가 가능하게끔 만들어주는 protocol입니다.

**2\. @Published**

ObservableObject에서 속성을 선언할 때 사용하는 wrapper입니다.

**@Published로 선언된 속성이 ObservableObject에 포함되어 있다면 해당 속성이 업데이트될 때마다 뷰를 업데이트합니다.**

1번 ObservableObject와 함께 쓰는 wrapper입니다.

여기까지 간단하게 설명을 했는 데 좀 더 자세한 부분은 검색을 해보시면 도움이 되실 것 같아요!

저희는 먼저 ModalData.swift를 고치도록 하겠습니다.

![](/images/swiftui-71/11.png)

ObservableObject를 사용하기 위해 **import Combine**을 해줍니다.

final class를 만들어 주고 ObservableObject protocol을 채택해 준 후 

@Published ~~ 를 작성해 줍니다.

위의 설명드린 단어들로 보면 load해온 landmarkData.json의 값이 변경될 때마다

view가 업데이트된다고 생각해도 괜찮을 것 같습니다.

그럼 이제 **view에서 모델 개체를 채택**하는 작업을 해야겠죠?

![](/images/swiftui-71/12.png)

먼저 LandmarkList.swift 를 가보겠습니다.

landmark filter 하는 부분에서 landmark를 찾을 수없다는 error가 떠 있을 것입니다.

여기에 **@EnvironmentObject**를 이용해서 ModalData를 불러옵니다.

![](/images/swiftui-71/13.png)

그 후 modalData.landmarks로 바꿔줍니다.

**@EnvironmentObject**

뷰와 공유해야 하는 데이터의 경우 swiftUI는 EnvironmentObject 속성 래퍼를 제공합니다.

**뷰와 뷰끼리 공유**를 해야하는 데이터에는 EnvironmentObject로 설정합니다.

위에 저렇게 하더라도 preview가 보이지 않을 것입니다.

Preview에 .environmentObject를 추가해줘야 합니다.

```swift
// LandmarkList.swift
struct LandmarkList_Previews: PreviewProvider {
    static var previews: some View {
        LandmarkList()
            .environmentObject(ModalData())
    }
}

// LandmarkRow.swift
struct LandmarkRow_Previews: PreviewProvider {
    static var landmarks = ModalData().landmarks
    
    static var previews: some View {
        LandmarkRow(landmark: landmarks[0])
    }
}

// LandmarkDetail.swift
struct LandmarkDetail_Previews: PreviewProvider {
    static var previews: some View {
        LandmarkDetail(landmark: ModalData().landmarks[3])
    }
}

// ContentView.swift
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(ModalData())
    }
}
```

추가로 가장 상위 LandmarksApp.swift에 

![](/images/swiftui-71/14.png)

environmentObject를 추가해 줍니다.

이렇게 하면 미리 보기도 잘 나오게 됩니다.

* * *

#### **각 랜드마크에 즐겨찾기 버튼 만들기**

![](/images/swiftui-71/15.png)

사용자가 즐겨찾기를 추가 및 제거를 하기 위한 버튼을 만들도록 하겠습니다.

오랜만에 FavoriteButton swiftView를 만듭니다.

현재 상태를 나타낼 수 있는 바인딩을 추가해 줍니다.

그리고 바인딩을 해주면 미리 보기에도 상태를 넣어줘야 하기에 상수값을 제공합니다.

```swift
import SwiftUI

struct FavoriteButton: View {
    @Binding var isSet: Bool
    
    var body: some View {
        Text("Hello, World!")
    }
}

struct FavoriteButton_Previews: PreviewProvider {
    static var previews: some View {
        FavoriteButton(.constant(true))
    }
}
```

기본 설정은 이렇게 하고 이 안에 별 모양의 toggle 버튼을 만들어주도록 하겠습니다.

```swift
import SwiftUI

struct FavoriteButton: View {
    @Binding var isSet: Bool
    
    var body: some View {
        Button{
            isSet.toggle()
        } label: {
            Label("Toggle Favorite", systemImage: isSet ? "star.fill" : "star")
                .labelStyle(.iconOnly)
                .foregroundColor(isSet ? .yellow : .gray)
        }
    }
}

struct FavoriteButton_Previews: PreviewProvider {
    static var previews: some View {
        FavoriteButton(isSet: .constant(true))
    }
}
```

별 icon 만 있는 Toggle 버튼이며

isSet이 true면 yellow에 채워져 있는 icon이

isSet이 false이면 gray에 테두리만 있는 icon이 나오게 됩니다.

이 button을 Detail 쪽에 넣어주도록 하겠습니다.

```swift
import SwiftUI

struct LandmarkDetail: View {
    @EnvironmentObject var modalData: ModalData
    var landmark: Landmark
    
    var landmarkIndex: Int{
        modalData.landmarks.firstIndex(where: {$0.id == landmark.id})!
    }
    
    var body: some View {
        ScrollView{
            MapView(coordinates: landmark.locationCoordinate)
                .ignoresSafeArea(edges: .top)
                .frame(height: 300)
            
            CircleImage(image: landmark.image)
                .offset(y: -130)
                .padding(.bottom, -130)
            
            VStack(alignment: .leading) {
                HStack{
                    Text(landmark.name)
                        .font(.title)
                    FavoriteButton(isSet: $modalData.landmarks[landmarkIndex].isFavorite)
                }
                HStack{
                    Text(landmark.park)
                    Spacer()
                    Text(landmark.state)
                }
                .font(.subheadline)
                .foregroundColor(.secondary)
                Divider()
                
                Text("About \(landmark.name)")
                    .font(.title2)
                Text(landmark.description)
            }
            .padding()
            
            Spacer()
        }
    }
}

struct LandmarkDetail_Previews: PreviewProvider {
    static let modalData = ModalData()
    
    static var previews: some View {
        LandmarkDetail(landmark: ModalData().landmarks[3])
            .environmentObject(modalData)
    }
}
```

제목 쪽에 HStack을 사용해서 제목 바로 옆에 위치하도록 했습니다.

바인딩에 상태값을 전달할 때는 $을 사용하는 것을 잊으시면 안 됩니다.

![](/images/swiftui-71/16.png)

이렇게 결과가 나오게 됩니다.

실행해 보면 클릭 후 뒤로 가면 데이터값이 List에 남아있는 것을 볼 수 있습니다.
