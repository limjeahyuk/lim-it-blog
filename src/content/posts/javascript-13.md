---
title: '[MusicTree] scrollBar 꾸미기'
pubDate: 2022-03-16
category: study/javascript
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/13
---
## **\- CSS -**

```html
body::-webkit-scrollbar {
	width: 10px; /* 오른쪽 스크롤바 크기 */
	height: 10px;  /* 하단 스크롤바 크기 */
}
/* 스크롤바 활성화 영역 */
body::-webkit-scrollbar-thumb {
	background-color: #29602b;
	border-radius: 20px;
}
/* 활성화 영역 hover 시 */
body::-webkit-scrollbar-thumb:hover{
	background-color: #429b44;
}
/* 스크롤바 전체 영역 */
body::-webkit-scrollbar-track {
	background-color: #dddddd;
}
```

전체적인 스크롤바를 꾸며주는 CSS

* * *

![](/images/javascript-13/1.png)

scrollBar
