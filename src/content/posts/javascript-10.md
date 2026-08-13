---
title: '[MusicTree] register & login 부분'
pubDate: 2022-03-16
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/10
---
## **\- Html -**

```html
<button type="button" class="registerBtn" onclick="chkForm()">회원가입</button>
```

-   클릭 시 chkForm() 함수 실행.

* * *

## **\- JavaScript -** 

```html
//이메일 입력여부
$("#useremail").keyup(function(){					
	var pattern = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
	var email = $("#useremail").val();
    
	/* 
	!pattern.test(email) => pattern.test(email) == false
	pattern.test(email) => pattern.test(email) == true 
	*/
					
	//console.log(pattern.test(email));
	if(email == "" || !pattern.test(email)){
		$("#useremail").css("border-color","#ff4d78");
		$(".emailerr").show();
	}else{
		$("#useremail").css("border-color","#dddddd");
		$(".emailerr").hide();
	}
```

-   pattern : 'A-Za-z0-9'@'A-Za-z0-9'.'A-Za-z0-9'로 지정.
-   false는! 를 붙여줌으로써 부정을 나타냄
-   email이 비어있거나 pattern처럼 되어있지 않다면 테두리가 #ff4d78 색상으로 변경되고 emailerr가 보임.
-   email이 잘 맞춰져 있다면 테두리가 #dddddd 색상으로 변경되고 emailerr가 숨겨짐.

* * *

```html
function chkForm(){
			
	var err = 0;
			
	if($("#userid").val() == ""){
		$("#userid").css("border-color","#ff4d78");
		$(".iderr").show();
		err++;
	}
	if($("#userpw").val() == ""){
		$("#userpw").css("border-color","#ff4d78");
		$(".pwerr").show();	
		err++;
	}
			
	if($("#pwchk").val() == ""){
		$("#pwchk").css("border-color","#ff4d78");
		$(".chkerr").show();	
		err++;
	}
			
	if($("#username").val() == ""){
		$("#username").css("border-color","#ff4d78");
		$(".nameerr").show();	
		err++;
	}
			
	if($("#useremail").val() == ""){
		$("#useremail").css("border-color","#ff4d78");
		$(".emailerr").show();	
		err++;
	}
			
	if(err > 0){
		return false;
	}else{
		//$("#registerForm").submit();
	}
}
```

register.jsp

-   칸이 비어있다면 그 칸의 테두리가 #ff4d78 색상으로 변경되고 err메시지가 보인다.
-   추가로 err가 1 추가됩니다.
-   함수가 실행될 때 err가 1 이상이면 return 값이 false로 반환됩니다.

* * *

![](/images/javascript-10/1.png)

결과값
