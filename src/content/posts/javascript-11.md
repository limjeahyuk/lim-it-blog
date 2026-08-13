---
title: '[MusicTree] recent'
pubDate: 2022-03-16
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/11
---
## **\- Html -**

```html
<li class="music">
	최신음악
	<ul class="Mmenu rList">
		<li onclick="location.href='/music/music';">최신 곡</li>
		<li onclick="location.href='/music/album';">최신 앨범</li>
		<li onclick="location.href='/music/video';">최신 뮤직비디오</li>
	</ul>
</li>
```

-   클릭 시 매핑 주소로 이동하게 한다.

* * *

## **\- JavaScript -**

```html
function getVideo(){
	
	$(".loding").hide();
	
	for(var i = 0; i < 12; i++){
		var html = '';
		
		html += '<div class="listItem">';
		
		if(i%3 == 0){
			html += '<iframe width="560" height="315" src="https://www.youtube.com/embed/ZSNYuWoQdzg"></iframe></div>';
		}else if(i%3 == 1){
			html += '<iframe width="560" height="315" src="https://www.youtube.com/embed/Dhy20HC8bM4"></iframe></div>';
		}else{
			html += '<iframe width="560" height="315" src="https://www.youtube.com/embed/xNoRmx8GXeY"></iframe></div>';
		}
		$(".videoChart .chartList").append(html);
	}
}
```

musictree.js

-   getVideo() 함수가 실행되면 loding이 숨겨진다.
-   for문을 통해 유튜브에서 가져온 코드를 차례로 배분한다.
-   위 html를 .videoChart .chartList 에 추가를 한다.

* * *

![](/images/javascript-11/1.png)

최신 뮤직비디오
