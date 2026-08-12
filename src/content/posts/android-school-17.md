---
title: '[Android] 3.18 수업내용'
pubDate: 2022-03-20
category: study/android-school
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/17
---
### **알림 창**

Toast & log

Toast : 알림 창.  
Toast는 static으로 이루어져 있어서 아무 곳이나 넣어도 상관없이 잘 작동됩니다.

\- Toast 사용 법  
Toast.makeText(this, "", Toast.LENGTH\_SHORT). show();   
Toast.makeText(content (Activity) , 메시지 , 보이는 시간(short, long) ). show();  => 해석

![](/images/android-school-17/1.png)

Toast 메세지

* * *

Log : logcat이라는 log 창에 메시지를 출력할 때 사용.

안드로이드 스튜디오에는 여러 가지 log가 있습니다.  
Log.d       >       debug  
Log.i        >       info  
Log.w       >       werring  
Log.e       >        error

log마다 그거에 맞는 레벨을 줄 수 있습니다.  
어떤 레벨의 log 메시지를 볼 것인지 선택이 가능합니다.

![](/images/android-school-17/2.png)

LOG 레벨들

-   **Debug는** Debug, info, warn, error 가 다 나옵니다.
-   **Info는** Info, warn, error 가 나옵니다.
-   **Warn는** warn, error가 나옵니다.
-   **Error는** error 하나만 나옵니다.
-   주로 Log.e를 자주 사용합니다.

Log는 나중에 앱으로 만들고 설치 파일로 된다면 보이지 않습니다. > 사용자는 log가 보이지 않음.  
개발자만 사용하기에 개발할 때 용이합니다.

* * *

### **앱 이름.**

project의 manifests의 AndroidManifest.xml 안에 label에 적혀있습니다.  
label 클릭 시 @string/app\_name이라고 되어있으며

```
android:label="@string/app_name"
```

values > string.xml에

```
<resources>
    <string name="app_name">201740228_lim</string>
</resources>
```

이런 식으로 앱 이름이 나와있습니다.  
변경은 이곳에서 하면 됩니다.

* * *

### **안드로이드 Activity 생명주기**

1.  **onCreate()** > Activity가 생성될 때 / 화면 정의하는 용도로 많이 사용
2.  **onStart()** > Activity가 사용자에게 보일 때 / 사용자와 상호작용은 불가능.
3.  **onResume()** > 사용자와 상호작용을 하는 단계
4.  **onPause()** > Activity가 잠시 멈춘 단계 / background에 위치해 있을 때.
5.  **onStop()** > Activity가 사용자에게 보이지 않는 단계
6.  **onDestroy()** > onStop()이던 상태가 완전히 제거되는 단계

예전에는 안드로이드 back 버튼을 누르면 Destroy가 실행되면서 완전히 사라졌는데  
요즘에는 pause 상태가 된다.  
다시 키면 start랑 resume이 실행됩니다.

* * *

### **Layout**

**constraintLayout** : 가장 기본적으로 깔려있는 레이아웃,  
너무 설정할 것 이 많아서 처음부터 쓰기는 어려움이 있다.

**LinearLayout** : orientation만 정해준다면 쉽게 사용 가능한 레이아웃.

```
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:layout_margin="10dp"
    >
```

-   orientation = " 가로 or 세로 "  
    가로 : horizantal  
    세로 : vertical
-   px : 어떤 화면에서 보든 다 똑같은 크기..  
    하지만 폰마다 해상도가 다 다르기 때문에 좀 이상해보일 수 있음.
-   dp : 화면 비율에 따른 퍼센트로 크기를 조정하기 때문에  
    화면마다 원하는 크기로 조절 가능합니다.

**FromeLayout** : 딱히 지정해줄 건 없지만 안에 들어가는 컨포넌트의 위치를 지정해줘야합니다. ( top, center, button )  
지정해주지 않으면 무조건 left top에 계속 들어갑니다.

```html
layout_gravity=	"Top"		//위
		"Bottom" 	//아래
		"right | Bottom"  //오른쪽 아래
```

이런 식으로 위치를 조정해줄 수 있습니다.

**※ 머리 아픔 주의 ※**  
위치 조정하는 계산법은 이진수로

![](/images/android-school-17/3.png)

이렇게 한다고 치면 ' | ' 는 두개를 합쳐주는 "and"의 뜻을 가지고 있기에  
ex) right | bottom 이면 1010으로 right와 bottom 자리라는 걸 인식한다.

* * *

### **Margin  & Padding**

margin 과 padding 을 그림으로 그려보자면

![](/images/android-school-17/4.jpg)

**margin은 컨텐츠에 들어가지 않지만**  
**padding은 컨텐츠에 포함됩니다.**  
그렇기에 padding으로 늘리거나 줄인 부분은 클릭이 가능하고  
margin으로 늘리거나 줄인 부분은 클릭이 불가능합니다.

![](/images/android-school-17/5.png)

-   margin은 컨텐츠가 아니기에 layout
-   padding은 컨텐츠에 포함되기에 그냥 padding만 독자적으로 사용한다.
-   layout\_gravity와 gravity의 차이점.  
    layout\_gravity => 컨텐츠의 위치  
    gravity는 컨텐츠 안에 것들의 위치 ( text 같은 것들 )

* * *

### **trim()**

trim() 을 사용하면 space바를 없애줍니다.

ex) 12 3 4   56 ===trim()===> 123456
