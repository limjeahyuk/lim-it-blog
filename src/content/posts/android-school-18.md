---
title: '[Android] 계산기 만들기'
pubDate: 2022-03-20
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/18
---
###  **-소개**

![](/images/android-school-18/1.png)

이런 식의 계산기를 만들어볼 예정입니다.

* * *

### **Layout**

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/tv"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:padding="10dp"
        android:gravity="bottom|right"
        android:text="0"
        android:textSize="50dp"
        />
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:layout_margin="10dp"
        >

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_margin="5dp"
            >
            <Button
                android:id="@+id/bt_1"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="1"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_2"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="2"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_3"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="3"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_p"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="+"
                android:textSize="30dp"
                />
        </LinearLayout>
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_margin="5dp"
            >

            <Button
                android:id="@+id/bt_4"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="4"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_5"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="5"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_6"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="6"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_m"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="-"
                android:textSize="30dp"
                />
        </LinearLayout>
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_margin="5dp"
            >

            <Button
                android:id="@+id/bt_7"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="7"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_8"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="8"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_9"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="9"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_x"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="*"
                android:textSize="30dp"
                />
        </LinearLayout>
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_margin="5dp"
            >

            <Button
                android:id="@+id/bt_0"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="0"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_h"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="="
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_n"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="%"
                android:textSize="30dp"
                />
            <Button
                android:id="@+id/bt_d"
                android:layout_width="0dp"
                android:layout_weight="0.25"
                android:layout_height="wrap_content"
                android:layout_margin="2dp"
                android:text="/"
                android:textSize="30dp"
                />
        </LinearLayout>
    </LinearLayout>
</LinearLayout>
```

activity\_main.xml

**weight는** 고정값이 아닌 비율로 크기를 정하는 것이므로  
한 줄을 1로 봤을 때 0.25로 해주면 4등분으로 콘텐츠가 이쁘게 크기를 잡을 수 있다.  
※ width 값은 무조건 0dp를 줘야합니다.

* * *

### **MainActivity.java**

#### **1\. 먼저 화면에 만들어놓은 버튼들을 사용하기 위해 지정해줍니다.**

```
public class MainActivity extends AppCompatActivity {

    private MainActivity activity;
    private Button bt_1, bt_2, bt_3, bt_4, bt_5, bt_6, bt_7, bt_8, bt_9, bt_0;
    private Button bt_p, bt_m, bt_x, bt_d, bt_n, bt_h;
    private TextView tv;
    
    //////////////////////////////////////////
     @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        activity = this;

        // id로 숫자찾기
        bt_1=findViewById(R.id.bt_1);
        bt_2=findViewById(R.id.bt_2);
        bt_3=findViewById(R.id.bt_3);
        bt_4=findViewById(R.id.bt_4);
        bt_5=findViewById(R.id.bt_5);
        bt_6=findViewById(R.id.bt_6);
        bt_7=findViewById(R.id.bt_7);
        bt_8=findViewById(R.id.bt_8);
        bt_9=findViewById(R.id.bt_9);
        bt_0=findViewById(R.id.bt_0);

        // id로 연산자찾기
        bt_p=findViewById(R.id.bt_p);
        bt_m=findViewById(R.id.bt_m);
        bt_x=findViewById(R.id.bt_x);
        bt_d=findViewById(R.id.bt_d);
        bt_n=findViewById(R.id.bt_n);
        bt_h=findViewById(R.id.bt_h);
        tv=findViewById(R.id.tv);
    }
