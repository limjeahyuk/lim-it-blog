---
title: '[2] 트랜잭션 & 비동기 동기'
pubDate: 2022-07-22
category: study
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/50
---
### **\- 트랜잭션**

![](/images/study-50/1.png)

구매를 눌렀을 때,

1\. order 테이블에 누가 무엇을 얼마나 구매했는 지 insert 해줘야합니다.

2\. product 테이블에 총 갯수를 판매한 갯수만큼 빼서 update 해줘야합니다.

두 가지 일을 해야하는 데 api를 두번 보내게 되면 오류가 날 확률도 높아지고 둘 중 하나가 오류가 나면 어떻게 될지 아무도 모릅니다.  
이럴 때 사용하는 것이 **트랜잭션으로 둘 다 성공을 했을 때 다음으로 넘어가는 것입니다.**

```javascript
// 제품 구매버튼 눌렀을 때 order 테이블에 저장. 후 product 테이블 수량 변경
// 트랜잭션으로 한번에 해버림.
function itemcount(req, res) {
    const { proid, username, count, orderdate } = req.body;
    const rb = req.body;
    const ordertype = rb.type;
    const orderinfo = rb.data;
    const orderemail = rb.email;
    const query = `start transaction;
    INSERT INTO \`order\`(PROID, USERNAME, COUNT, ORDERDATE, ORDERTYPE, ORDERINFO, ORDEREMAIL) VALUE
     (${proid},'${username}',${count}, '${orderdate}', '${ordertype}' ,'${orderinfo}','${orderemail}');
    UPDATE product SET quantity=quantity-${count} WHERE proid = ${proid};
    commit;
    `
    connection.query(query, (err, rows) => {
        if (err) throw err;
        return res.send('주문이 완료되었습니다.')
    });
}
```

-   query 문을 보게 되면 start transaction 을 사용해서 transaction을 시작합니다.
-   위에서 설명한 대로 order 테이블에 insert 해주고  
    product 테이블의 수량을 update 해줬습니다.  
    둘 다 성공을 했을 때 commit을 통해 db에 저장을 해줍니다.
-   이걸 사용하게 되면 api는 한번만 호출하면 될 뿐더러 오류 날 일도 많이 줄어 듭니다.

* * *

### **\- 비동기 , 동기**

동기 비동기 자체는 꼭 알아야하는 개념이라고 합니다.  
간략하게 설명 해드릴께요!

**api 동기와 비동기 차이**

-   동기  
    -   서버 컴퓨터가 작업이 끝날 때까지 기다립니다.
    -   한번에 하나씩 응답이 모두 끝난 후 응답을 합니다.
-   비동기
    -   동시에 여러개 통신을 합니다.
    -   서버 컴퓨터가 작업이 끝날 때 까지 통신을 기다리지 않습니다.
-   비동기를 동기로 바꿔주는 명령어 > async / await
-   대표적인 비동기 명령어 promise
    -   axios를 사용하게 되면 axios promise는 자동으로 들어가게 됩니다.
    -   axios 만 사용하더라도 promise는 생략됩니다.
-   callback함수
    -   함수 안에 실행되는 함수
-   callback 지옥
    -   비동기가 자주 일어나는 프로그램일 때 발생합니다.
    -   콜백함수가 계속해서 일어나서 들여쓰기가 매우 힘든 상황을 뜻합니다.
-   setTimeout()
    -   js의 대표적인 내장 비동기 함수

리액트의 경우 리액트 내에서도 가장 대표적인 **useState 또한 비동기로 움직입니다.**  
만약 useState 가 동기로 움직였다면 상태 하나가 바뀔 때마다 화면이 렌더링 되어야 할 것입니다.  
  

이처럼 리액트는 비동기의 힘이 매우 강력합니다.  
axios promise의 힘이 강하다는 것을 알고 계시면 좋을 것 같습니다.
