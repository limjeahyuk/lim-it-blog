---
title: '[Android] Manifest / StartActivityforResult'
pubDate: 2022-03-26
category: study/android-school
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/21
---
### **\- androidManifest**

AndroidManifest.xml

```html
<activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
</activity>
```

-   activity를 만들면 androidManifest에 activity가 만들어진다.
-   intent-filter를 붙여주는 activity가 앱 실행 때 가장 먼저 보이게 된다.
-   exported를 true로 만들어 줘야한다.  
    false로 해주게 되면 intent로 activity를 호출해야 하는 데 호출할 수 없어진다.

* * *

### **\- splashActivity**

activity\_splash.xml

```html
<ImageView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:src="@mipmap/ic_launcher"
        />
```

-   splashActivity는 앱이 실행되기 전에 잠깐 보여주는 창으로 대개 로딩 창이라고 생각하면 편하다.  
    주로 splash 단계에서 버전 체크를 해서 업데이트 팝업을 띄우기도 한다.
-   @mipmap/ic\_launcher는 안드로이드 기본 아이콘.

### **\- Handler**

SplashActivity.java

```html
activity = this;

       new Handler().postDelayed(new Runnable() {
           @Override
           public void run() {
               Intent intent = new Intent(activity,InitActivity.class);
               startActivity(intent); // 화면 전환
               finish(); // activity 죽이기
           }
       }, 2000); //2초후에 실행
```

-   Handler를 사용하여 postDelayed를 쉽게 적용 가능하다.
-   일정 시간이 지나고 하고 싶은 일을 하도록 할 때 사용.  
    h. postdelayed( Runnable > 스레드 , time >몇 초동 안(ms) )
-   finsh()를 사용해줌으로써 activity를 완전히 죽여둔다.  
    이렇게 함으로써 앱 실행 후 뒤로 가기를 누르더라도 splashActivity는 호출되지 않는다.

* * *

### **\- StartActivityforResult \[ ※ 세상 어렵 ※ \]**

InitActivity.java

```
public void onClick(View view){
    Intent intent = new Intent(activity, NextActivity.class);
    startActivityForResult(intent,1004);
}
```

-   startActivity : 새 액티비티를 만들어 준다.  
    startActivity(intent);
-   startActivityForResult : 새 액티비티를 만들어 준다 + 결괏값을 전달한다.  
    startActivityForResult(intent, requestCode);
-   start 메서드로 하면 값을 못 받아오지만  
    StartActivityForResult 메소드로 하면 값을 받아올 수 있습니다.

NextActivity.java

```html
@Override
    public void onBackPressed() {
        Intent i = new Intent();
        i.putExtra("data", "ddddd");
        setResult(RESULT_OK,i);
        super.onBackPressed();
    }
```

-   onBackPressed, ios는 없지만 android는 있는 뒤로 가기 버튼을 눌렀을 때 실행된다.
-   intent.putExtra()를 통해 key값와 value를 받아올 수 있다.
-   받아온 값을 setResult로 저장을 한다.   
    성공이라면 RESULT\_OK 실패라면 RESULT\_CANCEL 각각 -1 , 0을 반환
-   super.onBackPressed() == finish() 같은 말이다. 

```
@Override
protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    String a = data.getExtras().getString("data");
    Log.e("111",""+a);
    
}
```

InitActivity.java

-   alt + insert를 사용하여 override 메서드를 클릭하여 코드를 쉽게 만들 수 있음.
-   **onActivityResult는** 결과를 받는 곳이다.
-   **requestCode**는 int 값으로 써 만약 여러 개의 activity가 있을 때 구분해주기 위함.
-   **resultCode**는 setResult에서 보낸 값입니다.
-   **data**는 putExtra에서 가져온 키 값.

* * *

방식이 복잡한 데...  
이거 보고 조금 이해는 됐다.

![](/images/android-school-21/1.png)

1\. startActivityForResult()로 activity 호출  
2\. 호출된 activity에서 setResult()로 결과 돌려주기  
3\. onActivityResult()에서 결과 확인
