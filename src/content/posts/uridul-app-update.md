---
author: developer
title: 우리둘 수동 업데이트
slug: uridul-app-update
description: 홈 화면에 추가한 웹앱이 새 버전을 못 받던 것
pubDate: 2026-10-29T11:00:00+09:00
project: uridul
draft: false
secret: false
---
우리둘은 폰에서 사파리 "홈 화면에 추가" 로 앱처럼 쓰고 있습니다.

그런데 아이폰에서 이렇게 띄운 웹앱에는 **새로고침이 없습니다.**

주소창도 없고, 당겨서 새로고침도 안 됩니다.

그래서 새 버전을 배포해도 폰은 한 번 띄운 옛 버전을 계속 들고 있었고, 폰을 껐다 켜기 전까지 안 바뀌었습니다.

하루에 몇 번씩 배포하는데 그때마다 폰을 껐다 켤 수는 없어서... 설정에 직접 누르는 업데이트 버튼을 만들었습니다.

---

## 새 버전인지 어떻게 아나

버전 번호를 따로 관리하고 싶지는 않았습니다.

대신 Vite 가 빌드할 때마다 `/assets/index-해시.js` 처럼 **파일 이름을 바꾼다**는 점을 썼습니다.

- 지금 화면이 불러온 파일 이름
- 서버의 `index.html` 을 캐시 없이 새로 받아서 거기 적힌 파일 이름

둘이 다르면 새 버전이 나온 것입니다.

```js
// 배포마다 index.html이 가리키는 /assets/index-*.js 이름이 바뀌니 지금 것과 서버 것을 비교한다
const bundleOf = html => html.match(/\/assets\/index-[\w-]+\.js/)?.[0];

const current = bundleOf(document.documentElement.outerHTML);
const check = () => fetch('/', { cache: 'no-store' }).then(r => r.text()).then(t => setLatest(bundleOf(t) ?? null), () => setLatest(null));
```

배포할 때 따로 챙길 게 없어서 제일 편한 방법이었습니다.

---

## 누르면

<img src="/images/uridul-app-update/update.jpg" alt="설정 — 앱 업데이트: 새 버전이 나왔어요, 업데이트하기 버튼" width="320">

새 버전이 있으면 "새 버전이 나왔어요" 와 함께 **업데이트하기** 버튼이 진하게 뜹니다.

누르면 서비스 워커에 업데이트를 한 번 시키고(`registration.update()`) 페이지를 다시 불러옵니다.

새 버전이 없으면 "지금 최신 버전을 쓰고 있어요" 와 흐린 **새로고침** 버튼만 보입니다.

새 버전이 아니어도 그냥 다시 불러오고 싶을 때가 있어서 버튼은 늘 남겨 뒀습니다.

---

이젠 새로운 업데이트가 있으면 알람이 가도록 했으며

알람은 사용자가 끄고 켜고 할수잇습니다.

원한다면 그냥 천천히 업데이트 되도록 해도 상관없도록..



업데이트 기능은 웹앱을 사용하면 반드시 넣어야할 것 같습니다.

너무 편하고 좋습니다.

