---
title: '[swiftUI] 복잡한 인터페이스 구성'
pubDate: 2023-01-24
category: ios/swiftui
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/73
---
#### **새로운 리스트 만들기**

![](/images/swiftui-73/1.png)

위의 사진처럼 List 안에 가로로 움직이는 List를 또 만들 예정입니다.

먼저 swiftUI View로 CategoryHome.swift를 만들어줍니다.

![](/images/swiftui-73/2.png)

NavigationView로 감싸주고 navigationTitle을 작성해 줍니다.

#### **Grouping을 통해 Category 목록을 만들기.**

![](/images/swiftui-73/3.png)

DummyData(landmarkData)를 보게 되면 category가 3가지로 나뉘어있는 것을 볼 수 있습니다.

**같은 category끼리 묶을 수는 없을까?**

이런 생각을 할 수 있을 것입니다.

구현을 먼저 해보도록 하죠!

Landmark.swift 에 가서 category를 받아올 수 있도록 속성을 추가해 주도록 할게요

```swift
    var category: Category
    enum Category: String, Codable, CaseIterable{
        case lakes = "Lakes"
        case rivers = "Rivers"
        case mountains = "Mountains"
    }
```

category를 String Type 열거형으로 만들었습니다.

여기서 rowValue를 사용하게 되면 설정해 둔 단어가 나오게 됩니다.  
열거형을 좀 찾아보면 여러 Type이 많이 나오니까 모르시는 분들은 한 번씩 찾아보는 것을 추천드리겠습니다.

**CaseIterable 프로토콜**

**enum 열거형의 값들을 배열 컬렉션과 같이 순회할 수 있도록 해주는 프로토콜입니다.**

allCases 타입 프로퍼티를 사용해서 배열에만 사용할 수 있는 map / reduce / count 등등 을 사용할 수 있게 해 줍니다.

저희는 allCases를 사용하지 않기 때문에 굳이 프로토콜을 쓸 필요는 없지만..

나중에 써먹으면 도움이 많이 될 듯하네요!!

