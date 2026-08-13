---
title: '[Android] 설문지 페이지'
pubDate: 2022-04-03
category: study/android-school
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/23
---
### **ImageView**

```html
<ImageView
        android:layout_width="match_parent"
        android:layout_height="170dp"
        android:padding="10dp"
        android:src="@drawable/image"
        />
```

-   drawable 폴더에 image 파일을 넣어주고 src로 경로 지정 해준다.
-   image 크기를 맞출 때   
    wrap\_content => 사진크기에 맞춰서 (기본값)  
    300dp => 고정크기  
    weight => content 들의 정한 비율 크기

* * *

### **CheckBox ( Xml )**

```html
 <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:layout_marginTop="20dp"
        android:layout_marginBottom="10dp"
        >
        <CheckBox
            android:id="@+id/cb_c"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="CUTE"
            />
        <CheckBox
            android:id="@+id/cb_s"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="SEXY"
            />
        <CheckBox
            android:id="@+id/cb_h"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="HANDSOME"
            />

    </LinearLayout>
```

-   <CheckBox /> 하나씩 여러개 써도 상관 없지만 관리가 많이 힘듬  
     => Layout 으로 묶어주면서 CheckBox 들을 관리한다.
-   id 값 필수!!! > checkbox가 check 됐는 지 안됐는지 확인하려면 id가 필요함.

* * *

### **CheckBox ( Java )**

```html
 private CheckBox cb_c, cb_s, cb_h;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_research);

        cb_c = findViewById(R.id.cb_c);
        cb_s = findViewById(R.id.cb_s);
        cb_h = findViewById(R.id.cb_h);

        cb_c.setChecked(true);
```

-   설정한 id값으로 매칭 시켜준다음.
-   setChecked(true); > 화면 처음 들어올 때 체크 되어있도록 만들어줌.  
    ▼ 이런 식으로

![](/images/android-school-23/1.png)

```html
 Log.e("!!!!", "cb_c : " + cb_c.isChecked());
```

-   isChecked()를 사용하여 cb\_a가 체크 되어있는 지 확인 가능
-   icChecked() 와 intent를 사용하여 다음 화면으로 값을 넘겨주는 것도 가능하다.

```html
 Intent intent = new Intent();
                intent.putExtra("cute",cb_c.isChecked());
                intent.putExtra("sexy",cb_s.isChecked());
                intent.putExtra("hend",cb_h.isChecked());
                startActivity(intent);
```

-   이렇게도 가능하지만... 설문지에 질문이 무지막지하게 많다면?  
    저걸 다 써줄 수도 없으며 관리도 너무 힘들고 복잡하다.....  
      
    

```html
String str = "";
                if(cb_c.isChecked()) {
                    str = str+"CUTE";
                }
                if(cb_s.isChecked()) {
                    if(str.length() > 0) {
                        str = str+", SEXY";
                    } else {
                        str = str + "SEXY";
                    }
                }
                if(cb_h.isChecked()) {
                    if(str.length() > 0) {
                        str = str+", HANDSOME";
                    } else {
                        str = str + "HANDSOME";
                    }
                }

                Intent intent = new Intent(ResearchActivity.this, ResearchNextActivity.class);
                intent.putExtra("data", str);
                startActivity(intent);
                finish();
```

-   이렇게 개선이 가능하다.
-   체크가 되면 어떤 것들이 체크되었는 지 한 줄로 요약을 해줘서  
    그 요약문장을 다음 페이지로 넘겨주는 작업.
-   finish() 를 사용한 이유는 뒤로 넘어왔을 때 했던 설문지로 못 넘어오게 만들었다.  
    ( 이 부분은 자기 마음대로... )  
      
    

```html
   private String firstData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_research_next);

        firstData = getIntent().getStringExtra("data");
```

-   넘어온 data를 이런식으로 받아올 수 있다.  
    이 부분은 저번에 해서 설명 pass!

* * *

### **RadioButton ( Xml )**

```html
<RadioGroup
        android:id="@+id/rb_content"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp"
        android:layout_marginBottom="10dp"
        android:orientation="vertical"
        >
        <RadioButton
            android:id="@+id/rb_1"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="TFT"
            />
        <RadioButton
            android:id="@+id/rb_2"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Android"
            />
        <RadioButton
            android:id="@+id/rb_3"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="FaceBook"
            />
    </RadioGroup>
```

-   RadioButton 은 CheckBox와는 다르게 RadioGroup으로 꼭 묶어줘야한다.  
    안 묶어 줘도 오류는 안나지만 RadioButton의 가장 큰 기능을 하지 못한다.  
    \> 여러개가 한번에 눌린다. ( 동그라미 checkbox )
-   RadioGroup에는 orientation을 사용하여 RadioButton들을 정렬 시킬 수 있다.

* * *

### **RadioButton ( Java )**

```html
    private RadioGroup rb_content;
    private String firstData;
    private String str = "TFT";
```

-   변수 설정 해주는 작업 인데 이상한 부분이 있다.  
    \> RadioButton은 설정 안해줬다.  
       그 이유는 Group을 이용해서 Check 상황을 파악 가능하기 때문  
      
    

```html
rb_content = findViewById(R.id.rb_content);
        rb_content.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup radioGroup, int i) {
                switch(i) {
                    case R.id.rb_1:
                        str = "TFT";
                        break;
                    case R.id.rb_2:
                        str = "Android";
                        break;
                    case R.id.rb_3:
                        str = "FaceBook";
                        break;
                }
            }
        });
```

-   Group은 checkedchangelistener을 사용해야함.
-   이런 식으로 switch ~ case 문을 이용하여 RadioButton 이 check 되었을 때  
    str 값을 받아오도록 한다.
-   RiddioButton도 CheckBox와 동일하게 rb\_1.isChecked() 을 사용하여  
    체크 되었는 지 안 되었는 지 확인 가능하다.
-   str 값 또한 위에 CheckBox와 동일하게 다음 페이지로 정보를 넘길 수 있다.  
     

```html
Button bt_next = findViewById(R.id.bt_next);
        bt_next.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(ResearchNextActivity.this, ResearchTwoActivity.class);
                intent.putExtra("first_data", firstData);
                intent.putExtra("two_data",str);
                startActivity(intent);
                finish();
            }
        });
```

-   이런 식으로 만들면 된다.

### **완 전 재 미 있 음**

![](/images/android-school-23/2.gif)

* * *

### **과제**

-   설문지 3개를 만들고 설문지마다 체크 된 값들을 마지막 페이지에서 설명해주는 페이지
-   예시 )

![](/images/android-school-23/3.png)

* * *

[https://github.com/limjeahyuk/android](https://github.com/limjeahyuk/android)

 [GitHub - limjeahyuk/android: android

android. Contribute to limjeahyuk/android development by creating an account on GitHub.

github.com](https://github.com/limjeahyuk/android)
