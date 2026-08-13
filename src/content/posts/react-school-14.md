---
title: '[React] props / Map()'
pubDate: 2022-03-17
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/14
---
### **Return 반환**

```html
1
return <div> test </div>
		<div> test</div>
=========================
2
return <div>
		<div>test</div>
		<div>test</div>
	    </div>
```

\- return은 한 덩어리만 받을 수 있다. 그렇기 때문에 1번은 오류가 나고  
2번은 오류가 나지 않습니다.

* * *

### **Script 분리**

```html
import { faker } from '@faker-js/faker';
import logo from './image.jpg';

const testData = [
  {
    text: "누구든지 체포 또는 구속을 당한 때에는 적부의 심사를 법원에 청구할 권리를 가진다. ",
    imgUrl: "https://img.insight.co.kr/static/2020/09/22/700/97so3hz72p4nq982if5l.jpg"
  },
  {
    text: "국무총리는 국회의 동의를 얻어 대통령이 임명한다. ",
    imgUrl: "https://upload.wikimedia.org/wikipedia/ko/thumb/4/4a/%EC%8B%A0%EC%A7%B1%EA%B5%AC.png/230px-%EC%8B%A0%EC%A7%B1%EA%B5%AC.png"
  },
  {
    text: "재산권의 행사는 공공복리에 적합하도록 하여야 한다.",
    imgUrl: "http://image.auction.co.kr/itemimage/14/97/95/1497951b06.jpg"
  }
]

function DogMain(props) {
  const h1Element = <h1>{props.title}</h1>
  const imgElement = <img src={logo} className="App-logo" alt="logo" />
  
  return (
    <> 
        {h1Element}
        {imgElement}
        <p>
          짱구 귀여워 5가닥<code>src/App.js</code> and save to reload.
        </p>
        {testData.map((contents)=>{
            return <div>
              <img src={faker.image.avatar()} alt="fake 사진"/>
              {contents.text}
              <img src={faker.image.cats()} alt="fake 사진"/>
              </div>
        })}  
    </>
  );
}

export default DogMain;
```

DogMain.js

App.js에서 content 부분을 가지고 새로운 js를 만들었습니다.

```html
import DogMain from './DogMain';
============================
<DogMain />
```

App.js에 위 코드를 넣음으로써 원하는 위치에 DogMain.js를 유동적으로 넣을 수 있습니다.  
 > App.js이 덜 복잡해지고 보기 편하며 여러 개 복사하더라도 코드가 복잡해지지 않습니다.

* * *

### **Props**

```html
<DogMain title="짱구입니다."/>
<DogMain title="짱아입니다1."/>
<DogMain title="아기짱구입니다."/>
<DogMain title="흰둥이입니다.2"/>
<DogMain title="짱구가 최고입니다.3"/>
<DogMain title="짱구왕 귀엽습니다.4"/>
```

App.js

```html
function DogMain(props) {
  const h1Element = <h1>{props.title}</h1>
```

DogMain.js

-   props는 부모 컨포넌트가 자식 컴포넌트에 값을 전달할 때 사용하는 것.
-   h1 Element에 App.js에서 적은 title들을 저장합니다.

* * *

### **Faker**

```html
import faker from '@faker-js/faker';//영문 버전의 faker.js
import faker_ko from '@faker-js/faker/locale/ko' // 한글 버전의 faker.js
```

faker 사용할때 import를 이름만 다르게 두 개 해줌으로써  
한글 버전과 영문 버전 두 가지로 나눠서 받아올 수 있다.

* * *

### **Const**

```html
const userData = {
    avatar: faker.image.avatar(),
    name: `${faker_ko.name.lastName()}${faker_ko.name.firstName()}`,
    email: faker.internet.email(),
    jobTitle: faker.name.jobTitle(),
    phoneNo: faker.phone.phoneNumber()
  }
```

-   faker data를 userData에 넣을 때 const를 사용해서 저장합니다.
-   [https://github.com/faker-js/faker에서](https://github.com/faker-js/faker) faker.js 패키지의 API를 확인 가능합니다.
-   faker는 영문이 기본이기 때문에 한국 이름 저장 시 faker\_ko를 이용해 lastName을 받고 firstName을 받아야 한다.
-   name : \` @@ \` , 문자열 두 개를 가져와 합칠 때는 작은 따옴표 ' 가 아닌 \`를 사용해야 합니다.
-   사용 시에는 {user.jobTitle} 이런 식으로 사용 가능.

* * *

## **Datas**

```html
while(userDatas.length < 5){
    userDatas.push({
      avatar: faker.image.avatar(),
      name: `${faker_ko.name.lastName()}${faker_ko.name.firstName()}`,
      email: faker.internet.email(),
      jobTitle: faker.name.jobTitle(),
      phoneNo: faker.phone.phoneNumber()
    })
  }
```

 - 여러 가지 data들을 넣고 싶을 때는 while(반복) 문과 push를 사용하여 data들을 userDatas에 저장해준다.

```html
const userCards = userDatas.map((userData) => {
    return <>
    <h4>{ userData.jobTitle }</h4>
    <img src={ userData.avatar }alt="사용자 프로필용 아바타"></img>
    <h5>{ userData.name }</h5>
    { userData.email }<br />
    { userData.phoneNo }
  </>
  })
```

-   map() 함수는 각 배열의 요소를 돌면서 인자로 전달된 함수를 사용하여  
    새로운 결과를 새로운 배열에 담아 반환하는 함수입니다.
-   map 함수를 통해서 datas에 저장된 data들을 차례로 넣어준다.

* * *

### **Key**

map() 함수는 key값을 지정해주지 않으면 오류가 납니다.   
key 값은 언제나 유일한 값이어야만 합니다. 기본적으로 map() 함수 내부에 인덱스가 있습니다.

-   map(element)
-   map(element, index)
-   map(element, index, array)

```html
userDatas.map((userData, idx) => {
```

이런 식으로 사용하여 key값을 지정해줄 수 있습니다.  
단, 그리 좋은 방법은 아닙니다.
