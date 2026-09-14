/*
  /admin 의 「저장」 — 발행 설정 모달, 저장 결과 기다리기, 저장 뒤 목록으로.

  2026-09-14 에 skin.js 에서 떼어 냈습니다. 저장이 안 나가던 것·커서가
  튀던 것·목록으로 나가기가 전부 여기서 났는데, 1,600줄짜리 파일 한가운데
  있어서 찾기가 어려웠습니다. 바깥과 닿는 것은 export 넷이 전부입니다.

  ⚠ 폼 칸을 모달 안으로 옮기는 것은 여전히 skin.js 의 `layoutForm` 이고,
    Esc 로 닫는 것도 skin.js 의 `onEscape` 입니다 (조회수 지면·쓰다 만 글
    판과 같이 닫아서 공용입니다).
*/

import { draftSaved } from './drafts.js'
import { el, say } from './say.js'

/* -------------------------------------------------------------------
   「발행 설정」 모달 — 저장을 누르면 묻습니다

   왜 모달이냐: 작성일·프로젝트·초안·비밀글은 **글을 쓰는 동안에는 볼 일이
   없고, 저장하기 직전에만 정하는 것들**입니다. 본문 아래에 늘 펼쳐 두면
   폰에서 스크롤만 길어지고, 정작 저장할 때는 위 띠만 보고 눌러서 초안
   토글을 그냥 지나칩니다.

   Decap 의 「저장」은 사실 **드롭다운**입니다 (`PublishButton`). 눌러야
   메뉴가 열리고 거기서 "지금 게시" 를 한 번 더 눌러야 합니다. 그 첫 번째
   누름을 가로채 모달을 열고, 모달의 「저장」이 원래 순서(단추 → 첫 메뉴
   항목)를 대신 밟습니다.

   ⚠ **`PublishButton` 일 때만 가로챕니다.** 고칠 것이 없는 글에서는 같은
     자리가 `PublishedToolbarButton`(메뉴에 「복제」뿐)이라, 그때까지
     가로채면 복제를 못 하게 됩니다. 두 이름은 서로 부분문자열이 아닙니다.
   ⚠ **`document` 의 캡처 단계에서 잡습니다.** React 는 루트 컨테이너에
     듣기 때문에 그보다 먼저 걸립니다 — 여기서 stopPropagation 을 해야
     드롭다운이 안 열립니다.
   ⚠ **모달은 `pane` 안에 둡니다** (자리는 `position: fixed`). 밖으로 옮기면
     글 화면이 언마운트될 때 React 가 `pane` 만 걷어가고 모달은 남습니다 —
     안에 든 것이 React 가 그린 필드 칸이라 유령이 됩니다.

   ⚠ **드롭다운의 나머지 둘(「게시하고 새로 만들기」·「게시하고 복제」)은
     이제 못 누릅니다.** 혼자 쓰는 저장소에서 쓸 일이 없다고 보고 버렸습니다.
     되살리려면 모달 아래에 줄로 다세요 — 가로채기를 푸는 쪽은 안 됩니다.
   ------------------------------------------------------------------- */

const SAVE_BUTTON = "[class*='ToolbarSectionMain'] [class*='PublishButton']"

/** 모달을 거치지 않고 통과시키는 동안만 켭니다 (모달의 「저장」이 켭니다). */
let passingThrough = false

/** 저장을 눌러 놓고 결과를 기다리는 동안만 켭니다. */
let saving = false

/** 결과가 영영 안 오면 풀어 줍니다 (네트워크가 멈춘 경우). */
let savingTimer = null

/** 다음 「저장」 한 번은 가로채지 않습니다 (아래 `waitForMenu` 가 켭니다). */
let escapeNext = false

