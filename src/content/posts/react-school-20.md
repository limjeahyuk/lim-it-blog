---
title: '[React] Dark mode & PageNation'
pubDate: 2022-03-25
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/20
---
### **\- Dark Mode**

mui를 이용하여 쉽게 dark mode를 할 예정.

[https://mui.com/customization/dark-mode/](https://mui.com/customization/dark-mode/)

 [Dark mode - MUI

MUI comes with two palette modes: light (the default) and dark.

mui.com](https://mui.com/customization/dark-mode/)

```html
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  const [useDarkMode, setUseDarkMode] = useState(true);

  const handleChange = (event) => {
    setUseDarkMode(event.target.checked);
  };
 
 return(
  <ThemeProvider
      theme={createTheme({
        palette: {
          mode: useDarkMode ? 'dark' : 'light',
        },
      })}
    >
    
    <Switch
          checked={useDarkMode}
          onChange={handleChange}
          color="warning"
          inputProps={{ 'aria-label': 'controlled' }}
        />
     </ThemeProvider>
     );
    }
```

-   mui에서 받아온 ThemeProvider, createTheme를 import 해온다.
-   hooks 문법 사용 하여 useState 사용 => hooks 문법 밑에서 설명 예정
-   <ThemeProvider>의 하위 자식들은 props로 넘어가는 theme의 값을 사용 가능하다.  
    ThemeProvider가 최상단에 위치하고 있으므로 전체적으로 theme의 속성을 다 가진다.
-   palette를 이용하여 mode를 dark와 light로 나눈다.
-   switch 또한 mui에서 가져왔다. 클릭 할 때마다 useDarkMode를 실행.

* * *

### **※ 이해하기 너무 어려움 ※**

### **\- hooks**

```html
const [name, setName] = useState("test");
const [age, setAge] = useState(21);
const [phoneNo, setPhoneNo] = useState('0102212112');

const [userInfo, setUserInfo] = useState({
name: 'test",
age: 21,
phoneNo: "0101111"
})

setName("ttt");
setAge(42);

setUserInfo({
...userInfo,
name: "test2",
age: 22,
})
```

-   const는 상수라는 뜻으로 사용하는 이유로는 다른 곳에서 변하지 않도록 하나의 제어장치를 해놓은 것이다.  
    하지만 위 코드를 보면 너무 자유롭게 잘 변하고 있다.
-   const를 선언하므로써 state 변수를 직접 수정하는 것을 방지하고, setState를 사용하게 하기 위함이다.
-   const \[name, setName\] = useState("test")의 코드를 보면  
    name의 초기값은 test이며 setName으로 값을 변경해줄 수 있다.
-   hooks를 위 3줄의 코드처럼 한줄한줄 쓸 수 도 있겠지만 userInfo 처럼 한 번에 묶어서 사용도 가능하다.
-   hooks를 완전히 이해하려면 클로저라는 것을 이해해야한다고 한다....  
    함수 내부의 변수가 함수 수명이 끝나더라도 변수의 참조가 계속 된다면 그 변수의 수명은 계속된다...???
-   [https://hewonjeong.github.io/deep-dive-how-do-react-hooks-really-work-ko/](https://hewonjeong.github.io/deep-dive-how-do-react-hooks-really-work-ko/)

 [\[번역\] 심층 분석: React Hook은 실제로 어떻게 동작할까?

React Hook에 대해 이해하려면 JavsScript 클로저에 대해 잘 알아야합니다. React의 작은 복제본을 만들어보며 클로저와 hook의 동작 방식을 알아봅니다.

hewonjeong.github.io](https://hewonjeong.github.io/deep-dive-how-do-react-hooks-really-work-ko/)

여기서 잘 설명 해주시는 데... 솔직히 너무 어렵다...

* * *

### **\- useEffect**

```html
 useEffect(() => {
    console.log('component did mount');
  }, []);

  useEffect(() => {
    console.log(`theme 변경된 -> ${useDarkMode}`);
  }, [useDarkMode]);
```

* * *

### **\- 페이지 최적화**

```html
avatar: `images/${getRandomIntInclusive(1, 10)}.jpg`,
```

이제까지 faker.js를 사용했다.  
faker.js를 통해 생성한 이미는 외부서버에 있어서 로딩도 더 오래 걸리고 별로 좋지 않다.  
그렇기 때문에 image를 내부서버에 저장해 두고 불러온다.

* * *

### **\- Random , ceil , floor**

```html
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
```

-   getRandomInclusive(min, max) 로 사용함.
-   최솟값 (min)은 설정한 값의 내림이다. 혹시 소수점으로 쓰는 사람이 있으면 내려서 설정하기 위해
-   최댓값 (max)은 설정한 값의 올림이다. 내림과 비슷한 맥락
-   ceil => 내림 / floor => 올림

* * *

### **\- PageNation**

정말 방대한 양의 데이터가 한 번에 웹사이트에 올라가게 되면 엄청난 렉과 로딩이 필요하다.  
그걸 방지하고자 숫자버튼을 사용해 데이터를 나누곤 한다. > pagenation  
화면에 보일때만 데이터를 가져오고 안 보일 때는 없애주고 그런 식으로 성능을 올린다.

```html
 <Pagination 
 	count={10} 
    page={pageNo} 
    onChange={handleChangePageNo} 
    variant="outlined" color="secondary" />
```

-   count > 숫자 버튼의 개수 (컨텐츠 총 개수 / 화면에 표시할 개수 )
-   page > 현재 페이지
-   onchange > 버튼을 누를 때마다 작동되는 것.

```html
function UserCardList(props) {
  const pageContentsCount = 9;
  const [pageNo, setPageNo] = useState(1);
  const [currentUserDatas, setCurrentUserData] = useState(
    paginate(props.userDatas, pageContentsCount, pageNo),
  );

  const handleChangePageNo = (event, value) => {
    setPageNo(value);
    setCurrentUserData(paginate(props.userDatas, pageContentsCount, value));
  };

<Pagination
      count={Math.ceil(props.userDatas.length / pageContentsCount)}
      page={pageNo}
      onChange={handleChangePageNo}
      color="secondary"
    />,
    
    const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
```

-   pageContentsCount > 현재 페이지에 보이는 contents 수
-   pageNo를 hooks를 사용하여 1로 초기값을 설정하고 변경해준다.
-   currentUserDatas 또한 hooks를 사용하여 설정해준다.
-   userDatas에서 배열로 받아와서 맨 밑에 paginate에서 받은 리턴 값으로 초기값 설정해준다.
-   pageNo가 페이지 숫자로 변할 때마다 그 숫자에 맞는 결과값으로 페이지 내용을 재배치해준다.

* * *

### **\- export**

```html
import UserCard from './UserCard';
import { paginate } from '../Utils';
import { useState } from 'react';

export const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

export default UserCard;
```

-   import 할 때 {}가 있는 것은 paginate 만 가져온다는 뜻이다.
-   import 할때 {} 없을 땐 default 값 까지 전부 다 가져온다는 뜻이다.