```

-   activity는 화면이 넘어갈 때 사용하는 것이라 필요 없지만..  
    언젠가는 할 수도 있으니 기본적으로 해줍시다.  
      
    
-   private로 Button과 textview를 변수와 함께 정해줍니다.  
      
    
-   findViewById를 사용하여 xml에 있는 id로 지정해준 변수와 이어줍니다.

* * *

#### **2\. 숫자 버튼을 누르면 textview에 숫자가 나타나게 만들어줍니다.**

```
View.OnClickListener click = new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.bt_0:
                tv.append("0");
                break;
            case R.id.bt_1:
                tv.append("1");
                break;
            case R.id.bt_2:
                tv.append("2");
                break;
            case R.id.bt_3:
                tv.append("3");
                break;
            case R.id.bt_4:
                tv.append("4");
                break;
            case R.id.bt_5:
                tv.append("5");
                break;
            case R.id.bt_6:
                tv.append("6");
                break;
            case R.id.bt_7:
                tv.append("7");
                break;
            case R.id.bt_8:
                tv.append("8");
                break;
            case R.id.bt_9:
                tv.append("9");
                break;
        }
    }
};
```

-   클릭 리스너를 이용해 click을 만들어줍니다.  
      
    
-   switch 문을 이용해 R.id.bt\_\* 이 어떤 것이냐에 따라 tv에 뭐가 올라갈지 지정.  
      
    
-   **append()와 setText()의 차이점**  
    append()는 textview에 어떤 내용이 있던 그 뒤에 이어서 문자를 넣어줍니다.  
    setText()는 textview에 어떤 내용이 있던 그 문자를 지우고 새 문자를 넣어줍니다.  
    우리는 뒤이어서 계속 숫자를 넣어줘야 하기에 append를 사용했습니다.

* * *

#### **3\. 숫자 버튼마다 click를 넣어줍니다.**

```
bt_1.setOnClickListener(click);
bt_2.setOnClickListener(click);
bt_3.setOnClickListener(click);
bt_4.setOnClickListener(click);
bt_5.setOnClickListener(click);
bt_6.setOnClickListener(click);
bt_7.setOnClickListener(click);
bt_8.setOnClickListener(click);
bt_9.setOnClickListener(click);
bt_0.setOnClickListener(click);
```

oncreate()

* * *

#### **4\. 숫자를 누르기 전 textview가 깨끗해야 합니다.**

```
private boolean cl = false;
============================
View.OnClickListener click = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            clear();
            cl = true;
===========================
private void clear(){
        if(cl == false){
            tv.setText("");
        }
    }
```

-   clear 함수를 만들었습니다.  
      
    
-   cl을 boolean 변수로 만들어주고 cl이 false일 때만 clear()를 이용해 textview를 지워줬습니다.  
      
    
-   setText()를 사용하면 전에 내용을 다 지워줍니다.

* * *

#### **5\. 연산자를 눌렀을 때 값과 누른 연산자를 저장해줘야 합니다.**

```html
private boolean bl = true;
private int result = 0;
private String ope;
==========================
View.OnClickListener o_click = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            cl = false;
            if(bl == false){
                switch (view.getId()){
                    case R.id.bt_p:
                        resultData(tv.getText().toString().trim(),"+");
                        break;
                    case R.id.bt_m:
                        resultData(tv.getText().toString().trim(),"-");
                        break;
                    case R.id.bt_x:
                        resultData(tv.getText().toString().trim(),"*");
                        break;
                    case R.id.bt_d:
                        resultData(tv.getText().toString().trim(),"/");
                        break;
                    case R.id.bt_n:
                        resultData(tv.getText().toString().trim(),"%");
                        break;
                    case R.id.bt_h:
                        resultData(tv.getText().toString().trim(),"=");
                        break;
                }
            }
            if(bl == true){
                switch(view.getId()){
                    case R.id.bt_p:
                        firstData(tv.getText().toString().trim(),"+");
                        break;
                    case R.id.bt_m:
                        firstData(tv.getText().toString().trim(),"-");
                        break;
                    case R.id.bt_x:
                        firstData(tv.getText().toString().trim(),"*");
                        break;
                    case R.id.bt_d:
                        firstData(tv.getText().toString().trim(),"/");
                        break;
                    case R.id.bt_n:
                        firstData(tv.getText().toString().trim(),"%");
                        break;
                    case R.id.bt_h:
                        firstData(tv.getText().toString().trim(),"=");
                        break;

                }
            }
        }
    };
    
    private void firstData(String str, String s){
        int value = Integer.parseInt(str);

        if(s == "="){
            result = result + value;
            tv.setText(""+result);
            bl = false;
            result = 0;
        }
        else{
            ope = s;
            result = result + value;
            tv.setText(""+result);
            bl = false;
        }
    }

    private void resultData(String str, String s){
        int value = Integer.parseInt(str);
        switch (ope) {
            case "+":
                result = result + value;
                ope = s;
                tv.setText(""+result);
                break;
            case "-":
                result = result - value;
                ope = s;
                tv.setText(""+result);
                break;
            case "*":
                result = result * value;
                ope = s;
                tv.setText(""+result);
                break;
            case "/":
                result = result / value;
                ope = s;
                tv.setText(""+result);
                break;
            case "%":
                result = result % value;
                ope = s;
                tv.setText(""+result);
                break;
            case "=":
                bl=true;
                result=0;
                break;
        }
    }
