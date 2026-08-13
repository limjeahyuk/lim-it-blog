---
title: '[1] 화면 구성 (Routes) & props 구조분해'
pubDate: 2022-07-22
category: study
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/49
---
### **만든 페이지 기본 구성**

![](/images/study-49/1.png)

이런 식의 페이지를 만들었습니다.  
메인 화면에는 게시물들이 쭈욱 나열 되어 있으며 클릭했을 때는

![](/images/study-49/2.png)

이런 식으로 게시물이 나오게 됩니다.

여기서 봐야하는 건 **헤더부분은 어디서든 보이도록 구현 했습니다.**  
뭐... 모든 프로젝트마다 위에 헤더 컴포넌트를 넣어줘도 작동만 잘 한다면 상관은 없겠지만...

![](/images/study-49/3.png)

페이지 갯수가 정말 많아요... 여기다가 똑같은 태그를 계속 넣어주는 것도 매우 스트레스가 받을 것 같더라구요

```javascript
//App.js

<BrowserRouter>
        <HeadBox isLogin={isLogin} userName={userName} userId={userId} isLoginCheck={isLoginHandler} />
        <Routes>
          <Route path="/" element={<ShopMain userId={userId} />} />
          <Route path='/login' element={<Login isLoginCheck={ isLoginHandler} />} />
          <Route path='/sign' element={<Sign />} />
          <Route path='/post' element={<Post userId={userId} />} />
          <Route path='/item/:id' element={<Item name={userName} />} />
          <Route path='/mypage/:id' element={<MyPage userId={userId} isLoginCheck={isLoginHandler} />} />
          <Route path='/userupdate' element={<UserUpdate name={userName} userId={userId} isLoginCheck={isLoginHandler} />} />
          <Route path='/search/:cont' element={<ShopSearch userId={userId} />} />
          <Route path="/search" element={<ShopMain userId={userId} />} />
          <Route path="/proupdate/:id" element={<ProductUpdate  />} />
        </Routes>
      </BrowserRouter>
```

이렇게 넣어주게 되면 헤더 (HeadBox)는 항상 위에 고정되며 밑에 내용들만 url에 의해 바뀌게 됩니다.

footer도 동일 한데 footer는 작동하는 것이 아무것도 없는 그냥 색깔만 채우는 용이라서 그냥 밑에 div로 넣어줬습니다.

* * *

App.js에서 좀 신기한 것들이 있어요. :id ? 이게 뭐람

/item/:id를 예시로 보면

![](/images/study-49/4.png)

아이템을 선택할 때 아이템이 100개라고 100개의 페이지를 만들 수는 없잖아요.  
결국 안에 내용만 다르고 같은 페이지인데,...

params를 이용하여 번호를 넘겨주는 것입니다.  
db에서 index가 첫번째인 아이템을 선택하면 item/1  
index가 두번째인 아이템을 선택하면 item/2

```javascript
//Item.js

const Item = ({name}) => {
    const [itemData, setItemData] = useState({});
    const { id } = useParams();

    const navigagte = useNavigate();

    const sendRequest = async () => {
        const response = await axios.get(`http://localhost:8080/item/${id}`);
        setItemData(response.data);
        console.log(response.data);
    }

    useEffect(() => {
        sendRequest();
    }, []);
```

-   위에서 설명한 것 처럼 params로 얻은 id를 저장했습니다. const {id} = useParams();
-   id를 이용하여 서버에서 item의 정보를 불러왔습니다. sendRequest
-   item의 정보는 useEffect를 이용하여 처음 랜더링 될 때 바로 시작되도록 했습니다.

* * *

### **Props 구조분해**

```javascript
const ShopSearch = ({userId}) => {
    const [searchNull, setSearchNull] = useState(false);
    const [searchData, setSearchData] = useState({});
    const { cont } = useParams();
```

props로 쓰고 props.userId라고 쓰는 것보다는 {userId}라고 지정을 해주면  
처음 코드를 볼 때도 userId가 props로 넘어왔구나... 라고 한 눈에 알아차릴 수가 있습니다.

그런데 저렇게 넘겨주는 것이 매우매우 많을 때는???  
예를 들어

```javascript
const Hyuk = ({a, b, c, d, e, f, g, h ,....}) => {
...
```

이러면 오히려 더 지저분 하기도 합니다.

그리고 props를 넘겨줄 때도 매우 지저분합니다.

```javascript
<Hyuk 
  a={a}
  b={b}
  c={c}
    ...
/>
```

이럴 때는 데이터들을 묶어서 보내주는 것이 깔끔합니다.

```javascript
// 보낼 때
<ShopProduct
                bool={true}
                key={index}
                cont ={item}
                id={userId}
            />
            
//받을 때

const ShopProduct = ({ bool, id, cont }) => {
    const { proid, proimg, proname, userid, proca, quantity, date, price, count, proca2 } = cont;
```

받은 다음 구조분해할당을 해주면 좀 더 보기 쉽고 깔끔하고 좋습니다 😀

* * *

구조분해할당은 react 뿐만 아니라 nodejs에서도 충분히 가능합니다.

![](/images/study-49/5.png)

api로 넘겨주는 데이터를 받을 때 서버에서는  req.body.username 로 넘겨받습니다.  
지금은 두 개 뿐이니까 그러려니 하지만... 저것도 많아진다면 분명 보기도 힘들고 코드가 더러워질 것이 뻔합니다.

![](/images/study-49/6.png)

이런식으로 구조분해할당이 가능합니다.
