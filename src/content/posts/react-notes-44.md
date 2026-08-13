---
title: 'React 간단 정리 2'
pubDate: 2022-07-01
category: study/react-notes
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/44
---
이 게시물은 [https://beta.reactjs.org/learn](https://beta.reactjs.org/learn) 참고하고 있습니다.

 [Quick Start

A JavaScript library for building user interfaces

beta.reactjs.org](https://beta.reactjs.org/learn)

* * *

### JSX로 마크업 작성하기

JSX는 JavaScript 파일 내에 HTML과 유사한 마크업을 작성할 수 있는 JavaScript용 구문 확장입니다.

### JSX의 규칙

#### 1\. 단일 루트 요소 반환

**return () 안에는 한 덩어리만 반환할 수 있습니다.**

```html
return (
   <div>
      <h1>안녕하세요</h1>
      <p>임재혁입니다.</p>
   </div>
)
```

이런 식으로 한 덩어리로 묶어줘야 합니다.

JSX는 HTML처럼 보이지만 내부적으로는 일반 JavaScript 객체로 변환됩니다.  
함수에서 두 객체를 배열로 래핑 하지 않고는 반환할 수 없습니다.  
그렇기 때문에 한 덩어리로 묶어주지 않고 반환 할 수 없습니다.

#### 2\. 모든 태그 닫기

```html
// HTML
<img
   src="dog.jpg"
   alt="dog"
   class="photo"
>

// JSX
<img
   src="dog.jpg"
   alt="dog"
   className="photo"
/>
```

**HTML에서는 닫지 않았던 태그 또한 JSX에서는 명시적으로 닫아줘야 합니다.**

#### 3\. camelCase

JSX는 JavaScript로 바뀌고 JSX로 작성된 속성은 JavaScript 객체의 키가 됩니다.

종종 이러한 속성을 변수로 읽어 들일 수 있습니다.

그렇기 때문에 **React에서는 많은 HTML 및 SVG 속성이 camelCase로 작성됩니다.**

class => className

background-color => backgroundColor

**※ camelCase란?**

이름을 중간에 대문자로 사용하여 마치 낙타의 등처럼 중간에 큰 게 하나 있다는 뜻

React에서는 많이 사용하기에 알아두면 좋습니다.

* * *

### 중괄호가 있는 JSX

**JSX에서 중괄호를 사용하여 Javascript 창을 열 수 있습니다.**

#### 문자열은 따옴표로 전달합니다.

```html
<img
    className="photo"
    src="http://image.jpg"
    alt="image"
/>
```

**문자열 속성을 JSX에 전달하려면 작은따옴표나 큰 따옴표로 묶습니다.**

src나 alt 같은 텍스트를 동적으로 지정할 때 사용하는 것이 중괄호입니다.

```html
const name = "lim"
return(
   <h1>{name}'s To Do List </h1>
   );
   
// 결과창 : lim's To Do List
```

#### 중괄호를 사용하는 곳

JSX 내에서 중괄호는 두 가지 방법으로만 사용 가능합니다.

1.  **JSX 태그 내부에 직접 텍스트에 사용 가능합니다.**  
    <h1> {name} 's To Do List </h1>  
    **하지만 태그 자체에는 사용 불가능합니다.**  
    <{tag}>lim's To Do List </{tag}>
2.  **태그 속성으로 사용 가능합니다.**  
    src={avatar}  
    \= 바로 뒤에 오는 속성으로 변수를 넣었지만 문자열로 읽습니다.

#### 이중 괄호를 사용하는 곳

JavaScript 에서 객체는 중괄호를 사용하여 표현합니다.  
JSX에 객체를 전달해야 할 때는 객체 자체를 중괄호를 사용하여 한번, 전달할 때 두 번  
총 두 번의 중괄호를 사용하게 됩니다.

```javascript
<ul style={{color : 'red'}}>
   <li></li>
   <li></li>
   <li></li>
</ul>
```

-   대체로 인라인 스타일로 css 적용을 할 때 style을 사용합니다.
-   이때 style에 객체로 전달을 해야 하기 때문에 이중 괄호를 사용합니다.

* * *

#### ※ css 스타일에 관하여 ※

css를 적용하는 것은 크게 2가지가 있습니다.

**1\. 인라인 스타일**

태그 안에 style을 넣어서 직접 넣어주는 것입니다.

```javascript
<div style={{backgroundColor : 'pink',
			color: 'blue'}}>
   <p> hello~ </p>
</div>
```

1.  HTML과 섞여 있기 때문에 적당히 쓰면 모르겠는 데 남발하게 되면 찾기도 힘들뿐더러 보기가 어렵습니다.
2.  인라인 스타일은 최우선으로 작동하기 때문에 인라인 스타일로 덮어쓰게 됩니다.  
    다른 것과 충돌이 날 경우 원하는 결과가 안 나올 수 있습니다.
3.  이런저런 이유로 **인라인 스타일 사용은 권장하지 않습니다.**

**2\. css 클래스를 추가하는 스타일**

태그 안에 className을 사용하여 css 코드를 이용해서 스타일링해주는 것입니다.

```javascript
// js
<div className="cont">
   <p>hello~</p>
</div>

// css
.cont{
   background-color : pink,
    color : blue
}
```

1.  인라인 스타일과 반대로 코드가 훨씬 간결하고 보기 좋아지며 남들이 봤을 때 한눈에 보입니다.
2.  **가장 기본적인 스타일링하는 법입니다.**
3.  단점이라면 리액트의 경우 한 컴포넌트가 css를 import 하고 있다고 해도 스타일의 범위가 한 컴포넌트에 국한하지 않습니다.  
    그리하여 DOM 어딘가에 같은 className 이 있다면 스타일에 영향을 끼치게 됩니다.  
    해결 방안은 블로그 css스타일링 편 참고...

* * *

### 요약

1.  따옴표 안에 JSX 속성은 문자열로 전달이 됩니다.
2.  중괄호를 사용하여 JavaScript 변수, 객체를 전달 가능합니다.
3.  JSX에 객체를 전달할 때는 이중 괄호를 사용합니다.
4.  css스타일링 할 때 인라인 스타일은 가급적 사용하지 않는 것을 권장합니다.
