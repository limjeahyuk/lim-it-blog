---
title: '[React] JSX / map / faker'
pubDate: 2022-03-11
category: study/react-school
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/5
---
## JSX

-   JSX는 javascript를 확장한 문법.
-   react는 JSX 사용이 필수는 아니지만,  
    javascript 코드 안에서 UI 관련 작업을 할 때 시각적으로 더 도움이 됨.
-   JSX는 html보다는 javascript에 가깝기 때문에 프로퍼티 명명 규칙을 사용. ex) jsx에서 class > className / tabindex > tabIndex

* * *

## faker

```
npm install @faker-js/faker --save-dev

import { faker } from '@faker-js/faker';
```

아무 이미지나 넣고 테스트할때 필요한 npm 패키지 중 하나.

* * *

## map 함수

map 함수는 return 필수  
foreach 함수는 return 없어도 괜찮습니다.

```
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

 {testData.map((contents)=>{
            return <div>
              <img src={faker.image.avatar()} alt="fake 사진"/>
              {contents.text}
              <img src={faker.image.cats()} alt="fake 사진"/>
              </div>
          })}
```

map 함수는 안에 있는 내용물 만큼 반복해서 넣어줍니다.

* * *

추가 사항.

```
function add(a,b){
return a+b;
}

const add = (a,b) => {
return a+b;
}

const add = (a,b) => a+b;
```

위 3가지 다 같은 뜻
