---
title: '[swiftUI] List 만들고 Detail 페이지 navigator'
pubDate: 2023-01-15
category: ios/swiftui
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/68
---
#### **랜드 마크 모델 만들기**

공홈에 가시면 다운로드 파일에 landmark.json 파일이 있을 것입니다.

여러 Landmark의 데이터들을 json 구조로 모아둔 dummy 파일이라고 보시면 됩니다.

dummyData를 가지고 화면에 뿌려줄 것 이기에 먼저 landmark.json을 넣어줍니다.

![](/images/swiftui-68/1.png)

json 파일을 보게 되면

```swift
{
        "name": "Turtle Rock",
        "category": "Rivers",
        "city": "Twentynine Palms",
        "state": "California",
        "id": 1001,
        "isFeatured": true,
        "isFavorite": true,
        "park": "Joshua Tree National Park",
        "coordinates": {
            "longitude": -116.166868,
            "latitude": 34.011286
        },
        "description": "Suscipit inceptos est felis purus aenean aliquet adipiscing diam venenatis, augue nibh duis neque aliquam tellus condimentum sagittis vivamus, cras ante etiam sit conubia elit tempus accumsan libero, mattis per erat habitasse cubilia ligula penatibus curae. Sagittis lorem augue arcu blandit libero molestie non ullamcorper, finibus imperdiet iaculis ad quam per luctus neque, ligula curae mauris parturient diam auctor eleifend laoreet ridiculus, hendrerit adipiscing sociosqu pretium nec velit aliquam. Inceptos egestas maecenas imperdiet eget id donec nisl curae congue, massa tortor vivamus ridiculus integer porta ultrices venenatis aliquet, curabitur et posuere blandit magnis dictum auctor lacinia, eleifend dolor in ornare vulputate ipsum morbi felis. Faucibus cursus malesuada orci ultrices diam nisl taciti torquent, tempor eros suspendisse euismod condimentum dis velit mi tristique, a quis etiam dignissim dictum porttitor lobortis ad fermentum, sapien consectetur dui dolor purus elit pharetra. Interdum mattis sapien ac orci vestibulum vulputate laoreet proin hac, maecenas mollis ridiculus morbi praesent cubilia vitae ligula vel, sem semper volutpat curae mauris justo nisl luctus, non eros primis ultrices nascetur erat varius integer.",
        "imageName": "turtlerock"
    },
```

이런 식으로 데이터가 나열 되어 있는 것을 볼 수 있습니다.

데이터들을 코드로 불러오기 위해서는 속성들의 구조를 따로 정의 해야합니다.

![](/images/swiftui-68/2.png)

Swift File을 선택 후 Landmark.swift로 생성해줍니다.

이곳에 landmark 데이터의 속성들의 구조를 정의할 예정입니다.

![](/images/swiftui-68/3.png)

이렇게 다 넣어준 후 정리를 해줄 예정입니다.

```swift
import Foundation
import SwiftUI
import CoreLocation

struct Landmark: Codable, Hashable{
    var name: String
    var category: String
    var city: String
    var state: String
    var id: Int
    var isFeatured: Bool
    var isFavorite: Bool
    var park: String
    var description:String
        
    // 사용자는 imageName보다는 image 자체를 원하기에
    // imageName은 Private
    // imageName을 가지고 image 를 불러왔습니다.
    private var imageName: String
    var image : Image{
        Image(imageName)
    }
    
    // image와 동일하게 주소보다는 그냥 맵 화면을 원합니다.
    // longitude 와 latitude는 private로 하고
    // CLLocationCoordinate2D를 불러오게 하였습니다.
    private var coordinates: Coordinates
    var locationCoordinate: CLLocationCoordinate2D{
        CLLocationCoordinate2D(
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
        )
    }
    
    // json 구조 안에 {}는 새롭게 struct로 정의해준 후 사용을 해야합니다.
    struct Coordinates: Codable, Hashable {
        var longitude: Double
        var latitude: Double
    }
}
```

json 구조 안에 있는 것들을 struct로 전부 변경을 했을 때 이런 식으로 정의를 할 수있습니다.

그냥 전부 var로 받아도 전혀 상관은 없겠지만 할때마다 imageName을 받아서 image()안에 넣어주고

