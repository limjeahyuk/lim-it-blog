---
title: 'React 간단 정리 1'
pubDate: 2022-06-29
category: study/react-notes
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/43
---
곧 있으면 회사 현장실습에 들어가게 됩니다!!  ^ㅁ^

React 공부는 계속해야 하지만 우선 가기 전에 아는 것을 최대한 정리하는 시간이 필요하다고 생각이 들었습니다.

그리하여!!! 교수님께서 추천해주신 React 사이트

[https://beta.reactjs.org/learn/start-a-new-react-project](https://beta.reactjs.org/learn/start-a-new-react-project)

 [Start a New React Project

A JavaScript library for building user interfaces

beta.reactjs.org](https://beta.reactjs.org/learn/start-a-new-react-project)

를 이용하여 빠르게 빠르게 정리해보도록 할게요! ㅎ▽ㅎ

* * *

### **React 시작**

cmd를 통해 Node.js를 설치 해야합니다.

```html
npx create-react-app app_name
```

### **React 구성요소**

컴포넌트는 사용자 UI를 구축하는 기반이 되는 React의 핵심 개념 중 하나입니다.

#### 1 단계. 내보내기

내보내기는 두 가지로 기본 내보내기와 명명된 내보내기가 있습니다.

**기본 내보내기 > export default**

**export default의** 경우 전체 코드를 내보내는 것입니다.

가져올 때는 **import App from './App';**

사용할 때는 **<App />**

**명명된 내보내기 > default function ()**

**default function () {}의** 경우 function 뒤의 함수만 가져옵니다.

가져올 때는 **import {App} from './App';**

사용할 때는 **<App />**

**※ import App from './App.js' = import App from './App' **※****  
   **.js 는 생략 가능합니다.**

#### 2단계. 함수 정의

**fuction App() {}** 이런 식의 javascript 함수를 정의할 수 있습니다.  
**const App = () => {}** 위의 함수와 마찬가지의 화살표 함수를 정의할 수 있습니다.

**☆ 중요한 점 ☆**

**React 구성 요소는 일반 Javascript 함수이지만 이름은 대문자로 시작해야 합니다.**

만약 대문자로 안 하게 되면 html에서 제공하는 태그와 헷갈릴 수 있습니다.

html에서 제공하는 태그는 소문자로 시작합니다. <img />

직접 만든 함수는 대문자로 시작합니다. <Img />

#### 3 단계. 마크업 추가

React는 JSX를 사용하며 HTML을 사용하여 작성하였지만 내부는 전부 Javascript로 이루어져 있습니다.

return () 뒤에는 무조건 한 덩어리만 와야 합니다.

```html
return(
    <li>가</li>
    <li>나</li>
    <li>다</li>
) /* Error */

//////////////////////

return (
    <ul>
    	<li>가</li>
        <li>나</li>
        <li>다</li>
    </ul>
) /* Perfect */
```

### 요약

-   React를 사용하면 앱에 재사용 가능한 UI 요소인 구성요소를 만들 수 있습니다.
-   React 앱에서 UI의 모든 부분은 구성요소입니다.
-   React 구성 요소는 다음을 제외하고 일반 JavaScript 함수입니다.
    -   이름은 항상 대문자로 시작합니다.
    -   JSX 마크업을 반환합니다.
