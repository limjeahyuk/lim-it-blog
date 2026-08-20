---
title: '[ K ] Modal 창 구현'
slug: react-40
pubDate: 2022-06-08
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/40
---
### **\- Modal?**

유효성 검사를 하고 사용자에게 오류라는 것을 알려줄 때  
이제까지는

![](/images/react-40/1.png)

이런 식으로 border나 background의 color를 변경하여 사용자에게 알려줬습니다.

이번에는 새로운 방식으로 해보도록 하겠습니다.

![](/images/react-40/2.png)

**Modal이라고** 하는 알림 창 같은 창을 띄우는 것입니다.  
인터넷 하다 보면 많이들 보셨을 것 같은 데 한번 구현해보도록 하겠습니다.

* * *

### **\- 유효성 검사**

![](/images/react-40/3.png)

1.  username이 빈칸이 아니여야 합니다.
2.  age 가 빈 칸이 아니여야 합니다.
3.  age가 0 이하로 내려가면 안 됩니다.

버튼을 눌렀을 때, if문을 통해서 검사를 해보도록 하겠습니다.

![](/images/react-40/4.png)

-   **enteredAge.trim().length === 0**   
    Age칸에 입력값의 길이가 0일 때 ( 공백 )
-   **enteredUsername.trim().length === 0**  
    username 칸 입력값의 길이가 0일 때 ( 공백 )
-   **trim()**  
    문자열 앞뒤의 공백을 제거합니다.
-   **if 문 안에 return;** 을 사용하게 되면  
    함수 밖으로 나가 달라는 뜻입니다.  
    switch case 문의 break; 와 같은 뜻.
-   **+enteredAge**  
    enteredAge의 state가 문자열이기 때문에 + 를 붙여줌으로써  
    확실하게 age를 숫자형으로 바꿔줍니다.

* * *

### **\- Modal 구현**

modal은 재사용이 가능하기에 UI 부분에 만들어 주겠습니다.

![](/images/react-40/5.png)

-   다양한 오류 메시지를 나오게 하기 위해서 title, message를 props로 받아오겠습니다.
-   Card 부분이 Modal 본체(?)이며 <div ...{classes.backdrop} /> 부분이 그 외 부분입니다.  
    button을 클릭하면 다시 입력창이 나오게 하겠지만 뒤 배경을 눌러도 입력창이 나오도록 하려 합니다. 

![](/images/react-40/6.png)

css는 css모듈을 사용하여 적용했으며

![](/images/react-40/7.png)

이런 식으로 z-index를 이용하여 앞에 나올 것을 처리했습니다.

* * *

Modal은 입력창에서 사용자가 잘못 입력하면 뜨게 할 예정이기 때문에  
방금 위에서 유효성 검사 한 부분에서 넣어주도록 하겠습니다.

![](/images/react-40/8.png)

error State를 만들어서 error 가 날 때마다 title과 message를 넣어줍니다.

![](/images/react-40/9.png)

error가 뭐든 있다면 <ErrorModal >을 나타나게 연산자를 이용했습니다.

이렇게만 하면 modal 창이 없어지지 않습니다.  
마지막으로 버튼을 누르던 뒷 배경을 누르던 누르게 되면 error를 null로 만들어 줘야 합니다.

![](/images/react-40/10.png)

이렇게 하면 잘 작동하게 됩니다.
