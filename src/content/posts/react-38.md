---
title: '[ I ] Css 스타일링'
pubDate: 2022-06-03
category: study/react
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/38
---
### **\- inline 스타일**

![](/images/react-38/1.png)

입력창을 빈칸으로 두고 버튼을 눌렀을 때 Course Goal이라는 title의 색상을 변경시키고 싶습니다.  
css를 건드리는 가장 기본적인 방법으로는 inline 스타일이 있습니다.

**인라인 스타일**이란

![](/images/react-38/2.png)

이처럼 style = {{ 이 안에 스타일을 지정해주는 것입니다. }}

state를 이용하여 입력칸이 빈칸이면 color를 red 지정해주겠습니다.

![](/images/react-38/3.png)

isValid를 useState를 통해 boolean 상태를 가지도록 합니다.  
그렇게 버튼을 눌렀을 때 입력창에 값이 없으면 false를 지정해줍니다.

![](/images/react-38/4.png)

style 안에 삼항 연산자를 이용해서 isValid가 false 이면 red / true 라면 black을 지정해줬습니다.

### **인라인 스타일은** 

1.  HTML과 섞여 있어서 인라인 스타일을 남발하게 되면 찾기도 힘들고 보기도 어렵습니다.
2.  인라인 스타일이 최우선으로 작동하기 때문에 인라인스타일로 덮어쓰게 됩니다.  
    그렇게 해서 첫 렌더링 될 때 입력칸이 비워져 있다면 red로 덮어쓰게 됩니다.
3.  이런저런 이유로 가급적 사용을 자제하는 것이 좋습니다.

* * *

### **\- css 클래스 추가하는 스타일**

![](/images/react-38/5.png)

css 파일에 이런 식으로 추가하게 되면  
원래 있던 form-control에 추가로 invalid가 있어야만 적용이 되게 됩니다.

이제 inValid가 false 일 때 invalid 클래스를 추가해줘야 합니다.

![](/images/react-38/6.png)

처음 보는 것이 보입니다.

**템플릿 리터널** 이라는 키보드 tab 위에 있는 \`\` 을 사용했습니다.  
템플릿 리터널 (\`\`)을 사용하게 되면 문자열에 동적인 값을 주입할 수 있어집니다.  
$ 표시 다음에 {  }를 추가하고 사이에 콘텐츠를 넣습니다.

코드를 해석해보면  
\`form-control ${!isValid ? 'invalid' : ' ' } \`  
isValid가 false 이면 invalid / true 이면 공백을 추가합니다.

false 이면 className = "form-control invalid" 가 되고  
true 이면 className = "form-control"가 됩니다.

이제 아까 만든 css가 원하는 데로 적용 되게 됩니다.

이 방법이 inline 스타일보다 훨씬 깔끔하면서 강제로 덮어쓰이지 않기 때문에 불안정하지도 않습니다.

* * *

### **\- 문제점**

리액트는 한 컴포넌트가 css를 import 하고 있다고 해도 스타일의 범위를 한 컴포넌트에만 국한하지 않습니다.  
그 말은 DOM 어딘가에서 같은 클래스가 있다면 스타일은 영향을 끼친다는 것입니다.

혼자서만 하는 프로젝트라면 혼자만 조심하면 되기 때문에 그리 큰 문제는 아니겠지만...  
대규모 프로젝트의 경우 많은 개발자들이 같은 코드에서 작업을 하고 있습니다.  
그렇기에 같은 클래스 이름이 다른 위치에서 사용될 때 영향을 미칠 수 있습니다.  
그런 상황을 피하기 위해서 여러 방법이 있습니다.

* * *

### **\- styled components**

styled components 패키지를 사용하면 손쉽게 클래스 중복 문제를 해결할 수 있습니다.

 [styled-components

Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress 💅🏾

styled-components.com](https://styled-components.com/)

styled - components를 사용하게 되면 특정 스타일이 첨부된 컴포넌트를 구축할 수 있게 됩니다.  
이 스타일이 첨부되는 컴포넌트에만 영향을 미치고 다른 컴포넌트에는 전혀 영향을 미치지 않습니다.

![](/images/react-38/7.png)

위 코드를 보면 예전에 props 게시물에서 했던 props.children과 같은 코드입니다.  
button이라는 태그로 만들어서 button 클래스를 추가해주는 방식이었습니다.

위 코드 또한 button이라는 class를 다른 곳에서 사용하게 되면?  
코드가 좀 꼬일 것입니다. 그렇기에 button 컴포넌트에서만 css를 적용시키고 싶습니다.

import styled from 'styled-components'; 를 해준 후

![](/images/react-38/8.png)

styled.button\`\`를 사용했습니다.  
이것을 **Tagged Template Literals라고** 합니다.

styled-components를 설치해서 사용할 수 있는 구문이 아닌 자바스크립트 기본 기능입니다.

백 틱 ( \`\` ) 사이에 전달하는 내용이 Button 메소드로 가게 됩니다.  
추가로 반환되는 Button은 모든 props를 적용합니다.

내용을 보면 css 이긴 한데 뭔가 이상합니다.  
ClassName 이 빠져있습니다. 그나마 있어야 할 구간에는 & 이 차지하고 있습니다.

styled-component를 사용하는 이유가 className을 다른 곳에서 사용 못하게 하는 것이기 때문에  
사용하는 건 앞뒤가 맞지 않습니다. 그렇기에 저런 식으로 사용하게 됩니다.

![](/images/react-38/9.png)

실행하면 전과 그대로 나오게 됩니다.  
버튼을 검사해보면 해괴망측한 class가 들어가 있습니다.  
이것이 styled-component를 사용함으로써 다른 곳에서 class 중복을 피하는 방법입니다.
