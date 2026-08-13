---
title: '[MusicTree] Scroll을 이용한 topBtn'
pubDate: 2022-03-16
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/12
---
## **\- JSP -**

```html
<div class="topBtn" onclick="goTop();">
		<img src="${path}/static/img/up-arrow.png"/>
		TOP
	</div>
```

-   클릭 시 goTop() 함수가 실행됨.
-   img를 static/img/up-arrow.png 가져옴.

* * *

## **\- CSS -**

```html
.topBtn{
	width: 30px;
	color: #000000;
	font-weight: 800;
	cursor: pointer;
	position: fixed;
	bottom: 150px;
	right: 20px;
	display: none;
}
```

-   position을 fixed로 고정시켜 놓는다.
-   display를 none으로 보이지 않게 하고 함수 > show()를 통해 보이도록 할 예정.

* * *

## **\- JavaScript -**

```html
 $(document).ready(function(){
		 
		 if($(window).scrollTop() > 700){
			 $(".topBtn").show();
		 }
		 
		 $(function(){
			 $(window).scroll(function(){
				 if($(this).scrollTop() > 700){
					 $(".topBtn").fadeIn(300);
				 }else{
					 $(".topBtn").fadeOut(300);
				 }
			 })
		 })
   ------------------------------------------------
   function goTop(){
			 $('html, body').animate({
				 scrollTop: 0
			 }, 700);
```

-   scroll 위치가 위에서 부터 700 이상이면 topBtn을 보여준다.
-   topBtn이 나타날 때 서서히 나타난다. (0.3초)  
    topBtn이 사라질 때 서서히 사라진다. (0.3초)  
    기본값은 400, 1000 => 1초
-   goTop() 함수가 실행되면 scrollTop을 0으로 변환해준다. (맨 꼭대기)  
    0.7초 안에 스르륵 올라가도록 한다.

* * *

![](/images/javascript-12/1.png)

오른쪽 하단 topBtn 버튼
