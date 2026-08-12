---
title: '[storyboard] swift로 todoList 만들기 #외전'
pubDate: 2022-12-24
category: ios/storyboard
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/63
---
```swift
import UIKit

class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    // MARK: - Properties
    let day = ["일","월","화","수","목","금","토"]
    var memoCheck:[Bool] = [false,false,true,false,true]
    var memoCont:[String] = ["롤토체스 1등하기", "ios 짱먹기", "유도하기", "업어치기 성공하기", "맨몸운동 5세트"]
    
    // yyyy년 mm월 dd일
    @IBOutlet weak var todayLabel: UILabel!
    // 요일
    @IBOutlet weak var dayLabel: UILabel!
    // 리스트 뷰
    @IBOutlet weak var tableView: UITableView!
    // 할일 n개 남음
    @IBOutlet weak var todoCount: UILabel!
    
    // MARK: - tableView 설정.
    //섹션은 1개
    func numberOfSections(in tableView: UITableView) -> Int {return 1}
    
    // 행의 개수는 데이터 개수
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return memoCont.count
    }
    // cell 안에 들어갈 데이터 설정.
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // 스크롤 될 때마다 사라지는 cell에 새로운 cell을 입혀서 보이게 만듬.
        let cell = tableView.dequeueReusableCell(withIdentifier: "myCell", for: indexPath) as! CustomCell
        
        cell.listBtn.setTitle(memoCont[indexPath.row], for: .normal)
        cell.listBtn.setTitleColor(UIColor.black, for: .normal)
        switch memoCheck[indexPath.row]{
        case true :
            cell.checkBtn.setImage(UIImage(systemName: "checkmark.circle"), for: .normal)
        case false :
            cell.checkBtn.setImage(UIImage(systemName: "circle"), for: .normal)
        }
        getTodoCount()
        
        return cell
    }
    

    // MARK: - Lifecyce
    override func viewDidLoad() {
        super.viewDidLoad()
        // 오늘 날짜 나타내기
             getNowTime()
        getTodoCount()
        

        // Do any additional setup after loading the view.
    }
    
    // MARK: - Actions
    // add
    @IBAction func addBtnAction(_ sender: UIButton) {
        // 클릭시 alert창 띄우기
        let alert = UIAlertController(title: "Todo List", message: "해야할 일을 추가해주세요.", preferredStyle: .alert)
        let ok = UIAlertAction(title: "OK", style: .default){(ok) in
            //code
            // optionals를 그냥 text로 변경해줌.
            let newList = alert.textFields?[0].text ?? ""
            if !newList.isEmpty {
                // memo배열 안에 데이터 넣기.
                self.memoCont.append(newList)
                self.memoCheck.append(false)
                // tableView 새로고침
                let indexPath = IndexPath(row: self.memoCont.count - 1, section: 0)
                self.tableView.insertRows(at: [indexPath], with: .automatic)
            }else{
                // 아무것도 안적었을 때

                print("아무것도 적지 않았습니다.")
            }
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
    // 삭제
    @IBAction func trashBtnAction(_ sender: UIButton){
        let point = sender.convert(CGPoint.zero, to: tableView)
        guard let indexPath = tableView.indexPathForRow(at: point) else { return}
        memoCont.remove(at: indexPath.row)
        memoCheck.remove(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .automatic)
        getTodoCount()
    }
    
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
    
    
    // MARK: - Helpers
    func getNowTime(){
           let now = Foundation.Date()
           let dateFormatter = DateFormatter()
           dateFormatter.dateFormat = "yyyy년 MM월 dd일"
           dateFormatter.timeZone = NSTimeZone(name: "ko_KR") as TimeZone?
           
           todayLabel.text = dateFormatter.string(from: now)
        
        // 요일 구하기
                let str = "월요일"
                let cal = Calendar(identifier: .gregorian)
                let comps = cal.dateComponents([.weekday], from: now)
                let todayStr = str.replacingOccurrences(of: "월", with: self.day[comps.weekday! - 1])
                dayLabel.text = todayStr
       }
    
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
   
}

class CustomCell: UITableViewCell {
    @IBOutlet weak var checkBtn: UIButton!
    @IBOutlet weak var listBtn: UIButton!
    @IBOutlet weak var trashBtn: UIButton!
}
```
