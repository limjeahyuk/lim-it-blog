---
title: '[Android] SharedPreferences / AlertDialog'
pubDate: 2022-04-15
category: study/android-school
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/28
---
### **\- values**

values 폴더에 colors.xml / strings.xml 태그로 이루어져 있음.

자주 쓰는 color 나 단어의 경우 name 지정해준 후

```
@string/app_name
```

이런 식으로 사용해주는 것이 좋음.  
만약 바꿔야 하는 경우 하나하나 찾을 필요 없으며 한 번에 변경 가능하다.

* * *

### **\- Data**

안드로이드에서 데이터를 저장하는 저장소가 필요할 때 방식은 여러 가지가 있다.

1.  SQLite  
    안드로이드에서 컨텐트 프로바이더라는 것을 이용하여 db 값을 이용하거나 저장 가능하다
2.  file  
    데이터 값을 파일에 저장하여 불러오는 방식으로 사용 가능  
    하지만 안드로이드로는 사용할 수 있는 용량도 적고 경로도 정해져 있어서  
    다른 것과 이어 주기가 힘들다. > 잘 사용 x
3.  SharedPreference  
    안드로이드에서 제공하는 클래스로 간단한 데이터를 저장하는 저장소 같은 개념이다.  
    가장 많이 사용.

SharedPreference를 사용하는 예시로는 카카오톡 로그인은 처음 한 번만 하고 로그아웃하기 전까지 자동 로그인이다.  
이 부분이 sharedpreference에 저장하여 바로바로 사용하는 방식.  
캐시 정보를 삭제하지 않는 한 데이터는 날아가지 않는다.

* * *

### **\- SharedPreference**

읽기 방식과 쓰기 방식 두 가지 경우가 있다.

읽기의 경우 > read , select  
 매우 간단하다.

쓰기의 경우 > update, delete  
 살짝궁 어렵...

* * *

1\. 객체 생성을 먼저 해준다.  
**sharedpreference sp = getSaredPreferenct( "name" , 읽기 / 쓰기 옵션);**  
읽기 / 쓰기 옵션의 경우 : 여러 가지가 있지만 연습용으로는 MODE\_PRIVATE를 자주 사용함.

![](/images/android-school-28/1.png)

2\. SharedPreference를 Editor와 이어준다.  
SharedPreference 안에 Editor라는 class를 사용해야 data 값을 넣을 수 있다.  
 **SharedPreference.Editor e = sp.edit();**  
이런 식으로 edit 해준다.

3\. data 값을 넣어준다.  
**e.putString ("key", "value"); / e.putInt("key" ,0); / putLong(~)  
**어떤 data를 넣어주냐 에 따라 put다음이 결정된다.  
key값은 무조건 string 값이어야 하며 int의 경우 default 값을 지정해줘야 하기에 0을 넣어준다.

4\. commit 해준다.  
put 했다고 바로 들어가는 것이 아니라 확인 작업이 필요하다.  
**e.commit();**

```
private SharedPreferences sp;
...

sp = getSharedPreferences("DB",MODE_PRIVATE);

bt1.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("info",et.getText().toString());
        editor.commit();
    }
});
```

-   DB라는 이름의 sp 저장소를 만들고,
-   버튼을 누를 때마다 info라는 이름을 가진 데이터를 et( EditText )에서 받아온다.
-   commit까지 해준다.

* * *

반대로 값을 가지고 올 경우는 매우 간단하게 가져올 수 있다.

```
sp.getString("info","")
```

sp 저장소에 info라는 이름의 값을 가져와 주세요.  
default 값은 ""입니다.

* * *

### **\- AlretDialog**

간단히 설명해서 팝업창이다.  
우리가 전에 했던 Toast의 경우 메시지만 잠깐 나오고 사라졌다면 alretDialg의 경우는

![](/images/android-school-28/2.png)

이런 식으로 Title과 message, 필요에 의하면 버튼까지 만들 수 있다.

1\. 이것도 화면 전환의 일부이기에 activity를 선언해준다.

```
private SheardPreferenceActivity activity = this;
```

2.  AlertDialog 객체 생성해준다.

```
AlertDialog.Builder ad = new AlertDialog.Builder(activity);
```

3\. AlerDialog를 꾸며준다.

```
ad.setTitle("title").setMessage(sp.getString("info","")).setPositiveButton("확인", new DialogInterface.OnClickListener() {
    @Override
    public void onClick(DialogInterface dialogInterface, int i) {

    }
});
```

-   setTitle => title 제목을 정해준다.
-   setMessage => Message 안에 넣을 내용을 정해준다.  
    sp 저장소의 info라는 이름의 값을 넣어주기로 했다.
-   setPositiveButton => 버튼을 정해줍니다.  
    버튼이기에 눌렀을 때 어떤 식으로 작용할 것인지도 작성해줘야 한다.  
    위 코드처럼 아무것도 적지 않았을 때는 그냥 꺼진다.
-   버튼의 종류는 3가지가 있다.  
    setPostitiveButton / setNegativeButton / setNeturalButton
