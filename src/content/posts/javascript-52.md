---
title: 'express 비동기 동기 promise 사용.'
slug: javascript-52
pubDate: 2022-07-28
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/52
---
express로 프로젝트를 하는 도중 비동기와 동기를 잘 사용해야할 것 같다는 소리를 들었습니다.

```javascript
// 주문클릭했을 시 수량 확인.
app.post('/buy',  function (req, res) {
    const { proid, count } = req.body;

    const query = `select * from product where proid= ${proid}`
    connection.query(query, (err, rows) => {
        if (err) throw err;
        if (rows[0].quantity >= count) {
            // async await
            itemcount(req, res);
            email(req, res);
        } else {
            res.send('수량이 없습니다.')
        }
    })
})
```

-   처음에는 뭐가 문제인지 잘 몰랐는 데... 지금 보니까 문제이네요..
-   위 코드 설명부터 하자면 상품 주문을 했을 때  
    itemcount  => db에 주문내역 insert 후 상품 총 갯수 업데이트 해주는 함수.  
    email => 주문한 이메일로 주문내역 이메일 보내주는 함수.
-   email은 그렇다고 쳐도 itemcount의 경우는 동기가 되어야하는 데 현재 비동기로 되어있어서  
    만약 itemcount 쪽에서 오류가 나게되더라도 주문완료라고 사용자에게 전달 될 것 이라는 것입니다.

* * *

### **해결**

정말 막막했는 데 우선 asnyc await를 사용하는 것이 가장 보편적이고 깔끔하다고 하더라구요.

그런데 현재 저는 mysql을 사용 중인데 asnyc await는 mysql2를 사용해야하더라구요...ㅎㅎ

뭔가 엄청 바꿔야 할 것 같기도 하고...  
asnyc await 안 쓰고 해보라는 지시도 있었기에 그냥 promise .then .catch를 사용하기로 했습니다.

```javascript
itemcount(req, res).then(function (tableData) {
                console.log(tableData);
                email(req, res);
                res.send("주문완료되었습니다.")
            }).catch(function (err) {
                console.log(err);
                res.send(err);
            })
```

-   itemcount가 성공 했을 때 ( resolve가 들어왔을 때 ) then.  
    itemcount가 실패했을 때 ( reject 가 들어왔을 때 ) catch
-   성공 했을 때 resolve에서 받은 tableData를 console에 찍은 후  
    email 함수가 실행되고 res.send로 주문완료를 보냅니다.
-   실패하면 reject로 받은 err를 사용자에게 보냅니다.

```javascript
// itemcount 함수
    
 const query = `start transaction;
 INSERT INTO \`order\`(PROID, USERNAME, COUNT, ORDERDATE, ORDERTYPE, ORDERINFO, ORDEREMAIL) VALUE
 (${proid},'${username}',${count}, '${orderdate}', '${ordertype}' ,'${orderinfo}','${orderemail}');
 UPDATE product SET quantity=quantity-${count} WHERE proid = ${proid};
 commit;`

return new Promise(function (resolve, reject) {
        connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Request is failed"));
            }
            resolve(rows);
    });
    })
```

-   then으로 가기 위해 return new Promise를 해줍니다.  
    그 안에 쿼리문을 실행하고 성공했을 때 row를 resolve에 담아서 넘겨주고
-   실패하게 되면 reject에 담아서 넘겨줍니다.

* * *

### **하고 나니...**

진짜 비동기 동기 ... 어떻게 써야할 지 감도 잘 안오고 해보고도 이게 맞나?? 싶었는 데...

이렇게 정리하니까 진짜 별거 아니였네요..

아직 개념정리나 쓰는 법을 완벽하게 익힌 것은 아니지만 그래도

promise를 사용하려면 .then 과 .catch를 사용하고  
new Promise를 꼭 **return** 해줘야합니다.

다들 화이팅