export function buildSaveModal(meta) {
  const back = el('div', 'lim-modal-back')
  back.addEventListener('click', closeSaveModal)

  const card = el('div', 'lim-modal-card')
  card.setAttribute('role', 'dialog')
  card.setAttribute('aria-modal', 'true')
  card.setAttribute('aria-label', '발행 설정')
  card.setAttribute('tabindex', '-1')
  card.appendChild(el('h3', 'lim-modal-title', '발행 설정'))
  card.appendChild(meta)

  const foot = el('div', 'lim-modal-foot')
  const cancel = el('button', 'lim-modal-cancel', '취소')
  cancel.type = 'button'
  cancel.addEventListener('click', closeSaveModal)
  const save = el('button', 'lim-modal-save', '저장')
  save.type = 'button'
  save.addEventListener('click', confirmSave)
  foot.appendChild(cancel)
  foot.appendChild(save)
  card.appendChild(foot)

  const modal = el('div', 'lim-modal')
  modal.appendChild(back)
  modal.appendChild(card)
  return modal
}

function openSaveModal() {
  const modal = document.querySelector('.lim-modal')
  if (!modal) return false
  modal.classList.add('is-open')
  const card = modal.querySelector('.lim-modal-card')
  if (card) card.focus()
  return true
}

export function closeSaveModal() {
  const modal = document.querySelector('.lim-modal')
  const wasOpen = modal && modal.classList.contains('is-open')
  if (modal) modal.classList.remove('is-open')
  /* 눌렀던 자리로 초점을 돌려줍니다 — 키보드로 다니는 사람이 길을 잃습니다.
     ⚠ **열려 있었을 때만.** 안 그러면 엉뚱한 때에 초점을 뺏습니다. */
  if (!wasOpen) return
  const btn = document.querySelector(SAVE_BUTTON)
  if (btn && btn.focus) btn.focus()
}

/*
  모달의 「저장」. 원래 순서를 대신 밟습니다 — 단추를 눌러 드롭다운을 열고,
  첫 항목(「지금 게시」)을 누릅니다.

  ⚠ 메뉴는 React 가 그리고 나서야 생깁니다. 한 번 보고 없으면 잠깐씩 더
    봅니다 — 그래도 없으면 **메뉴를 열어 둔 채 손을 뗍니다.** 저장이 안 된
    것을 됐다고 알리는 것보다, 사용자가 한 번 더 누르는 편이 낫습니다.
*/
function confirmSave() {
  const btn = document.querySelector(SAVE_BUTTON)
  if (!btn) return

  /*
    ⚠ **모달을 바로 닫지 않습니다.** 배포에서 쓰는 GitHub 백엔드는 저장이
      곧 커밋이라 몇 초가 걸립니다. 예전에는 여기서 모달을 닫아 버려서,
      누른 뒤 결과가 올 때까지 화면에 **아무 일도 안 일어났습니다** —
      저장이 됐는지 안 됐는지 알 방법이 없었습니다.
      끝난 것은 `watchToasts()` 가 Decap 의 알림을 보고 알려 줍니다.
  */
  saving = true
  setSaveBusy(true)

  /*
    ⚠ **빠져나갈 길을 둡니다.** 알림이 영영 안 오면(네트워크가 멈추면)
      모달이 「저장하는 중…」에 갇힙니다. 그때는 풀어 주고 위 띠를 보게
      합니다 — 저장이 됐다고 알리지는 않습니다.
  */
  if (savingTimer) clearTimeout(savingTimer)
  savingTimer = setTimeout(() => {
    finishSave()
    say('저장 결과를 못 받았습니다. 위 띠에서 저장됐는지 확인해 주세요.')
  }, 20000)

  passingThrough = true
  btn.click()
  passingThrough = false

  waitForMenu()
}

