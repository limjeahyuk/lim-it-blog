/*
  화면 아래에 한 줄 알리는 것.

  Decap 의 알림(react-toastify)이 **안 뜨는 경우**에만 씁니다 — 저장이 시작
  조차 안 됐을 때, 「에디터 추가」를 못 찾았을 때 같은 것들. 판정이 있는 것은
  Decap 알림에 맡깁니다 (§6-2). 같은 말을 두 곳에서 하면 언젠가 어긋납니다.

  ⚠ skin.js 와 editors.js 가 같이 씁니다. 한쪽에 두고 다른 쪽에서 import 하면
    서로를 import 하는 고리가 생기는데, skin.js 는 불려 들어가는 순간
    startSkin() 까지 돌리는 파일이라 그 고리를 만들지 않는 편이 낫습니다.
*/

export function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text != null) node.textContent = text
  return node
}

let sayTimer = null

export function say(text) {
  let box = document.querySelector('.lim-say')
  if (!box) {
    box = el('div', 'lim-say')
    document.body.appendChild(box)
  }
  box.textContent = text
  box.classList.add('is-on')
  if (sayTimer) clearTimeout(sayTimer)
  sayTimer = setTimeout(() => box.classList.remove('is-on'), 8000)
}

/*
  React 가 그릴 때까지 기다립니다.

  ⚠ **타이머로 훑지 말고 MutationObserver 로 기다리세요.** 뜨는 순간 바로
    씁니다. 정해 둔 시간(6초)은 "이쯤이면 안 뜬다" 는 뜻이지 기다리는 간격이
    아닙니다 — 짧게 잡았다가 저장이 통째로 안 나간 일이 있습니다 (§8의
    2026-09-07).

  @param find 찾으면 그것을 돌려주는 함수. 아무것도 없으면 falsy.
  @param done 찾았을 때. @param fail 6초 안에 못 찾았을 때.
*/
export function waitFor(find, done, fail) {
  let over = false
  let mo = null
  let giveUp = null

  const stop = () => {
    over = true
    if (mo) mo.disconnect()
    if (giveUp) clearTimeout(giveUp)
  }

  const tryNow = () => {
    if (over) return
    let found = null
    try {
      found = find()
    } catch (e) {
      found = null
    }
    if (!found) return
    stop()
    done(found)
  }

  mo = new MutationObserver(tryNow)
  mo.observe(document.body, { childList: true, subtree: true })
  giveUp = setTimeout(() => {
    if (over) return
    stop()
    if (fail) fail()
  }, 6000)

  tryNow()
}
