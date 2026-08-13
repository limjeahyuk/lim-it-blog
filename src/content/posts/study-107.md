---
title: '[html/css] 기본으로 홈페이지를 따라 만들어보자'
pubDate: 2026-01-01
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/107
---
기본적인 웹페이지의 감각을 다시 찾기 위해서 웹페이지 하나를 찾아서 따라 만들어보기로 결심했습니다.

[https://www.s5-style.com/](https://www.s5-style.com/)

 [ハイクオリティなWebサイトを探すなら Webデザインギャラリー | S5-Style

ハイクオリティなWebサイトのデザインギャラリー。参考になるコーポレートサイト、採用サイト、ECサイト、キャンペーンサイトなど2025年の最新トレンドを毎日更新中！

www.s5-style.com](https://www.s5-style.com/)

일본의 Style 좋은 웹페이지를 보여주는 곳 같은데.. 어쩌다가 찾게 되었습니다.

이 중 짱구 팝업 홈페이지를 따라 만들어 보자! 라고 생각이 들었습니다.

[https://crayonshinchan-japancrafts.jp/#information](https://crayonshinchan-japancrafts.jp/#information)

 [CRAYON SHINCHAN JAPAN CRAFTS

「CRAYON SHINCHAN JAPAN CRAFTS」は、秋田県・埼玉県・熊本県の伝統産業や紋様としんちゃんたちとが出会った新たなコラボレーションデザイン。「クレヨンしんちゃんと 家族都市でつながる日本

crayonshinchan-japancrafts.jp](https://crayonshinchan-japancrafts.jp/#information)

* * *

#### Header 부분

![](/images/study-107/1.png)

먼저 로고가 두 개에 중간에 글씨랑... 오른쪽 끝에는 navigation 이 있습니다.

만드는 거야 뭐 이미지 다운 받고 따라 그냥 되는 대로 만들면 되니까 별 거 없었으나...

먼저 postion: relative 에 대해서 다시 공부하는 게 먼저 같았습니다.

#### postion의 속성

-   position: static;
-   position: relative;
-   position: absolute;
-   position: fixed;
-   position: sticky;

#### static

태그들의 가장 기본 형태입니다.

top bottom 같은 속성은 무시가 됩니다.

위치 이동 x

![](/images/study-107/2.png)

```css
.test{
  background: #666;
  width: 100px;
  height: 100px;
  position: static;
  margin-top: 10px;
}
```

여기에 top left를 추가하더라도 박스가 움직이지 않는 것을 볼 수 있습니다.

> .test\_\_container div:nth-of-type(2){ top: 20px; left: 20px;}

#### relative

자기 자신을 이동시킵니다.

그러니까 원래 자신의 위치에서 설정한 위치만큼 움직이게 됩니다.

![](/images/study-107/3.png)

```css
.test__container div:nth-of-type(2){
  position: relative;
  top: 20px;
  left: 20px;
  background: green;
}
```

원래 위치에서 자기 자신이 움직이는 것을 볼 수 있습니다.

#### absolute

Position 속성 중에서 꽤나 어려운 건 둘째 치고 막 사용하다가 보면 이상해지기 일수인 친구입니다.

![](/images/study-107/4.png)

```css
.test__container{
  margin: 100px 10px ;
  width: 300px;
  height: 500px;
  background: yellow;
  position: relative;
}
.test{
  background: #666;
  width: 100px;
  height: 100px;
  position: static;
  margin-top: 10px;
}

.test__container div:nth-of-type(2){
  position: absolute;
  left: 20px;
  bottom: 20px;
  background: green;
}
```

여기서 확인을 해야하는 것은 2번이 움직였는데 3번 또한 움직였습니다.

이말인 즉슨 absolute로 하게 되면 바로 독립이 되어서 다른 요소들과 상호작용을 하지 않습니다.

또한 absolute는 부모요소 로 부터 위치 계산을 하게 됩니다.

그런데 그 부모 요소는 반드시 static이 아닌 요소를 찾게 됩니다.

그러므로 만약 부모 요소에 postion을 넣지 않으면 최상위 뷰를 부모로 인식하여 원하는 곳으로 이동하지 않는 다는 뜻이죠

예시에 있는 것 처럼 relative를 넣어줘야지 생각하는 대로 나오게 될 것 입니다.

#### Fixed

주로 nav 버튼을 만들 때 많이 사용합니다. 스크롤에 영향을 받지 않고 항상 그 위치에 고정으로 나타납니다.

![](/images/study-107/5.png)

```css
.test__container div:nth-of-type(2){
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: green;
}
```

보시면 브라우저에서 bottom 이랑 left를 계산 하여 위치되어있습니다.

fixed를 하게 된 순간 속성값이 브라우저 전체로 되어버립니다.

또한 absolute와 마찬가지로 모든 속성에 독립되어서 상호작용을 하지 않게 됩니다.

#### sticky

sticky를 확인 하려면 스크롤이 되는 환경을 만들어야합니다.

![](/images/study-107/6.png)

```css
.test__container{
  margin: 100px 10px ;
  width: 300px;
  height: 500px;
  background: yellow;
}

.test__container div:nth-of-type(2){
  position: sticky;
  bottom: 0px;
  background: green;
  border: 1px solid #111;
  
}
```

확인해보시면

bottom 0에서 계속 붙어있다가 3이 나올때 쯤 제 자리로 갑니다.

웹페이지 보다보면 따라 올라가지는 또는 잠깐 위치가 붙었다가 때지는 그런 경우가 sticky 입니다.

스크롤에 따라서 설정한 포지션에 최대한 따르려고 노력한다고 생각이 듭니다.

position은 이정도로 마치도록 하겠습니다.

* * *

#### css를 이용한 간단한 애니메이션

홈페이지를 보면 로고에 마우스를 올릴 때 로고가 잠깐 작아지고 커집니다.

또 nav 부분을 마우스에 가져다 대면 색 반전이 있습니다.

```css
.navBox,
.iconBox{
  background-image: linear-gradient(#111, #111);
  background-repeat: no-repeat;
  background-size: 0% 100%;
  background-position: left top;
  transition: background-size 260ms ease, color 220ms ease, border-color 220ms ease;
}

.navBox:hover,
.iconBox:hover{
  background-size: 100% 100%;
  color: #fff;
}
```

하다보니까 hover가 아닌 focus로도 해야할 것 같다는 생각이 들었습니다.

키보드로 할때 tap같은걸 이용하더라도 확인이 되도록 하기 위해서..

```css
.navBox:focus-visible,
.iconBox:focus-visible{
  background-size: 100% 100%;
  color: #fff;
  border-color: #fff;
  outline: none;
}
```

focus로 했을 때 문제점이 있었습니다.

-   :focus는 “포커스만 있으면” 마우스 클릭이든 Tab이든 다 걸림
-   :focus-visible은 그 중에서도 “보이는 포커스가 필요한 상황”에만 걸리게 더 똑똑함

그렇기에 focus-visible로 한번 더 해줬습니다.

```css
.header__brand{
  transition: transform 180ms ease;
  will-change: transform;
}

.header__brand:hover{
  transform: scale(0.96);
}
```

이렇게 header 부분 완료했습니다.

![](/images/study-107/7.png)
