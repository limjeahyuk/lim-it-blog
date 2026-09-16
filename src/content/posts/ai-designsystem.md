---
author: developer
title: AI가 쓰기 좋은 디자인 시스템
slug: ai-designsystem
description: Claude를 이용해서 화면을 구성할때 쓰기 좋은 디자인 시스템
pubDate: 2026-09-16
draft: false
secret: false
---
## 디자인 시스템

> 요즘은 AI로 화면을 만드는 게 압도적으로 빠르고 퀄리티도 좋습니다.



예전에 화면을 만들때는 디자이너와 소통을 원활하게 하고 앞으로 더 나은 유지보수와 빠르게 수정하기 위해서   
제 개인적으로 디자인 시스템이라는 것을 직접 만들어서 사용하곤 했습니다.

그래서 다른 프로젝트를 들어갈 때 해당 시스템을 복붙을 해서 빠르게 쓰고 점점 고도화 시켜서 저만의 자산으로 가지고 있으려고 했으나..

이제는 사실 AI 딸깍이면 화면이 만들어지는 세상이다보니..

이게 큰 의미가 없어져버렸습니다. ~~그저 데이터 쪼가리..~~

![설명](https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1789524079/hnawawynnud9lcck8ney.png)



최근에 여러 페이지와 개인 프로젝트를 AI를 이용해서 만들고 코드를 살펴보고 있었습니다.

그런데 매번 똑같이 비슷한 컴포넌트는 다 따로 만들고 정리가 하나도 안 되는 느낌이였습니다.

나름대로 만들기는 하는데... 그냥 props로 전달해서 같은 거 써도 문제 없을 것 같은데??



유지보수를 하려하니 이야... 이건 뭐 다 margin을 사용해서 간격 조절을 하고 있지를 않나

어디인지 찾는것도 한세월이여.. 안되겠다 결국 AI야 해줘잉!!

그런 저한테서 약간의 현타가 오더라구요..



**혼자 해볼래!** 하고 결국 하긴 했는데 좀 불안한 느낌은 떨칠 수 없었어요

---

## AI가 사용하기 좋은 디자인시스템을 만들자



사실 결국 AI가 만드는건 만들지만 어느정도 유지보수와 코드를 볼 때 아하! 여기가 여기구나! 최소한 이정도는 알 수 있도록 코드를 짜고 싶었습니다.

그리하여 제가 혼자서 만들던 디자인 시스템 (limSystem)을 대폭 수정하기로 했습니다.



우선 어떤 방식으로 해야할지 또 가장 많이 쓸 친구한테 물어보기로 했습니다.

### Claude가 쓰기 좋은 디자인 시스템의 조건

####  추측 없애기

- **예측 가능한 Props 사용하기**

현재 사용중인 props는 `size="1"|"2"|"3"`, `variant`, `color: ColorType`, `radius` 이렇게 입니다.

그런데 `textInput`의 경우에는 `small|medium` 이런식으로 사용 중인데 **예외는 제거하고 공통적으로 사용해야합니다.**



- **확실한 타입.**

**Claude는 마크다운 문서보다 exported 타입을 먼저 읽습니다.**

그렇기에 타입만 정확하면 문서가 없어도 알맞은 값을 넣습니다. 반대로 타입이 느슨하면 문서가 아무리 좋아도 틀린 값을 넣을 수가 있습니다.



- **하나의 진입점**

현재 `import { Button } from 'src/components/button` 이런식으로 사용중입니다.  
이보다는 `import { Button, Flex } from 'src/compoents'` 이처럼 한 곳에서 import 할 수 있도록 하면 좋습니다.

component마다 export 방식이 다르면 매번 찾아야하니 힘듭니다.



- **제어/비제어 패턴 통일**

`value` / `defaultValue` / `onChange`시그니처가 컴포넌트마다 다르면 가장 자주 틀립니다. 

지금 `Switch`는 `onChange(checked: boolean)`, `Checkbox`는 `onChange(event)`, `Select`는 `onChange(value: string)`

세 가지가 섞여 있습니다. 하나로 정하는 것이 더 좋습니다.



- **토큰 사용 권장.**

hex 코드 사용 금지 후 Color / Radius 를 허용하도록 되어있습니다.

