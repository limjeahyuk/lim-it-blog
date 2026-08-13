---
title: '[Tumbl] React 최근 본 페이지 구현'
pubDate: 2022-08-29
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/55
---
쇼핑몰 같은 프로젝트를 만들다 보면 최근 본 프로젝트를 만들어야 합니다.

저희 프로젝트 또한 그 기능이 있었습니다.

![](/images/react-55/1.png)

여러 가지 방법이 있겠지만 저는 사용자가 프로젝트를 클릭하여 상세 페이지에 들어갔을 때 localstorge에 저장을 하여 보이도록  
구현했습니다.

```javascript
const localUpload = (item) => {
        let get_local = localStorage.getItem("data");

        if (get_local === null) {
            get_local = [];
        } else {
            get_local = JSON.parse(get_local);
        }

        get_local = get_local.filter(item => item.projectIndex !== Number(id));

        get_local = [item, ...get_local];
        localStorage.setItem('data', JSON.stringify(get_local));
        console.log(JSON.parse(localStorage.getItem('data')))
    }
```

만약 사용자가 프로젝트를 클릭하여 상세 페이지에 들어갔을 때 localUpload를 실행하도록 하였습니다.

item은 메인에서 카드 형태로 보이기 위한 최소한의 값들을 추려서 넣어줬습니다.

먼저 localStorge에서 data라는 이름의 데이터를 가지고 옵니다.

만약 그 데이터가 없다면? get\_local에 빈 값을.  
있다면? JSON.parse를 해서 가져옵니다.

여기서 JSON.parse를 하는 이유는 localStorge의 경우 text로만 저장이 가능합니다.  
그렇기에 저장할 때는 JSON형식의 데이터를 text로...  
가져와서 사용할 때는 text를 JSON형식의 데이터로... 변경을 하는 작업이 필수로 필요합니다.

데이터를 가지고 왔다면 filter를 이용하여 projectIndex가 같은 데이터들을 걸러줍니다.  
이유는? 예전에 봤었던 프로젝트를 새롭게 업데이트를 해주는 작업입니다.  
같은 프로젝트가 여러 개 들어가 있으면 그것만큼 비효율적인 것이 없기 때문입니다.

걸러줬다면 localStorge에 넣어줄 데이터 ( item )을 배열에 추가해줍니다.  
최근에 본 프로젝트가 앞에 나와야 하기에 스프레드 연산자를 사용하여 추가해줬습니다.

전부 세팅이 끝났다면 data를 text화 시켜서 localstorge에 저장합니다.

최근 본 프로젝트를 보여줄 때는

```javascript
const data = JSON.parse(localStorage.getItem('data'));

 {data.map((prom, index) => (
                            <SwiperSlide key={index}>
                                <Grid item xs={2.4}>  
                                    <ProjectCards project={prom} size={'m'} />
                                </Grid>
                            </SwiperSlide>
                        ))}
```

localstorge에서 data를 가지고 와서 json 형식으로 변환 한 뒤 map 함수를 돌려줬습니다.

#### \- 문제점 - 

1\. reverse  
지금은 고쳤지만 원래는 그냥 배열 끝에 저장 후에 reverse를 통해 배열을 뒤집어줬습니다.  
reverse는 쓸 때는 고작 한 단어라서 더욱 쉽고 간편하지만 컴퓨터의 입장에서는 reverse를 사용하게 되면 꽤나 큰 무리가 갑니다.  
배열을 뒤집는 작업이 생각보다 쉬운 작업이 아니기 때문에 최적화를 위해서라도 처음 저장할 때 뒤집어서 저장되도록 하는 것이 좋습니다.

2\. localstorge 길이를 생각할 것  
localstorge의 저장소가 무한대도 아니고 길이를 생각해서 5개만 저장되도록 하던가  
저장하는 데이터를 projectindex 같은 고유한 값만 저장하여 main에서 보일 때마다 서버에서 받아서 사용하는 것도 방법입니다.  
둘 다 장단점이 있으니 상황에 맞춰서 잘 사용하는 것이 좋을 듯합니다!
