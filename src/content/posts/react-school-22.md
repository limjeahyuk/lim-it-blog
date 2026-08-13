---
title: '[React] API 사용하기'
pubDate: 2022-04-02
category: study/react-school
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/22
---
### **OpenWeatherMap**

[https://home.openweathermap.org/users/sign\_up](https://home.openweathermap.org/users/sign_up)

 [Members

home.openweathermap.org](https://home.openweathermap.org/users/sign_up)

openapi를 사용하여 날씨 관련 콘텐츠 만들 예정.

```html
https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid={myApi}
```

-   login 하고 자신의 id를 받아야합니다.
-   lat & lon은 map상의 좌표. 바꿔주면 그 지역의 날씨 정보가 나오게 됩니다.
-   myapi 부분에 자신의 apiid를 넣어줍니다.

![](/images/react-school-22/1.png)

api 호출

사진과 같은 코드 구조를 json 구조이라고 말합니다.

* * *

### REST API

서버에 api를 넣어서 간단하게 게시판 같은 것 삭제, 생성, 조회, 수정 하는 작업들을 말한다.

▼ 자세한 내용 ▼

[https://www.redhat.com/ko/topics/api/what-is-a-rest-api](https://www.redhat.com/ko/topics/api/what-is-a-rest-api)

 [REST API(RESTful API, 레스트풀 API)란 - 서버, 구현, 사용법

REST API(RESTful API)란 REST 아키텍처의 제약 조건을 준수하는 애플리케이션 프로그래밍 인터페이스를 뜻합니다. api 서버, rest api 구현 및 사용법을 설명합니다.

www.redhat.com](https://www.redhat.com/ko/topics/api/what-is-a-rest-api)

rest api는 http 메소드를 사용 한다.

* * *

### **Http Methods**

![](/images/react-school-22/2.png)

생성. 조회. 수정. 삭제가 이런식으로 이루어져 있다.

### https://localhos:8080/api/1.0/boards

-   get  => board 전체 조회
-   delete => board 전체 삭제
-   post => board 생성
-   update => 전체를 수정할 수 없기 때문에 오류가 남.

### https://localhos:8080/api/1.0/boards/10

-   get => board에서 id값이 10인 게시물 조회
-   delete => board에서 id값이 10인 게시물 삭제
-   post => board에서 id값이 10인 게시물 생성
-   update => board에서 id값이 10인 게시물 수정

* * *

### **axios**

```html
npm install axios

import axios from 'axios';
```

-   axios는 부라우저, node.js를 위한 api를 활용하는 비동기 라이브러리입니다.  
    벡엔드와 프론트엔드랑 통신을 쉽게하기위해 ajax와 함께 사용합니다.
-   axios.get() > get방식 / axios.post() > post방식

**※ ajax와 비동기 부분** 

[https://hyuk-todayfeelsogood.tistory.com/3](https://hyuk-todayfeelsogood.tistory.com/3)

 [\[MusicTree\] ajax

\- ajax를 사용하여 api를 가지고 와서 정보 입력해주기. function getChart(){ $.ajax({ type: "get", url: "https://ws.audioscrobbler.com/2.0/", data: {method: "chart.gettoptracks", api\_key: key, format:..

hyuk-todayfeelsogood.tistory.com](https://hyuk-todayfeelsogood.tistory.com/3)

* * *

### **비동기코드**

```html
const userDatas = makeUserDatas(1004);
console.log(1);

function App() {
  const [useDarkMode, setUseDarkMode] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleChange = (event) => {
    setUseDarkMode(event.target.checked);
  };

  useEffect(() => {
    const callApi = async () => {
      try {
        const result = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?lat=37.3943&lon=126.9568&lang=kr&units=metric&&appid=db07f8319467878d8d2ee4c5d2b038b4',
        );
        setWeatherData(result.data);
      } catch (err) {
        setApiError(err);
      }
    };
    console.log(2);
    callApi();
    console.log('component did mount');
  }, []);
  console.log(3);
```

-   위 코드처럼 console.log를 찍어보면 코드는 위에서 아래로 순차적으로 해석하므로  
    결과가 1,2,3 나와야한다. 하지만 결과는 1,3,2가 나오게 된다.
-   동기는 말 그래도 코드를 위에서 아래로 순서대로,  
    비동기는 좀 오래 걸릴것 같은 건 좀 따로 빼놨다가 빨리 끝나는 거 후딱 해치워버리는 것을 말한다.
-   시간이 드는 것, 파일을 찾아주는 것, api처럼 외부에서 정보를 가져오는 것 > **비동기**
-   꼭 순차적으로 해야하는 것 > **동기**예 ) api안에 있는 값을 가지고 또 api를 불러와야할 때..  
    순차적으로 하지 않으면 정확한 정보를 불러올 수가 없다. -> async/await

* * *

### **async / await**

```html
async function callAPI() {
  try {
    const result = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather?lat=37.3943&lon=126.9568&lang=kr&units=metric&&appid=db07f8319467878d8d2ee4c5d2b038b4',
    );
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
```

-   비동기를 동기로 바꿔주는 명령어.
-   api를 사용해서 할 일은 요청에 대한 응답을 받은 객체를 변수에 담아서 사용해야한다.  
    await axios.get
-   이때 async / await를 활용하여 기다린다.
-   await는 단독으로 사용불가.

* * *

### **Promise**

-   자바스크립트 비동기 처리에 사용되는 객체
-   동시에 해도 상관없는 것들은 promise all을 사용한다.

* * *

### **code**

```html
useEffect(() => {
    const callApi = async () => {
      try {
        const result = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?lat=37.3943&lon=126.9568&lang=kr&units=metric&&appid=db07f8319467878d8d2ee4c5d2b038b4',
        );
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    };
    callApi();
    console.log('component did mount');
  }, []);
```

-   api를 effect 밖에다 빼놨을 경우 > state가 바뀔때마다 호출됨  
    이것이 문제인 이유 : api가 단시간에 너무 많이 호출당하면 api가 차단당하는 경우가 있음.  
    이러한 문제 때문에 필요할때만 호출해줘야한다.

```html
  const [useDarkMode, setUseDarkMode] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [apiError, setApiError] = useState(null);
  
  setWeatherData(result.data);
```
