---
title: '[storyboard] swift로 todoList 만들기 #2'
pubDate: 2022-12-24
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/60
---
#### 화면 구성

![](/images/storyboard-60/1.png)

왼쪽. 예시 /  오른쪽. main 화면

어떤 식으로 만들었나 궁금해하실 까봐... 

하나하나 제약조건을 설명해드리기 너무 힘들고 저도 잘 몰라서 제약조건 없이 그냥 마구잡이로 해도 상관없어요!

그냥 직접 만들어보세요!

아 대신 어떤 거 사용했는지는 말씀드릴게요.

![](/images/storyboard-60/2.png)

yyyy 년 mm월 dd 일 > **Label**

월요일 > **Label**

할 일 n개 남음 > **Label**

\-- 중앙선 -- > **UIView**

**TableView** 배치 후

그 안에 **tableViewCell** 배치.

tableViewCell 안에 3가지 배치.

check 아이콘 > **Button**

List 글자 > **Button**

trash 아이콘 > **Button**

마지막 맨 아래

\+ 아이콘 > **Button**

폰마다 화면 크기가 다르기 때문에 화면 구성할 때 autoLayout이라는 것을 알아야 하더라고요...

[https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html)

 [Auto Layout Guide: Understanding Auto Layout

developer.apple.com](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/index.html)

여기를 좀 보시거나 찾아보시는 거 추천드릴게요!

* * *

#### tableView와 tableViewCell 추가 및 관리.

저는 이 부분이 가장 어렵고 힘들었던 것 같아요.  
그래도 해보자고요!

![](/images/storyboard-60/3.png)

이런 식으로 Table View 안에 tableViewCell을 넣어줘야 합니다.

기본적으로 cell 안에 여러 가지 구성 요소가 있다면 custom으로 해야 합니다.  
custom으로 하는 게 이쁘겠죠? ㅎㅎ

* * *

**1\. 처음 보일 list 내용 추가.**

```swift
    // MARK: - properties
    // 유효성 검사를 위한 프로퍼티
    let day = ["일","월","화","수","목","금","토"]
    var memoCheck:[Bool] = [false,false,true,false,true]
    var memoCont:[String] = ["롤토체스 1등하기", "ios 짱먹기", "유도하기", "업어치기 성공하기", "맨몸운동 5세트"]
```

-   memoCont는 보여줄 내용들을 배열로 정리를 했습니다.
-   memoCheck는 보여줄 내용들이 check 돼야 하는지 말아야 하는지 알아야 하기에 bool 값으로 정리했습니다.
-   제가 js를 공부를 해왔기 때문에 당연하게 json 값으로 정리하려 했지만... ( js 그립다 )  
    swift는 구조체를 만들고 여러 가지를 만들고 해야 하더라고요...  
    아직은 많이 미숙해서 배열 두 개로 관리하겠습니다.. 더 열심히 공부해야겠네요!

이런 식으로 properies 부분에 정리를 해주시고요.

**2\. 리스트 뷰를 코드와 연결.**

```swift
    // MARK: - properties
    // 유효성 검사를 위한 프로퍼티
    
    ...
    // 리스트 뷰
    @IBOutlet weak var tableView: UITableView!
```

이후 꼭 연결해줘야 해요!

그다음은 리스트 뷰를 control + 드래그해서 

![](/images/storyboard-60/4.png)

동그라미로 이동해 주세요!

그 이후 에는 

![](/images/storyboard-60/5.png)

위와 같은 창이 뜰 텐데 2개를 선택해주셔야 해요

dataSource , delegate를 선택해주신 후

코드에서

```swift
import UIKit

class ViewController: UIViewController, 
UITableViewDataSource, UITableViewDelegate {
...
```

DataSource와 ViewDelegate를 추가해 주세요!

그러면 빨간색으로 오류가 뜰 텐데 절대 겁먹지 마시고 클릭하고 fix를 눌러주세요!

아마 두 번 나올 거예요.

```swift
class ViewController: UIViewController,
UITableViewDataSource, UITableViewDelegate {

// MARK: - tableView 설정
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        <#code#>
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        <#code#>
    }
```

이런 식의 코드가 추가될 거예요!  
여기에 code를 좀 더 추가한 후 설명 드릴게요!

```swift
    // MARK: - tableView 설정.
    //섹션은 1개
    func numberOfSections(in tableView: UITableView) -> Int {return 1}
    
    // 행의 개수는 데이터 개수
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return memoCont.count
    }
    // cell 안에 들어갈 데이터 설정.
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        <#code#>
    }
```

-   tableView에 섹션은 기본 1개로 지정을 해줍니다.
-   행의 개수는 아까 설정한 memoCont의 배열 개수 ( 데이터 개수 ) 로 지정을 해줬습니다.
-   cell 안에 들어갈 데이터를 이제 설정할 때 code 안에 넣으면 됩니다.
    -   button Title을 변경하거나 button image를 변경하는 것을 저기에 적으면 됩니다.

그런데 우리는 아직 tableViewCell을 건들지도 않았는데..? 어떻게 하는 거죠?

이제 해보려고요! 잠시 마지막 코드는 치워놓고 cell이랑 코드랑 연결부터 하러 갑시다!

**3\. tableViewCell과 코드와 연결**

우리는 기본적으로 customcell이라는 것을 잊으면 안 됩니다.  
그렇기에 cell의 구성요소들을 class로 지정을 해줄 예정이에요!

```swift
class CustomCell: UITableViewCell {
    @IBOutlet weak var checkBtn: UIButton!
    @IBOutlet weak var listBtn: UIButton!
    @IBOutlet weak var trashBtn: UIButton!
}
```

-   코드 가장 밑에 넣어주면 됩니다.
    -   연결은 절대 잊으시면 안 돼요!!

연결도 했겠다 이제 아까 봤던 코드를 좀 작성해 봐야겠죠?

```swift
    // cell 안에 들어갈 데이터 설정.
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath)
    	-> UITableViewCell {
        // 스크롤 될 때마다 사라지는 cell에 새로운 cell을 입혀서 보이게 만듬.
        let cell = tableView.dequeueReusableCell(withIdentifier: "myCell",
        for: indexPath) as! CustomCell
        
        cell.listBtn.setTitle(memoCont[indexPath.row], for: .normal)
        cell.listBtn.setTitleColor(UIColor.black, for: .normal)
        
        return cell
    }
```

-   dequeueReusableCell
    -   안드로이드도 배웠었던 것 같은 데 ios 도 동일하게 있더라고요.
    -   cell이 100을 넘게 있으면 그것을 다 만들기에는 데이터가 엄청 쌓이기 때문에 화면에 보이는 cell 만 만들고  
        안 보이게 되는 cell을 새로운 cell로 변경해서 보이게 만드는 작업입니다.
-   btn.setTitle()
    -   아까 배열의 내용을 title에 넣어주는 작업입니다.
    -   button의 title은 이런 식으로 넣어줘야 하더라고요. 
    -   그리고 color도 변경해주고 return 해줬습니다.

이렇게 실행하면.... **오류가 뜰 거예요!**

에.. 이게 뭐람... 위의 코드에서 가장 이해 한가는 부분인 "myCell"입니다.  
이걸 지정해줘야 합니다.

![](/images/storyboard-60/6.png)

이런 식으로 indentifier을 "myCell"로 지정을 해줘야 합니다.

* * *

#### 결과물

![](/images/storyboard-60/7.png)

성공!! 우선 기능은 없지만 tableView에 나오게 한 게 어디예요!!

다음에는 기능을 넣어보도록 할게요!
