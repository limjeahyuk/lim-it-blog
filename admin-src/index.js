/*
  /admin 편집기 번들의 입구.

  하는 일은 **CSS 를 끌어오는 것뿐**입니다. 알맹이는 editor.js 에 있습니다.

  ⚠ 왜 갈라놨냐: `scripts/check-md-roundtrip.mjs` 가 editor.js 를 node 에서
    직접 불러다 씁니다(편집기와 똑같은 기준으로 왕복을 재려고). node 는
    `.css` import 를 못 읽어서, CSS 가 editor.js 안에 있으면 그 검사가
    아예 안 돌아갑니다.

  esbuild 가 이 파일을 묶으면 `public/admin/editor.js` 와
  `public/admin/editor.css` 두 개가 나옵니다. **둘 다 커밋합니다.**
*/
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css'

import './editor.js'
