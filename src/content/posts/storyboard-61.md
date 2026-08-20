---
title: '[storyboard] swift로 todoList 만들기 #3'
slug: storyboard-61
pubDate: 2022-12-24
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/61
---
#### 전 포스팅 진행 상황

![](/images/storyboard-61/1.png)

기능은 없지만 아무튼 배열 안에 있는 값들을 보이도록 구현은 했어요!

이번 포스팅은 데이터 추가, 삭제 정도만 목표로 잡고 하겠습니다

* * *

#### list 추가

**1\. add 버튼 클릭 이벤트 코드연결**

저희는 add 버튼 자체에 값을 넣고 변경할 것은 아니기에 버튼을 연결할 필요보다는  
클릭 action을 연결해야 합니다.

```swift
    // MARK: - Actions
    
    @IBAction func addBtnAction(_ sender: UIButton) {
    }
```

코드를 직접 작성하고 연결해도 상관없겠지만 add버튼을 control 드래그해서 코드로 옮겨주면 쉽게 작성 돼요!

이제 코드 안에 넣어주기만 하면 됩니다.

**2\. add 버튼 클릭 시 alert 창을 통해 작성 칸 나오도록**

![](/images/storyboard-61/2.png)

\+ 버튼을 클릭했을 때 저런 창이 뜨고 리스트 추가되도록 하는 게 목표입니다.

먼저 alert 창부터 나오게 만들어 볼까요?

```swift
    // MARK: - Actions
    
    @IBAction func addBtnAction(_ sender: UIButton) {
        let alert = UIAlertController(title: "Todo List", message: "해야할 일을 추가해주세요.", preferredStyle: .alert)
        let ok = UIAlertAction(title: "OK", style: .default){(ok) in
            //code
        }
        let cancel = UIAlertAction(title: "cancel", style: .cancel){(cancel) in
            //code
        }
        alert.addAction(cancel)
        alert.addAction(ok)
        alert.addTextField { alertTextField in
            alertTextField.placeholder = "할 일을 적어주세요."
        }
        self.present(alert, animated: true, completion: nil)
    }
```

-   alert 창의 title과 message와 preferredStyle을 지정해 줬습니다.
    -   .alert 가 위의 사진 같은 기본적인 alert 창입니다.
    -   .actionSheet 는 밑에서 올라오는 선택창입니다.
    -   우리는 alert로 하겠습니다.
-   ok와 cancel을 클릭했을 때 작동하는 코드는 //code 부분에 작성해주면 될 것 같고요
-   이렇게 설정해준 것들을 alert에 추가를 해줬습니다.
-   그 후 설정을 마친 alert를 selft.present로 페이지에 넣어줬습니다.

실행해보면 아무 작동은 하지 않는 alert 창이 나오게 됩니다.

**3\. ok 클릭 시 작동 코드 작성**

```swift
 let ok = UIAlertAction(title: "OK", style: .default){(ok) in
            //code
            // optionals를 그냥 text로 변경해줌.
            let newList = alert.textFields?[0].text ?? ""
            if !newList.isEmpty {
                // memo배열 안에 데이터 넣기.
                self.memoCont.append(newList)
                self.memoCheck.append(false)
                // tableView 업데이트
                let indexPath = IndexPath(row: self.memoCont.count - 1, section: 0)
                self.tableView.insertRows(at: [indexPath], with: .automatic)
            }else{
                // 아무것도 안적었을 때
                print("아무것도 적지 않았습니다.")
            }
        }
```

-   alert.textFields? \[0\]. text
    -   textFields에 값을 받아오게 되면 optionals라는 걸로 받게 됩니다. ( 이거 때문에 애를 좀 먹었어요.. )
    -   솔직히 아직 저도 완전히 이해는 못했기에 설명은 따로 못 드릴 것 같아서 직접 찾아보시는 걸 추천드립니다.
    -   아무튼 optionals 값을 String으로 변경을 해주기 위해 nil 일 때는 ""로 해달라고 했습니다.
-   !newList.isEmpty
    -   만약 textFields의 값이 아무것도 없지 않다면 memoCont 배열에 그 값을 넣어주고  
        memoCheck 배열에 false를 넣어줬습니다.
    -   그 후 tableView를 업데이트해줘야 했습니다.

* * *

**tableView 업데이트**

1\. **tableView.reloadData()**

처음에 제가 사용한 방법은 tableView 전체를 업데이트하는 방법입니다.  
이 방법을 사용하면 기능은 되기는 하지만 뭔가 뚝뚝 끊기는 느낌이 듭니다. ( 어색 )  
그리고 tableView를 모두 다 업데이트하기 때문에 매우 비효율적입니다.  
최대한 안 쓰는 것을 권장하고 있습니다.

2\. **tableView.insertRow(at: , with: )**

제가 사용하고 있는 방법이며 앞으로도 몇 개 더 사용할 방법입니다.  
이 방법은 업데이트가 필요한 row만 업데이트를 해줍니다.  
파라미터 부분을 설명드리면  
at : 몇 번째 배열 인지  
with: 애니메이션  
보시면 알겠지만 애니메이션도 들어가기 때문에 어색한 부분도 자동으로 해결됩니다.

* * *

```swift
let indexPath = IndexPath(row: self.memoCont.count - 1, section: 0)
self.tableView.insertRows(at: [indexPath], with: .automatic)
```

다시 설명을 드리면 먼저 index를 구해야 합니다.  
추가는 맨 마지막에 넣어야 하기 때문에 memoCont의 개수에서 1을 뺀 것을 구했습니다.  
그 index에다가 insertRows를 해줬습니다.  
이미 배열에 추가를 했기 때문에 그 배열에 맞춰서 tableViewCell을 넣어주면 됩니다.

실행을 해보면 잘 작동될 것입니다.

![](/images/storyboard-61/3.png)

![](/images/storyboard-61/4.png)

* * *

#### list 삭제

trash 버튼을 눌렀을 때 삭제가 되도록 구현하도록 할게요

add 버튼과 동일하게 코드와 연결해 줍니다.

```swift
    //MARK: - Action
    ...
    @IBAction func trashBtnAction(_ sender: UIButton){
        
    }
```

이후 작동하는 것을 코딩해주도록 합니다.

```swift
    @IBAction func trashBtnAction(_ sender: UIButton){
        let point = sender.convert(CGPoint.zero, to: tableView)
        guard let indexPath = tableView.indexPathForRow(at: point) else { return}
        memoCont.remove(at: indexPath.row)
        memoCheck.remove(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .automatic)
    }
```

-   tableView 안에 cell 안에 있는 버튼에 접근을 해야 합니다.  
    그렇기에 convert를 이용해서 tableView의 클릭 한 부분이 어디인지 저장을 합니다.
-   point를 이용해서 index를 얻어낸 후 데이터들에서 클릭한 부분을 삭제하게 됩니다.
-   데이터 변경을 마쳤다면 tableView를 업데이트를 해줍니다.

이렇게 하고 실행을 해보면 매우 잘 되는 것을 볼 수 있습니다.

* * *

다음 포스팅에서 완전히 끝낼 수 있을 것 같네요!