longitude와 latitude를 받아서 CLLocationCoordinate2D를 해줘야합니다.

중복되는 코드를 줄이고자 이 곳에서 처리를 해줬습니다.

codable을 해줬다면 decodable을 해줘야겠죠?

```swift
// ModelData.swift

import Foundation

// landmarks를 초기화 해주는 배열을 만들었습니다.
var landmarks: [Landmark] = load("landmarkData.json")

func load<T: Decodable>(_ filename: String) -> T {
    let data: Data

    guard let file = Bundle.main.url(forResource: filename, withExtension: nil)
    else {
        fatalError("Couldn't find \(filename) in main bundle.")
    }

    do {
        data = try Data(contentsOf: file)
    } catch {
        fatalError("Couldn't load \(filename) from main bundle:\n\(error)")
    }

    do {
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    } catch {
        fatalError("Couldn't parse \(filename) as \(T.self):\n\(error)")
    }
}
```

앱에서 load (\_ filename) 을 이용해서 데이터를 불러오는 매서드입니다.

* * *

#### **리스트에 들어갈 Row 만들기**

![](/images/swiftui-68/4.png)

이런식으로 Row를 만들어서 ListView에 Row로 넣어줄 예정입니다.

먼저 저런식으로 만들어보도록 하죠!

siwftUIView로 LandmarkRow.swift를 만들어주도록 하겠습니다

```swift
// LandmarkRow.swif
import SwiftUI

struct LandmarkRow: View {
    // 속성 추가
    var landmark: Landmark
    
    var body: some View {
        Text("Hello, World!")
    }
}

struct LandmarkRow_Previews: PreviewProvider {
    static var previews: some View {
        LandmarkRow(landmark: landmarks[0])
    }
}
```

-   landmark라는 저장 속성을 추가해줬습니다.
    -   이렇게 하면 Previews에서 오류가 생길 것입니다.
    -   why? 초기화 중에 landmark 인스턴스가 필요로 하기에 지정해달라고 error가 발생합니다.
-   Previews에 landmark 인스턴스를 지정해줍니다.
    -   위에 ModalData에서 load함수를 사용한 landmarks의 0번째를 보여달라고 했습니다.

이제 제대로 Row를 구성해보도록 하죠

```swift
// LandmarkRow.swift
import SwiftUI

struct LandmarkRow: View {
    // 속성 추가
    var landmark: Landmark
    
    var body: some View {
        HStack{
            landmark.image
                .resizable()
                .frame(width: 50, height: 50)
            Text(landmark.name)
            
            Spacer()
        }
    }
}
```

위에서 가지고온 landmark에 정의해둔 image와 name을 사용해서 화면 구성을 했습니다.

결과물은

![](/images/swiftui-68/5.png)

이런 식으로 나왔습니다.

list에 넣을 row라고 생각하면 깔끔하니 나쁘지 않은 것 같습니다.

추가로 apple 공홈에서 image를 받아서 assets에 넣어주도록 할께요

![](/images/swiftui-68/6.png)

* * *

#### **Landmark 목록 만들기**

SwiftUIView로 LandmarkList.swift를 만들어줍니다.

그 후 Row를 배치하여 화면 구성을 해보도록 할께요

```swift
import SwiftUI

struct LandmarkList: View {
    var body: some View {
        List{
            LandmarkRow(landmark: landmarks[0])
            LandmarkRow(landmark: landmarks[1])
        }
    }
}
```

![](/images/swiftui-68/7.png)

이런식으로 나오게 됩니다.

그러면 데이터 전체를 다 불러오면 될 것 같네요

* * *

#### **List를 동적으로 만들기**

landmarkData.json 에 있는 데이터들을 모두 불러올 예정입니다.

```swift
import SwiftUI

struct LandmarkList: View {
    var body: some View {
        List(landmarks, id:\.id){landmark in
            LandmarkRow(landmark: landmark)
        }
    }
}
```

이렇게 하면 마치 React의 map 함수처럼 쉽게 구현이 가능합니다.

![](/images/swiftui-68/8.png)

여기서 좀 더 간결하게 id를 적고 싶지 않아요!

그러면 Landmark.json에 Identifiable을 추가해줍니다.

![](/images/swiftui-68/9.png)

**\* Identifiable \***

