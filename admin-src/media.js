/*
  /admin 사진 목록 — 폴더가 없는 글도 열리게.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 esbuild 로 묶은
    `public/admin/editor.js` 입니다. 고쳤으면 `npm run admin` 을 돌리세요.

  무엇이 문제였냐:

  `config.yml` 의 `media_folder: '/public/images/{{fields.slug}}'` 때문에
  Decap 은 **글을 열 때** 그 글의 사진 폴더를 훑습니다 (`processEntry` 가
  `getMedia(폴더)` 를 부릅니다). 그런데 사진을 한 장도 안 쓴 글은 폴더가
  아예 없습니다 — 지금 128편 중 34편이 그렇습니다.

  이때 `npm run cms` 의 로컬 프록시(decap-server)가 **500 을 냅니다.**
  없는 경로에 `fs.realpath` 를 걸어서 ENOENT 가 그대로 올라옵니다
  (`middlewares/utils/path.ts` 의 `resolveExistingRepoPath`).
  `getMedia` 가 튕기면 글 읽기 전체가 같이 튕겨서, 화면이 하얗게 남고
  "항목 불러오기 실패: Unknown error" 만 뜹니다. `status-effects-redefined`
  (§1 이 표본으로 가리키는 글)가 그래서 안 열렸습니다.

  왜 이렇게 고쳤냐:

  - **빈 폴더에 `.gitkeep` 을 두지 않습니다.** 글을 하나 쓸 때마다 폴더를
    미리 만들어 둬야 하고, 사진을 안 쓰는 글이 계속 나오는 한 끝이 없습니다.
  - **`media_folder` 를 글마다 나누는 규칙은 그대로 둡니다** (§2·§6-2).
    사진 429장이 이미 그 모양으로 들어가 있습니다.
  - 그래서 **없는 폴더 = 사진 없음** 으로 넘깁니다. Decap 자신도 404 를
    그렇게 처리합니다 (`mediaLoaded([])`).

  ⚠ **`proxy` 만 고칩니다.** 배포에서 쓰는 GitHub 백엔드는 없는 폴더에
    404 를 받고 `listFiles` 가 이미 빈 목록으로 넘깁니다 — 거기까지 감싸면
    진짜 실패(토큰 만료·네트워크)까지 "사진 없음"으로 삼켜서, 사진이 있는데
    없는 것처럼 보이고 같은 파일을 또 올리게 됩니다.

  여기가 죽어도 Decap 은 굴러갑니다 (전부 try/catch 안입니다).
  고치지 못하면 예전 그대로 — 로컬에서 폴더 없는 글이 안 열립니다.
*/

/* 로컬 프록시(`npm run cms`)만입니다. 위의 ⚠ 를 읽고 늘리세요. */
const BACKENDS = ['proxy']

function patch(CMS, name) {
  const entry = CMS.getBackend(name)
  if (!entry || typeof entry.init !== 'function' || entry.limMediaPatched) return

  /* Decap 의 백엔드 등록부는 `{ init: (...args) => new BackendClass(...args) }`
     한 칸입니다. 클래스를 못 잡으니 만들어져 나온 것을 가로채 감쌉니다. */
  const init = entry.init
  entry.init = function () {
    const backend = init.apply(this, arguments)
    try {
      const getMedia = backend.getMedia
      if (typeof getMedia === 'function') {
        backend.getMedia = function () {
          const args = arguments
          return Promise.resolve()
            .then(() => getMedia.apply(backend, args))
            .catch((err) => {
              /* 지우지 마세요 — 폴더가 없는 것과 프록시가 죽은 것을
                 화면에서는 구분할 수 없습니다. 여기가 유일한 단서입니다. */
              console.warn('[lim] 사진 목록을 못 읽어서 빈 목록으로 넘깁니다:', args[0], err)
              return []
            })
        }
      }
    } catch (e) {
      /* 감싸다 실패하면 원래 백엔드를 그대로 돌려줍니다. */
    }
    return backend
  }
  entry.limMediaPatched = true
}

if (typeof window !== 'undefined' && window.CMS && window.CMS.getBackend) {
  for (const name of BACKENDS) {
    try {
      patch(window.CMS, name)
    } catch (e) {
      console.warn('[lim] 백엔드를 못 감쌌습니다:', name, e)
    }
  }
}
