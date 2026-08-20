---
title: '[storyboard] swift로 todoList 만들기 # 완'
slug: storyboard-62
pubDate: 2022-12-24
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/62
---
#### 진행 상황

전 포스팅에서 추가와 삭제까지 했습니다.  
이번에는 클릭 시 아이콘 변경되는 부분과 체크되어 있지 않은 이미지만 count 해서 나타나게 하는 것을 구현하도록 할게요!

* * *

#### 클릭 시 icon 변경

**1\. bool 값을 이용해서 image 변경**

memocheck 배열 안에 bool 값들을 이용해서 image를 변경할 예정입니다.

```swift
    // cell 안에 들어갈 데이터 설정.
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
		...
        switch memoCheck[indexPath.row]{
        case true :
            cell.checkBtn.setImage(UIImage(systemName: "checkmark.circle"), for: .normal)
        case false :
            cell.checkBtn.setImage(UIImage(systemName: "circle"), for: .normal)
        }
        
        return cell
    }
```

switch 문을 이용하여 memoCheck에서 bool 값을 가져와서 비교했습니다.  
check가 되어있다면 uiImage에서 checkmark.circle을  
false라면 uiImage에서 circle을 보이게 했습니다.

**2\. check 클릭 이벤트**

```swift
    // check 클릭 이벤트
    @IBAction func checkBtnAction(_ sender: UIButton) {
        let point = sender.convert(CGPoint.zero, to: tableView)
        guard let indexP = tableView.indexPathForRow(at: point) else {return}
        if(memoCheck[indexP.row]){
            memoCheck[indexP.row] = false
        }else{
            memoCheck[indexP.row] = true
        }
        tableView.reloadRows(at: [indexP], with: .automatic)
    }
```

전 포스팅에서 trashBtn 했던 것과 완전히 동일합니다.  
다른 점은 클릭했을 때 해당하는 memoCheck가 false라면 true러 true라면 false로 변경해주는 것뿐입니다.  
reloadRows 또한 전 포스팅에서 설명한 그대로 동작하기 때문에 쉽게 할 수 있습니다.

**3\. list 클릭 이벤트**

check icon 뿐만 아니라 list 도 클릭 했을 때 check icon 이 변하게 하고 싶었기 때문에 button으로 만들었습니다.

```swift
    // list 클릭 이벤트
    @IBAction func checkCellAction(_ sender: UIButton) {
        let point = sender.convert(CGPoint.zero, to: tableView)
        guard let cellIndex = tableView.indexPathForRow(at: point) else {return}
        if(memoCheck[cellIndex.row]){
            memoCheck[cellIndex.row] = false
        }else{
            memoCheck[cellIndex.row] = true
        }
        tableView.reloadRows(at: [cellIndex], with: .automatic)
    }
```

* * *

#### false인 값을 세서 나타내기

함수로 만들어서  
1\. 처음 app이 시작되었을 때  
2\. tableView가 업데이트될 때   
마다 실행하게 하면 될 것 같습니다.

```swift
func getTodoCount(){
        
        // 할일 남은 count
        let noneCheckList = memoCheck.filter{
            (item:Bool) -> Bool in
            return !item
        }
        let cont = "할 일 n개 남음"
        let todoStr = cont.replacingOccurrences(of: "n", with: String(noneCheckList.count))
        
        todoCount.text = todoStr
        
    }
```

-   filter
    -   js에만 있을 줄 알았는 데 여기에도 있어서 정말 반가웠어요!
    -   동작 방식도 비슷했습니다.  
        그냥 memoCheck에서 하나하나 확인하면서  
        false인 것을 찾아서 새로운 배열로 만들었습니다.
-    그 이후 예전 요일 나타낸 것과 같이 내용을 나타나게 하는 아주 간단한 함수였습니다.

* * *

#### 작동을 해보면

매우 잘 되는 것을 볼 수 있습니다!!

이렇게 원하는 기능은 모두 만들었어요!

추가로 몇몇 기능 추가하고 json으로 바꾸는 것을 하려고 했으나...  
제가 swiftUI를 새롭게 공부해야 하게 되어서..  
다음부터는 swiftUI로 만드는 것을 포스팅하도록 할게요!

모든 코드는 따로 올려드릴게요!

**다들 파이팅 해요!**
