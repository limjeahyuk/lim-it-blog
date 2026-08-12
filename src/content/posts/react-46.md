---
title: 'React 와 nodejs 합치고 프로젝트 기본설정'
pubDate: 2022-07-07
category: study/react
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/46
---
### \- 동기

풀스택을 해보기도 해야 하고 직접 react로 만든 것을 nodejs를 이용해 db에 데이터를 넣고 조회하고 하고 싶었습니다.

회사에서 해보라고 하기도 했고 저한테 많은 도움이 될 것 같았습니다.

* * *

### \- 소개

저의 경우는 react를 먼저 만들고 거기에 서버를 넣는 방식으로 했습니다.

react 시작하는 법은 저 블로그에 잔뜩 나와있기 때문에 생략하겠습니다.

어떤 것을 만들 건지 구상도 안 하고 시작을 하긴 했는 데 결국 만든 결과물을 먼저 보자면

![](/images/react-46/1.png)

화면은 이런식으로 되어있습니다.

mysql의 경우에는

![](/images/react-46/2.png)

이런 식으로 만들었습니다.

* * *

### \- 기본 틀

![](/images/react-46/3.png)

이런식으로 app.js에서 컴포넌트를 하나하나 추가하면서 만들었습니다.

그 중간중간 서버와 api를 통해 데이터를 주거니 받거니 하여 데이터를 db에 저장했습니다.

* * *

### **\- 연결**

먼저 만들어논 react앱에 setupProxy.js를 만들어줍니다.

그리고 프록시 모듈이 필요합니다.

npm install htpp-proxy-middleware --save

setupProxy.js안에

```javascript
// setupProxy.js
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
    createProxyMiddleware("/api",{ //도메인 api로 호출
      target:"http://localhost:8080", // 통신할 서버의 도메인 주소
      changeOrigin:true,
    })
  )
}
```

이런 식으로 넣어줍니다.

react를 localhost:3000, 서버를 localhost:8080에 넣어줄 것이기 때문에 proxy를 사용하여 연결해줄 것입니다.

#### **proxy란?**

**server와 client 사이에 중계기로써 대리로 통신을 수행하는 것을 proxy라고 합니다.**

서버의 경우에는  mkdir mynode ( 앱이름 ) 을 이용해 서버 프로젝트를 만들어줍니다.

그 후 cd mynode 를 이용하여 프로젝트 위치로 이동하고

npm init -y 로 프로젝트 초기화시켜줬습니다. 초기화를 하게 되면 package.json이 생성되는 데

![](/images/react-46/4.png)

scripts 안에 start를 만들어 줍니다.

이렇게 되면 node index를 사용해서 서버를 시작할 수 있게 됩니다.

express를 설치해줄 것입니다. npm install express

#### **express란?**

**node.js의 핵심 모듈인 http와 connect 컴포넌트를 기반으로 하는 웹 프레임워크로써  
개발을 쉽고 빠르게 할 수 있게 도와주는 역할을 합니다.**

이제 mysql과 연동을 해야하기 때문에 mysql 모듈을 설치하도록 하겠습니다.

npm install mysql

database.js라는 파일을 만들어줍니다.

```javascript
//database.js
module.exports = {
    host: 'localhost',
    user: 'root',
    password: '1004',
    database: 'schema_hyuk',
};
```

사용할 db의 이름을 database: 에 작성해줍니다. 저의 경우에는 'schema\_hyuk'이네요.

index.js

```javascript
//index.js
const express = require('express');
const mysql = require('mysql');
const dbconfig = require('./database.js');
const connection = mysql.createConnection(dbconfig);
const cors = require('cors');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(cors());

// configuration ====
app.set('port', process.env.PORT || 8080);
```

아까 서버 port번호 8080으로 하기로 했으니까 8080으로 설정해줬습니다.

이렇게 하면 db와 node , react 전부 세팅 끝났습니다.
