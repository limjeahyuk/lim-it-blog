---
title: 'React와 node.js 합치고 마음대로 프로젝트'
pubDate: 2022-07-07
category: study/react
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/47
---
### **설명**

리액트 html 구조에 관해서는 설명드리지 않겠습니다... 너무 길어질 것 같아요..

리액트 기본적인 것은 설명드리지 않겠습니다... 블로그에서 못해도 3번씩은 말한 것들만 사용했어요

서버 위주로 설명하고 몇 개 몇 개만 설명할게요... 어차피 저만 볼 것 같아서...

혹시 보고 프로젝트 원하시면 드릴게요 > 댓 ㄱ

* * *

### **\- DB의 data 값 전체 조회 ( READ )**

![](/images/react-47/1.png)

Title / Name / Age 순으로 조회하고 화면에 띄울 예정입니다.

저는 이번 프로젝트를 하면서 항상 node로 서버 먼저 코딩하고 postman으로 확인 한 다음 react로 만들었습니다.

```javascript
const express = require('express');
const mysql = require('mysql');
const dbconfig = require('./database.js');
const connection = mysql.createConnection(dbconfig);
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// configuration ====
app.set('port', process.env.PORT || 8080);

//DB 전체 조회
app.get('/', (req, res) => {
    connection.query('SELECT * from hyuk', (error, rows) => {
        if (error) throw error;
        console.log(rows);
        res.json(rows);
    });
});
```

-   require의 경우 react의 import와 같은 거라고 보면 됩니다.
-   cors는 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권하는 부여 하도록 알려주는 것.  
    **쉽게 말해서 브라우저와 서버가 통신하기 위해 필요하다고 보면 됩니다.**
-   bodyparser는 api요청에서 받은 body값을 파싱 하는 역할을 수행하는 것입니다.  
    **쉽게 말해서 json 형식으로 값을 받아오려면 있어야 합니다.**
-   DB 전체 조회를 보면 app.get('/')을 볼 수 있습니다.  
    get방식으로 localhost:8080/ 에 요청을 주면 값을 보낸다는 말입니다.
-   **req : 요청받는 것**  
    **res : 요청받은 값으로 연산 후 res으로 반환하는 것**
-   쿼리문을 사용하여 db에서 얻은 값은 rows에 저장되어있습니다.
-   row를 json형식으로 반환하여 res에 넣어줬습니다.
-   만약 요청이 오게 되면 db에서 쿼리문을 돌려 얻은 값을 json 방식으로 변환하여 반환해줍니다.

react의 app.js

```javascript
	// db에 저장되어있는 전체 값 불러오기
  const sendRequest = async() => {
    const response = await axios.get('http://localhost:8080');
    setData(response.data);
  };

  // 화면 렌더링 되었을 때 실행
  useEffect(()=>{
    sendRequest();    
  }, []);
```

-   **axios**를 사용하여 api 요청을 했습니다.
-   서버 port 번호인 8080에 요청을 했으며 get 방식으로 했습니다.  
    그렇게 얻은 값을 **response에 저장했으며 json 형식으로 온 것 중 data만 빼서 data에 state를 이용하여 저장했습니다.**
-   또한 app.js 가 렌더링 되는 순간 실행되도록   
    **useEffect**를 사용했습니다.

여기까지가 DB 전체 데이터 불러오는 과정입니다.

* * *

### **\- DB에 값 추가하기 ( CREATE )**

![](/images/react-47/2.png)

**서버**

```javascript
// DB 삽입
app.post('/reg', function (req, res) {
    console.log('console : %j',req.body);
    const rb = req.body;
    const title = rb.title;
    const name = rb.name;
    const age = rb.age;
    
    const query = `INSERT INTO HYUK(TITLE,NAME,AGE) VALUE('${title}','${name}','${age}')`;
    connection.query(query,
    (err,rows) => {
        if(err) throw err;
        return console.log("insert success");
    }
    );

    res.json(req.body);
    
}
);
```

-   DB에 추가할 때는 post 방식을 사용합니다.
-   console.log() 안에 그냥 req.body를 해버리면 console은 json 방식을 바로 못 받기 때문에 오류가 납니다.  
    %j 를 통해 json 형식이라는 것을 알려줘야 오류가 안 납니다.
-   req가 받아오는 값이기 때문에 req.body.title 이런 식으로 사용자가 주는 데이터를 받아옵니다.
-   그렇게 하여 조회와 마찬가지로 쿼리문을 사용하여 INSERT INTO로 데이터를 DB에 넣어줍니다.

**프론트**

```javascript
    const submitHandler = (event) => {
        event.preventDefault();

        const expenseData = {
            title: enterTitle,
            name: enterName,
            age: enterAge
        };

        axios({
            url: "http://localhost:8080/reg",
            method: 'post',
            data: expenseData
        }).then(function a(response) {
            console.log(response);
            window.location.replace("http://localhost:3000")
        })
            .catch(function (error) {
            console.log(error);
        }); 
    }
```

-   form 안에 있는 값들을 submit 할 때 새로고침을 방지해줍니다.
-   Title , Name , Age의 값들을 받아서 expenseData에 json 형식으로 저장해줍니다.
-   axios를 사용하여 이번엔 데이터를 보낼 것입니다.
-   서버에서 설정한 url ( /reg ) , post 방식 , data를 보냅니다.
-   그때 res가 오게 되면 console에 찍고 새로고침을 해줍니다.
-   새로고침 하면 렌더링 되면서 db 전체 데이터가 또 불러오게 되고  
    추가한 값이 보이게 됩니다.

* * *

### **\- DB에 값 삭제하기 ( DELETE )**

![](/images/react-47/3.png)

**서버**