/*
  드롭다운의 「지금 게시」를 찾아 누릅니다. **저장이 실제로 나가는 곳입니다.**

  ⚠ **시간을 넉넉히 줘야 합니다.** 예전에는 30ms 씩 열두 번(360ms)만 보고
    포기했습니다. 빈 글은 6ms 면 뜨길래 그 숫자를 믿었는데, 글이 길거나 기기가
    느리면 React 가 그 안에 드롭다운을 못 그립니다 — 그러면 **저장이 통째로
    안 나갑니다.** 2026-09-07 에 실제로 그랬습니다 (콘솔에 "저장 메뉴를 못
    찾았습니다" 만 남고 저장소에는 아무것도 안 올라갔습니다).

  ⚠ **타이머로 훑지 말고 MutationObserver 로 기다리세요.** 뜨는 순간 바로
    누릅니다. 정해 둔 시간(6초)은 "이쯤이면 안 뜬다" 는 뜻이지 기다리는
    간격이 아닙니다.

  ⚠ **못 찾았으면 조용히 넘어가면 안 됩니다.** 저장이 시작조차 안 된
    것입니다. 사람에게 알리고, **다음 한 번은 가로채지 않아서** Decap 의
    원래 두 단계로 저장할 수 있게 둡니다.
*/
function waitForMenu() {
  const MENU = "[class*='DropdownList'] [role='menuitem']"
  let done = false
  let mo = null
  let giveUp = null

  const stop = () => {
    done = true
    if (mo) mo.disconnect()
    if (giveUp) clearTimeout(giveUp)
  }

  const tryPick = () => {
    if (done) return
    const item = document.querySelector(MENU)
    if (!item) return
    stop()
    item.click()
  }

  mo = new MutationObserver(tryPick)
  mo.observe(document.body, { childList: true, subtree: true })

  giveUp = setTimeout(() => {
    if (done) return
    stop()
    finishSave()
    escapeNext = true
    say('저장이 안 나갔습니다. 「저장」을 한 번 더 누르고 「지금 게시」를 골라 주세요.')
    if (window.console) {
      console.warn('[lim admin skin] 저장 메뉴를 못 찾았습니다 — 다음 한 번은 그냥 통과시킵니다')
    }
  }, 6000)

  tryPick()
}

/*
  「저장하는 중…」.

  ⚠ **단추 글자만 바꾸지 말고 눌리지 않게 막으세요.** 안 막으면 기다리는
    동안 한 번 더 눌러서 저장이 두 번 나갑니다.
*/
function setSaveBusy(on) {
  const btn = document.querySelector('.lim-modal-save')
  if (!btn) return
  btn.disabled = on
  btn.textContent = on ? '저장하는 중…' : '저장'
  const modal = document.querySelector('.lim-modal')
  if (modal) modal.classList.toggle('is-busy', on)
}

/*
  Decap 의 알림(react-toastify)을 지켜보다 저장이 끝나면 모달을 닫습니다.

  **왜 Decap 것을 봅니까.** 저장이 됐는지 안 됐는지는 Decap 만 압니다 —
  성공이면 "항목 저장됨", 실패면 "필수 필드를 놓치셨습니다" 같은 것을
  띄웁니다 (번들의 ko 로케일에서 확인). 우리가 따로 판정하면 언젠가 둘이
  어긋납니다. 그래서 **판정은 Decap 것을 쓰고, 보여 주는 자리만 우리가**
  손봅니다.

  ⚠ 실패해도 모달을 닫습니다. 걸리는 칸(본문 같은 것)은 모달 **밖**에
    있어서, 열어 둔 채로는 어디가 문제인지 볼 수가 없습니다.
*/
/**
 * @param ok 저장이 **됐는가**. 임시저장본을 버릴지가 여기서 갈립니다.
 *   모르면 넘기지 마세요 — 안 된 것을 됐다고 보는 쪽이 훨씬 나쁩니다.
 */
function finishSave(ok) {
  if (savingTimer) {
    clearTimeout(savingTimer)
    savingTimer = null
  }
  if (!saving) return
  saving = false
  setSaveBusy(false)
  closeSaveModal()
  /* 파일로 나갔으니 이 브라우저에 남겨 둔 한 벌은 버립니다 (drafts.js).
     ⚠ 실패했으면 **그대로 둡니다** — 남겨 둔 것이 필요한 자리가 바로
     여기입니다. */
  if (ok) {
    try {
      draftSaved()
    } catch (e) {
      if (window.console) console.warn('[lim admin skin] 임시저장 비우기', e)
    }
    leaveToList()
  }
}

