/*
  /admin 편집기 번들의 입구.

  하는 일은 **CSS 를 끌어오고 아래 둘을 부르는 것**뿐입니다.

  ⚠ 왜 갈라놨냐: `scripts/check-md-roundtrip.mjs` 가 editor.js 를 node 에서
    직접 불러다 씁니다(편집기와 똑같은 기준으로 왕복을 재려고). node 는
    `.css` import 를 못 읽어서, CSS 가 editor.js 안에 있으면 그 검사가
    아예 안 돌아갑니다.

  `./skin.js` 는 Decap 화면을 시안 모양으로 고쳐 앉히는 것입니다 —
  브라우저 DOM 만 만지므로 여기서만 부릅니다.

  esbuild 가 이 파일을 묶으면 `public/admin/editor.js` 와
  `public/admin/editor.css` 두 개가 나옵니다. **둘 다 커밋합니다.**
*/
import './editor.css'

import './editor.js'
import './skin.js'
