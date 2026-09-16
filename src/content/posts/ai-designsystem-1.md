---
author: developer
title: AI 가 쓰기 좋은 디자인 시스템 part.2
slug: ai-designsystem
description: Claude 프로젝트에서 쓰기 좋은 디자인 시스템을 만들어보자
pubDate: 2026-09-16
draft: false
secret: false
---
## 디자인 시스템 수정

> 거의 모든 React 프로젝트에서 사용이 가능하도록, AI가 보고 실수 없이 잘 만들 수 있도록 수정.

#### 레포 프레임워크

현재 제 프로젝트는 Next로 되어있습니다. 이는 만들 당시 Next와 친해지고자 만들었던 것입니다.

그런데 어짜피 StoryBook을 사용할 것이고 그냥 복붙해서 사용할 것이기 때문에 프레임워크는 크게 상관 없습니다.

조금이나마 가벼운 Vite를 사용하는 게 맞을 것 같습니다.

#### Emotion vs CSS Modules

- Emotion 
  - 현재 프로젝트는 Emotion을 사용 중입니다.
  - 동적 prop로 자연스럽고 TS 타입 토큰을 사용 중이기에 더욱 쉽고 가볍게 사용 가능합니다.
  - 대상 프로젝트에 Emotion 설치를 해야하고 , Next면 compiler 설정도 필요하고 RSC에서 사용이 안됩니다.
- CSS Modules + CSS 변수
  - 의존성 0, 어떤 번들러든 동작, 서버 컴포넌트 가능합니다.
  - 스타일의 값의 TS 타입과 임의 값은 인라인 styled로 해야하는 점이 매우 불편합니다.



어떤 React 프로젝트에든 사용 가능하게 하려면 CSS Modules이 더 맞는 방향인 듯합니다.



#### CSS Modules로 갈 때의 대응


| 지금                                     | CSS Modules                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| 사용 코드 `<Button size variant color />`  | 동일                                                                                        |
| `Button.styled.ts`의 `Record<..., css>` | `Button.module.css`의 `[data-size]`, `[data-variant]`, `[data-color]` 선택자                  |
| `theme.ts`의 `Color.BLUE_500`           | `tokens.css`의 `var(--ls-blue-500)`                                                        |
| 색마다 variant 6벌 복제                      | 색은 변수 재바인딩 2줄, variant는 한 벌                                                               |
| `${({ width }) => width}`              | 유한값 → `data-*`, 임의값 → `style={{ width }}`, 파생/전파 → `style={{ "--size" }}` + `var(--size)` |




---

### Semantic 토큰 정리

```
const Color = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",

  GRAY_10: "#f9f9fa",
  GRAY_50: "#f1f2f4",
//생략
```

현재는 이런식으로 그냥 hex  code를 나열해놨습니다.

그렇게 해서 Color.WHITE 이런식으로 사용할 수 있도록....



Semantic 코드로 변경하기위해서 먼저 해야할것은 

css 변수에 먼저 넣어줘야합니다. CSS Module을 사용하기로 했으니깐요!



```
:root {
  /* primitive */
  --ls-white: #ffffff;
  --ls-black: #000000;
  --ls-gray-10: #f9f9fa;
  --ls-gray-50: #f1f2f4;
```

이런식으로 css 변수로 넣어주시고요



Semantic은 아래와 같습니다.

```
  /* semantic: 프로젝트별로 여기만 바꾼다 */
  --ls-accent-50: var(--ls-blue-50);
  --ls-accent-100: var(--ls-blue-100);
  --ls-accent-200: var(--ls-blue-200);
  --ls-accent-300: var(--ls-blue-300);
```



이런식으로 쓰는 이유는?



목적과 역할로 token을 나눠야 추후 새로운 프로젝트에 넣었을 때 한번에 바꾸는 게 가능합니다.

지금 프로젝트의 메인 색상만 저기로 넣어주기만 하면 컴포넌트가 프로젝트에 맞게 설정이 되게 됩니다.



#### barrel export 추가

```
// components/index.ts
export { default as Avatar, type AvatarProps } from "./avatar";
export { Badge, BadgeBasic } from "./badge";
export type { BadgeProps, BadgeSize, BadgeVariant } from "./badge/Badge";
export { Button, ButtonBasic } from "./button";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./button/Button";
export {
  default as IconButton,
  type IconButtonProps,
} from "./button/IconButton";
```

한 곳에 다 모아서 import 할 때 ts만 확인하면 되도록 수정했습니다.