/*
  저장이 끝나면 목록으로 나갑니다 (2026-09-10).

  Decap 은 저장한 뒤에도 그 글에 그대로 서 있습니다. 오른쪽 위에 "항목
  저장됨" 이 잠깐 떴다 사라지고 나면 화면이 저장 전과 똑같아서, **나가도
  되는지 알 수가 없었습니다** — 위 띠의 "변경사항 저장됨" 은 글자가 작고
  긴 글에서는 화면 밖입니다.

  ⚠ **성공했을 때만입니다.** 실패하면 그 자리에 남아야 어디가 틀렸는지
    고칩니다.

  ⚠ **바로 안 나갑니다.** 새 글은 저장이 끝나면 **Decap 이 먼저** 주소를
    `posts/new` → `posts/entries/<주소>` 로 옮깁니다. 같은 순간에 목록으로
    바꾸면 그 이동이 우리를 도로 글로 끌고 옵니다. 한 박자 쉬고, 그러고도
    글로 돌아와 있으면 **한 번만 더** 내보냅니다.

  ⚠ **그새 사람이 딴 데로 갔으면 그대로 둡니다.** 저장하자마자 다른 글을
    열었는데 목록으로 튕기면 그게 더 나쁩니다.
*/
const ENTRY_ROUTE = /^#\/collections\/([^/]+)\/(new|entries\/)/

function leaveToList() {
  const m = ENTRY_ROUTE.exec(location.hash)
  if (!m) return
  const list = '#/collections/' + m[1]

  const go = () => {
    const now = ENTRY_ROUTE.exec(location.hash)
    if (!now || now[1] !== m[1]) return false
    location.hash = list
    return true
  }

  setTimeout(() => {
    if (!go()) return
    /* Decap 이 뒤늦게 글로 돌아왔을 때를 위한 한 번 더. */
    setTimeout(go, 500)
  }, 700)
}

export function watchToasts() {
  const root = document.body
  if (!root) return
  const seen = new WeakSet()
  const check = () => {
    document.querySelectorAll('.Toastify__toast').forEach((t) => {
      if (seen.has(t)) return
      seen.add(t)
      /* ⚠ **저장을 기다리는 동안에만 반응합니다.** 알림은 저장 말고도
         뜹니다 — 아무 때나 모달을 닫으면 글을 쓰던 중에 초점이 위
         「저장」 단추로 튑니다. */

      /* 됐는지 안 됐는지도 Decap 것을 봅니다. 저장이 끝나면
         `type: 'success'` 로 알림을 띄우고(번들에서 확인), react-toastify
         가 그걸 클래스로 붙입니다. 실패는 `--error` 입니다.
         ⚠ 클래스가 없으면 **안 된 것으로 봅니다** — 임시저장본은 남는
         쪽이 안전합니다. */
      const ok = String(t.className).indexOf('Toastify__toast--success') >= 0
      finishSave(ok)
    })
  }
  const mo = new MutationObserver(check)
  mo.observe(root, { childList: true, subtree: true })
  /* ⚠ 지역 변수에 두면 수거될 수 있습니다 (§6-2). */
  window.__limToastWatcher = mo
  check()
}

export function onSaveIntent(e) {
  if (passingThrough) return
  /* 한 번 실패한 뒤에는 Decap 원래 두 단계(저장 → 지금 게시)로 보냅니다. */
  if (escapeNext) {
    escapeNext = false
    return
  }
  const target = e.target && e.target.closest ? e.target.closest(SAVE_BUTTON) : null
  if (!target) return
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
  if (!document.querySelector('.lim-modal')) return /* 못 세웠으면 Decap 것 그대로 */
  e.preventDefault()
  e.stopPropagation()
  openSaveModal()
}
