---
title: 'React 간단 정리 3'
pubDate: 2022-07-01
category: study/react-notes
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/45
---
이 글은 [https://beta.reactjs.org/](https://beta.reactjs.org/)을 참고했습니다.

 [React Docs Beta

A JavaScript library for building user interfaces

beta.reactjs.org](https://beta.reactjs.org/)

* * *

### 컴포넌트에 props 전달하기

리액트 컴포넌트는 props를 사용하여 통신합니다.  
상위 컴포넌트에서 하위 컴포넌트로 props를 사용하여 정보를 전달합니다.

#### props 전달하는 방법

![](/images/react-notes-45/1.png)

props는 JSX태그에 전달하는 정보입니다.  
예를 들어 className, src, alt, ... 등등 전달 가능한 정보들입니다.

현재는 어떠한 props도 전달하고 있지 않은 상태입니다.

#### 1\. 자식 구성 요소에 props 전달

![](/images/react-notes-45/2.png)

자식 구성요소 태그 안에 cont 객체와 size를 props로 전달해줬습니다.

#### 2\. 자식 구성 요소 내부의 props 읽기

![](/images/react-notes-45/3.png)

props 내부의 이름들을 나열하여 읽어올 수 있습니다.  
이렇게 읽어온 정보들은 변수를 사용하는 것처럼 사용 가능합니다.

#### props를 사용하게 된다면?

![](/images/react-notes-45/4.png)

**한 컴포넌트로 다양한 props를 사용하여 다양한 방식으로 렌더링이 가능합니다.**  
props를 이용하여 객체뿐 아니라 함수까지도 전달 가능합니다.

#### props의 구조화

```javascript
// 비구조화 할당
const Avatar = ({cont, size}) => {
...
}

// 구조화 할당
const Avatar = (props) => {
let cont = props.cont;
let size = props.size;
...
}
```

구조화의 경우 props 전체 개체를 가져와서 함수 매개변수에서 속성을 읽는 것입니다.  
대개 props 전체를 가져오는 것보다는 사용할 것만 가져오는 비구조화 할당을 많이 사용하는 편입니다.

#### props의 기본값 지정

props 매개변수에 값이 지정되어 있지 않아서 기본값을 지정해줘야 할 때는 매개변수 바로 뒤에 기본값을 넣어줄 수 있습니다.

```javascript
const Avatar = ({cont, size = 100}) => {
...
}
```

이렇게 되었을 때 props로 cont 만 넘겨오더라도 렌더링 될 때 자동으로 100이 기본값 설정이 됩니다.

기본값을 null로 처리하고 싶을 때는 size = {undefined}로 해줘야 합니다.  
size = {null} 또는 size = {0}으로 하게 되면 적용이 되지 않습니다.

#### 스프레드 구문을 사용하여 props 전달.

```javascript
const Main = ({person, size, isSepia, thickBorder}) => {
   return(
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
        />
   )
}

// 위 코드를 스프레드 연산자를 사용
const Main = (props) => {
   return(
      <Avatar {...props} />
   )
}
```

종종 props 전달이 매우 반복적일 수 있습니다.  
반복적인 코드가 잘못된 것은 아니지만 코드가 복잡해지고 코드 자체가 커지기도 합니다.  
반복된 props 전달을 간결하게 하기 위해서는 스프레드 구문을 사용하는 것도 큰 도움이 됩니다.

#### ★ 스프레드 연산자 ★

{ ... }로 이루어진 연산자로 배열의 원소나 객체의 프로퍼티를 나누는 데 사용합니다.

```javascript
let arr1 = [1, 2, 3, 4];
let arr2 = [...arr1 ,5, 6, 7, 8];

console.log(arr2); // 1,2,3,4,5,6,7,8

let str1 = 'lim';
let str2 = [...str1];

console.log(str2); // 'l', 'i', 'm'
```

스프레드 연산자를 사용하면 **배열의 원소나 객체를 나누어 전체를 그대로 넣어줍니다.**

#### JSX를 자식으로 전달

HTML 코드를 짜게 되면 태그를 중첩하는 것이 일반적입니다.

```javascript
<div>
  <img />
<div>
```

이것처럼 자신이 만든 컴포넌트끼리도 중첩하고 싶을 수 있습니다.

```javascript
<Card>
   <Avatar />
</Card>
```

태그 중간에 있는 컴포넌트는 props.children을 사용하여 정보를 넘겨줄 수 있습니다.

```javascript
const Card = (props) => {
   return (
      <div className='card'>
         {props.children}
      </div>
      )
}
```

사용하는 이유는 **공통되는 스타일을 같은 태그로 묶어줌으로써 반복적인 코드를 간결화하는 데 있습니다.**

* * *

#### 요약

1.  props를 전달할 때는 HTML과 마찬가지로 JSX에 추가합니다.
2.  props를 읽을 때는 비구조화 구문을 사용하는 것이 좀 더 보기 좋습니다.
3.  props 매개변수 뒤에 = 을 사용하여 기본값 설정이 가능합니다.
4.  스프레드 구문으로 모든 props를 전달 가능하지만 너무 과도하게 사용하면 오류가 날 수 있습니다.
5.  props.children을 사용해서 중첩되는 태그 안에 정보를 넘겨줄 수 있습니다.
6.  props를 변경하는 것은 불가능합니다. 상호작용이 필요할 때는 state를 사용해주세요.
