/*
  문단 종류 표 — 도구 띠의 고르개와 단축키가 **같은 표**를 봅니다.

  ⚠ 따로 적으면 화면의 「제목 2」와 ⌘⌥2 가 언젠가 어긋납니다. 하나만
    고치고 다른 쪽을 잊는 일이 실제로 일어납니다.

  하니 매거진(~/Develop/Company/hani/magazine)의 `editor/blocks.ts` 를 옮긴
  것입니다. 거기는 제목 1~5 + 본문 크기 5단계인데, 여기서는 **제목 1~3 과
  본문**만 남겼습니다.

  - 제목 4~5(h5·h6): 글 128편에 한 번도 안 쓰였고 `.prose` 에 스타일도 없습니다.
  - 본문 크기 5단계: 마크다운에 담을 자리가 없습니다. 하니는 문서를 JSON 으로
    저장해서 되지만 여기는 `.md` 파일입니다.
*/

/** 편집기의 제목 1~3 은 문서의 h2~h4 입니다 — h1 은 글 제목이 이미 쓰고 있습니다. */
export const HEADING_LEVELS = [2, 3, 4]

export const BLOCKS = [
  { id: 'h2', label: '제목 1', mark: 'H1', shortcut: '⌘⌥1', keys: ['Mod-Alt-1'] },
  { id: 'h3', label: '제목 2', mark: 'H2', shortcut: '⌘⌥2', keys: ['Mod-Alt-2'] },
  { id: 'h4', label: '제목 3', mark: 'H3', shortcut: '⌘⌥3', keys: ['Mod-Alt-3'] },
  { id: 'p', label: '본문', mark: '본문', shortcut: '⌘⌥0', keys: ['Mod-Alt-0'] },
]

/** 커서가 선 자리가 어느 칸인지. 어디에도 안 걸리면 본문입니다. */
export function blockAt(editor) {
  const level = HEADING_LEVELS.find((l) => editor.isActive('heading', { level: l }))
  return level ? 'h' + level : 'p'
}

/** 고른 칸을 지금 문단에 씌웁니다. */
export function setBlock(editor, id) {
  const chain = editor.chain().focus()
  if (id.charAt(0) === 'h') return chain.setNode('heading', { level: Number(id.slice(1)) }).run()
  return chain.setNode('paragraph').run()
}
