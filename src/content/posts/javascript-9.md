---
title: '[MusicTree] register 1/2'
pubDate: 2022-03-13
category: study/javascript
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/9
---
### \- Html -

```html
<div class="formItem">
	<label for="userid">아이디</label>
	<input type="text" name="userid" id="userid" placeholder="아이디를 입력해주세요." autofocus />
</div>
```

-   for : <label>을 클릭하면 <input>이 자동 클릭됨.
-   name : ajex로 api 불러올 때 name을 사용하므로 백엔드와 협의하여 name을 맞추는 것이 좋음.
-   placeholder : 공백일 때 "아이디를 입력해주세요." 적힘.
-   autofocus : 자동으로 focus가 됩니다. 창에 들어가면 자동 선택이 됨.

* * *

### \- Css -

![](/images/javascript-9/1.png)

폰트마다 ●●●●●● 가 투명한 폰트가 있습니다.  
왼쪽 사진처럼 타이핑을 쳤는 데 투명하게 나온다면 폰트를 변경하면 됩니다.

* * *

### \- JS -

```html
<script>
		$(document).ready(function(){
			
			$(function(){
				//아이디 입력여부
				$("#userid").keyup(function(){
					if($("#userid").val() !== ""){
						$("#userid").css("border-color","#ff4d78");
					}else{
						$("#userid").css("border-color","#dddddd");
					}
				})
				
				//비밀번호 입력여부
				$("#userpw").keyup(function(){
					if($("#userpw").val() == ""){
						$("#userpw").css("border-color","#ff4d78");
						$("#pwchk").val("");
					}else{
						$("#userpw").css("border-color","#dddddd");
					}
				})
			})
			
		})
	</script>
```

-   userid에 값이 들어가면 테두리가 #ff4 d78 색상으로 변경됩니다.  
    반대로 값이 들어가지 않으면 테두리가 #dddddd 색상으로 변경됩니다,  
    userpw도 비슷한 맥락으로 해석 가능합니다.
-   userpw에 값이 들어가지 않았다면 pwchk(비밀번호 확인란)이 알아서 비어지게 됩니다.
