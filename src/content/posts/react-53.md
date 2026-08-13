---
title: 'React : useReducer와 useState의 차이'
pubDate: 2022-07-29
category: study/react
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/53
---
React를 공부하고 사용하게 되면 가장 먼저 알게 되고 접하는 것이 useState일 것입니다.

useState를 이용하여 상태를 변경하기도 하고 값을 저장하기도 하죠.

그런데 사용하다보면 한 js 파일에 state를 무진장 많이 사용하고 state 들끼리 엄청 얽히고 얽힌 적도 있을 것 같습니다.

그럴 때 사용하는 것이 useReducer입니다.

* * *

#### **useState**

useState는 개별 state를 다루기에 적합하며 간단한 state에 적합합니다.

또한 state 업데이트가 쉬우고 state 변경되는 경우가 다양하지 않다면 useState는 정말 좋은 방법입니다.

* * *

#### **useReducer**

useState를 사용하면 너무 번거로운 경우.  
너무 많은 일들을 처리해야하며 관련 state 들이 서로 독립적이고 같이 업데이트가 잘 안될 때 사용하면 좋습니다.

기본적으로 useReducer가 더 강력합니다.  
강력하다는 것은 복잡한 state 업데이트 로직을 포함하는 reducer함수를 사용 가능하다는 것입니다.

* * *

#### **총평**

사실 프로그램이라는 것이 정답은 없습니다. 솔직히 코드를 작성해서 잘 돌아가기만 하면 된다고 생각하기에...  
useReducer를 쓰는 것이 좋아보이는 경우도 usestate로 충분히 가능하고  
useState를 사용하는 것이 좋아보이는 경우도 useReducer로 충분히 가능합니다.

그냥 좀 더 나아보이는 것을 사용하는 것이 맞습니다.

그럼 useReducer 사용법 가시죠

* * *

#### **useReducer 사용.**

useReducer는 회원가입 창 이나 로그인 창 같은 유효성 검사 하는 곳에서도 사용할 수 있습니다.

로그인 페이지에서 시작해보도록 하겠습니다.

![](/images/react-53/1.png)

email에는 @이가 들어가야하고 password는 6글자 이상이어야 합니다.

```javascript
const Login = (props) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
```

고작(?) input 두개 밖에 없는 데 state는 5개나 있습니다. 심지어 email , password 부분은 각각 두개씩 있습니다.

뭔가 많다고 느껴서 reducer를 사용하기로 했습니다.

Reducer는 기본적으로 함수가 필요합니다.

```javascript
const [emailState, dispatchEmail] = useReducer ( () => {} , {})
```

useState와 마찬가지로  
**const \[state(저장값) , dispatch(변경)\] = useReducer (Reducer함수 , 기본값)  
**으로 기본 틀입니다.

대체로 함수를 안에다가 한번에 써버리면 너무 보기도 힘들기에 따로 빼놓습니다.

```javascript
const emailReducer = (state, action) => {
return {}
}
```

reducer 함수 기본 틀입니다.

**state는 저장되어있는 값. action은 위에 dispatch를 사용하여 변경되는 값을 뜻합니다.**

**reducer 함수는 무조건 useReducer를 이용해서 얻은 값으로만 작동하기에**   
**컴포넌트 함수 바깥에 만들었습니다.**

안에 살을 좀 붙혀봐야 알겠네요.

* * *

```javascript
// email 쪽 reducer

//Reducer 함수
const emailReducer = (state, action) => { 
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {

//useReducer
 const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });
  
  // email input창 값 변경
   const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };
  
  // email 유효성 검사
    const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'})
  };

//email input
return (
<label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
)
  
  
  }
```

-   useReducer에 reducer 함수와 기본값을 지정해줬습니다. > value : '' , isValid : null
-   reducer 함수가 실행될 때 값이 변하도록 지정해줬습니다 > value: '', isValid: false
-   email input에 값을 넣게 되면 type : 'USER\_INPUT' 과 함께 reducer 함수에 값을 보냅니다.
-   reducer함수에서는 USER\_INPUT에서 걸리며 action.val을 value에 넣어주는 작업과  
    action.val의 유효성 검사를 진행하여 isValid를 변경하는 작업을 합니다.
-   input창에 변화가 있을 때마다 validateEmailHandler에서는 type:'INPUT\_BLUR'를 함수로 보냅니다.  
    action으로 보내는 값은 없기에 함수에서는 전의 값을 유효성 검사하는 작업을 합니다.
-   이런식으로 작동되는 useReducer였습니다. 비밀번호 또한 마찬가지입니다.

* * *

이해하기도 어렵고 쓰는 것도 쉽지 않아 보이지만... 자주 쓰다보면 좋아지겠죠? ㅎㅎ  
  

전체 코드 올릴께요

```javascript
import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = (state, action) => { 
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
}

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  // const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  });

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  const { isValid: emailIsValid} = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
```

-   여기서 추가로 useEffect 쪽에 const 로 디스트럭쳐링을 이용하여 다른 이름으로 변경해주는 부분이있습니다.  
    const { isValid: emailsValid } = emailState;
-   useEffect가 이전에는 input에 값을 넣기만 하면 작동했었습니다.  
    그러다보니 너무 잦은 호출이 맘에 안들었습니다.
-   만약 isValid가 변경 될때만 호출 한다면?  
    호출의 수는 반토막보다 더 낮아지지만 정확도는 딱히 다르지 않을 것 같습니다.
-   그렇기에 저렇게 디스트럭쳐링을 사용하여 isValid를 다른 이름으로 지정해준 뒤 useEffect에 넣어줬습니다.
