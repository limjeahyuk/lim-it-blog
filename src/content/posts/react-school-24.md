---
title: '[React] 컴포넌트 이론'
pubDate: 2022-04-07
category: study/react-school
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/24
---
### **컴포넌트 개념**

웹 사이트 화면은 각 요소가 비슷하고 반복적으로 사용하는 경우가 많습니다.  
이 점을 착안하여 컴포넌트가 등장.

![](/images/react-school-24/1.png)

위 그림 처럼 큰 네모틀 안에 영상들이 여러가지가있음.  
영상들이 컴포넌트.

기존의 웹 프레임워크에서 사용하는 MVC 방식의 뷰를 독립적으로 구성하여 재사용 할 수 있고  
컴포넌트를 통해 새로운 컴포넌트를 만들 수 있다.

큰 틀 안에 작은 컴포넌트들이 많다. 틀을 만든다고 생각하면 될 듯..?

컴포넌트의 첫 글짜는 반드시 대문자여야 합니다.  
WHY? 기존의 HTML 마크업과 구분하기 위해

* * *

### **컴포넌트 추가하는 방식**

![](/images/react-school-24/2.png)

컴포넌트

위 처럼 About로 export 한다. > 컴포넌트

![](/images/react-school-24/3.png)

컴포넌트 추가

  
import About from About 경로   
{About}  > 추가하는 방식

* * *

### **컴포넌트 구성요소**

-   프로퍼티 : 사위 컴포넌트에서 하위 컴포넌트로 전달되는 읽기 전용 데이터
-   state : 컴포넌트의 상태를 저장하고 변경할 수 있는 데이터
-   컴텍스트 : 부모 컴포넌트에서 생성하여 모든 자식 컴포넌트에 전달하는 데이터.

* * *

### **프로퍼티**

```html
import React from 'react';
import PropsTypes from 'prop-types';

class Ccomponent extends React.Component {
  render() {
    const { bool, num, array, obj, node, func } = this.props;

    return (
      <div>
        <span>불리언값:{bool}</span>
        <span>숫자값:{num}</span>
        <span>배열값:{array}</span>
        <span>객체값:{String(obj)}</span>
        <span>노드값:{node}</span>
        <span>함수값:{String(func)}</span>
      </div>
    );
  }
}

Ccomponent.propTypes = {
  bool: PropsTypes.bool,
  num: PropsTypes.number,
  array: PropsTypes.arrayOf(PropsTypes.number),
  obj: PropsTypes.object,
  node: PropsTypes.node,
  func: PropsTypes.func,
};

export default Ccomponent;
```

-   자바스크립트의 자료형을 모두 사용 가능.  
    프로퍼티의 자료형은 prop-types를 이용하여 선언합니다.
-   프로퍼티에 문자열은 "큰따음표"를 사용하며  
    숫자형이나 불리언 값을 전달할때는 {중괄호}를 사용합니다.

* * *

### **불리언 프로퍼티**

```html
<Ccomponent bool />
<Ccomponent />
```

-   불리언 값은 true와 false로 나뉘어진다.  
    true는 프로퍼티의 이름만 선언해도 전달 가능하다.  
    반대로 false는 생략하면 전달 가능하다.

* * *

### **필수 프로퍼티**

```html
  //필수 프로퍼티
  requiredStringValue: PropTypes.string.isRequired,
```

-   isRequired를 이용하면 프로퍼티가 필수가 된다.
-   requiredStringValue를 비어두면 console창에 경고 메세지가 뜨게 된다.
-   특정 컴포넌트에 꼭 전달되어야하는 프로퍼티를 설정해줘야함.

* * *

### **기본값 프로퍼티**

```html
//기본값을 선언하는 예제
DefaultPropsComponent.defaultProps = {
  bool: false,
};
```

-   defaultProps를 이용하여 기본값을 설정해줄 수 있다.
-   코드를 보면 DefaultPropsComponent 의 기본값을 false로 설정해줬다.

* * *

**위 프로퍼티들은 모두 불변하는 프로퍼티들이다.  
이러한 속성들로만 페이지를 구성하게 되면 페이지가 유동적이지 않고 재미가 없어진다.  
그러한 문제를 해결하기 위해 state를 사용한다.**
