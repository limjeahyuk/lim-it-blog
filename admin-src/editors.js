/*
  「에디터」 두 화면 — 목록(카드)과 고치는 화면(줄).

  2026-09-09 에 컬렉션을 만들 때는 Decap 이 그린 것에 색만 입혀 뒀습니다.
  그러면 목록 화면에는 「에디터」라고 적힌 **줄 하나**만 보입니다 — 파일
  컬렉션이라 Decap 이 세는 것은 사람이 아니라 파일입니다. 누가 있는지
  보려면 그 줄을 눌러 들어가야 했습니다.

  그래서 두 가지를 답니다.

    #/collections/editors                  사람마다 카드 (여기)
    #/collections/editors/entries/authors  Decap 의 목록 위젯을 줄로 (여기)

  ⚠ **목록 카드의 명단은 마지막 배포 기준입니다** (`authors.gen.js`).
    `/admin` 은 정적 페이지라 `src/data/authors.json` 을 읽을 방법이 없습니다
    (config.yml 의 저자 목록과 같은 사정 — §3). 대신 고치는 화면을 한 번
    열면 그때 본 명단을 이 브라우저에 적어 두고, 다음부터는 그것을 먼저
    씁니다 — 폰에서 사람을 더한 뒤 목록으로 돌아왔을 때 없는 사람처럼
    보이지 않게.

  ⚠ **줄에 적는 값은 폼에서 그대로 읽습니다** (`authors.gen.js` 가 아니라).
    이름을 고치는 중에도 줄이 같이 바뀌어야 하고, 방금 더한 사람은 gen 에
    아예 없습니다. 「글 N편」만 gen 에서 옵니다 — 글 수는 폼에 없습니다.

  ⚠ **React 가 그린 노드를 지우지 않습니다.** 줄에 얹는 것은 전부 append 이고,
    Decap 이 그린 것은 CSS 로 감추기만 합니다 (skin.js 맨 위의 규칙과 같음).
*/

import { AUTHOR_COUNTS, AUTHOR_LIST } from './authors.gen.js'
import { el, say, waitFor } from './say.js'

/** config.yml 의 컬렉션·파일 이름과 같아야 합니다. */
const ENTRY = '#/collections/editors/entries/authors'

/** 고치는 화면에서 본 명단을 적어 두는 자리. 카드가 이것을 먼저 씁니다. */
const CACHE = 'lim.editors.v1'

/*
  색 이름은 config.yml 의 「색」 목록과 한 쌍입니다. 고르는 칸(react-select)
  에는 **보이는 글자만** 남아서 값을 되찾을 데가 없습니다 — 그래서 글자로
  거꾸로 찾습니다. ⚠ config.yml 의 label 을 고치면 여기도 같이.
*/
const COLOR_BY_LABEL = {
  파랑: 'blue',
  빨강: 'red',
  초록: 'green',
  주황: 'orange',
  청록: 'teal',
}

function hash() {
  return (typeof location !== 'undefined' && location.hash) || ''
}

export function inEditorsList() {
  return /^#\/collections\/editors\/?(\?|$)/.test(hash())
}

export function inEditorsEntry() {
  return /^#\/collections\/editors\/entries\//.test(hash())
}

/* -------------------------------------------------------------------
   폼에서 값 읽기

   ⚠ 라벨의 `for` 로 찾습니다. 입력칸 id 로 찾으면 사진 위젯을 놓칩니다 —
     그건 input 을 안 그립니다 (skin.js 의 fieldName 과 같은 이유).
   ------------------------------------------------------------------- */

function ctrl(row, name) {
  const label = row.querySelector("label[for^='" + name + "-field-']")
  if (!label) return null
  return document.getElementById(label.getAttribute('for'))
}

function val(row, name) {
  const node = ctrl(row, name)
  if (!node) return ''
  if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')
    return node.value || ''
  return (node.textContent || '').trim()
}

function colorOf(row) {
  const node = ctrl(row, 'color')
  if (!node) return ''
  /* 고른 것 하나만 담은 칸. 없으면 a11y 용 숨은 글자까지 딸려 와서
     그대로 쓰면 색 이름을 못 찾습니다. */
  const one = node.querySelector("[class*='singleValue']")
  return COLOR_BY_LABEL[((one || node).textContent || '').trim()] || ''
}

