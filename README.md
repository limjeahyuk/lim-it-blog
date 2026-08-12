# lim-it

게임 만들면서 부딪힌 것들을 적어두는 블로그. Astro + MDX.

```bash
npm run dev      # http://localhost:4321
npm run build
```

글은 `src/content/posts/` 에 마크다운 파일로 들어간다. 글 쓰는 규칙은 [CLAUDE.md](./CLAUDE.md) 참고.

---

## 배포 (최초 1회)

### 1. GitHub 저장소 만들기

```bash
git init && git add -A && git commit -m "init: devlog 블로그"
gh repo create limjeahyuk/blog --public --source=. --push
```

`gh`가 없으면 GitHub에서 저장소를 만들고 `git remote add origin ...` 후 push.

### 2. Vercel 연결

Vercel에서 이 저장소를 import 하면 Astro를 자동 인식한다. 빌드 설정은 건드릴 필요 없다.

배포되면 실제 도메인을 두 군데에 반영한다.

- `astro.config.mjs` → `site`
- `src/consts.ts` → `SITE_URL`
- `public/admin/config.yml` → `backend.base_url`

### 3. 폰에서 글 쓰기 (Decap CMS) — 선택

`/admin` 에서 글을 쓰면 GitHub에 자동으로 커밋된다. 쓰려면 GitHub OAuth 앱이 필요하다.

**a. GitHub OAuth 앱 등록**

Settings → Developer settings → OAuth Apps → New OAuth App

| 항목 | 값 |
|---|---|
| Application name | 아무거나 (예: lim-it admin) |
| Homepage URL | `https://<배포주소>` |
| Authorization callback URL | `https://<배포주소>/api/callback` |

**b. Vercel 환경변수 등록**

| 이름 | 값 |
|---|---|
| `OAUTH_GITHUB_CLIENT_ID` | OAuth 앱의 Client ID |
| `OAUTH_GITHUB_CLIENT_SECRET` | Generate a new client secret 으로 만든 값 |

**c. `public/admin/config.yml` 수정**

```yaml
backend:
  repo: limjeahyuk/blog        # 실제 저장소로
  base_url: https://<배포주소>  # 실제 주소로
```

환경변수를 바꾸면 Vercel에서 재배포해야 반영된다.

**로컬에서 먼저 확인하려면** — GitHub 없이 테스트할 수 있다:

```bash
npx decap-server        # 터미널 1
npm run dev             # 터미널 2 → localhost:4321/admin
```

`config.yml` 에 `local_backend: true` 가 켜져 있어서 이때는 로컬 파일에 직접 쓴다.

---

## 참고

- 히어로 이미지(`heroImage`)는 Decap 폼에 넣지 않았다. 폰에서 급히 쓸 때 걸리적거리기만 해서, 데스크톱에서 직접 편집할 때만 쓴다.
- `/admin` 은 `noindex` 이지만 페이지 자체는 공개다. 실제 접근 권한은 GitHub 로그인이 막는다.