관련 블로그 : [https://0urtrees.tistory.com/197](https://0urtrees.tistory.com/197)

 [swift enum, CaseIterable로 열거형타입 배열처럼 다루기

Protocol CaseIterable enum 열거형의 값들을 배열 컬렉션과 같이 순회할 수 있도록 해주는 프로토콜이 있습니다. 바로 CaseIterable이라는 프로토콜입니다. CaseIterable 프로토콜은 모든 case 값들에 대한 컬

0urtrees.tistory.com](https://0urtrees.tistory.com/197)

category를 연결하기 위해 ModalData.swift에 작성하도록 하겠습니다.

```swift
final class ModalData: ObservableObject{
    @Published var landmarks: [Landmark] = load("landmarkData.json")
    
    var cartegories: [String: [Landmark]]{
        Dictionary(
            grouping: landmarks,
            by: {$0.category.rawValue}
        )
    }
}
```

cartegories를 Dictionary로 설정했습니다.

보시면 key값은 string / Value는 \[Landmark\]인 것을 볼 수 있네요!

**Dictionary란?**

**Dictionary는 key와 value로 데이터를 저장하는 컨테이너입니다.** 

여기서 key는 고유한 값이어야 하며 해쉬가능한 타입이어야 합니다

key값으로는 스위프트 기본타입 ( String , Int... 등 )에 enum값도 가능합니다.

**Dictionary grouping**

배열을 그룹화하는 방식으로 by와 같은 것들끼리 묶어서 grouping 해줍니다.

위의 코드를 보게 되면 category를 기준으로 Dictionary가 생기게 됩니다.

이렇게 설정을 다 했으면 CategoryHome.swift에서 환경개체를 만들 도록 하겠습니다.

```swift
import SwiftUI

struct CategoryHome: View {
    @EnvironmentObject var modelData: ModelData

    var body: some View {
        NavigationView {
            List {
                ForEach(modelData.categories.keys.sorted(), id: \.self) { key in
                    Text(key)}
                }
                .navigationTitle("Featured")
        }
    }
}

struct CategoryHome_Previews: PreviewProvider {
    static var previews: some View {
        CategoryHome()
            .environmentObject(ModelData())
    }
}
```

환경 개체 ( EnvironmentObject )를 생성해 준 후 Category를 보이도록 하겠습니다.

**Sort() / Sorted() ?**

swift에서 배열을 정렬해 주는 대표적인 함수로 두 가지가 있습니다. sort / sorted

두 가지의 차이점은 **원본과 사본입니다.**

sort()는 원본 자체를 오름 차순으로 정렬을 한다면

sorted()는 원본은 그대로 놔두고 사본을 만들어서 오름 차순으로 정렬을 합니다.

sort()는 원본 데이터가 변경되지만 메모리 소모가 덜합니다.

sorted()는 원본 데이터는 보존하지만 사본을 만드는 것이기에 메모리가 두 배가 듭니다.

* * *

#### **Category 별 List에 들어갈 행 만들기**

![](/images/swiftui-73/4.png)

가로로 scroll 되는 view를 만들 예정입니다.

SwiftUIView를 이용해서 CategoryRow.swift를 만들도록 하겠습니다.

![](/images/swiftui-73/5.png)

먼저 category이름과 item을 속성으로 추가해 줍니다. 그에 맞게 preview에도 추가를 해줍니다.

그 후, VStact으로 카테고리 이름과 scrollView를 감싸주고

ScrollView에는 HStact으로 가로로 landmark.name을 나열하도록 했습니다.

![](/images/swiftui-73/6.png)

이렇게 했을 때 결과물은 요로코롬 나옵니다.

landmark.name 만 덜렁 나오는 것보다는 사진과 함께 이쁘게 나오는 것이 보기 좋겠죠?

SwiftUI View로 CategoryItem.swift를 만들어줍니다.

![](/images/swiftui-73/7.png)

이제 이 정도 만드는 것은 아직 쉽진 않지만 할 수는 있겠죠???

아니어도 괜찮아요..!! 저도 그래요 ㅎ\_ㅎ ( 파이팅 )

이제 CategoryRow에 CategoryItem을 넣어주도록 하겠습니다.

![](/images/swiftui-73/8.png)

저희가 원하는 view가 완성되었습니다!

이제 CategoryRow를 CategoryHome에 적용시키러 가볼까요?

![](/images/swiftui-73/9.png)

리스트들은 이쁘게 잘 나오는 것을 볼 수 있습니다.

이제 가장 상단에 Featured 사진을 하나 띄우면 될 것 같네요!

* * *

#### **Featured 띄우기 & Detail 페이지 이어 주기**

![](/images/swiftui-73/10.png)

상단 Featured 이미지를 띄우기 위해 isFeatured를 사용할 것입니다.

```swift
var isFeatured: Bool
```

Landmark.swift에 있는 지 확인해 주시고요!

ModelData.swift에서 Featured로 설정된 랜드마크만 포함하는 배열을 추가하도록 하겠습니다.

![](/images/swiftui-73/11.png)

이제 배열도 만들었겠다 CategoryHome.swift에서 띄우기만 하면 되겠죠?

![](/images/swiftui-73/12.png)

이쁘게 잘 나오네요 ^ㅁ^

이제 ListItem을 클릭했을 때 그에 맞는 Detail 페이지로 이동하게 만들어 보도록 하겠습니다

CategoryRow.swift에 가주세요!

```swift
ScrollView(.horizontal, showsIndicators: false) {
                HStack(alignment: .top, spacing: 0) {
                    ForEach(item) { landmark in
                        NavigationLink{
                            LandmarkDetail(landmark: landmark)
                        } label: {
                            CategoryItem(landmark: landmark)
                        }
                    }
                }
            }
            .frame(height: 185)
```

ForEach 문 안에 NavigationLink를 추가해 주세요.

NavigationLink {

클릭했을 때 들어가는 페이지 ( detail )

} label : {

보이는 Item ( categoryItem )

}

* * *

#### **Tab 바 구현**

![](/images/swiftui-73/13.png)

Tab 바를 만들어서 Featured에 방금 만든 페이지

List에는 전에 만들어둔 toggle이 있는 List를 보이게 하겠습니다.

가장 상단의 ContentView.swift에 가도록 하겠습니다.

```swift
struct ContentView: View {
	// 2
    @State private var selection : Tab = .featured
    
    // 1
    enum Tab{
        case featured
        case list
    }
    
    var body: some View {
    	// 3
        TabView(selection: $selection){
            CategoryHome()
            	// 4
                .tabItem{
                    Label("Featured",systemImage: "star")
                }
                .tag(Tab.featured)
            
            LandmarkList()
            	// 4
                .tabItem{
                    Label("List", systemImage: "list.bullet")
                }
                .tag(Tab.list)
        }
    }
}
```

1\. enum으로 Tab을 정해줍니다. 

2\. 탭 선택에 대한 상태변수를 추가하고 기본값을 지정해 줍니다.

3\. CategoryHome()과 LandmarkList()를 래핑 하는 Tab 바를 만들어줍니다.

4\. tabItem을 이용해서 icon과 이름을 지정해 줍니다.

![](/images/swiftui-73/14.png)

여기까지 클릭을 해보면 잘 나오는 것을 볼 수 있습니다.
