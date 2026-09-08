/*
  쪽 나누기 — **브라우저에서 돕니다.**

  서고(`/posts`)와 저자 지면(`/authors/<id>`)이 같이 씁니다. 이 파일만
  브라우저에서 도는 것이라 `src/lib` 의 다른 것들(서버에서 도는 것)과
  성격이 다릅니다 — Astro 의 `<script>` 가 이걸 import 해서 묶습니다.

  ⚠ **줄은 전부 그려 둡니다.** 쪽마다 주소를 따로 내는 쪽(`/posts/page/2`)
    도 놓고 견줬는데, 이쪽이면 131편의 링크가 한 문서 안에 다 있어서
    검색엔진이 한 번에 다 봅니다. 자바스크립트가 죽어도 **전부 보이는 채로**
    남습니다 — 쪽 단추는 스크립트가 만들기 때문에 그때는 아예 안 나옵니다.

  ⚠ 쪽 번호는 주소(`?page=`)에 남깁니다. 그래야 그 쪽을 그대로 주고받거나
    뒤로가기로 돌아올 수 있습니다 (옛 `?author=` 와 같은 규칙).
*/

/** 한 쪽에 몇 줄. 시안이 131편을 일곱 쪽으로 나눠 그려 놨습니다. */
export const PER_PAGE = 20

type Options = {
  /** 나눌 줄. 이 차례대로 잘립니다 */
  rows: HTMLElement[]
  /** 쪽 단추를 그려 넣을 자리 */
  mount: HTMLElement
  /** 쪽을 옮길 때 여기가 화면 위로 오게 합니다 */
  top?: HTMLElement | null
}

/**
 * 쪽 번호를 어떻게 늘어놓을지. 여섯 쪽까지는 다 적고, 그보다 많으면
 * 지금 쪽 언저리 다섯 개에 첫 쪽·끝 쪽을 `…` 로 이어 붙입니다.
 *
 * ⚠ 경계가 여섯인 것은 시안이 131편 · 일곱 쪽을 `1 2 3 4 5 … 7` 로
 *   그려 놨기 때문입니다. 일곱까지 다 적으면 그 그림이 안 나옵니다.
 */
function sequence(current: number, pages: number): (number | '…')[] {
  if (pages <= 6) return Array.from({ length: pages }, (_, i) => i + 1)

  const start = Math.min(Math.max(current - 2, 1), pages - 4)
  const end = start + 4
  const out: (number | '…')[] = []

  if (start > 1) {
    out.push(1)
    if (start > 2) out.push('…')
  }
  for (let i = start; i <= end; i += 1) out.push(i)
  if (end < pages) {
    if (end < pages - 1) out.push('…')
    out.push(pages)
  }
  return out
}

export function setupPager({ rows, mount, top }: Options) {
  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE))
  let current = 1

  function draw() {
    mount.textContent = ''
    /* 한 쪽에 다 들어가면 단추를 아예 안 그립니다 — 눌러 봐야 그 자리입니다 */
    if (pages <= 1) return

    const arrow = (label: string, to: number, disabled: boolean) => {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'pg-arrow'
      el.textContent = label
      el.disabled = disabled
      el.setAttribute('aria-label', label === '‹' ? '이전 쪽' : '다음 쪽')
      if (!disabled) el.addEventListener('click', () => go(to))
      mount.append(el)
    }

    arrow('‹', current - 1, current === 1)

    for (const item of sequence(current, pages)) {
      if (item === '…') {
        const gap = document.createElement('span')
        gap.className = 'pg-gap'
        gap.textContent = '…'
        mount.append(gap)
        continue
      }

      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'pg-num'
      el.textContent = String(item)
      if (item === current) {
        el.classList.add('is-on')
        el.setAttribute('aria-current', 'page')
      }
      el.addEventListener('click', () => go(item))
      mount.append(el)
    }

    arrow('›', current + 1, current === pages)
  }

  function apply(page: number) {
    current = Math.min(Math.max(page, 1), pages)
    const from = (current - 1) * PER_PAGE
    rows.forEach((row, i) => {
      row.hidden = i < from || i >= from + PER_PAGE
    })
    draw()
  }

  function go(page: number) {
    const url = new URL(location.href)
    if (page <= 1) url.searchParams.delete('page')
    else url.searchParams.set('page', String(page))
    history.pushState({}, '', url)
    apply(page)
    /* 쪽을 옮기면 목록 맨 위로. 안 그러면 스크롤이 그대로라 아무 일도
       안 일어난 것처럼 보입니다 */
    if (top) top.scrollIntoView({ block: 'start' })
  }

  const fromUrl = () => Number(new URL(location.href).searchParams.get('page')) || 1

  addEventListener('popstate', () => apply(fromUrl()))
  apply(fromUrl())
}