function byId(id) {
  for (const a of roster()) if (a.id === id) return a
  return null
}

function countOf(id) {
  return AUTHOR_COUNTS[id] != null ? AUTHOR_COUNTS[id] : 0
}

/* -------------------------------------------------------------------
   명단 — 이 브라우저에 적어 둔 것 · 없으면 마지막 배포 것
   ------------------------------------------------------------------- */

function roster() {
  try {
    const raw = localStorage.getItem(CACHE)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length) return list
    }
  } catch (e) {
    /* 사생활 보호 창이거나 값이 깨진 것 — 배포된 명단으로 갑니다 */
  }
  return AUTHOR_LIST
}

function saveRoster(list) {
  if (!list.length) return /* 아직 안 그려진 폼 — 멀쩡한 것을 덮지 않습니다 */
  try {
    localStorage.setItem(CACHE, JSON.stringify(list))
  } catch (e) {
    /* 못 적어도 카드는 배포된 명단으로 그려집니다 */
  }
}

/* -------------------------------------------------------------------
   아바타 — 얼굴 사진이 없어서 글자 하나입니다 (블로그 Avatar.astro 와 같음)
   ------------------------------------------------------------------- */

function avatar(a) {
  const node = el('span', 'lim-eav', a.initial || (a.name || a.id).slice(0, 1))
  node.setAttribute('data-who', a.color || 'blue')
  node.setAttribute('aria-hidden', 'true')
  return node
}

function nameBox(a) {
  const box = el('span', 'lim-ename')
  box.appendChild(el('b', null, a.name || a.id))
  box.appendChild(el('i', null, a.id))
  return box
}

/* -------------------------------------------------------------------
   1. 목록 화면 — 사람마다 카드
   ------------------------------------------------------------------- */

/** 다른 화면으로 넘어가면 걷어냅니다 — React 는 제가 만든 노드만 지웁니다. */
export function clearCards() {
  for (const n of document.querySelectorAll('.lim-eds, .lim-eadd, .lim-ecnt'))
    n.remove()
}

function card(a) {
  const box = el('div', 'lim-ed')

  const top = el('div', 'lim-ed-top')
  top.appendChild(avatar(a))
  top.appendChild(nameBox(a))
  box.appendChild(top)

  box.appendChild(el('p', 'lim-ed-bio', a.bio || '소개가 비어 있습니다.'))

  const foot = el('div', 'lim-ed-foot')
  foot.appendChild(el('span', 'lim-ecount', '글 ' + countOf(a.id) + '편'))

  const btns = el('span', 'lim-ed-btns')
  const edit = el('button', 'lim-ed-edit', '편집')
  edit.type = 'button'
  edit.addEventListener('click', () => editEditor(a))
  const del = el('button', 'lim-ed-del', '삭제')
  del.type = 'button'
  del.addEventListener('click', () => deleteEditor(a))
  btns.appendChild(edit)
  btns.appendChild(del)
  foot.appendChild(btns)

  box.appendChild(foot)
  return box
}

function drawCards() {
  const grid = document.querySelector("[class*='CardsGrid']")
  const top = document.querySelector("[class*='CollectionTopRow']")
  if (!grid || !top) return

  /* 머리 줄 — "에디터 3명" 과 「에디터 추가」.
     ⚠ 개수는 글 목록의 `.lim-count` 와 **다른 클래스**입니다. 그쪽은
       skin.js 가 글 목록이 아닐 때 지우기 때문에, 같은 이름을 쓰면
       손질 한 바퀴마다 서로를 지웁니다. */
  if (!top.querySelector('.lim-eadd')) {
    const add = el('button', 'lim-eadd', '에디터 추가')
    add.type = 'button'
    add.addEventListener('click', addEditor)
    top.appendChild(add)
  }
  const list = roster()
  let cnt = top.querySelector('.lim-ecnt')
  if (!cnt) {
    cnt = el('span', 'lim-ecnt')
    top.insertBefore(cnt, top.querySelector('.lim-eadd'))
  }
  const people = list.length + '명'
  if (cnt.textContent !== people) cnt.textContent = people

  const parent = grid.parentNode
  if (!parent) return
  const sig = JSON.stringify(list)
  let box = parent.querySelector('.lim-eds')
  if (box && box.getAttribute('data-lim') === sig) return
  if (!box) {
    box = el('div', 'lim-eds')
    parent.insertBefore(box, grid)
  }
  box.setAttribute('data-lim', sig)
  box.textContent = ''
  for (const a of list) box.appendChild(card(a))
}