데이터를 구분할때 ID로 구분을 한다는 것은 다들 잘 알고 계실 거라고 믿습니다.

같은 이름의 같은 카테고리에 같은 도시 모든 속성을 값이 같은 데이터가 있을 수 있습니다.

그럴때 그 두개의 데이터가 다르다는 것은 해당 데이터의 고유한 속성 id로 판단 할 수 있습니다.

**Identifiable은 id 한개만 가지는 프로토콜입니다.**

identifiable을 채택했다면 당연하게도 id가 필수 일 것이며  
위에 구현한 것 처럼 id를 따로 구분해주지 않아도 괜찮습니다.

각 개체는 특정 상태와 관계없이 언제나 id에 의해 고유한 개체로 구분될 수 있습니다.

그러면 Identifiable을 채택 후에 LandmarkList.swift는 어떻게 바뀔까요?

```swift
struct LandmarkList: View {
    var body: some View {
        List(landmarks){landmark in
            LandmarkRow(landmark: landmark)
        }
    }
}
```

이렇게 ID를 따로 적어주지 않아도 잘 작동 되는 것을 볼 수 있습니다.

* * *

#### **List 클릭시 Detal 페이지 이동**

![](/images/swiftui-68/10.png)

List를 클릭시 Detail 페이지로 이동하도록 만들 예정입니다.

SwiftUIView로 LandmarkDetal.swift를 만들어줍니다.

그리고 Detal 페이지는 저희가 전에 만들어둔 ContentView를 사용하면 될 것 같아요!

ContentView에서 화면구성을 복붙해옵니다.

```swift
import SwiftUI

struct LandmarkDetail: View {
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

그리고 ContentView는 첫 화면이기에 List를 보여주는게 더욱 깔끔하겠죠?

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        LandmarkList()
    }
}
```

이렇게하면 Detail 페이지의 틀은 만들어졌습니다.

물론 클릭했을 때 그것에 맞는 정보는 아직이지만.. 아무튼 틀은 만들어졌습니다. ^\_\_^

이제 List에서 Row 클릭 했을 때 페이지 이동하도록 만들어 보겠습니다.

Navigation을 사용할 예정입니다.

```swift
import SwiftUI

struct LandmarkList: View {
    var body: some View {
        NavigationView{
            List(landmarks){landmark in
                NavigationLink{
                    LandmarkDetail()
                }label: {
                    LandmarkRow(landmark: landmark)
                }
            }
            .navigationTitle("Landmarks")
        }
    }
}
```

-   NavigationView로 전체를 감싸고
-   그 안에 LavigationLink를 이용해서 클릭했을 때 LandmarkDetail()로 이동하고  
    label은 LandmarkRow를 사용했습니다.
-   가장 위에 List를 소개하는 Title 제목도 지어줬습니다.

![](/images/swiftui-68/11.png)

클릭을 해보면 이동을 한다는 것을 알 수 있습니다.

이제는 Detail 페이지에 데이터를 보내서 클릭한 제목에 맞는 Detail 페이지가 나오도록 해보겠습니다.

* * *

#### **하위 뷰에 데이터 전달**

![](/images/swiftui-68/12.png)

우선 Circle Image 와 coordinates를 데이터에 맞게 불러오는 것 부터 하도록 하겠습니다.

**Circle Image**

```swift
import SwiftUI

struct CircleImage: View {
    var image: Image
    
    var body: some View {
        image
            .clipShape(Circle())
            .overlay{
                Circle().stroke(.white, lineWidth: 4)
            }
            .shadow(radius: 7)
    }
}

struct CircleImage_Previews: PreviewProvider {
    static var previews: some View {
        CircleImage(image: Image("icybay"))
    }
}
```

-   image를 받아와야하며 받아온 image를 뿌려주도록 변경했습니다.
-   preview에서 볼 수 있듯이 image를 보내줘야합니다.

아마도 오류로 미리보기가 안 될 것입니다. ( 저는 안되더라구요 )

LandmarkDetail.swift에서 CircleImage() 안에 Preview처럼 넣어주면 잘 작동 될 것입니다.

![](/images/swiftui-68/13.png)

**coordinates**