```

-   연산자 버튼을 클릭 시 나오는 o\_click 리스너를 만들어줍니다.  
      
    
-   연산자를 처음 눌렀을 때와 두 번 이상 눌렀을 때로 나눠주기 위해 boolean값을 지정해줬습니다.  
    만약 boolean값을 지정 안 하고 다 똑같이 해버리면...  
    처음 값은 무조건 result와 더해줘야 하는 데 곱하기 같은 경우 0과 곱해서 0이 됩니다.  
      
    
-   bl == true 일 때는 firstData() 함수를 bl == false 일때는 resultData() 함수를 사용하게 만들었습니다.  
      
    
-   textview에 들어있는 값을 가져오는 것은 (tv.getText(). toString(). trim()) 부분입니다.  
      
    
-   firstData() 설명  
    1\. 우선 string으로 tv에 들어있는 값과 처음 누른 연산자를 받아옵니다.  
    2\. string으로 받아온 숫자들을 int 형으로 다시 변환해줍니다  
       int value = Integer.parseInt(str); > value 값에 저장  
    3\. 만약 처음 누른 연산자가 =이라면 value 값을 result로 저장하고 result를 tv에 올립니다.  
       setText()는 string 형만 가능합니다. 하지만 result는 int 형이기 때문에  
       tv.setText(""+result); 로 사용해줍니다.  
    4\. =이 아닌 다른 모든 연산자라면 우선 연산자를 ope에 저장해주고  
       result에 값을 저장 후 tv에 올려줍니다.  
       이후 누른 연산자는 첫 번째가 아니라고 알려주기 위해 bl을 false로 바꿔줍니다.  
      
    
-   bl == false이기 때문에 연산자가 눌렸을 때는 resultData() 함수가 실행됩니다.  
      
    
-   resultData() 설명  
    1\. firstData()와 동일하게 값을 받아오고 int형으로 바꿔줍니다.  
    2\. switch 문을 사용하여 저장된 ope가 어떤 것이냐에 따라 result를 계산 후 tv에 값을 올려줍니다.  
       추가로 계산했을 수도 있기 때문에 ope를 최신화해줍니다.  
    3\. 만약 =을 눌렀더라면 ope는 =으로 저장됩니다.  
       다음에 다른 연산자를 누르면 resultData()의 = 쪽으로 가게 되어  
       bl = true로 바꾸고 result =0으로 초기화해줍니다.  
      
    
-   bl = true로 바뀌었으니 이어서 바로 밑에 있는 if문에도 걸리게 됩니다.  
      
    
-   이렇게 계속 돌아가는 구조입니다.  
      
    
-   \= 을 누르면 result는 0으로 초기화되며 추가 연산도 가능합니다.

* * *

#### **6\. 연산자 버튼에 o\_clik을 넣어줍니다.**

```
bt_p.setOnClickListener(o_click);
bt_m.setOnClickListener(o_click);
bt_x.setOnClickListener(o_click);
bt_d.setOnClickListener(o_click);
bt_n.setOnClickListener(o_click);
bt_h.setOnClickListener(o_click);
```

ocCreate()

* * *

#### **7\. 예외처리**

```
case "/":
    if(value == 0){
        tv.setText("0");
        Toast.makeText(this,"0으로 나누면 안됩니다.", Toast.LENGTH_SHORT).show();
        break;
    }
