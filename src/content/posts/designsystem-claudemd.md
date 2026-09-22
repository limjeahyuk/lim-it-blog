---
author: developer
title: AI가 인식하는 디자인시스템
slug: designsystem-claudemd
description: Claude가 사용할 때 필요한 Component Claudemd 작성.
heroImage: https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1790067299/fgtjv0nyd99poxivi3wq.jpg
pubDate: 2026-09-21
draft: false
secret: false
---
## 디자인 시스템 Component

퍼블리싱을 할 때 앞으로는 AI가 다 만듭니다.

이 때, 정말 사소한 업데이트 같은 경우에, 예를 들면 간격 이나 컴포넌트의 색상이라던가 등등



이런 간단한 수정 또한 ai에게 시켜도 되지만 진짜 사소한걸 바꾸기 위해서 말하는 것도 조금 이상하고 또 이 작은 걸 위해서 코드 10줄 20줄 늘어나기도 합니다.

그렇다고 직접 하려고 코드를 보면 전체적으로 그냥 인라인으로 되어 있거나 css에 막 들어있기도 있고, 추가로 margin으로 되어있는 경우도 많기 때문에

CSS에서 고쳐도 되나? 라는 생각이 들기도 하고 또 색상 변경은 어떤가요. 싹다 hex 코드로 써놔서 이게 뭔지... 하나하나 바꾸다가 그냥 ai야 해줘! 해버립니다.



그래서 생각한 것은 아무래도 나와 ai의 싱크를 맞춰야할것 같다 싶었습니다.

애초에 디자인 시스템이 **일관된 사용자 경험을 빠르고 안정적으로 만들기 위한 공통 기준** 이니깐요.

이 기준을 AI와 맞춰서 하면 업데이트도 쉽지 않을 까 싶었습니다.



이런 말 전 포스팅에서도 한 것 같은데... 그냥 한번 더 들어주세요.

---

### Claudemd

우선 현재 Component를 엄청나게 만들었습니다.

이전 포스팅에서는 component에는 어떤것을 넣어야하는지 props에 어떤것을 지양 해야하는지 이런것을 작성했었습니다.



그럼 이번에는 Claudemd 작성에 대해서 작성하겠습니다.

### Claude가 문서를 읽는 방식


| 문서                                | 읽히는 순간               | 비용      |
| --------------------------------- | -------------------- | ------- |
| `<repo>/CLAUDE.md`                | 세선 시작시 자동, 전문        | 매 세션 토큰 |
| `<repo>/CLAUDE.md` **안의** `@path` | 위와 같이 자동 인라인         | 매 세션 토큰 |
| 하위 폴더 `CLAUDE.md`                 | 그 폴더 파일을 건드릴 때 자동    | 건드릴 때만  |
| 폴더 안`README.md` , `.tsx`타입        | Claude가 필요해서 직접 열 때만 | 열 때만    |




→ 쓰는 컴포넌트만 보게 하려면 자동 로드되는 파일엔 고르는 데 필요한 정보만, 상세는 컴포넌트 폴더 안에 두면 됩니다.

Claude 는 쓸 컴포넌트의 `.tsx` 를 어차피 열기 때문에 그 옆에 있는 것만 읽게 됩니다.



### 현재 구조

```
limSystem/
  CLAUDE.md                  레포 개발 규칙 (스택, 명령, git). @src/components/CLAUDE.md 인라인 ← 복사 안 됨
  README.md                  컴포넌트별 prop 표 ← 복사 안 됨
  src/components/
    CLAUDE.md                사용 규칙 69줄 ← 복사됨, 소비 프로젝트도 자동 로드
    index.ts                 barrel
    button/, dialog/, ...    폴더별 README 없음, props JSDoc 거의 없음
  src/util/theme.css, theme.ts
```

위 components를 사용하려는 프로젝트에서는 src/components의 폴더만 복붙해서 사용하면 됩니다.

그렇게 됐을 때 문제점이 몇가지 있습니다.



1. AI가 component들을 잘 사용할 수 없음.
2. 하면 안되는 것도 잘 모릅니다.
3. 매번 모든 것을 확인해야하기에 토큰이 많이 듭니다.



그 방법을 해결하기 위해서 CLAUDE.md를 작성했지만... 아쉽게도 프로젝트의 AI는 위에 설명한 것처럼 Component를 직접 고칠 때를 제외하고는 바로 보지 않습니다.

