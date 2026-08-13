---
title: '[ H ] 삼항연산자'
pubDate: 2022-06-03
category: study/react
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/37
---
### **\- 문제**

![](/images/react-37/1.png)

처음부터 ExpenseForm이 아닌 NewAddExpense 버튼이 나오게 합니다.

![](/images/react-37/2.png)

New 버튼을 누르면 만들어 놨던 Form이 나오며 cancel 버튼과 add 버튼을 눌렀을 때 다시 new 버튼이 나오도록 합니다.

* * *

### **\- My code**

우선 new 버튼을 보일 때와 form 이 보일 때 두 가지 경우이기에 state가 필요하다고 판단했습니다.

![](/images/react-37/3.png)

그 state가 true라면 false로 false라면 true로 변환할 수 있는 handler 또한 필요합니다.

![](/images/react-37/4.png)

-    **삼항 연산자로써 ? :** 를 사용합니다.  
    해석을 하자면 cancelButton 이 true라면 (?) setCancelButton을 false로 변환해주고  
    그게 아니라면 ( : ) setCancelButton을 true로 변환해주세요.
-   if 문을 쉽게 한 줄로 표현했다고 생각하면 편합니다.  
    if => ? / else => : 라고 생각하면 편합니다.

![](/images/react-37/5.png)

-   cancelButton 이 true라면 cancel 버튼과 add 버튼을 나타내 주고 아니라면 new 버튼을 나타내 주세요.
-   위에서 설명한 ? : 삼항 연산자를 이런 식으로 html 코드와 함께 사용도 가능합니다.

이제는 입력창을 true 일 때 보여주고 false 일때 사라지게 해야 합니다.

![](/images/react-37/6.png)

-   여기서 사용된 **새로운 연산자 &&** 입니다.  
    해석 먼저 하자면 cancelButton 이 true라면 () 안에 있는 코드를 실행시켜줍니다.  
    true가 아니라면? 아무것도 반환하지 않습니다.
-   a && b 라면 a가 true 일 때 b를 반환하고 false 라면 null을 반환합니다.

이렇게 하여 문제를 해결했습니다.

* * *

### **\- 연산자**

사용한 연산자는 두 가지로  
**&& 연산자 와 ? : 연산자입니다**

**&& 연산자는**   
&& 앞에 있는 것이 true 라면 && 뒤에 있는 것을 반환하고 그 나머지는 반환하지 않습니다.  
a && b => a 가 true 라면 b를 반환 / 그 외는 반환하지 않습니다.

**? : 연산자는**  
&& 보다는 상위 호환의 조건 연산자입니다.  
조건 **?** 조건이 true라면 결과 **:** 조건이 아니라면 결과  
**a ? b : c** => a가 true 라면 b를 반환 그것이 아니라면 c를 반환합니다.

* * *

### **\- Other code**

ExpenseForm.js 에서 작업하지 않고 NewExpense.js에서 작업했습니다.

![](/images/react-37/7.png)

마찬가지로 State를 사용하여 true와 false를 구분해줬습니다.

![](/images/react-37/8.png)

-   위에서 설명했던 && 을 사용했습니다.  
    !isEditing 은 isEditing이 false라면입니다.
-   isEditing이 false라면 new button을 ture 라면 form을 나오게 했습니다.
-   new 버튼에 onClick을 하여 starthandler를 지정해줬습니다.
-   form 에는 onCancel라는 속성으로 stophandler를 props로 보냈습니다.  
      
    

![](/images/react-37/9.png)

start는 isEditing을 true로  
stop은 isEditing을 false로 변환시켜줍니다.

cancel 버튼은 form.js에 있기 때문에 저는 form에서 작업을 했습니다.  
하지만 이 코드에서는 cancel 버튼 문제를 props로 해결했습니다.

![](/images/react-37/10.png)

props.onCancel을 넘겨줌으로써 Cancel 버튼을 눌러서 isEditing이 false로 변하게 하였습니다.  
cancel 버튼은 submit 되면 안 되기 때문에 type = "button"이라고 확실하게 했습니다.
