---
title: '[Android] ListView'
slug: android-school-26
pubDate: 2022-04-10
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/26
---
### **ListView**

listview는 직접 입력하는 것이 아닌 Adapter를 사용하여 data와 view를 연결시켜주는 것이다.

**Data > Adapter > View**

대표적으로 listView와 GridView가 있는데  
listView는 주소록같이 아래로 스크롤 하는 형식의 뷰,  
gridView는 바둑판 형식의 뷰이다.

androidstudio에서 제공하는 가장 기본적인 Adapter를 사용하는 것은 매우 쉬움.  
하지만 내용물도 간단해짐.  
화면에 문자열 하나만 여러개 나오는 정도

![](/images/android-school-26/1.png)

이런 식으로 정말 간단한 리스트를 나타낼 때는 제공하는 adapter를 사용하면 편리하다.

xml에는 <listview /> 하나만 만들어주면 되며  
java 코드는 ▽

```html
package com.daelim;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class ListActivity extends AppCompatActivity {

    private ListView lv_data;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        String[] LIST_MENU = {"123","가나다","abc"};

        lv_data = findViewById(R.id.lv_data);

        lv_data.setAdapter(new ArrayAdapter<>(this,android.R.layout.simple_list_item_1,LIST_MENU));

    }
}
```

-   xml에서 설정한 listview를 findViewById를 통해 지정해준다.
-   list 안에 넣을 정보들을 문자 배열을 통해 넣어둔다.
-   setAdapter를 해주므로써 data와 view를 이어준다.  
    setAdapter(new ArrayAdapter(context, resource, data > 배열);
-   context : 간단히 activity의 슈퍼클래스 > this를 사용하면 됨.
-   resource : view에 맵핑되는 layout 정보

이렇게 한줄짜리 ListView는 제공하는 adapter로 쉽게 만들 수 있다.

하지만 list에 사진도 넣고 이름도 넣고 싶을 것이다.

![](/images/android-school-26/2.png)

이런 식으로 item 하나에 두개 이상의 정보를 넣고 싶다면  
두 개 이상의 정보가 잇는 객체를 만들고 그 객체를 이용해서 arraylist를 만들면 가능하다.  
3개의 정보가 있는 객체는 기본적인 listview로는 할 수 없으나  
listview를 우리가 각자 custom 하여 만들어야 가능하다. 

* * *

### **CustomListView**

**※ 만들기 매우 어렵다..... ※**

-   ListCustomActiviy를 만들어준다.  
    위에서 만든 것처럼 <ListView />를 넣어준다.  
      
    
-   BaseAdapter를 상속 받아서 만들 것이기 때문에  
    lv\_data.setAdapter(view BaseAdapther(){  
    @override  
    public int getcount()  
    public object getItem  
    public long getItemId  
    public View getView <>  
    })  
    를 기본적으로 만들어준다.  
      
    추상 클래스를 만들려면 추상 메소드를 정리해놔야 하기 때문에  
    필요한 4가지들이다.  
      
    우선 만들어만 놓고 정보는 나중에 입력.  
      
    
-   Layout에 xml 파일 하나 새롭게 만들어준다.  
    list custom\_item.xml  
    item 안에 들어갈 data들 배치해 줄 예정이다.

![](/images/android-school-26/3.png)

-   패키지 안에 새로운 패키지를 만들어 listdata.java 파일을 새롭게 만들어준다.  
    여기에 data들이 들어갈 예정이다.  
    public class listData{  
    string 2개  
    boolean 1개  
    }

여기까지 하면 기본적인 작업이 끝났다.

* * *

ListCustomActivity.java

```html
...
import com.daelim.data.ListData;

public class ListCustomActivity extends AppCompatActivity {

    private ListView lv_data;
    private ArrayList<ListData> list = new ArrayList<ListData>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_custom);
        lv_data = findViewById(R.id.lv_data);

        list.add(new ListData("혁쨩","1004",true));
        list.add(new ListData("환쨩","0915",false));
        list.add(new ListData("준쨩","0202",true));

        lv_data.setAdapter(new BaseAdapter() {
            @Override
            public int getCount() {
                return list.size();
            }

            @Override
            public Object getItem(int i) {
                return null;
            }

            @Override
            public long getItemId(int i) {
                return 0;
            }

            @Override
            public View getView(int i, View view, ViewGroup viewGroup) {

                view = getLayoutInflater().inflate(R.layout.list_custom_item,viewGroup,false);
                TextView tv_1 = view.findViewById(R.id.tv_1);
                TextView tv_2 = view.findViewById(R.id.tv_2);
                ImageView img = view.findViewById(R.id.img);

                tv_1.setText(list.get(i).getTv_1());
                tv_2.setText(list.get(i).getTv_2());
                if(list.get(i).getBle()){
                    img.setImageResource(R.drawable.image);
                }else{
                    img.setImageResource(R.drawable.image2);
                }

                return view;
            }
        });
    }
}
```

-   ArrayList <> , list를 선언해줬다.  
    새롭게 만들어 논 ListData를 import 해놓은 걸 받아왔다.
-   findViewByID를 통해 ListView 객체를 생성.
-   list.add로 data 값들을 넣어줬다.  
    list.add(newListData("혁쨩", "111", "true"));  
    or  
    ListData data = new ListData("혁쨩", "111", true);  
    list.add(data);  
    둘 다 같은 말이니 적당하게 잘 사용하면 됨.
-   setAdapte(new BaseAdapter()를 통해 baseAdapter를 상속받아서 연결시켜줬다.  
    그러기 위해 꼭 필요한 getCount와 getView를 적어줬다.  
    -   getCount는 리스트 안에 몇 개를 뿌릴 것인지, 리스트에 보일 개수를 뜻한다.  
        고정값이 있는 것이 아니라면 리스트를 다 보여줄 때  
        list.size()를 사용한다.
    -   getView를 호출한다.  
        처음에는 int i 가 0인 상태로 getview를 호출하고 끝까지 반복한다.  
        i는 getCount에서 정한 개수. > list.size()로 했으므로 list 데이터 양만큼 반복.
    -   view에 보일 layout을 가져오기 위해서 inflater를 사용했다.  
        view = getLayoutInflater(). inflate(layout정보, viewgroup 정보, flase)  
        해주게 되면 view가 layout을 가지고 있는 view가 된다.  
        우리는 list\_custom\_item을 가지게 된다.
    -   각각 컴포넌트에 객체와 값 세팅해줬다.  
        이미지를 가지고 올 때는 setImageResource를 사용한다.

* * *

ListData.java

```html
package com.daelim.data;

public class ListData {
    private String tv_1, tv_2;
    private Boolean bl;

    public ListData(String str, String str2, Boolean b){
        tv_1 = str;
        tv_2 = str2;
        bl = b;
    }

    public void setTv_1(String str){ tv_1 = str;}
    public void setTv_2(String str){ tv_2 = str;}
    public void setBle(Boolean b){ bl = b;}

    public String getTv_1(){
        return tv_1;
    }
    public String getTv_2(){
        return tv_2;
    }
    public Boolean getBle(){
        return bl;
    }

}
```

-   get, set 함수를 만들어 ListCustomActivity에서 사용을 하였다.

* * *

### **Inflate**

-   xml에 표기된 레이아웃들을 메모리에 객체화시키는 행동.  
    XML 코드들을 객체화해서 코드에서 사용하기 위함.

다른 화면을 구성하는 xml을 불러오고 싶을 때 사용한다.  
자동으로 생성된 xml이 아닌 사용자가 추가적으로 만든 xml을 객체화시켜서 코드에서 사용할 때 사용.

 [안드로이드 Inflate 이란?

Inflate 란 부풀게 하다란 뜻이다. 안드로이드에서 Inflate의 정의는 xml 에 표기된 레이아웃들을 메모리에 객체화시키는 행동이다. 쉽게 말해서, XML 코드들을 객체화 해서 코드에서 사용하기 위함이

soo0100.tistory.com](https://soo0100.tistory.com/1017)

여기서 더욱 자세하게 알아볼 수 있습니다!!
