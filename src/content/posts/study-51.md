---
title: 'nodejs 여러가지 검색'
pubDate: 2022-07-28
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/51
---
![](/images/study-51/1.png)

이런 류의 검색창을 만들었습니다.

옆에 드롭다운 버튼을 이용하여 사용자가 어떤 것을 검색할 것인지 고를 수 있도록 했으며

전체로 검색도 가능하게끔 했습니다.

```javascript
// front
 const onSearchSubmitHandelr = (e) => {
        e.preventDefault();
        navigagte(`/search/${searchCont.trim()}`, { state: searchSel });
        setSearchCont('');
    }

<form onSubmit={onSearchSubmitHandelr}>
                <select onChange={onChangeSel} value={searchSel}>
                    <option value="all">전체</option>
                    <option value="cartegory">카테고리</option>
                    <option value="title">제목</option>
                    <option value="cont">내용</option>
                    <option value="nick">판매자</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchCont}
                    onChange={onSearchHandler}
                    onClick={onSearchClear}
                />
                <button><SearchIcon/></button>
            </form>
```

-   tirm() 은 그냥 스페이스바를 전부 없애는 줄 만 알았습니다. 하지만 알고 보니 앞 뒤 스페이스바만 없애는 역할을 하더라구요,.  
    검색창 같은 경우에 딱 맞는 역할 입니다.  
    사용자가 쓴 단어에는 스페이스바가 있어야하지만 앞 뒤에는 없어도 큰 상관 없으니깐요.
-   navigate를 이용하여 props 처럼 값을 넘기는 방법으로 {state : XXX} 가 있습니다.

```javascript
 // search js
 
 const { cont } = useParams();

    const { state } = useLocation();

    const sendFullRequest = async () => {
        const response = await axios.get(`http://localhost:8080/search/${state}/${cont}`);
        if (response.data === '검색결과가 없습니다') {
            setSearchNull(false);
        } else {
            setSearchData(response.data);
            setSearchNull(true);
        }
    }
```

-   값을 받아 올때는 useLocation을 이용하여 state 값을 가져옵니다.

* * *

서버쪽을 보면

```javascript
// 검색어를 이용하여 검색.
app.get("/search/:way/:cont", function (req, res) {
    const searchcont = req.params.cont;
    const searchWay = req.params.way;

    let query;
    switch (searchWay) {
        case "all":
            query = `select * from user join product join (select product_id, group_concat(cartegory_name) as "cartegory" from cartegory join connect on
                connect.cartegory_index = cartegory.cartegory_index
                group by product_id) as car on user.userid = product.userid and product.proid = car.product_id
                where user.usernick like '%${searchcont}%' or car.cartegory like '%${searchcont}%' or product.proname like '%${searchcont}%' or product.procont like '%${searchcont}%'`
            break;
        case "cartegory":
            query = `select * from product join (select product_id, group_concat(cartegory_name) as "cartegory" from cartegory join connect on
                connect.cartegory_index = cartegory.cartegory_index
                group by product_id) as car on product.proid = car.product_id
                where car.cartegory like '%${searchcont}%'`
            break;
        case "title":
            query = `select * from product join (select product_id, group_concat(cartegory_name) as "cartegory" from cartegory join connect on
                connect.cartegory_index = cartegory.cartegory_index
                group by product_id) as car on product.proid = car.product_id
                where product.proname like '%${searchcont}%'`
            break;
        case "cont":
            query = `select * from product join (select product_id, group_concat(cartegory_name) as "cartegory" from cartegory join connect on
                connect.cartegory_index = cartegory.cartegory_index
                group by product_id) as car on product.proid = car.product_id
                where product.procont like '%${searchcont}%'`
            break;
        case "nick":
            query = `select * from user join product join (select product_id, group_concat(cartegory_name) as "cartegory" from cartegory join connect on
                connect.cartegory_index = cartegory.cartegory_index
                group by product_id) as car on user.userid = product.userid and product.proid = car.product_id
                where user.usernick like '%${searchcont}%'`
        }

    connection.query(query, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.send("검색결과가 없습니다")
        }
    })
})
```

-   어마어마하게 많습니다. 
-   좀 더 잘 만드면 코드를 줄일 수 있을 것 같습니다만... 우선은 저렇게 만들었습니다.
-   way를 통해 사용자가 드롭다운에서 어떤 것을 골랐는 지 확인 후 쿼리문을 그것에 맞춰서 고칩니다.
-   그렇게 나온 결과를 다시 프론트에 보내줍니다.

* * *

db

![](/images/study-51/2.png)

카테고리를 여러개 할 때 어떤 식으로 해야할 지 고민이 엄청 많았습니다.

그냥 product에 넣자니 만약 카테고리가 막 5개 6개 넘어가게 되면  
product 테이블에 카테고리 컬럼만 5개 6개가 되는 것이고 이건 아니다 싶어서 카테고리 테이블을 따로 만들었습니다.

그후 connect 테이블을 이용하여 product와 연결해줫습니다.

그렇게 하여 검색할 때 product, cartegory, connect를 join 해줘야합니다.
