---
title: '[MusicTree] Javascript 공부 내용.'
pubDate: 2022-03-11
category: study/javascript
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/7
---
### ◎ 매핑 주소 설정.

```html
	//회원가입
	@RequestMapping(value = "/register")
	public String register() {
		return "contents/register";
	}
```

FrontController.java

주소 끝에 /register 붙히면 contents/register가 보여짐.

* * *

### ◎ Javascript

```html
function getAlbum(limit){
	$.ajax({
		type: "get",
		url: "https://ws.audioscrobbler.com/2.0/",
		data: {method: "geo.gettoptracks",country: "spain", api_key: key, format: "json", limit: limit},
		dataType: "JSON",
		async: false, //비동기를 동기로 변환
		success: function(res){
			
			$(".loading").hide();
			
			res.tracks.track.forEach(function(item, index){
			
			html = '';
			html += '<div class="listItem">';
			html += '<div class="albumImg"><img src="../static/img/MusicCover'+ (index%4 + 1) +'@2x.png"/></div>';
			html += '<div class="albumInfo"><div class="musicTitle">'+ item.name +'</div>';
			html += '<div class="singer">'+ item.artist.name +'</div>';
			html += '<img src="../static/img/ic_play_green@2x.png" class="playBtn" onclick="location.href= \''+ item.url +'\'"/></div></div>';
			
			$(".albumChart .chartList").append(html);
						
			}) 
		},
		error: function(err){
			console.log(err);
		}
	})
}
```

musictree.js

-   Javascript 함수 안에 limit라는 변수 넣어주면서 limit를 설정 가능.
-   html로 만들어놓은 틀을 javascript로 옮길 때 html += '~~~'; 사용.
-   api 불러오는 데 성공 할 때 loading 클래스 숨긴다. (hide)

```html
<img src="${path}/static/img/icons8-spinner.gif" class="loading"/>
```

rAlbum.jsp

* * *

### ◎ CSS

```html
.Mcontent .albumChart .chartList .listItem:nth-child(2n - 1){
	margin-right: 0;
}
```

main.css

-   nth-child(n) : n을 사용하여 유동적으로 선택 가능.

* * *

### ◎ 결과

![](/images/javascript-7/1.png)

최신앨범