이 부분은 Claudemd에 규칙으로 명시되어 있기에 그대로 따릅니다.

spacing (4/8/12/16...) 같은 것들도 토큰으로 묶으면, 임의로 숫자를 찍는 실수가 사라집니다.



- **semantic 토큰 층**

primitive(`BLUE_500`) → semantic(`ACCENT`, `BORDER_DEFAULT`, `TEXT_PRIMARY`, `BG_DISABLED`) → component. 

컴포넌트는 semantic만 참조. 이게 없으면 프로젝트마다 서로 다른 컬러를 맞추기 위해 신경을 더 써야합니다.



- **개념당 컴포넌트 하나**

`Badge`/`BadgeBasic`, `Button`/`ButtonBasic` 사실 같은 것들인데 컴포넌트가 따로 있기에 혼동이 오게 됩니다.



- **이름의 일치**

컴포넌트명 = 파일명 = 폴더명 = 스토리 제목 = export명. 

segment/SegmentController.tsx → `SegmentedControl` 같은 불일치 제거



- **타입은 단순하게**

제네릭 폴리모픽 대신 `as?: "div" | "span"` 유니온. 

읽을 수 있는 에러 메시지를 권장합니다.

#### 우회 없애기

- 탈출구

컴포넌트마다 `className`, `style`, `...rest`, `forwardRef`같은 것들이 없으면 해당 기능을 추가하기 위해서 wrapper div를 추가합니다.

이가 코드를 더럽히는 원인이 되기도 합니다. 



- **Compound Components** 

`Dialog나 Dropdown의 경우 현재 props로 모든 것을 받고 있습니다.`

```
<DialogContent
  title="삭제"
  desc="정말 삭제하시겠습니까?"
  content={<Text>...</Text>}
  footer={...}
  onCancel={...}
  onSubmit={...}
  cancelText="취소"
  submitText="삭제"
/>
```

위 방식의 문제는 요구가 조금만 달라져도 props가 마구마구 늘어납니다.

그래서 어떤 조합이 되고 안되는 지 매번 확인해야합니다. 만약 그러다가 footer props에 통째로 직접 만들어 넣는데,

그러면 cancelText 같은 나머지 props가 죽어버립니다.



컴파운드 컴포넌트의 경우에는 직접 조립이 가능하게 됩니다.

