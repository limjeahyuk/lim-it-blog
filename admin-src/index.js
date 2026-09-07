/*
  /admin 편집기 번들의 입구.

  하는 일은 **CSS 를 끌어오고 아래 셋을 부르는 것**뿐입니다.

  ⚠ 왜 갈라놨냐: `scripts/check-md-roundtrip.mjs` 가 editor.js 를 node 에서
    직접 불러다 씁니다(편집기와 똑같은 기준으로 왕복을 재려고). node 는
    `.css` import 를 못 읽어서, CSS 가 editor.js 안에 있으면 그 검사가
    아예 안 돌아갑니다.

  `./skin.js` 는 Decap 화면을 시안 모양으로 고쳐 앉히는 것입니다 —
  브라우저 DOM 만 만지므로 여기서만 부릅니다.

  `./media.js` 는 사진 폴더가 없는 글도 열리게 하는 것입니다. Decap 이
  아직 config.yml 을 받아오는 중에 백엔드를 감싸야 해서, **editor.js 보다
  먼저** 부릅니다.

  `./drafts.js` 는 쓰던 글을 이 브라우저에 남겨 두는 것입니다(임시저장).
  값을 읽고 쓰는 길은 위젯들이 직접 등록하므로(editor.js·skin.js), 여기서는
  듣기 시작하라고 한 번 불러 주기만 합니다.

  `guardMediaLibrary()` 는 Cloudinary 사진 창을 감싸는 것입니다. Decap 이 그
  창을 만드는 것은 「사진」을 **처음 누를 때**라, 페이지가 뜨는 동안 아무 때나
  걸어 두면 됩니다 (upload.js 참고).

  esbuild 가 이 파일을 묶으면 `public/admin/editor.js` 와
  `public/admin/editor.css` 두 개가 나옵니다. **둘 다 커밋합니다.**
*/
import './editor.css'

import { startDrafts } from './drafts.js'
import { guardMediaLibrary } from './upload.js'

import './media.js'
import './editor.js'
import './skin.js'

/* ⚠ 여기 차례는 상관없습니다. import 는 어차피 먼저 다 돌고(ESM), 사진 창은
   「사진」을 처음 누를 때 만들어집니다 — 그 전이기만 하면 됩니다. */
guardMediaLibrary()
startDrafts()
