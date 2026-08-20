---
title: '[ A ] React 가장 기초'
slug: react-29
pubDate: 2022-04-17
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/29
---
### **\- 변수 선언**

javascript 에서는 var을 가장 많이 사용.

하지만 react는 **let** 과 **const**를 사용할 예정.

let은 가변한 변수를 만들 때 사용.

const는 처음 할당한 후 다시는 값을 수정하지 않을 때 사용합니다.  
상수값을 만들 때 사용합니다.  
당연한 말이지만 const는 새 값을 재할당 할 수 없습니다.

![](/images/react-29/1.png)

우리는 const를 가장 많이 보게 될 것입니다.

* * *

### **\- 화살표 함수**

화살표 함수란 기본적으로 생성자 함수.  
javascript 함수를 생성하는 또 다른 구문입니다.

javascript에서 가장 기본 적인 함수인 **function myFnc(){ ... }**  
자바스크립트를 공부했다면 정말 많이 봤을 함수입니다.

화살표 함수는 **const myFnc = () => {...}**

javascript의 함수와 같지만 function을 사용하지 않기 때문에 더욱 간결하게 사용 가능합니다.  
또한 javascript에서는 this를 사용하면 원하는 것이 지목 안되는 경우가 많았는 데 그 문제점을 해결해주는 함수입니다.

![](/images/react-29/2.png)

위 두개의 코드는 같은 코드이지만 쓰는 방식이 다릅니다.

* * *

화살표 함수를 사용할 때 꿀팁 ( ? )

1\. **전달인수가 딱 1개인 경우에는** 

![](/images/react-29/3.png)

이런 식으로 인자 안에 있는 ( 괄호 ) 를 뺄 수 있습니다.

2\. **전달인수가 없는 함수라면**

![](/images/react-29/4.png)

무조건 빈 괄호를 넣어줘야합니다. 당연히 함수를 실행 할 때도 빈 괄호를 사용해줘야 합니다.

3\. **전달 인수가 1개 이상이라면**

![](/images/react-29/5.png)

무조건 괄호가 필요하며 , 를 사용해줍니다.

4. **return 값 생략**

많은 함수들이 return을 이용하여 무언가를 반환합니다.  
화살표 함수도 함수의 일종이기에 return을 사용 가능합니다.

![](/images/react-29/6.png)

이런식의 함수를 

![](/images/react-29/7.png)

매우 간결하게 생략이 가능합니다.

* * *

### **\- export & import**

리액트를 하면 파일을 여러개로 만들게 될 것이며 그것이 코드를 읽는 데 편합니다.  
코드를 여러 파일로 나누고 html 파일에 올바른 순서로 가져오기만 하면 되는 데  
문장을 내보는 내는 것을 export / 가져오는 것을 import 라고 합니다.

**export 할 때**

![](/images/react-29/8.png)

**import 할 때**

![](/images/react-29/9.png)

default 키워드는 파일에 어떤 것을 가져오면 항상 default export 가 내보낸 것을 기본으로 가져온다는 뜻입니다.  
그렇기에 import 할 때 경로만 잘 지정해주면 어떤 이름으로 import 하더라도 같은 코드가 export 됩니다.

반면 상수를 불러올 때는 파일에서 특정한 어떤 것을 정확하게 가리켜야합니다.  
우리가 어떤 것을 가리키는 지 알려줘야하기에 정확히 이름을 불러줍니다.  
그렇기 때문에 import 해줄 때  { 중괄호 }를 이용하여 { 중괄호 } 안에 이름을 넣어서 import 해줍니다.  
이것을 name export라고 부릅니다.

위에서는 따로 썼지만..  
**import { names, Data } ...** 이런 식으로 한줄로 사용도 가능합니다.

만약 정해진 이름으로 부르기 싫다하면 별명을 지어주면 됩니다.  
**import { Data as D } from ...**  
as를 이용하여 별명을 지어주고 사용은 D로 하면 됩니다.

파일 안에 export 하고 있는 모든 것을 가져올 때는 \*을 사용하면 됩니다.  
**import \* as all from ...**  
하게 되면 all.Data / all.names 이런식으로 사용하면 됩니다.