#### API 일관성

> Claude가 컴포넌트 하나의 API를 배우면 나머지도 추측할 수 있어야 한다.



1. onChange 가 받는 값
   - 전: `TextInput`/`Checkbox`는 `(event)`, `Switch`는 `(checked)`, `Tab`/`Select`는 `(value)`  
   컴포넌트마다 `e.target.value`를 꺼내야 하는지 달랐습니다.
   - 후: 항상 새 값이 첫 인자, 이벤트가 필요하면 둘째 인자 로 설정 했습니다.  
   텍스트 `(value, event)`, 체크/스위치 `(checked, event)`, 선택류 `(value)`. 
   - 구현: `Omit<HTMLAttributes, "onChange">` 후 `onChange={(e) => onChange?.(e.target.value, e)}`



2. 내용 - children
   - 전: `Badge`/`Button`/`Callout`은 `label: string` 로 되어있었고, `Text`는 `children`으로 서로 달랐습니다.  
   같은 "내용"인데 prop 이름이 달랐습니다.
   - 후:  전부 `children`으로 수정 완료 했습니다. `label`은 Checkbox처럼 실제 label인 경우에만 남겼습니다.



3. **아이콘 슬롯 타입 통일 (**`IconSlot`**)**
   - 전: `startIcon?: IconName`  
   시스템 아이콘 이름만 가능. 커스텀 SVG나 `<Avatar>`를 넣을 수 없었다
   - 후: `IconSlot = IconName | ReactNode`.   
   문자열이면 `<Icon name>`으로, 아니면 그대로 렌더합니다. `Callout`은 `icon={null}`로 기본 아이콘 제거

   
4. `ref` **+** `className` **+** `style` **+** `...rest` **전달**
   - 전: 어떤 건 `className`만, 어떤 건 `ref` 없음, `data-testid`/`aria-*`/`onMouseEnter`가 안 넘어가는 컴포넌트가 섞여 있었습니다.
   - 후: 모든 컴포넌트가 `forwardRef` + `...rest`를 루트 요소로 전달되도록 수정.  
   props 타입은 `extends Omit<React.XHTMLAttributes<...>, "충돌하는 키">`

   
5. `Basic` **삭제**
   - `ButtonBasic`, `BadgeBasic` 같은 "스타일 없는 버전"이 따로 있었습니다.  
   실제로는 `variant="ghost"`로 표현 가능하므로 삭제하고 하나로 합쳤습니다.

   
6. `warnDev`
   - `Select`/`SegmentedControl`/`Tab`에 `value`가 `options`에 없으면 dev 모드에서 콘솔 경고.   
   Claude가 오타를 냈을 때 조용히 빈 상태가 되는 대신 즉시 알 수 있게

   
7. 컴파운드 컴포넌트
   - `DialogContent`의 `title/description/footer` prop 뭉치를 컴파운트 컴포넌트로 수정했습니다.
   - DropDown도 마찬가지로 수정 했습니다.



그 외 `size`는 전부 `1 | 2 | 3` 으로 처리가 되도록 했습니다.

---

### CLAUDEmd 수정

이 부분이 제일 중요한 부분이라고 생각했습니다.

현재 디자인 시스템 또한 claude를 이용해서 개발을 진행합니다. 그러면 해당 프로젝트 내부에서 쓰이는 Claudemd가 필요합니다.

그리고 디자인 시스템을 가져다가 쓰는 프로젝트도 claude를 사용할 것입니다.

그러면 이 디자인 시스템을 알려주는 claudemd가 필요할 것입니다.



그렇다면 프로젝트에서 필요한 claudemd가 두가지여야합니다.



- 개발 Claudemd

개발에 필요한 규칙들을 작성합니다.

예) hex 금지, 바로바로 커밋, 주석 2줄 이하 등등...



- 프로젝트용 Claudemd

components/CLAUDEmd 에 생성.



불변성/매직넘버/CSS Modules/`data-*`/`"use client"` 규칙,

파일 구조, 컴포넌트 성격 설명, 번들러 전용 기능 금지, `reset.css`+`theme.css` 루트 import 안내, 

`util/*` alias가 없는 프로젝트에선 상대경로로 바꾸라는 주의 규칙



Claude Code는 하위 디렉토리의 CLAUDEmd를 그 디렉토리 안 파일을 읽을 때 자동으로 로드합니다.  
즉 compoennts를 복붙하면 규칙 파일도 함께 따라가고, 별도 설정 없이 동작합니다.

