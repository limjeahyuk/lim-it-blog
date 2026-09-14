---
author: developer
title: ShapeSpider MVP 개발
slug: shapespider-mvp
description: ShapeSpider MVP 개발 정리
heroImage: https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789362804/mbb3sk850xacvjd2txmk.png
pubDate: 2026-09-14
project: shapespider
draft: false
secret: false
---
## MVP 개발

기획 문서를 보고 MVP를 바로 개발에 들어갔습니다.

우선 Claude 디자인 대로 화면부터 만들었습니다.  


그런데 만들면서 두가지가 거슬렸습니다.

1. hex code 사용.
2. 매번 새로운 컴포넌트 생성.



그렇기에 Claude.md 에 작성하고 갔습니다.

```
- 개발 중 요소를 만들어야 하는 상황에서는 `components` 폴더 내부에 있는 컴포넌트를 우선적으로 사용하기.
  - 새로운 요소가 있을시에는 컴포넌트를 만들고 여기에 하단에 어떤 컴포넌트인지 작성 (설명은 최대 3줄 이하로)
- `theme.ts` 의 Color를 사용.
  - 만약 새로운 헥사코드를 사용해야하는 상황에서는 Color 내부에 선언 후 사용.
  - 코드에 직접적으로 hex 코드 사용하지 않기.

## Components (`src/components/`)

- `Button` — 목재(`wood`)/황금(`primary`) 질감 버튼. `selected`로 토글 상태, `size`로 md/lg.
- `IconButton` — 원형 목재 아이콘 버튼. `label`이 aria-label로 들어간다.
- `Panel` — 목재(`wood`)/녹색(`green`)/황금(`gold`) 질감 컨테이너.
- `PieceIcon` — 장식용 폴리오미노 아이콘. `[r, c]` 좌표 목록을 CSS Grid로 그린다.
- `Card` — 크림색 종이 질감 도형 카드. `title`/`meta`/`label`과 아이콘 슬롯, `selected`면 라벨이 "선택됨"으로 바뀐다.
```

이렇게 작성을 하고 나니 원하는 대로 theme.ts에 모든 색상이 저장되어서 그에 맞게 공통적으로 사용하고 있었습니다.

추가로 component를 똑같은거를 계속 만들지 않고 가져다 사용하니 훨씬 보기 좋고 오류도 찾기 편했습니다.

---

### Ponytail

<img src="https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789368910/wdimielt7y24x32afbel.png" alt="설명" width="427">

ponytail의 명령어를 사용하면 지금 사용하고 있지 않는 함수나 그런것을 설명해줍니다.

바로 파악해서 말해주니까 생각보다 좋은 것 같습니다.

그런데 이게 그냥 질문 할때마다 도는 지는 정확히 모르겠어서... 잘 되고 있는 지? 

이전보다 뭐가 좋은지는 솔직히 모르겠습니다.



그래도 제가 항상 안쓰는 함수 찾아서 정리해줘 라고 직접 말하지 않아도 돼서 그 점은 좋은 것 같습니다.

### Graphify

<img src="https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789369037/myeub6wvvebzxo7rv1tf.png" alt="설명" width="539">

<mark>뭔가 엄청 예쁘게 생겼당</mark>

이렇게 정리를 해주는 데 이 부분으로 제가 파악하기는 힘들겠다는 생각이 들었습니다.

그냥 꽤나 잘 정리되어있군! 이정도?



그 부분은 ai가 확인해서 토큰을 아끼고 매번 코드를 보는 수고를 더는 용도라고 하니

그냥 그렇구나 하고 사용하는 것 같습니다.



위 두 부분은 직접적으로 뭔가 보여지는게 없다보니까 아직까지 좋은지 모르겠고 사용중인것 같습니다.

똑같은 프로젝트에서 하나는 쓰고 하나는 안쓰고 해서 그런 대비효과를 봐야 그때 체감이 될 것 같습니다.

---

### 호스팅

1. Firebase
2. Vercel



둘 중 하나로 하려고 했습니다.

그런데 지금 당장 랭킹 또는 그런것을 추가할 예정도 없을 뿐더러 그냥 빠르게 볼 수 있었으면해서

Vercel을 이용하기로 했습니다.



바로 git을 연결하고 바로 설정 완료 했습니다.



그렇게 blog에 service 탭에 하나 더 추가까지 완료 했습니다.



![설명](https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789369282/cc8fvvwlnw1vzvxhk0a3.png)

