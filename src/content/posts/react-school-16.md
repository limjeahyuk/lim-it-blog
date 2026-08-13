---
title: '[React] UI 라이브러리 / grid 컨테이너'
pubDate: 2022-03-18
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/16
---
### **UI 라이브러리**

리액트 기반 ui 라이브러리를 사용함으로써 좀 더 쉽고 편하게 이쁘고 원하는 모양으로 디자인을 할 수 있습니다.

[https://mui.com/getting-started/installation/](https://mui.com/getting-started/installation/)

 [Installation - MUI

Install MUI, the world's most popular React UI framework.

mui.com](https://mui.com/getting-started/installation/)

npm, svg icon을 install 해준다.  
font는 index.html에 <link> 해준다.

![](/images/react-school-16/1.png)

index.html

위 사진 처럼 넣어준다.  
MUI 라이브러리 기본 폰트가 Roboto 폰트이기 때문에 roboto font <link> 해주는 것이 좋다.

```html
const { userData } = props;

const userData = props.userData;

==================================

const { userData, idx } = props;

const userData = props.userData;
const idx = props.idx;
```

UserCard.js

밑에 문장을 {괄호} 사용을 통해 위 문장처럼 짧고 보기 좋게 바꿀 수 있습니다.

```html
return <UserCard userData={userData} idx={idx} />
```

App.js

UserCard.js 에서 props를 통해 userData와 idx를 받아와 App.js에서 리턴 받아 올 수 있습니다.

* * *

### **grid 컨테이너**

사용하기 위해서 

```html
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
```

App.js

App.js 에 import 해줍니다.

```html
<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  {Array.from(Array(6)).map((_, index) => (
    <Grid item xs={2} sm={4} md={4} key={index}>
      <Item>xs=2</Item>
    </Grid>
  ))}
</Grid>
```

-   mui container에서 제공하는 grid는 반응형 레이아웃으로 화면 크기에 맞춰서 item이 조정됩니다.
-   크기는 xs / sm / md / lg / xl 순으로 있으며  
    xs => 0px ( extra-small )  
    sm => 600px ( small )  
    md => 900px ( medium )  
    lg => 1200px ( large )  
    xl => 1536px ( extra-large) 로 이루어져 있다.
-   위 코드를 보며 설명 하자면,
-   spacing은 item들 사이의 여백으로써 xs일 때는 2만큼의 여백, md일 때는 3만큼의 여백이 있다.
-   columns는 한 줄에 1 크기의 item이 몇 개 들어가는지 알려준다.  
    xs일 때는 1 크기의 아이템이 4개, sm일 때는 8개, md일 때는 12개이다.
-   item은 xs일 때 2만큼의 크기를 가지게 되고, sm일 때 4, md일 때 4를 가지게 된다.
-   이렇게 되면 xs일 때는 한 줄에 2개씩 있으며 3줄로 나오게 된다.  
    sm 일때는 한줄에 2개씩 3줄  
    md일 때는 한줄에 3개씩 2줄이 나오게 된다.  
    

* * *

### **결과창**

![](/images/react-school-16/2.png)

xs, sm / md

* * *

### **추가로...**

```html
return (
    <Container maxWidth="lg" sx={{p:1}}>
      <Grid container spacing={{xs:2,md:3}} columns={{xs:4,sm:8,md:12}}>
        <Grid item xs={2} sm={2} md={2} key={1}>
          <UserCard userData={userDatas[0]} />
        </Grid>
        <Grid item xs={2} sm={4} md={6} key={2}>
          <UserCard userData={userDatas[1]} />
        </Grid>
        <Grid item xs={2} sm={2} md={4} key={3}>
          <UserCard userData={userDatas[2]} />
        </Grid>
      </Grid>
     </Container>
  );
```

-   위와 같이 item들 마다 값을 다 다르게 줄 수도 있다.

![](/images/react-school-16/3.png)

결과창
