---
title: '간단한 정리 and 막무가내 2'
pubDate: 2026-01-05
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/111
---
### useState

React에서 값을 변수에 저장하는 방법으로는 useState도 있습니다.

> let \[a, b\] = useState('남자 코트 추천');  
>   
> <h4>{a}</h4> // 남자 코트 추천

이런 식으로 사용할 수 있습니다.

그런데 그냥 let post = '강북 돈가스 맛집' 이렇게 저장하면 되는 걸 뭐 저리 어렵게 하나요?

그리고 변수 설정을 왜 저렇게 하나요?

이거에 대한 설명을 위해서는 구조 분해 (Destructuring) 문법을 알아야합니다.

#### Destructuring 

> let num = \[0, 1\]  
>   
> let a = num\[0\] // 0  
> let b = num\[1\] // 1

이런식으로 배열에 있는 값을 저장할 때 이렇게 쓰는게 기본일 것 입니다.

그런데 아래와 같이 편리하게 사용도 가능합니다.

> let \[a, b\] = \[0, 1\]

이게 구조 분해 문법입니다.

이렇게 보니까 useState와 생김새가 비슷한걸요?

> let \[a, b\] = \[0, 1\]  
> let \[a, b\] = useState('남자 코트 추천')

useState는 구조 분해 문법으로써 useState는 까보면 내부에는 \[변수, 함수\] 이렇게 저장이 되어있습니다.

그러니까 풀어서 작성을 해보면

> let \[a, b\] = \['남자 코트 추천', 함수\]

이런식이 되는 것입니다.

그러면 여기에 함수는 뭐에요??

-   a = state에 저장한 자료
-   b = state 변경을 도와주는 함수.

#### state를 사용해야하는 이유.

일반 변수는 사용 중간에 변경이 되면 html에 자동으로 반영이 안됩니다.

만약 변경되면 따로 작업을 해줘야하는 반면, state는 갑자기 변경이 되면 html은 자동으로 재렌더링 됩니다.

그렇기 때문에 자주 변경되는 변수를 state로 처리를 하는게 가장 이상적입니다.

자주 변경 되지 않는 것 까지도 state로 처리할 필요는 없습니다.

* * *

### state 변경 방법

state를 변경할 때는 그냥 변수를 변경하는 것처럼 사용을 하면 안됩니다.

지정해둔 setLike를 사용하여 변경을 해줘야 html이 렌더링 됩니다.

**state 변경함수 (새로운 state)**

```javascript
let [like, setLike] = useState(0)

<span onClick={() => { setLike(like++) }}>👍</span>
```

이렇게 사용을 하면 됩니다.

#### array / object 변경.

> let \[blogTitle, setBlogTitle\] = useState(\['돈가스 맛집', '햄버거 맛집','피자 맛집'\])

만약 blogTitle의 첫번째만 값을 변경해야할 때는 어떻게 해야할까요?

우선 첫번째 간단하게 생각하면

> setBlogTitle(blogTitle\[0\] = '냉면 맛집')

이렇게 쓸 수 있을 것입니다.

그런데 아무리 실행해봐도 html이 변경되지 않습니다.

그리고 array를 직접적으로 변경하는 것은 엄청 위험합니다.

그러면... copy 본을 따서 만드는 것은 어떨까?

> let copy = blogTitle;  
> copy\[0\] = '냉면맛집';  
> setBlogTitle(copy);

역시나 이래도 되지 않습니다.

이유를 알기 위해서는 state 변경함수 특징을 알 필요가 있습니다.

먼저 정답부터 말하면 아래 처럼 써야합니다.

> let copy = \[...blogTitle\];  
> copy\[0\] = '냉면맛집'  
> setBlogTitle(copy)

### state 변경함수 특징.

state 변경함수는 변경하기 전에 기존 state == 신규 state를 확인 해보고 같으면 변경을 하지 않습니다.

이말인 즉슨, html 렌더링을 하지 않는 다는 뜻입니다.

값이 같은 데 굳이 또 렌더링 할 필요가 없기 때문입니다. ( 에너지 절약 )

그런데 저희는 분명 값을 변경했는데요?

**copy\[0\] ='냉면맛집'**

이 부분은 js가 array와 object를 저장하는 특징을 알아야합니다.

array 와 object를 참조타입이라고 합니다. js에는 array나 object를 변수에 저장할 때 값 자체를 저장하는 것이 아니라

Ram에 저장 후 그 주소를 저장을 합니다.

그러니까 blogTitle을 까보면 뭐 \['돈가스', '햄버거', '피자'\] 가 들어있는게 아니라

\['돈가스', '햄버거', '피자'\]가 저장되어 있는 주소가 들어있는 것입니다.

주소로 가서 돈가스를 냉면으로 바꾼다고 한 들 주소는 동일 하기 때문에 js에서는 값이 변경 되지 않았다고 판단하게 됩니다.

copy로 복사 하는것도 동일합니다.

copy로 복사하면 주소를 복사하기 때문에 변경한다 한들 전혀 달라지지 않습니다.

```javascript
let copy = blogTitle;
copy[0] = '여자 코트 추천'
console.log(copy == blogTitle)
setBlogTitle(copy)
```

이렇게 하면 console에 true로 나오는 것을 볼 수 있습니다.

이런 동작 원리를 알았으니까 \[...blogTitle\] 이건 뭐죠?

> 문서에 의하면 '비구조화 할당(destructuring assignment) 구문은 배열이나 객체의 속성을 해체하여  
> 그 값을 개별 변수에 담을 수 있게 하는 자바스크립트 표현식(expression)'입니다.

그렇다고 하는 데 그냥 간단하게 \[ \] 벗기고 다시 넣어주세요. 개별적으로 저장하여 다른 주소가 저장되게 됩니다.

그러므로 js가 어라? 다른 값이네 하고 판단하여 html이 재렌더링 되는 것입니다.
