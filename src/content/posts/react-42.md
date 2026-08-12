---
title: '[ M ] 사이드이펙트 / useEffect'
pubDate: 2022-06-21
category: study/react
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/42
---
### **\- 사이드 이펙트**

이펙트 = 사이드 이펙트

**사이드 이펙트란 애플리케이션에서 일어나는 다른 모든 것을 뜻합니다.**

리액트 앱의 주요 임무는 ui를 렌더링 하는 것입니다.

사용자 입력에 반응하여 필요할 때 ui를 다시 렌더링 하는 것,  
state나 이벤트들의 주요 임무 또한 화면에 무언가를 가져오는 것.  
이제까지 만들었던 컴포넌트 모두 화면에 무언가를 가져오기 위한 함수였습니다.

사이드 이펙트는 이것들과 반대로 화면에 무언가를 가져오는 것과 관련없는 부수적인 것들입니다.

대표적인 예로는 http 리퀘스트를 보내는 것. 저장소에 데이터를 저장하는 것. 이 있습니다.

프로젝트를 하게 되면 back에 http 리퀘스트를 보내야합니다,  
물론 http 리퀘스트를 통해 데이터를 받아와서 화면을 변하게 할 수 있지만..  
http 리퀘스트 자체는 화면에 전혀 변화를 주지 않습니다.

**일반적인 컴포넌트 밖에서 일어나야하는 일을 말합니다.**

* * *

### **\- useEffect**

만약 http 리퀘스트를 직접 보낸다고 한다면 렌더링 될 때마다 리퀘스트를 보내게 됩니다.  
렌더링은 기본적으로 state나 컴포넌트가 변경될 때마다 렌더링 됩니다.  
state가 변경되고 리퀘스트를 보내면  
또 state가 변경되고 리퀘스트를 보내고  
또 변경되고....  
**무한루프에 돌게 될 확률이 매우 높아집니다.**

무한 루프에 빠지지 않게 하기 위해서 useEffect를 사용합니다.

useEffect 훅은 두개의 매개변수, 두개의 인수와 함께 호출됩니다.

![](/images/react-42/1.png)

**첫번째 인수는 익명의 화살표 함수로써 모든 컴포넌트 평가 후 실행되어야 합니다.**  
**두번째 인수로는 의존성을 넣어줍니다.**  
배열 안에 의존성이 변경될 때만 첫번째 인수인 함수가 실행됩니다.

* * *

### **\- localStorage**

브라우저에서 우리가 사용할 수 있는 저장소가 여러개가 있습니다.  
그 중 대표적인 두가지가 쿠키 와 localStorage 입니다.

localStorage는 매우 간단하게 사용 가능합니다.

localStorage.setItem('isLoggedIn', '1');

localStorage에 값을 넣고 싶을 때는 setItem을 해주고 문자열 두개를 넣어주면 됩니다.  
첫번째는 저장소 키값, 두번째는 값.  
저장하게 되면..

![](/images/react-42/2.png)

이런식으로 저장소에 들어가게 됩니다.

이것을 이용하여 로그인을 구현 해보도록 하겠습니다.

* * *

### **\- Effect 사용 예시**

![](/images/react-42/3.png)

이런 매우 간단한 로그인 창이 있습니다.  
로그인을 하게 되면

![](/images/react-42/4.png)

Welcome back! 이라는 문구가 나타납니다.  
현재는 새로고침 한 번 하는 순간 다시 로그인 창이 나타납니다.

우리는 오른쪽 상단 Logout을 누르지 않는 한 계속 Welcome back 을 보이게 하고 싶습니다.

![](/images/react-42/5.png)

login 하게 되면 localStorage에 isLoggedIn이라는 key값으로 1을 넣어줬습니다.

그 후 렌더링 될 때마다 isLoggedIn의 값이 1이면 IsLoggedIn을 계속해서 true로 만들어 주면 됩니다.

![](/images/react-42/6.png)

-   localStorage에 isLoggedIn의 값을 가지고 와서 storedUserLoggedInInformation에 저장했습니다.
-   storedUserLoggedInInformation의 값이 1이면 IsLoggedIn을 true로 해줬습니다.

결과는 Error가 뜨게 됩니다.

![](/images/react-42/7.png)

Too many re-renders. 렌더링이 너무 많이 일어났다. > 무한루프라는 말입니다.

Information의 값이 1일 때 setIsLoggedIn을 true로 변경했습니다.  
state가 변경되었으니 화면이 렌더링이 되었고  
렌더링 되었으니 또 Information의 값을 확인 하고 true로 변경하고..  
또 렌더링 되고... 이런식으로 무한루프에 빠지게 되었습니다.

위에서 말한 것 처럼 **렌더링 될 때마다 사이드이펙트를 하게 되면 무한루프에 빠질 확률이 높아집니다.**

![](/images/react-42/8.png)

useEffect를 사용했습니다.

**useEffect는 의존성이 변경된 경우에만 실행됩니다.**  
**모든 컴포넌트가 평가 후 실행됩니다. 그 후로는 의존성이 변하고 나서 실행됩니다.**  
**이말은 즉슨 앱이 처음 시작되었을 때는 한번 실행됩니다.**

우리는 의존성에 아무것도 넣지 않았기 때문에  
앱이 처음 시작되었을 때 한번 실행되고 그 이후로는 실행되지 않습니다.

![](/images/react-42/9.png)

logout을 눌렀을 때 localStorage에 isLoggedIn의 값을 제거해줬습니다.  
이렇게 로그인 구현이 완료되었습니다.

* * *

### **\- Clean up**

만약 컴포넌트가 마운트 해제될 때 / update 직전에 어떠한 작업을 수행하고 싶다면  
clean up 함수를 사용하면 됩니다.

![](/images/react-42/10.png)

-   enteredEmail / enteredPassword 라는 state가 변경 될때마다 실행되는 사이드이펙트입니다.
-   effect가 실행될 때 0.5초마다 유효성 검사를 합니다.

우리는 위 코드에 더해서 사용자가 입력하고 잠깐 멈추면 그때 유효성 검사를 하고 싶습니다.  
현재 코드는 모든 키가 눌릴 때마다 0.5초가 기다려집니다.

![](/images/react-42/11.png)

-   **useEffect 안에 return () => {} 를 사용해주면 clean up 함수가 실행됩니다.**
-   키를 누를 때마다 console에는 clean이 찍히게 되며 마지막 잠깐 멈추면 dd가 찍히게 됩니다.

![](/images/react-42/12.png)

useEffect의 순서로는 

#### **Render > Clean up > Effect**

가 되게 됩니다.

* * *

### **\- useEffect  요약**

**useEffect 는 useState 와 마찬가지로 가장 중요한 리액트 훅입니다.**

![](/images/react-42/13.png)

-   두번째 인수인 의존성이 없기 때문에 앱이 처음 실행될 때 딱 한번 실행됩니다.

![](/images/react-42/14.png)

-   의존성이 state 이므로 state가 변경 될 때 마다 실행됩니다.

![](/images/react-42/15.png)

-   state와 count 가 변경 될 때마다 실행됩니다.

![](/images/react-42/16.png)

-   state와 count가 변경될 때마다 실행됩니다.
-   clean up 이 먼저 그 다음 Effect가 console에 찍히게 됩니다.
