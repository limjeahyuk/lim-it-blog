---
title: '[ J ] css 모듈'
pubDate: 2022-06-08
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/39
---
### **\- css 모듈**

className을 겹치지 않게 하는 방법으로   
**1\. 인라인 스타일**  
**2\. styled component**  
두 가지를 알아봤습니다. 

이번에 알아볼 것은 css 모듈입니다.

![](/images/react-39/1.png)

위의 코드처럼 styled component는 정말 괜찮은 방법이지만  
**javascript 안에서 css를 건드려야 한다는 점과 솔직히 코드가 지저분하다는 느낌이 있습니다.**

* * *

css 모듈을 사용할 때 우선 css 파일의 이름을 변경해줍니다.

![](/images/react-39/2.png)

Button.css -> Button.module.css

css모듈이 작동하도록 코드를 변환하라고 컴파일 프로세스에게 신호를 보내야 합니다.  
그 신호가 css 파일 이름 변경입니다.

그 후 css 파일을 적용할 js에  
import styles from './Button.module.css';  
을 import 해줍니다.

마치 js 파일 import 하는 것처럼 styles라는 이름을 지정해주고 import 해줍니다.

그 후 className 부분에 styles.button 이라고 넣어줍니다.

![](/images/react-39/3.png)

이렇게 넣어주기만 한다면 끝입니다.  
전에 했던 방법들보다 비교적 쉽고 간편합니다.  
확인 한 번 해주면..

![](/images/react-39/4.png)

className이 바뀌어져 있습니다.  
이것은 " 컴포넌트 이름\_클래스 이름\_\_고유한 해시값 " 구성되어 있습니다.

* * *

### **\- css 모듈 정리**

css 모듈은 **css 클래스나 css 파일을 가지고 클래스 이름을 고유하게 바꾸는 것입니다.**

모든 컴포넌트에 대해, 임포트하고 있는 모든 클래스 이름을 바꿉니다.  
그렇게 임포트 하고 있는 모든 css 파일을 고유하게 만듭니다.

css 모듈 주의할 점은  
**브라우저에서 코드가 실행되기 전에 코드의 변환이 필요하기 때문에 기능을 지원하는 프로젝트에서만 사용이 가능합니다.**  
우리가 사용하는 리액트 프로젝트는 다행히 css 모듈을 지원하기 때문에 사용이 가능합니다.