```
<Dialog>
  <Dialog.Trigger><Button label="삭제" /></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>삭제</Dialog.Title>
    <Dialog.Description>정말 삭제하시겠습니까?</Dialog.Description>
    <Dialog.Body>...</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close><Button variant="ghost" label="취소" /></Dialog.Close>
      <Button color="RED" label="삭제" onClick={remove} />
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

레고 맞추듯이 그냥 필요한 것만 빼서 넣으면 됩니다.



Claude 입장에서 위 방식이 좋은 이유는 안되는 조합이 없어서 추측할 게 없다는 것입니다.

부품 목록만 알면 뭐든 만들 수 있고, 만든 결과가 시스템 밖으로 새지 않습니다.



**모든 component를 다 컴파운드 컴포넌트로 만들라는 뜻은 절대 아닙니다.**

Button 처럼 내부 구조가 고정이고 변형이 유한하면 props로 전달하는 것이 맞습니다.

컴파운드 컴포넌트 사용에 유리한 컴포넌트는 주로 Dialog, Card, Dropdown 같은 컴포넌트들이 대표적인 예입니다.



- **슬롯은 ReactNode**

`startIcon?: IconName`은 아이콘만 됩니다. 그런데 다른 것도 열어두는 것도 추천합니다.

```
startIcon?: IconName   // "search" | "plus" | ...
```

편리하지만, 아이콘 이름 문자열만 받습니다. 그러면 아래 요구에서 막힙니다.

- 로딩 중 버튼 : 아이콘 자리에 `spinner`
- Avater 버튼 : 아이콘 자리에 `Avatar`
- 색이 다른 아이콘 버튼 : `Icon color ={Color.Red}`



이런 요구로 막히게 되면 새로운 버튼을 만들게 됩니다.

그 순간 버튼은 시스템 밖입니다.



그렇기 때문에 `IconName | React.ReactNode` 로 해버리면 모두 가능합니다.



- **안되는 것은 우회하지 말도록 설정**

컴포넌트로 표현 안 되면 멈춰서 (a) 디자인을 맞추거나 (b) 시스템에 variant 추가. 

결정은 사람이 해야합니다. 시스템이 무너지는 1순위 경로.



- **컴포넌트가 없으면 컴포넌트로 먼저 만든다**

화면을 짜다가 컴포넌트에 없는게 나오게 되면, 두가지 방법이 있습니다.

인라인

```
// src/app/dashboard/page.tsx
const StatCard = styled.div`
  padding: 16px;
  border: 1px solid ${Color.GRAY_200};
  border-radius: 8px;
`;
```

지금 당장은 빠릅니다. 하지만 다음 화면에서 또 나오면 또 똑같은 것을 만들게 됩니다.  
지금 디자인 시스템을 만드는 이유에 위배됩니다.

그렇기 때문에 다른 시스템이 나오면 바로 컴포넌트로 만들어 두고 추가합니다.

그렇게 화면에서는 조립만 하면 되도록 최대한 유지합니다.



- **레이아웃 규칙**

간격은 `Flex`/`Grid`의 `gap`, `margin` 금지. 이유와 예외를 함께 명시.



- **규칙은 lint로 강제** 

프로즈는 대부분 지켜지고 lint는 항상 지켜짐. raw hex, margin, 화면 안의 styled는 lint까지.



- **번들러 중립 소스**

`next/*`, `import.meta.env`, `?raw`, SVGR 금지. 필요하면 `TabNav`의 `linkComponent`처럼 prop 주입. `SvgIcon`은 제거.

#### 틀렸을 때 알게 하는 것

- **실행 가능한 예제**

Storybook 스토리. 정답 사용법 복사 + 브라우저 검증.



- **화면 단위 레시피**

폼 페이지, 목록+필터, 상세 페이지 2\~3개를 스토리로. 원자 조합 방식은 여기서 복사.



- **검증 명령 하나**

`npm run check` = tsc + lint + storybook build.



- **잘못 쓰면 시끄럽게 실패**

`list`에 없는 `value`, `Dialog` 밖의 `DialogContent`는 dev 경고나 TS 에러로.



- **결정 기록** 

"왜 Emotion", "왜 data-\*", "왜 size가 문자열" 세 줄씩. 의도된 구조를 리팩터링으로 되돌리는 것 방지.



- **접근성은 컴포넌트 안에**

포커스 트랩, 키보드 이동, aria. 컴포넌트가 하면 공짜, 안 하면 화면마다 잊음.



- **규칙은 CLAUDE.md에**

짧게, 디렉토리별로 분리. 컴포넌트 목록 + 한 줄 설명 + 대표 예제 표 포함.



---

### 이제까지 생각한 것과 많이 다른점



디자인 시스템을 만듦면서 제가 생각한 것은 모든 것을 풀어주지 않고 제한적으로 사용하되 그것을 통제하고 그것에 맞춰서 사용할 수 있게끔 구조를 만들었습니다.

그런데 이제 AI가 사용할 디자인 시스템을 만든다고 생각을 하니.. 모든 것을 생각해야하나? 싶기도 하면서 어떻게 처리를 해야할 지 고민이 됩니다.



간단하게 예를 들어서 위에서 `ReactNode`를 전부 뚫어주는 것도 제가 이제까지 만든 디자인 시스템에 대한 룰? 에는 조금 위배가 되는 느낌입니다.

물론 ReactNode로 뚤으면 다 넣을 수 있으니까 제가 개발할때는 매우 쉽고 좋습니다.

그런데 해당 디자인 시스템을 누군가가 쓴다고 생각했을 때 Icon으로 잡혀있으면 "아 icon을 넣는 곳이구나" 하고 생각이 들게 됩니다.

ReactNode로 뚫어져있으면 어떻게 넣어야하지? 하고 한차례 멈칫 하게 되어버립니다.



그런데 또 쓰다보니까 어짜피 AI가 이해만 하면 되는 건데... 라는 생각도 들기도 합니다..



아무튼 여러 생각이 드는데 좀 찾아보고 더 작성해보겠습니당



&nbsp;

&nbsp;

&nbsp;