/* -------------------------------------------------------------------
   카드의 단추 셋 — 전부 고치는 화면으로 건너가서 Decap 것을 누릅니다

   ⚠ **카드에서 값을 직접 고치지 않습니다.** 파일을 바꾸는 것은 폼이고,
     폼을 거치지 않으면 리덕스가 든 값과 어긋납니다. 저장을 대신 눌러 주는
     것과 같은 방법입니다 (skin.js 의 confirmSave — 진짜 단추를 누릅니다).
   ------------------------------------------------------------------- */

/** 고치는 화면으로 가서, 목록 위젯이 그려지면 `then` 을 부릅니다. */
function openEntry(then, fail) {
  const run = () =>
    waitFor(
      () => document.querySelector("[class*='TopBarContainer']"),
      then,
      fail ||
        (() =>
          say('에디터 화면을 못 열었습니다 — 「에디터」 탭을 눌러 주세요.')),
    )
  if (hash() === ENTRY) {
    run()
    return
  }
  location.hash = ENTRY
  run()
}

/** 그 사람의 줄. 「아이디」 칸으로 찾습니다 — 이름은 겹칠 수 있습니다. */
function rowOf(id) {
  for (const row of document.querySelectorAll("[class*='SortableListItem']"))
    if (val(row, 'id') === id) return row
  return null
}

function isOpen(row) {
  const panel = row.lastElementChild
  return !!(panel && panel.offsetParent)
}

function editEditor(a) {
  openEntry(() => {
    const row = rowOf(a.id)
    if (!row) return /* 방금 지운 사람일 수 있습니다 — 화면은 이미 그쪽입니다 */
    if (!isOpen(row)) {
      const btn = row.querySelector("[class*='StyledListItemTopBar'] button")
      if (btn) btn.click()
    }
    row.scrollIntoView({ block: 'center' })
  })
}

function addEditor() {
  openEntry(() => {
    const btn = document.querySelector("[class*='AddButton']")
    if (btn) btn.click()
    else say('「에디터 추가」를 못 찾았습니다 — 목록 위 단추를 눌러 주세요.')
  })
}

/*
  지우기.

  ⚠ **글이 딸린 사람은 막습니다.** 그 이름으로 쓴 글이 남아 있으면 빌드가
    멈춥니다 (`z.enum` — §3). 여기서 막지 않으면 폰에서 지우고 배포한 뒤에야
    알게 되는데, 그때는 사이트가 통째로 안 나갑니다.

  ⚠ **지우는 것으로 저장까지 되지 않습니다.** 줄만 빠지고, 파일에 남는 것은
    「게시」를 눌러야 합니다 — 그래서 그렇게 알립니다. 여기서 저장까지 대신
    누르지 않는 이유는 지우기와 저장이 한 번에 나가면 되돌릴 자리가 없어서입니다.
*/
function deleteEditor(a) {
  const n = countOf(a.id)
  if (n > 0) {
    window.alert(
      '「' +
        (a.name || a.id) +
        '」로 쓴 글이 ' +
        n +
        '편 있습니다.\n먼저 그 글들을 다른 에디터로 옮기세요 — 그대로 지우면 빌드가 깨집니다.',
    )
    return
  }
  if (
    !window.confirm(
      '「' + (a.name || a.id) + '」를 지웁니다.\n이어서 「게시」를 눌러야 저장됩니다.',
    )
  )
    return

  openEntry(() => {
    const row = rowOf(a.id)
    if (!row) {
      say('지울 줄을 못 찾았습니다 — 줄 오른쪽 ✕ 를 눌러 주세요.')
      return
    }
    /* 줄 오른쪽 ✕. 접기 단추와 같은 모양이라 **차례**로 가릅니다 —
       첫 단추가 접기, 둘째가 지우기입니다 (Decap 3.9). */
    const btns = row.querySelectorAll(
      "[class*='StyledListItemTopBar'] > button",
    )
    const x = btns[btns.length - 1]
    if (!x || btns.length < 2) {
      say('지울 단추를 못 찾았습니다 — 줄 오른쪽 ✕ 를 눌러 주세요.')
      return
    }
    x.click()
    say('「' + (a.name || a.id) + '」를 지웠습니다 — 「게시」를 눌러 저장하세요.')
  })
}

