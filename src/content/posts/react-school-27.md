---
title: '[React] LocalStorage'
slug: react-school-27
pubDate: 2022-04-15
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/27
---
### **\- WebStorage**

브라우저 상에서 데이터를 저장하는 용도.

데이터를 서버에 저장하는 경우가 많겠지만 크게 중요하지 않거나  
api data 갱신 주기를 맞출 때 브라우저 상에 저장하여 사용.

webstorage에는 localStorage와 sessionStorage로 나뉜다.

#### localStorage **vs** sessionStorage

localStorage와 sessionStorage 둘 다 web 애플리케이션 전역에 접근 가능하다.

localStorage의 데이터는 직접 삭제하지 않는 이상 영구히 유지가 되는 반면  
sessionStorage는 해당 페이지가 닫을 때 사라진다.  
데이터를 자주 삭제해줘야 하는 경우가 아니라면 local을 주로 사용하는 편

#### **Api**

localStorage와 sessionStorage 둘 다 모두 setItem(key, value) 형태로 저장하고  
getItem(key)를 사용하여 저장된 데이터를 가져올 수 있습니다.

![](/images/react-school-27/1.png)

이런 식으로 setItem은 cityName으로 뒤에 값을 저장합니다.  
getItem은 chityGetDate의 데이터를 가져옵니다.

#### **데이터가 여러 개 라면?**

localstorate에는 text 데이터만 가능하다.  
하지만 json 형식으로 여러 가지 값을 넣고 싶을 때는???

![](/images/react-school-27/2.png)

이런 식의 값을 localStorage에 저장하고 싶을 때는  
 JSON.stringify(userData);  
을 사용.

JSON.stringify > json 파일을 텍스트 파일로 변경해준다.

```html
const userData = {
name: "홍길동",
age: 21
}

const stringJsonData = JSON.stringify(userData);

console.log(stringJsonData);

// 결과값
// "{\&quot;name\&quot;:\&quot;홍길동\&quot;,\&quot;age\&quot;:21}"
```

이런 식으로 json 형식의 파일을 text 파일로 변경해준다.

text로 변경한 것을 다시 json형식으로 가져오고 싶을 때는?  
JSON.parse(userData);  
를 사용.

JSON.parse > text 파일을 json파일로 변경해준다.

```html
const userData = localStorage.getItem('userData');

const jsonParseData = JSON.parse(userData);

console.log(jsonParseData);

/* 결과값
const jsonParseData = {
name: "홍길동",
age: 21
}
*/
```

이런 식으로 사용한다.

1.  json 방식으로 값을 입력한다.
2.  json 방식의 데이터를 text로 변경하여 localStorage에 저장한다. ( JSON.stingify )
3.  localStorage에 저장되어 있는 text를 json 방식으로 변경하여 사용한다. ( JSON.parse )

\* stringify는 무조건 json 형식이어야 한다. > text를 넣으면 오류..

* * *

### **\- 사용 예제**

```html
useEffect(() => {
    //현재 시간 - 로컬스토리지에 저장한 시간 = 로컬스토리지에 저장한 시간으로부터 흘러간 시간이 나옴
    // 흘러간 시간이 10분 미만이면 로컬스토리지에 저장한 날씨 데이터를 활용
    // 흘러간 시간이 10분 이상이면 openApi를 호출.
    const cityName = selectedCityData.name;
    const cityGetDate = cityName + '_저장시간';
    if ((Date.now() - localStorage.getItem(cityGetDate)) / 1000 / 60 > 10) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCityData.lat}&lon=${selectedCityData.lon}&lang=kr&units=metric&&appid=db07f8319467878d8d2ee4c5d2b038b4`,
        )
        .then((res) => {
          setWeatherData(res.data);
          localStorage.setItem(cityName, JSON.stringify(res.data));
          localStorage.setItem(cityGetDate, Date.now());
        })
        .catch((error) => {
          setApiError(error);
        });
    } else {
      setWeatherData(JSON.parse(localStorage.getItem(cityName)));
    }
  }, [selectedCityData]);
```

-   API 호출에는 제한이 있는 경우가 많다. (1분에 60번)  
    그래서 10분 간격으로만 api를 호출하도록 하게 하고 싶다.
-   date.now()는 현재 시간을 저장하는 것으로 밀리초 단위이기 때문에 1000을 나누면 1초,  60000을 나누면 1분
-   if문을 사용하여 10분 이상일 때만 api를 새로 호출하고  
    그게 아닐 시 localStorage에 저장되어 있는 값을 사용한다.

* * *

### **\- 사용 예제. 2**

![](/images/react-school-27/3.png)

새로고침을 하더라도 전에 선택한 것으로 선택되어 있도록 만들기.

![](/images/react-school-27/4.png)

1~9까지 map 함수를 이용하여 9가지를 id값과 함께 지정해준다.

![](/images/react-school-27/5.png)

1.  지정해준 id 값을 props에 저장해준다.
2.  defaultCityName으로 초기값을 설정해준다. id\_city가 없으면 안양으로 설정해준다.  
    localStorage.getItem(id + '\_city')? localStorage.getItem(id+ '\_city') : '안양';  
    과 같은 말. 생략하면 위 코드처럼 사용 가능하다.  
    반대라면  && '안양'으로 사용 가능.
3.  도시 선택을 할 시 ( selectHandleChange ) 선택한 도시를 localStorage.setItem으로 id\_city로 저장해준다.
4.  setselectedCityData를 통해 data.name과 defaultCityName이 같은 것을 찾아서 바꿔준다.

이런 식으로 localStorage에 박스마다 선택한 값을 저장해준다.