그렇기 때문에 위 표의 두번째인 `@path`를 사용해줘야합니다.



사용하려는 프로젝트의 ClaudeMd 파일 내부에 아래와 같이 작성해줍니다.

```
**# testStitch2**

Stitch(NexusAdmin Executive Slate) 디자인을 limSystem 컴포넌트로 조립한 Vite 앱.

@src/components/CLAUDE.md
```



이렇게 작성을 해주면 매번 확인을 합니다.

그런데 생각해보면 또 다른 문제가 있습니다.



모든 component들의 내용을 매번 읽고 사용을 하는 것은 그렇다고 치는데

종종 규칙이 매우 긴 component들이 있습니다. 예를 들어서 Dropdown 같은 컴포넌트.

```
<Dropdown>
<DropdownTrigger></DropdownTrigger>
DropdownContent></DropdownContent>
</Dropdown>
```

이런식으로 dropdown 안에 어떤것을 어떻게 넣어야하는 지 설명하는 글이 필요합니다.



컴포넌트들이 많으면 많을 수록 Claudemd는 길어지게 되고 그러면 어느 순간부터는 최대한 짧게 유지해야하는 Claudemd가 길어져서 토큰을 많이 잡아먹게 되는 경우가 생깁니다.

그렇기 때문에 Readmd를 넣어줍니다.

### 목표 구조

```
src/components/
  CLAUDE.md            [자동 로드, ≤90줄] 세팅 / 무엇을 쓸까 표 / 공통 API / 크기 정책 / 스타일 / 금지→대신 표
  dialog/README.md     [조합형만] 슬롯 구조 + 예시 1개 + 제어형 흐름
  bottom-sheet/README.md
  dropdown/README.md
  toast/README.md
  form-field/README.md
  button/Button.tsx    [모든 컴포넌트] props 인터페이스에 JSDoc — 타입만 보고 모르는 함정에만
```

책임 분리 ( 같은 내용 두 번 적지 않습니다. )


| 정보                                | 위치                       | 이유                                                 |
| --------------------------------- | ------------------------ | -------------------------------------------------- |
| 뭘 고를지                             | `CLAUDE.md` 표            | 매번 필요, 짧음                                          |
| 전역 규칙 (토큰, import, onChange 시그니처) | `CLAUDE.md`              | 매번 필요                                              |
| prop 이름·타입                        | `.tsx` **타입** (문서에 안 적음) | 정답은 하나, 어긋남 방지                                     |
| 한 prop의 함정                        | JSDoc                    | 타입 옆에서 같이 읽힘                                       |
| 조합 구조·예시                          | 폴더 `README.md`           | 쓸 때만 읽힘                                            |
| 레포 개발 규칙 (명령, git, 스토리 위치)        | 루트 `CLAUDE.md`           | 복사 대상 아님                                           |
| 사람용 개요                            | 루트 `README.md`           | prop 표는 지우고 컴포넌트 목록 + src/components/CLAUDE.md 링크만 |




거의 모든 component는 그냥 Component 코드만 넣겠지만 위에서 말한것처럼 조합이 필요하고 약간의 룰이 필요할 때, 추가로 더 자세히 사용하도록 하려면 간단한 예시 코드까지 해야할 때, 그때는 해당 컴포넌트 폴더에 readme를 추가하고 Claude에서 방향을 정해줍니다.



그런식으로 하도록 하는데... 이럼에도 사실 모든 컴포넌트의 내용을 다 읽어야하는 것은 어쩔 수 없습니다.



### 각 컴포넌트마다 Readme가 필요?

> NO



- 단순 컴포넌트 ( Button, Badge, Text, Switch ... ) 는 타입 + JSDoc 한 두줄이면 끝입니다.
- CLAUDEmd에서 설명하는 것만으로도 충분합니다.



### 작성 원칙

- 명령형 한 줄. 이유는 비직관적일 때만 (`Box`에 배경 금지 → `Card`가 테마를 갖기 때문).
- 금지만 적지 말고 대신 ○○으로 알려줍니다.
- CLAUDE.md에 prop 목록을 적는 것 보다는 타입을 보라고 적습니다.
- 검증: 새 프로젝트에서 Claude에게 회원 목록 페이지 만들어줘 → 어긋난 지점마다 규칙 한 줄 추가, 안 어긋나는 규칙은 제거.

### Claude md 초안