```javascript
//Db 삭제
app.delete('/delete/:id', function (req, res) {
    const deleteid = parseInt(req.params.id);
    const query = `DELETE FROM HYUK WHERE limno = ${deleteid}`;
    connection.query(query,
        (err, rows) => {
            if (err) throw err;
            return console.log("delete good");
        });
    res.json(deleteid + "삭제")
});
```

-   삭제는 delete 메소드를 이용합니다.
-   req에서 id를 받아와야 합니다. 그렇기에 req.params.id를 이용하여 id 값을 받아왔습니다.
-   동일하게 쿼리문을 사용하여 DB 데이터를 삭제하고 삭제했다는 것을 res를 이용하여 보냈습니다.

**프론트**

여기서는 삭제 버튼을 눌렀을 때 누른 limno를 가지고 와야 합니다.

```javascript
            <div>
                <button onClick={(e) => onClickHandler(props.limno, e)}>삭제</button>
            </div>
```

이제까지 항상 onClick안에는 onClickHandler 만 넣었지만 이런 식으로 화살표 함수를 사용하게 되면  
매개변수를 가지고 올 수 있습니다.

```javascript
    // 삭제
    const onClickHandler = (limno, e) => {
        console.log("limno는 "+limno);
        console.log(e);

        axios({
            url: `http://localhost:8080/delete/${limno}`,
            method: 'delete',
        }).then(function a(response) {
            console.log(response);
            window.location.replace("http://localhost:3000")
        })
            .catch(function (error) {
            console.log(error);
        });
    }
```

-   매개변수로 클릭했을 시 limno를 가지고 왔습니다.
-   클릭한 limno를 axios에 넣어서 서버에 보내줍니다. method는 delete로 잘 보냈습니다.
-   완료되어 response 값이 오게 되면 CREATE와 마찬가지로 새로고침 해줍니다.  
    새로고침 하게 되면 DB 전체가 조회되므로 삭제된 것은 안 보이게 됩니다.

* * *

### **\- DB 데이터 해당 id 조회하기 ( READ )**

![](/images/react-47/4.png)

글자를 클릭하게 되면 그 글자에 맞는 세부사항이 밑에 나타나게 됩니다.

만약 클릭 안 하면 안 보이도록

```javascript
 {contRead && <ExpenseRead onChangeBool={contReadHandler} readcont={ readCont} />}
```

contRead 가 true 일 때만 뒤에 코드가 실행되도록 삼항 연산자를 사용했습니다.

**서버**

```javascript
//DB id 조회
app.get('/:id', (req, res) => {
    const selectid = parseInt(req.params.id);
    connection.query(`SELECT * from hyuk WHERE limno = ${selectid}`, (error, rows) => {
        if (error) throw error;
        res.json(rows);
    });
});
```

-   삭제와 마찬가지로 id값을 받아와서 쿼리문 돌리고 성공하면 res로 넘겨줍니다.
-   전부 동일합니다.

**프론트**

```javascript
 // 해당번호 조회
    const clickHandler = (limno, e) => {
        setClickNo(limno);
        props.onChangeBool(true);
        props.onGetCont(data);
    }

    const sendRequest = async() => {
    const response = await axios.get(`http://localhost:8080/${clickNo}`);
        setData(response.data);
        };    

    useEffect(() => {
        sendRequest();
    }, [clickNo]);
```

-   위에서 언급한 것처럼 클릭했을 시 클릭한 것의 limno를 가지고 와서 clickno에 저장해줍니다.
-   clickno를 가지고 axios.get으로 id값과 함께 보내줍니다.
-   useEffect를 이용하여 clickno가 변경될 때마다 api를 보내도록 설정했습니다.

* * *

### **\- DB 데이터 수정 ( UPDATE )**

![](/images/react-47/5.png)

**서버**

```javascript
//db 수정
app.put('/update/:id', function (req, res) {
    const rb = req.body;
    const title = rb.title;
    const name = rb.name;
    const age = rb.age;
    const cont = rb.cont;

    const updateid = parseInt(req.params.id);
    const query = `UPDATE hyuk SET TITLE='${title}', NAME = '${name}', AGE = '${age}', CONT = '${cont}' WHERE limno = ${updateid}`
    connection.query(query,
        (err, rows) => {
            if (err) throw err;
            return console.log("update success");
        });
    res.json("good");
})
```

-   update는 mathod를 put으로 전달합니다.
-   삽입과 마찬가지로 프런트에서 보내주는 정보들을 req.body.title 이런 식으로 빼내어 저장 후  
    id 값을 받아와서 쿼리문을 돌립니다.
-   잘 작동되었다면 res.json으로 good을 프론트에 전달합니다.

**프론트**

```javascript
const submitHandler = (e) => {
        e.preventDefault();
        const no = props.updateData;
        const updateitem = {
            title: updateTitle,
            name: updateName,
            age: updateAge,
            cont: updateCont
        };

        axios({
            url: `http://localhost:8080/update/${no}`,
            method: 'put',
            data: updateitem
        }).then(function a(response) {
            console.log(response);
            window.location.replace("http://localhost:3000")
        })
            .catch(function (error) {
            console.log(error);
        });
    }
```

-   update form 이 submit 될 때마다 새로고침을 막았습니다.
-   조회한 것을 수정할 것 이기 때문에 조회한 곳에서 props로 id를 받아왔습니다.
-   폼에 적은 내용들을 json 형식으로 updateitem에 저장했습니다.
-   axios로 url에 no를 넣어 조회한 id를 넣어 보냈으며  
    method는 put / data는 json 형식으로 보냈습니다.
-   이게 잘 완료되어서 res를 받았다면 3000으로 새로고침 하였습니다.

* * *

#### 여기까지 NodeJs와 React를 합치고 간단한 CRUD를 만들어본 프로젝트입니다.