```

-   계산했을 때 가장 기초적인 예외처리.. 0으로 나눴을 때
-   Toast를 이용해서 짧은 메시지를 주었습니다.
-   tv에 나타내려고 했으나 숫자가 아닌 값이 올라가버리니 다음 연산 때 오류가 나서  
    메시지로 변경했습니다.

* * *

#### **8\. 문제점**

\- 처음에 숫자 누르고 =을 누르면 다음 연산자를 누를 때 오류가 나면서 꺼진다.

* * *

### **MainActivity.java**

```
package com.dealim;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private MainActivity activity;
    private Button bt_1, bt_2, bt_3, bt_4, bt_5, bt_6, bt_7, bt_8, bt_9, bt_0;
    private Button bt_p, bt_m, bt_x, bt_d, bt_n, bt_h;
    private TextView tv;
    private boolean bl = true;
    private boolean cl = false;
    private int result = 0;
    private String ope;

    View.OnClickListener click = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            clear();
            cl = true;
            switch (view.getId()) {
                case R.id.bt_0:
                    tv.append("0");
                    break;
                case R.id.bt_1:
                    tv.append("1");
                    break;
                case R.id.bt_2:
                    tv.append("2");
                    break;
                case R.id.bt_3:
                    tv.append("3");
                    break;
                case R.id.bt_4:
                    tv.append("4");
                    break;
                case R.id.bt_5:
                    tv.append("5");
                    break;
                case R.id.bt_6:
                    tv.append("6");
                    break;
                case R.id.bt_7:
                    tv.append("7");
                    break;
                case R.id.bt_8:
                    tv.append("8");
                    break;
                case R.id.bt_9:
                    tv.append("9");
                    break;
            }

        }

    };

    View.OnClickListener o_click = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            cl = false;
            if(bl == false){
                switch (view.getId()){
                    case R.id.bt_p:
                        resultData(tv.getText().toString().trim(),"+");
                        break;
                    case R.id.bt_m:
                        resultData(tv.getText().toString().trim(),"-");
                        break;
                    case R.id.bt_x:
                        resultData(tv.getText().toString().trim(),"*");
                        break;
                    case R.id.bt_d:
                        resultData(tv.getText().toString().trim(),"/");
                        break;
                    case R.id.bt_n:
                        resultData(tv.getText().toString().trim(),"%");
                        break;
                    case R.id.bt_h:
                        resultData(tv.getText().toString().trim(),"=");
                        break;
                }
            }
            if(bl == true){
                switch(view.getId()){
                    case R.id.bt_p:
                        firstData(tv.getText().toString().trim(),"+");
                        break;
                    case R.id.bt_m:
                        firstData(tv.getText().toString().trim(),"-");
                        break;
                    case R.id.bt_x:
                        firstData(tv.getText().toString().trim(),"*");
                        break;
                    case R.id.bt_d:
                        firstData(tv.getText().toString().trim(),"/");
                        break;
                    case R.id.bt_n:
                        firstData(tv.getText().toString().trim(),"%");
                        break;
                    case R.id.bt_h:
                        firstData(tv.getText().toString().trim(),"=");
                        break;

                }
            }
        }
    };

    private void clear(){
        if(cl == false){
            tv.setText("");
        }
    }
    private void firstData(String str, String s){
        int value = Integer.parseInt(str);

        if(s == "="){
            result = result + value;
            tv.setText(""+result);
            bl = false;
            result = 0;
        }
        else{
            ope = s;
            result = result + value;
            tv.setText(""+result);
            bl = false;
        }
    }

    private void resultData(String str, String s){
        int value = Integer.parseInt(str);
        switch (ope) {
            case "+":
                result = result + value;
                ope = s;
                tv.setText(""+result);
                break;
            case "-":
                result = result - value;
                ope = s;
                tv.setText(""+result);
                break;
            case "*":
                result = result * value;
                ope = s;
                tv.setText(""+result);
                break;
            case "/":
                if(value == 0){
                    tv.setText("0");
                    Toast.makeText(this,"0으로 나누면 안됩니다.", Toast.LENGTH_SHORT).show();
                    break;
                }
                result = result / value;
                ope = s;
                tv.setText(""+result);
                break;
            case "%":
                result = result % value;
                ope = s;
                tv.setText(""+result);
                break;
            case "=":
                bl=true;
                result=0;
                break;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        activity = this;

        // id로 숫자찾기
        bt_1=findViewById(R.id.bt_1);
        bt_2=findViewById(R.id.bt_2);
        bt_3=findViewById(R.id.bt_3);
        bt_4=findViewById(R.id.bt_4);
        bt_5=findViewById(R.id.bt_5);
        bt_6=findViewById(R.id.bt_6);
        bt_7=findViewById(R.id.bt_7);
        bt_8=findViewById(R.id.bt_8);
        bt_9=findViewById(R.id.bt_9);
        bt_0=findViewById(R.id.bt_0);

        // id로 연산자찾기
        bt_p=findViewById(R.id.bt_p);
        bt_m=findViewById(R.id.bt_m);
        bt_x=findViewById(R.id.bt_x);
        bt_d=findViewById(R.id.bt_d);
        bt_n=findViewById(R.id.bt_n);
        bt_h=findViewById(R.id.bt_h);
        tv=findViewById(R.id.tv);

        bt_1.setOnClickListener(click);
        bt_2.setOnClickListener(click);
        bt_3.setOnClickListener(click);
        bt_4.setOnClickListener(click);
        bt_5.setOnClickListener(click);
        bt_6.setOnClickListener(click);
        bt_7.setOnClickListener(click);
        bt_8.setOnClickListener(click);
        bt_9.setOnClickListener(click);
        bt_0.setOnClickListener(click);

        bt_p.setOnClickListener(o_click);
        bt_m.setOnClickListener(o_click);
        bt_x.setOnClickListener(o_click);
        bt_d.setOnClickListener(o_click);
        bt_n.setOnClickListener(o_click);
        bt_h.setOnClickListener(o_click);
    }
}
```

**진짜 힘들었는 데 재미있네요....**

**혹시 궁금한 점 댓글이나 저 찾아오세요 ^ㅁ^**
