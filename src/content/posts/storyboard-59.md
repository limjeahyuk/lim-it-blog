---
title: '[storyboard] swift로 todoList 만들기 #1'
pubDate: 2022-12-24
category: ios/storyboard
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/59
---
새롭게 iOS를 시작하게 되어서 좀 공부 좀 할 겸 todoList 만들기 프로젝트를 시작했습니다!

처음 시작은 storyboard로 해보게 되어서 프로젝트를 작성했습니다.

디자인 자체는 그냥 구글링 해서 나온 todoList 사진을 따라 해보기로 했습니다.

![](/images/storyboard-59/1.png)

**기능**

1.  오늘 날짜 ( **yyyy 년 mm월 dd일 / n 요일** )이 나오도록 설정.
2.  check 가 되어 있지 않은 cell의 개수를 세서 '할 일 **n 개 남음**' 작성
3.  check 아이콘 및 글자 클릭 시 check가 **해제 또는 check** 되도록 구현
4.  보이지는 않지만 **삭제**도 가능
5.  \+ 버튼을 클릭 시 **리스트 추가** 기능

대충 이 정도 기능은 있어야 할 것 같습니다.

화면 구성 하는 방법은 제가 설명드리기는 너무 힘들 것 같아서..  
기능 위주로 설명해드릴게요!   
이상해도 괜찮으니까 직접 만들어보시는 것 추천드려요!

차근차근해보도록 할게요!

* * *

### Xcode 설치 및 프로젝트 생성.

맥북 > appStore에서 xcode를 설치. ( 엄청 오래 걸림 )

![](/images/storyboard-59/2.png)

App 클릭 후

![](/images/storyboard-59/3.png)

product Name은 원하시는 대로 만드시면 됩니다!

여기서 중요한 건 Interface를 Storyboard로 하셔야 해요!

이후 화면 구성 같은 건 위에서 말한 것처럼 넘어가고 기능 위주로 설명드릴게요!

* * *

#### 오늘 날짜 나오도록 설정 ( yyyy 년 mm 월 dd 일 )

처음 프로젝트를 만들면 ViewController 가 있을 거예요!

![](/images/storyboard-59/4.png)

기본적으로 Main 이 화면 구성.

ViewController가 Main을 동작하게끔 만들어주는 코드라고 보면 될 것 같아요!

저도 아직 swift가 익숙하지 못해서 ' **MARK: -** ' 로 작성을 해야 보기 깔끔하고 헷갈리지 않더라고요

MARK: - Properties ) 유효성 검사를 위한 프로퍼티, 변수 또는 UI 요소 참조하는 구간

MARK: - Lifecyce ) 생명주기, viewDidLoad() : view가 로딩을 마쳤을 때 실행 됩니다.

MARK: - Actions ) 움직임 제어, UI 요소 이벤트 처리 구간

MARK: - Helpers ) properties와 Actions을 이어주는 구간, 그 외의 것

대충 이렇게 사용하고 있어요! ( 맞게 사용하는지는... 솔직히 모르겠어요... ㅎㅎ;; )

* * *

자 그러면 다시 돌아와서 저희가 하려고 하는 기능이 날짜를 띄우는 것이에요!

처음 앱이 로딩되었을 때 한 번만 띄어주면 되기 때문에 Lifecyce 안에 넣기로 했어요!

추가로 함수로 넣으면 좋을 것 같아서 함수는 Helpers 쪽에 넣도록 할게요!

* * *

**UI요소 참조**

```swift
// MARK: - Properties

    // yyyy년 mm월 dd일
    @IBOutlet weak var todayLabel: UILabel!
    // 요일
    @IBOutlet weak var dayLabel: UILabel!
```

-   storyboard는 기본적으로 ui를 클릭 후 control 후 드래그로 만들 수 있어요!

![](/images/storyboard-59/5.png)

이런 식으로 왼쪽에 동그라미가 나오도록 설정해야 합니다.

동그라미를 클릭 후 드래그 해서 ui 요소에 가져다줘도 괜찮아요!  
모르시겠다면 한 번 찾아보세요..!! 

**날짜 구하는 함수**

```swift
// MARK: - Helpers
    func getNowTime(){
        let now = Foundation.Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy년 MM월 dd일"
        dateFormatter.timeZone = NSTimeZone(name: "ko_KR") as TimeZone?
        
        todayLabel.text = dateFormatter.string(from: now)
    }
```

-   Foundation
    -   데이터 저장, text 처리, **날짜 및 시간 계산**, 정렬 및 필터, 네트워킹을 포함한 앱 기능이 있는 기본적인 Frameworks입니다.
    -   import UIKit를 하고 있다면 다 사용 가능합니다
-   Foundation.Date()
    -   지금 날짜를 가지고 옵니다.
-   DateFormatter()
    -   가져온 날짜를 format을 통해 원하는 형식으로 맞춰야 합니다.
    -   dateFormatter.dateFormat을 이용해서 원하는 형식을 지정해 줬습니다.
-   timeZone
    -   시간을 우리나라로 맞춰주는 역할을 합니다.
-   todayLabel.text =
    -   todayLabel의 text에 위에서 실행해서 얻은 날짜를 넣어줍니다.

* * *

**n 요일 구하는 함수**

```swift
MARK:- Properties
let day = ["일","월","화","수","목","금","토"]

MARK:- Helpers
func getNewDate(){
        
        ...
        
        // 요일 구하기
        let str = "월요일"
        let cal = Calendar(identifier: .gregorian)
        let comps = cal.dateComponents([.weekday], from: now)
        let todayStr = str.replacingOccurrences(of: "월", with: self.day[comps.weekday! - 1])
        dayLabel.text = todayStr 
    }
```

-    따로 함수를 만들 필요성은 느끼지 못해서 한 함수 안에 넣어줬습니다.
-   Calender(identifier: .gregorian )
    -   월~일 날짜를 구해야 하기에 그레고리력 달력을 사용해야 합니다.
-   comps
    -   calender에서 오늘 날짜를 찾아서 숫자를 호출합니다.
    -   일 월 화 수 목 금 토  
        1 2 3 4 5 6 7
-   replacingOccurrences
    -   str 문자에서 of와 같은 문자를 골라냅니다. 그 후 with에 있는 문자로 바꿔줍니다.
-   comps.weekday -1 
    -   comps.weekday에서는 1~7입니다. 하지만 배열은 0부터 시작이기 때문에 1을 빼줘야 합니다.

* * *

**앱이 로딩 완료 되었을 때 함수 실행.**

```swift
    // MARK: - Lifecyce
    // 처음 돌아가는 것.
    override func viewDidLoad() {
        super.viewDidLoad()
        // 오늘 날짜 나타내기
        getNowTime()
    }
```

이렇게 하고 실행을 해주게 되면

![](/images/storyboard-59/6.png)

이런 식으로 원하는 대로 나오게 될 것입니다.

오늘은 여기까지 포스팅하도록 할게요!
