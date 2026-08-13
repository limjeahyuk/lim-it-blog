---
title: '@State 함수 / onTapGesture'
pubDate: 2023-05-14
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/80
---
#### 클릭을 했을 때 이벤트

**.onTapGesture**

```bash
    VStack{
        HStack{
           MyVstackView()
           MyVstackView()
           MyVstackView()
       } // Hstack
    .padding(isActive ? 50.0 : 10.0)
    .background(isActive ? Color.yellow : Color.black)
    .onTapGesture {
        // 애니메이션
        withAnimation {
            // toggle()
            self.isActive.toggle()
        }
    }
```

Hstack 을 클릭을 했을 때 {} 실행.

**애니메이션 효과 넣기.**

withAnimation{}

위 코드에서는 padding과 background가 바뀌는 것이 자연스럽게 변경되도록 애니메이션을 넣었습니다.

* * *

#### @State

```bash
    @State
    private var isActive: Bool = false
```

React의 useState와 비슷한 개념

@State로 설정해논 변수일 때 해당 변수가 변경 될 때 새롭게 뷰를 업데이트 해서 보여줍니다.

**toggle()**

bool의 경우 true와 false가 계속 변경 됩니다.

그래서 true일 때 클릭시 false로 false일 때 true로 변경 되는 코드를 작성을 해야하는 데

귀찮은 작업을 한번에 해주는 코드.

```bash
self.isActive.toggle()
```

* * *

#### 화면 이동

**NavigationView / NavigationLink**

```bash
        NavigationView {
            VStack{
                // 생략
                }
                
                NavigationLink(destination: MyTextView()){
                    Text("네비게이션 뷰")
                        .font(.system(size: 30))
                        .fontWeight(.bold)
                        .padding()
                        .background(Color.orange)
                        .foregroundColor(Color.white)
                        .cornerRadius(30)
                }.padding(.top, 50)
            }
        }
```

NavigationLink를 사용하기 위해서는 NavigationView로 묶어줘야합니다.

NavigationLink(destination: 이동 할 뷰){

  NavigationLink 안에 들어갈 content

}

* * *

#### 기타

```bash
    @State
    private var index: Int = 0
    
    private let backgroundColors = [
        Color.red, Color.yellow, Color.blue, Color.green, Color.orange
    ]

	VStack{
            Spacer()
            Text("배경 아이템 인덱스 \(self.index)")
                .font(.system(size: 30))
                .fontWeight(.bold)
                .frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity)
            Spacer()
        }
        .background(backgroundColors[index])
        .edgesIgnoringSafeArea(.all)
        .onTapGesture {
            print("clack")
            if(self.index == self.backgroundColors.count - 1){
                self.index = 0
            }else{
                self.index += 1
            }
            
        }
```

view 전체 화면을 채워야하는 상황일 때

1\. Spacer()를 넣어서 height를 채워줍니다. 추가로 widht를 설정해줍니다.

2\. frame()을 이용해서 설정해줍니다.

    .infinity를 사용하면 최대로 채워집니다.

**.edgesIgnoringSafeArea()**

아이폰의 위 아래 조금씩 있는 부분

![](/images/swiftui-80/1.png)

이 부분을 채우기 위해서 필요한 함수.

위만 채울땐 .edgesIgnoringSafeArea(.top)

아래만 채울땐 .edgesIgnoringSafeArea(.bottom)

모두 채울땐 .edgesIgnoringSafeArea(.all)

**배열을 순서대로 돌릴 때**

```bash
    if(self.index == self.backgroundColors.count - 1){
                self.index = 0
            }else{
                self.index += 1
            }
```

index가 배열의 끝에 다다르면 0으로 변경

그 외엔 +1 씩 해줍니다.
