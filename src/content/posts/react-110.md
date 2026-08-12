---
title: '간단한 정리 1'
pubDate: 2026-01-04
category: study/react
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/110
---
React를 다시 시작하는 김에 처음부터 다시 시작해보기.

코딩애플님의 유튜브를 보고 따라해보려고 합니다.

* * *

### React가 좋은 이유

1\. Single Page Application ( SPA )를 만들 수 있습니다

\-> 페이지 전환을 부드럽게 처리해주는 사이트

2\. 컴포넌트 기능으로 html 재사용이 편리합니다.

3\. 데이터가 html에 자동으로 반영됩니다.

React는 html + css + js를 편리하게 도와주는 **도구** 일 뿐입니다.

어디 가서 React는 잘 하는데 html이랑 js는 몰라요 이러면 안돼요..

React를 하기 위해서는 html + css + js 모두 알아야하는 것입니다.

* * *

#### 처음 시작할때 CRA.

CRA는 2025년 2월에 지원이 종료 되었기 때문에 ([지원 종료된 이유는 여기로](https://hyuk-todayfeelsogood.tistory.com/109))

> ❯ npm create vite@latest codingapple react

위 명령어를 사용하여 프로젝트를 생성했습니다.

* * *

#### App.jsx

```javascript
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let post = '강북 돈가스 맛집';

  return (
    <div className='App'>
      <div className='black-nav'>
        <h4 style={{color: 'red', fontSize: '16px'}}>블로그임</h4>
      </div>
      <h4>{post}</h4>
    </div>
  )
}

export default App
```

알아야 하는 점.

**1\. 현재 작성중인 문서는 html코드를 사용 중이지만 js라는 것.**

리액트에서 div를 만드는 방법은 아래와 같습니다.

> React.createElement(‘div’, null, ‘hello world’)

그런데 이렇게 하나하나 사용하면 너무 복잡하기 때문에 jsx라는 문법을 이용하여

js에서도 <div> </div>를 사용할 수 있게 해줬습니다.

그렇기에 <div>를 사용하니까 html 이라고 생각하면 안됩니다.

현재 작성중인 건 엄연히 js 파일입니다.

**2\. className을 사용하는 이유.**

html에서는 class로 작성을 했었는 데... 왜 className?

역시나 1번과 같은 맥락으로 class는 js에서 class를 만들어 달라는 다른 문법입니다.

혼동이 없기 위해서 className으로 작성을 해줘야합니다.

**3\. 데이터바인딩 = {}**

데이터를 html에 쉽게 넣기 위해서 사용을 해야하는 것이 데이터 바인딩입니다.

원래 html에서 데이터를 넣기 위해서는 아래와 같이 표현 해야합니다.

> document.querySelector('h4').innerHTML = post

하지만 이렇게 하면 너무 길고 복잡하니까 jsx에서는 {}를 이용하여 쉽게 바인딩이 가능합니다.

**4\. style = {{스타일명:'값'}}**

css에서 작성하기 싫고 한번에 다 하고 싶다 하면 style을 사용하면 됩니다.

이때 font-size와 같은 것은 fontSize로 변환을 해야합니다. (카멜케이스)

이유는 1번과 동일하게 - 기호는 js에서 뺄셈입니다.

혼동이 없기 위함입니다.
