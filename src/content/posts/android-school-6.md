---
title: '[Android] 구성요소 & Activity 사용'
pubDate: 2022-03-11
category: study/android-school
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/6
---
### **\- Android Application 구성 요소 -**

1. component  
2. Activity   
3. service  
4\. Broadcast Reciver   
5. content Provider 

**Activity**) 사용자와 상호작용을 담당하는 인터페이스.  
Intent를 통해 다른 애플리케이션의 activity를 호출 가능합니다.

**Service**) 백그라운드에서 어떠한 작업을 처리하기 위해 사용됨.  
네트워크와 연동이 가능함.

**BroadCast Receiver**) 안드로이드 os로부터 발생하는  
각종 이벤트와 정보를 받아와 핸들링하는 컴포넌트.  
안드로이드 os에서 메시지가 오면 모든 앱에 메세지가 왔다는 방송을 함.

**Content Provider**) 데이터를 관리하고 다른 애플리케이션의 데이터를 제공하는 데 사용되는 컴포넌트.  
SQLite DB / Web / 파일 입출력 등을 통해서 데이터를 관리.

* * *

### **Activity**

**onCreate  :  객체 생성**  
**onStart  :  객체 시작**  
**onResume  :  객체가 화면 최상단에 뜰 때**  
**onPause  :  객체가 화면에서 내려갈 때**  
**onStop  :  객체가 멈출 때**  
**onDestory  :  객체가 사라질 때**

전부 override 사용해야 함.

                  **1 : 1**  
**Activity <--------------> layout**  
**java 파일                    xml 파일**

* * *

## **★ 실전 ★**

```html
 <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:layout_editor_absoluteX="1dp"
        tools:layout_editor_absoluteY="1dp">

        <FrameLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent">

            <TextView
                android:id="@+id/name1"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="name"
                android:textSize="50dp"
                android:textColor="@color/black"
                />

            <TextView
                android:id="@+id/age1"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="age"
                android:layout_gravity="center"
                android:textSize="50dp"
                android:textColor="@color/black
                />

        </FrameLayout>
    </LinearLayout>
```

layout

-   LinearLayout : 위에서 아래 / 왼쪽에서 오른쪽으로 content 정렬해주는 layout
-   FrameLayout : gravity를 사용하여 content 위치 조정 가능.
-   match\_parent : 부모와 크기가 같게 / 최대
-   wrap\_content : content 크기와 같게 / 알맞게
-   dp : 크기를 정하는 단위. (휴대폰 기종마다 크기가 다르기 때문에 다른 단위 사용.)
-   id : id값 지정.

* * *

```html
 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        activity = this;
    }
    
    private MainActivity activity;
    
    @Override
    protected void onStart() {
        super.onStart();
        Button next = findViewById(R.id.next);
        next.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EditText name = findViewById(R.id.name);
                EditText age = findViewById(R.id.age);
                String value1 = name.getText().toString();
                String value2 = age.getText().toString();
                Intent intent = new Intent(activity, NextActivity.class);
                intent.putExtra("name", value1);
                intent.putExtra("age", value2);
                startActivity(intent);
            }
        });
    }
```

main.Activity

-   findViewById(R.id.name) : id를 이용해서 content 찾아서 설정.
-   Intent : intent를 이용해서 다른 activity에 값을 넘겨줍니다.

* * *

```html
 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_next);

        TextView name1 = findViewById(R.id.name1);
        TextView age1 = findViewById(R.id.age1);

        Intent intent = getIntent();
        String str = intent.getStringExtra("name");
        String str1 = intent.getStringExtra("age");
        name1.setText(str);
        age1.setText(str1);
    }
```

next.activity

-   getStringExtra : intent를 이용해서 받아온 값을 str에 저장.

* * *

## **★결과물★**

![](/images/android-school-6/1.png)

main / next