/* -------------------------------------------------------------------
   2. 고치는 화면 — 목록 위젯의 줄

   Decap 이 그리는 줄에는 접기 단추 · 끌개 · ✕ 와, 접혔을 때만 보이는
   요약 글자(config.yml 의 summary)뿐입니다. 시안의 줄에는 얼굴·이름·
   아이디·글 수가 한 줄에 있어야 해서, 그 띠에 얹습니다.

   ⚠ **띠 안에 넣습니다** (요약 글자 자리가 아니라). 요약은 펼치면 Decap 이
     감추는데, 시안에서는 펼쳐도 줄이 그대로 보여야 합니다.
   ------------------------------------------------------------------- */

/*
  칸마다 어느 필드인지 적어 둡니다 — 소개·얼굴 사진·말투를 한 줄 통째로
  쓰게 하는 CSS 가 이걸 봅니다 (index.html 의 `[data-field=…]`).
  ⚠ 글 편집 화면의 `data-field` 와 **같은 이름**입니다 (skin.js 의 layoutForm).
*/
function tagFields(row) {
  for (const box of row.querySelectorAll("[class*='ControlContainer']")) {
    if (box.getAttribute('data-field')) continue
    const label = box.querySelector('label[for*="-field-"]')
    if (!label) continue
    box.setAttribute(
      'data-field',
      (label.getAttribute('for') || '').replace(/-field-\d+$/, ''),
    )
  }
}

/*
  펼쳐진 폼 — 이름을 얹고 두 칸으로 세웁니다 (시안).

  Decap 은 펼친 칸들을 **클래스 없는 div 두 겹**으로 감싸 내려 줍니다.
  CSS 에서 잡을 이름이 없어서 여기서 붙입니다 (`lim-epanel`·`lim-egrid`).

  ⚠ **줄 안에 진짜로 칸이 들어 있을 때만 붙입니다.** 접힌 줄은 마지막
    자식이 요약 글자라, 그것까지 판으로 잡으면 접힌 줄에 테두리가 하나 더
    둘러쳐집니다.

  ⚠ **머리 줄을 맨 앞에 끼워 넣습니다.** React 는 제가 그린 칸들만 지우고
    넣으므로 앞에 붙은 남의 노드는 건드리지 않습니다 (줄 띠에 얹는 것과
    같은 방법). 지우지도 않습니다.
*/
function drawPanel(row, a) {
  const panel = row.lastElementChild
  if (!panel || !panel.querySelector("[class*='ControlContainer']")) return
  panel.classList.add('lim-epanel')

  /* ⚠ **칸이 든 곳을 찾아서** 붙입니다 (`firstElementChild` 가 아니라).
       Decap 은 펼칠 때와 접을 때 감싸는 div 를 갈아 끼웁니다 — 접힌 채로
       붙여 둔 이름이 펼치는 순간 사라져서, 칸이 한 줄로 늘어섰습니다.
       손질은 매 바퀴 도니까 그때마다 다시 붙이면 됩니다. */
  const box = panel.querySelector("[class*='ControlContainer']")
  const grid = box && box.parentElement !== panel ? box.parentElement : null
  if (grid) grid.classList.add('lim-egrid')

  let head = panel.querySelector('.lim-ehead')
  if (!head) {
    head = el('div', 'lim-ehead')
    head.appendChild(avatar(a))
    head.appendChild(el('b'))
    /* ⚠ 클래스를 꼭 답니다 — `.lim-ehead span` 으로 잡으면 아바타(도 span)
         까지 걸려서 머리 줄이 통째로 가운데로 몰립니다 (실제로 그랬습니다). */
    head.appendChild(el('span', 'lim-enote', '펼쳐진 항목'))
    panel.insertBefore(head, panel.firstChild)
  }

  const who = (a.name || a.id) + ' · ' + a.id
  const b = head.querySelector('b')
  if (b.textContent !== who) b.textContent = who
  const face = head.querySelector('.lim-eav')
  if (face) {
    face.textContent = a.initial || (a.name || a.id).slice(0, 1)
    face.setAttribute('data-who', a.color || 'blue')
  }
}