```swift
import SwiftUI
import MapKit

struct MapView: View {
    var coordinates: CLLocationCoordinate2D
    
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 34.011_286, longitude: -116.166_868),
        span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)
    )
    
    var body: some View {
        Map(coordinateRegion: $region)
        
    }
}
```

circleImage와 동일하게 coordinaties를 받아와서 맵 위치를 변경하는 식으로 하도록 하겠습니다.

그런데 저희는 CLLocationCoordinate2D( latitude , longitude ) 만 landmarks에서 받아오고 있죠?

그렇기에 MKCoordinateSpan은 고정값으로 따로 해줘야합니다.

```swift
import SwiftUI
import MapKit

struct MapView: View {
    var coordinates: CLLocationCoordinate2D
    
    @State private var region = MKCoordinateRegion()
    
    // onAppear 실행될때...
    var body: some View {
        Map(coordinateRegion: $region)
            .onAppear{
                setRegion(coordinates)
            }
    }
    
    // 좌표값을 기반으로 지역을 업데이트하는 메서드 추가
    private func setRegion(_ coordinate: CLLocationCoordinate2D){
        region = MKCoordinateRegion(
            center: coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)
        )
    }
}
```

받아온 좌표값을 기반으로 지역을 업데이트하는 setRegion 함수를 만들었습니다.

이 함수는 Map()이 실행될때 setRegion이 실행되도록 onAppear안에 넣어줬습니다.

**\* onAppear \***

storyBoard에는 viewDidLoad()가 있죠. viewDidLoad는 페이지가 load 될 때를 뜻합니다.

**onAppear는 View가 나타날때 실행될 action을 추가합니다.**

간단히 말해서 특정 뷰가 화면에 나타날 때 실행됩니다.

위의 코드에서 보면 Map()이 화면에 나타날때 setRegion이 실행 되겠죠?

onAppear과 반대의 의미인 onDisappear도 있습니다.

사용법은 동일하고 의미는 **view가 사라질때 실행될 action을 추가합니다.**

또한 view에 나타나거나 사라지고 몇초 뒤 실행되게 하는 지연효과를 줄 수도 있습니다.

[https://seons-dev.tistory.com/entry/SwiftUI-onAppear-onDisappear](https://seons-dev.tistory.com/entry/SwiftUI-onAppear-onDisappear)

이 부분은 위 블로그에 아주 자세히 나와있습니다.

제가 나중에 꼭 써먹을 것 같아서 링크 걸어뒀어요..ㅎㅎ

아무튼 작업으로 돌아가서 circleImage 와 coordinate는 마쳤습니다.

이제 LandmarkDetail.swift를 좀 수정을 해줘야겠죠!

```swift
import SwiftUI

struct LandmarkDetail: View {
    var landmark: Landmark
    
    var body: some View {
        VStack{
            MapView(coordinates: landmark.locationCoordinate)
                .ignoresSafeArea(edges: .top)
                .frame(height: 300)
            
            CircleImage(image: landmark.image)
                .offset(y: -130)
                .padding(.bottom, -130)
            
            VStack(alignment: .leading) {
                Text(landmark.name)
                    .font(.title)
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
```

landmark를 받아오고 데이터들을 이리저리 배치해줬습니다.

하지만 이렇게 하면 화면이 안 나올것이에요

why? List에서 landmark데이터를 줘야하기 때문에!!

LandmarkList.swift

![](/images/swiftui-68/14.png)

이렇게 Detail로 데이터를 전달하는 것은 완료했습니다!!

그럼 화면을 좀 보고 싶죠!

LandmarkDetail.swift의 Preview부분을 건드리면서 화면을 보면 잘 작동 되는 것을 볼 수 있습니다.

```swift
struct LandmarkDetail_Previews: PreviewProvider {
    static var previews: some View {
        LandmarkDetail(landmark: landmarks[3])
    }
}
```

![](/images/swiftui-68/15.png)

오!! 잘 나오네요!!

그런데... 흠... 이게 맨 밑에 ... 으로 생략이 되어있고 밑으로 스크롤도 안됩니다...

설명은 전부다 보고싶은데..

이럴때는!!

![](/images/swiftui-68/16.png)

![](/images/swiftui-68/17.png)

VStack을 ScrollView로 바꿔주기만 하면 사진 처럼 스크롤도 가능하고 생략도 안됩니다.
