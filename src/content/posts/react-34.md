---
title: '[ E ] Props 함수'
pubDate: 2022-04-20
category: study/react
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/34
---
### **\- Props**

import한 컴포넌트를 재사용할 때 이런 식으로 많이들 합니다.

![](/images/react-34/1.png)

다 좋은데.. 이렇게만 하면 화면에는 항상 똑같은 데이터만 보여질 것입니다.

![](/images/react-34/2.png)

이런 식으로 틀은 같더라도 안에 내용은 다르게 만들고 싶습니다.

* * *

자바스크립트의 경우를 보면 함수를 작성할 때 매개변수를 받아들여서 함수를 재사용 할 수 있도록 만듭니다.  
그렇게 다른 매개변수 값으로 같은 함수를 여러 번 호출합니다.  
같은 함수를 호출 했지만 다른 값이 출력되는 것 입니다.

리액트도 마찬가지 입니다.  
매개변수를 사용하거나 props라는 개념을 사용하여 다른 값으로 여러번 호출 합니다.

하지만 문제가 생깁니다.

![](/images/react-34/3.png)

item 이라는 변수는 CourseItem 컴포넌트가 아니라 App 컴포넌트에 있다는 것입니다.  
App 컴포넌트에서 관리되는 변수와 함께 courseItem 컴포넌트에서 나오는 결과값을 출력하고 싶다면  
props를 사용하면 됩니다.

![](/images/react-34/4.png)

이런 식으로 props로 넘겨주면 문제가 해결 됩니다.

* * *

### **\- props 예제**

```html
import Expense from './components/Expenses/Expense';

const App = () => {
  const expenses = [
    {
      id: 'e1',
      title: 'Toilet Paper',
      amount: 94.12,
      date: new Date(2020, 7, 14),
    },
    { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12) },
    ...(생략)
  ];

  return (
    <div>
      <h2>Let's get started!</h2>
      <Expense items={expenses} />
    </div>
  );
};

export default App;
```

-   App.js 에서 expenses라는 변수에 데이터들을 보관하고 있습니다.
-   데이터들을 Expense.js에 items라고 넘겨줬습니다.

```html
const Expense = (props) => {
  return (
    <Card className="expenses">
      <ExpenseItem
        title={props.items[0].title}
        amount={props.items[0].amount}
        date={props.items[0].date}
      />
      <ExpenseItem
        title={props.items[1].title}
        amount={props.items[1].amount}
        date={props.items[1].date}
      />
      ...(생략)
    </Card>
  );
};
```

-   props를 받아왔다는 뜻으로 const Expense = (**props**) => { 를 사용해줬습니다.
-   <ExpenseItem title={props.items\[0\].title} 를 통해 props로 받아온 값을 사용했습니다.  
    props로 받아온 items에 0번째 데이터에 title을 가져오겠습니다.  
    그렇게 Toilet Paper가 받아와집니다.
-   그것을 ExpenseItem.js에 props로 또 옮겨주고 있습니다.

```html
<ExpenseDate date={props.date} />
      <div className="expense-item__description">
        <h2>{props.title}</h2>
        <div className="expense-item__price">${props.amount}</div>
      </div>
```

이런식으로 사용하고 있습니다.

* * *

### **\- props.children**

컴포넌트를 만들때 <ExpenseItem /> 이런식으로 많이들 사용합니다.  
그런데 <ExpenseItem> xxx </ExpenseItem> xxx에는 넣으면 안되는 걸까?  
마치 <div> xxx </div> 와 같은 비슷해보입니다.

```html
<Card className="expense-item">
      <ExpenseDate date={props.date} />
      <div className="expense-item__description">
        <h2>{props.title}</h2>
        <div className="expense-item__price">${props.amount}</div>
      </div>
    </Card>
```

-   이런 식으로 <Card> </Card> 안에 많이 넣어놨습니다.  
    누가 보면 이미 있는 태그인 것처럼... 하지만 Card는 사용자가 직접 만든 컴포넌트입니다.
-   이렇게만 만들면 잘 나오던 것이 안나오고 Card.js 만 나오게 됩니다.

```html
const Card = (props) => {
  const classes = 'card ' + props.className;
  return <div className={classes}>{props.children}</div>;
};
```

-   이런식으로 {props.children}을 해주면 다시 잘 보입니다.
-   컴포넌트 사이에 있는 컴포넌트를 보여지게 만드는 하나의 문법(?)입니다.

* * *

**이걸 사용하는 이유는??**

프로젝트를 하다보면 비슷한 모양이 많습니다.  
Card로 예시를 들면

![](/images/react-34/5.png)

border-radius / box-shadow 항상 같은 크기입니다.

지금은 매우 간단하니 그냥 className에 .card를 추가해줘도 상관없습니다.  
하지만 좀 더 복잡해지면 별도의 래퍼 컴포넌트로 일부 중복되는 코드를 추출할 수 있습니다.

코드를 추출하여 수많은 코드 중복을 피할 수 있게 해주고 다른 컴포넌트를 깔끔하게 유지할 수 있게 해줍니다.

그때 래퍼컴포넌트로 만들어주는 것이 props.children 입니다.