```
# limSystem 컴포넌트

이 폴더(`src/components`)와 `src/util`은 limSystem 디자인 시스템에서 복사해 온 것이다.
prop은 각 컴포넌트의 TS 타입이 정답이다. 이 문서는 "무엇을 고를지"와 "타입이 말해주지 않는 규칙"만 담는다.
조합형 컴포넌트는 폴더 안 `README.md`를 먼저 읽는다.

## 세팅

- 앱 루트에서 `reset.css`와 `src/util/theme.css`를 한 번 import. 앱 루트를 `ToastProvider`로 감싼다.
- import는 전부 `src/components`(barrel)에서. 개별 파일 경로 import 금지.
- `tsconfig.json` paths에 `src/*`, `util/*`, `assets/*` alias 필요.
- 외부 의존성: `@floating-ui/react`, `react-date-picker`, `@wojtekmaj/react-daterange-picker`, `react-time-picker`, `react-datetime-picker`.
- 번들러 전용 기능(`next/*`, `import.meta.env`, `?raw`) 금지. 훅/상태/floating-ui를 쓰는 파일은 첫 줄 `"use client"`.

## 무엇을 쓸까

| 만들 것 | 쓸 것 |
| --- | --- |
| 레이아웃 | `Flex` / `Grid` / `Box`. wrapper `<div>` 금지 |
| 카드·섹션 박스 | `Card`. `Box`에 배경/테두리 직접 주지 않는다 |
| 글자 | `Text`(본문) / `Heading`(h1~h6). 날것 `<p>`, `<h2>` 금지 |
| 폼 한 칸 | `FormField`(label/description/error/required) 안에 입력 컴포넌트. 라벨을 따로 붙이지 않는다 |
| 텍스트 입력 | `TextInput` / `Textarea` |
| 선택 하나 | 2~5개 → `SegmentedControl` 또는 `RadioGroup`, 그 이상 → `Select` |
| 선택 여러 개 | `CheckboxGroup` + `useCheckboxGroup`, 전체선택은 `MasterCheckbox` |
| on/off | `Switch`. 즉시 반영되는 설정에만. 폼 제출용은 `Checkbox` |
| 날짜·시간 | `DatePicker` / `DateRangePicker` / `TimePicker` / `DateTimePicker` |
| 파일 첨부 | `FileUploader` |
| 버튼 | `Button`. 아이콘만 있으면 `IconButton`(`aria-label` 필수) |
| 메뉴·더보기 | `Dropdown`(조합형) |
| 힌트 | `Tooltip`. 필수 정보는 툴팁에 넣지 않는다 |
| 모달 | 데스크톱 `Dialog`, 모바일 `BottomSheet`. `useMediaQuery`로 분기. `window.confirm` 금지 |
| 액션 결과 알림 | `useToast().toast(...)`. `alert()` 금지 |
| 안내 박스 | `Callout` |
| 상태 표시 | `Badge` |
| 사람 | `Avatar` |
| 로딩 | 동작 중 `Spinner`, 데이터 자리 `Skeleton`. `<div>Loading...</div>` 금지 |
| 빈 목록 | `EmptyState`(액션 버튼은 children) |
| 표 | `Table`. 좁으면 가로 스크롤한다(자체 처리) |
| 키-값 나열 | `DataList` |
| 탭 | 화면 안 전환 `Tab`, 라우트 이동 `TabNav` |
| 트리 | `TreeView` |
| 스크롤 영역 | `ScrollBox` |
| 구분선 | `HorizontalDivider` / `VerticalDivider` |
| 아이콘 | `<Icon name="..." />`. `name`은 `IconName`(자동완성) |
| 반응형 분기 | `useMediaQuery(query)`. 서버에서는 항상 `false` |

## 공통 API

- `size`는 문자열 enum `"1" | "2" | "3" …`. `variant`, `color: ColorType`, `radius: RadiusType`.
- `color`는 `RED | BLUE | GRAY | TEAL | ORANGE | GREEN`. 생략하면 테마 accent.
- `onChange`는 항상 새 값: 텍스트 `(value, event)`, 체크/스위치 `(checked, event)`, 선택류 `(value)`. `e.target.value` 꺼내지 않는다.
- 내용은 `children`. 아이콘 슬롯(`startIcon`, `endIcon`, `icon`)은 `IconName` 문자열 또는 `ReactNode`.
- 모두 `className`, `style`, `...rest`를 루트로 넘기고 `ref`를 전달한다.
- `LayoutsProps`(`p/px/py/m/mx/width/height/fullWidth/bg/radius`): 숫자는 px, 문자열은 그대로.

## 크기 정책

- 리프 컨트롤(Button, Badge, Checkbox, Radio, Switch, Avatar, Icon, Spinner, SegmentedControl, Tab)은 자기 크기를 유지한다. 좁으면 찌그러지지 않고 넘친다.
- 필드(TextInput, Select, DatePicker 계열)는 부모 폭에 맞춰 줄어든다.
- 넘침 처리는 레이아웃 몫: `<Flex wrap="wrap">`, `ScrollBox`, 세로 스택.

## 스타일

- 색·간격·반경은 `theme.css` semantic 변수(`--ls-accent-*`, `--ls-bg-*`, `--ls-text-*`, `--ls-space-*` …)만. hex / rgba / `--ls-gray-*` 같은 primitive 직접 참조 금지.
- 인라인 style엔 `theme.ts`의 `Color`, `Radius`를 쓴다 (`Color.ACCENT_500 === "var(--ls-accent-500)"`).
- 프로젝트 룩을 바꿀 땐 `theme.css`의 semantic 블록만 고친다.
- 새 CSS는 CSS Modules(`Foo.module.css`). Tailwind / Emotion / 인라인 hex 금지.

## 하지 말 것 → 대신

| 금지 | 대신 |
| --- | --- |
| `<div style={{ display: "flex" }}>` | `<Flex>` |
| `<Box bg=... style={{ border }}>` | `<Card>` |
| `<label>` + `<TextInput>` | `<FormField label>` |
| `<div>Loading...</div>` | `Spinner` / `Skeleton` |
| `alert()` / `window.confirm()` | `useToast` / `Dialog` |
| `#333`, `rgba(...)`, `--ls-gray-500` | semantic 토큰 |
| `import Button from "src/components/button/Button"` | `import { Button } from "src/components"` |
| 직접 position 계산한 팝오버 | `Dropdown` / `Tooltip` |

## 아이콘 추가

- `src/assets/icons/*.svg`에 넣고 `node generate-icon-types.ts`. `icon/icon-data.ts`는 자동 생성, 직접 수정 금지.
- `<path d>`만 추출한다. `<circle>`, `<rect>`, stroke 기반 SVG는 빈 아이콘이 된다.

## 코드 규칙

- 주석은 한국어 2줄 이하, 이모티콘 금지. 컴포넌트 디렉토리는 소문자.
- 상태는 불변으로 다룬다.
```



### Readme 초안

```
# Dialog

조합형. `Dialog` > `Trigger` / `Content` / `CloseButton` / `Title` / `Description` / `Body` / `Footer` / `Close`.

```tsx
<Dialog>
  <Dialog.Trigger><Button>삭제</Button></Dialog.Trigger>
  <Dialog.Content>
    <Dialog.CloseButton />
    <Dialog.Title>정말 삭제할까요?</Dialog.Title>
    <Dialog.Body>되돌릴 수 없습니다.</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close><Button variant="ghost">취소</Button></Dialog.Close>
      <Button color="RED" onClick={remove}>삭제</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>

- Trigger / Close는 자식 하나에 props를 주입한다(asChild). Fragment 금지.
- 제어형은 open / onOpenChange. 비동기 액션 후 닫을 때 씀.
- 모바일이면 BottomSheet. 같은 슬롯 이름이라 컴포넌트명만 바꾸면 된다.


같은 형식으로 `bottom-sheet/`(snapPoints, dismissible, Footer 버튼 `width="100%"`), `dropdown/`(Item closeOnClick), `toast/`(Provider 위치, `toast()` 옵션), `form-field/`(id/aria 자동 주입, 자식 하나만) 정도만 만들면 됩니다. Button, Badge 같은 단순 컴포넌트는 README 없이 타입으로 충분합니다.
## props JSDoc — 타입이 말 못 하는 함정만
```ts
export interface BottomSheetContentProps {
  /** 핸들을 끌어 멈출 높이 목록. 생략하면 내용 높이 하나 */
  snapPoints?: (string | number)[];
}

```

**원칙 요약**

- [CLAUDE.md](http://CLAUDE.md) = 고르기 + 규칙. prop 안 적음.
- 폴더 README = 조합/제어 흐름처럼 타입이 못 담는 것. 단순 컴포넌트엔 없음.
- JSDoc = 한 prop의 함정.
- 세 곳에 같은 내용 두 번 적지 않는다.