/*
  고치는 화면의 머리 — 「에디터 N명」.

  Decap 은 목록 위젯 위에 「2 에디터」(개수 + 필드 이름)라고 적고, 그 위에
  필드 라벨 「에디터」를 한 번 더 적습니다. 시안은 목록 화면과 같은 머리
  하나입니다 — 「에디터」 크게, 옆에 「N명」.

  ⚠ **Decap 것을 지우지 않고 감춥니다** (index.html). 「에디터 추가」 단추는
    그대로 두고 검은 단추로만 칠합니다 — 그걸 누르는 것이 editors.js 의
    「에디터 추가」이기도 합니다 (addEditor).
*/
function drawTop(n) {
  const bar = document.querySelector("[class*='TopBarContainer']")
  if (!bar) return
  let head = bar.querySelector('.lim-ehd')
  if (!head) {
    head = el('div', 'lim-ehd')
    head.appendChild(el('b', null, '에디터'))
    head.appendChild(el('span'))
    bar.insertBefore(head, bar.firstChild)
  }
  const people = n + '명'
  const cnt = head.querySelector('span')
  if (cnt.textContent !== people) cnt.textContent = people
}

function drawRows() {
  const rows = document.querySelectorAll("[class*='SortableListItem']")
  if (!rows.length) return

  const seen = []
  for (const row of rows) {
    tagFields(row)

    const bar = row.querySelector("[class*='StyledListItemTopBar']")
    if (!bar) continue

    const id = val(row, 'id')
    const name = val(row, 'name') || id
    const known = byId(id)
    const a = {
      id,
      name,
      bio: val(row, 'bio'),
      color: colorOf(row) || (known && known.color) || 'blue',
      initial: val(row, 'initial') || name.slice(0, 1),
      count: countOf(id),
    }
    seen.push(a)

    drawPanel(row, a)

    const open = isOpen(row)
    const sig = [a.id, a.name, a.initial, a.color, a.count, open].join('')
    if (bar.getAttribute('data-lim') === sig) continue
    bar.setAttribute('data-lim', sig)

    let box = bar.querySelector('.lim-erow')
    if (!box) {
      box = el('div', 'lim-erow')
      bar.appendChild(box)
      bar.appendChild(el('span', 'lim-ecount'))
    }
    box.textContent = ''
    box.appendChild(avatar(a))
    box.appendChild(nameBox(a))

    const cnt = bar.querySelector('.lim-ecount')
    if (cnt) cnt.textContent = '글 ' + a.count + '편'

    /* 접기 단추에 글자를 답니다 — 화살표 하나만으로는 무엇이 열리는지
       안 읽힙니다. 아이콘은 CSS 가 감춥니다. */
    const toggle = bar.querySelector('button')
    if (toggle) {
      let word = toggle.querySelector('.lim-etoggle')
      if (!word) {
        word = el('span', 'lim-etoggle')
        toggle.appendChild(word)
      }
      const text = open ? '접기' : '펼치기'
      if (word.textContent !== text) word.textContent = text
    }
  }

  drawTop(seen.length)
  saveRoster(seen)
}

/** skin.js 의 손질 한 바퀴에서 불립니다. */
export function editorsPass() {
  if (inEditorsList()) {
    drawCards()
    return
  }
  clearCards()
  if (inEditorsEntry()) drawRows()
}
