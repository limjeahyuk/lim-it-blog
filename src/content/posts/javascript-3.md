---
title: '[MusicTree]  ajax'
pubDate: 2022-03-07
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/3
---
#### \- ajax를 사용하여 api를 가지고 와서 정보 입력해주기.

```
function getChart(){
    $.ajax({
        type: "get",
        url: "https://ws.audioscrobbler.com/2.0/",
        data: {method: "chart.gettoptracks", api_key: key, format: "json", limit: "100", page: '2'},
        dataType: "JSON",
        success: function(res){
            res.tracks.track.forEach(function(item, index){
                var html = '';
                html += '<div class="listItem">';
                html += '<div><input type="checkbox"/></div>';
                html += '<div class="rank">'+ (index + 1) +'</div>';
                html += '<div style="width: 150px;"><img src="../static/img/MusicCover'+ (index%4 + 1) +'@2x.png" class="musicCover"/></div>';
                html += '<div class="title">'+ item.name +'</div>';
                html += '<div class="singer">'+ item.artist.name +'</div>';
                html += '<div><img src="../static/img/ic_play_green@2x.png" class="playBtn" onclick="location.href= \''+ item.url +'\'"/></div>';
                html += '<div><img src="../static/img/ic_plus@2x.png" class="addBtn"/></div></div>';

                $(".musicChart .chartList").append(html);

            })
        },
        error: function(err){
            console.log(err);
        }
    })
}
```

처음 api 접속을 위한 정보들 정리를 해준다.  
  
그다음 html 코드를 사용해 이미 만들어진 틀을 javascript에다가 만들어준다.  
  
정보를 넣어야 하는 구간에 index와 item를 사용하여 넣어줍니다.

* * *

-   몇 백개를 하나하나 입력하지 않아도 되며 틀만 만들어 놓으면 쉽게 적용 가능.
-   ajax를 사용하면 페이지의 갱신 없이 서버와 비동기 통신을 가능하게 해 준다.
-   비동기 통신이란 요청을 보낸 후 응답과는 상관없이 동작하는 방식.
-   http 전송 중에도 클라이언트가 웹 애플리케이션과 상호작용을 할 수 있음.

![](/images/javascript-3/1.jpg)

* * *

#### \- 현재 날짜와 시간 가져오기.

```html
$(document).ready(function(){
			
			//현재 날짜 및 시간 가져오기
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() +1;
			var day = date.getDate();
			var hour = date.getHours();
			
			$(".date").html(year + "." + month + "." + day + " <span>" + hour + ":00</span>");
```

![](/images/javascript-3/2.png)

이건 뭐.. 가볍다

* * *

#### \- Hover 좀 어렵게 하기..?

```html
// 차트 불러오기
			getChart();
			
			$(".btns img").on('mouseenter',function(){
				var index = $(".btns img").index(this);
			
				$(".btns img").eq(index).attr("src",function(index, attr){
					if(attr.match('_off')){
						return attr.replace('_off', '_on');
					}
				})
			})
			
			$(".btns img").on('mouseout',function(){
				var index = $(".btns img").index(this);
			
				$(".btns img").eq(index).attr("src",function(index, attr){
					if(attr.match('_on')){
						return attr.replace('_on', '_off');
					}
				})
			})
```

\- 이미지 위에 마우스를 올리면 깜박깜박 테두리에 진한 선이 생긴다.

이미지 hover 하는 방식. 왕 신기하다.

![](/images/javascript-3/3.png)

전체 듣기를 hover중..
