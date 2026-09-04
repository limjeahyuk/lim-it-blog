/*
  단축키.

  하니 매거진(~/Develop/Company/hani/magazine)의 `editor/BlockShortcuts.ts` ·
  `editor/tools.ts` 를 옮긴 것입니다. 둘 다 순수 tiptap 확장이라 React 없이
  그대로 돕니다 — 하니 쪽 도구 띠(1,092줄 React)는 못 가져옵니다.

  ⚠ **단추와 키가 같은 함수를 부르게 두세요.** 따로 적으면 언젠가 둘이
    다르게 동작합니다 (하니에서 그렇게 정해 놓은 이유입니다).

  하니에 있지만 여기 없는 것: 정렬 · 폰트 · 줄간격 · 콜아웃 · 토글 · 본문
  크기. 전부 **마크다운에 담을 자리가 없어서** 뺐습니다. 넣으면 편집기에서는
  보이는데 저장하면 사라집니다.
*/
import { Extension } from '@tiptap/core'
import { BLOCKS, setBlock } from './blocks.js'

/**
 * 문단 종류 단축키 (⌘⌥1~3 · ⌘⌥0).
 *
 * ⚠ StarterKit 의 Heading 이 ⌘⌥1~6 을 h1~h6 에 이미 매어 둡니다. 우리 화면의
 *   이름은 「제목 1~3」이고 문서로는 h2~h4 라, 그대로 두면 ⌘⌥1 이 h1(글 제목과
 *   같은 단계)을 만들고 한 칸씩 밀린 채로 쓰게 됩니다. 그래서 여기서 다시 맵니다.
 *
 * ⚠ `priority` 를 올려야 Heading 보다 먼저 키를 봅니다 — 낮으면 겹치는 ⌘⌥1~3 을
 *   저쪽이 먹습니다.
 */
export const BlockShortcuts = Extension.create({
  name: 'blockShortcuts',
  priority: 1000,

  addKeyboardShortcuts() {
    const map = {}
    for (const block of BLOCKS) {
      for (const key of block.keys) map[key] = () => setBlock(this.editor, block.id)
    }
    return map
  },
})

/**
 * 도구 단축키.
 *
 * 목록·인용·코드블록은 tiptap 이 이미 매어 둡니다(⌘⇧7·8·9 · ⌘⇧B · ⌘⌥C) —
 * 여기 없는 이유입니다.
 *
 * ⚠ 취소선을 다시 매는 건 tiptap 자리(⌘⇧S)가 도구 띠에 적은 ⌘⇧X 와 달라서고,
 *   하니에서 쓰던 자리를 그대로 가져온 것입니다.
 */
export const ToolShortcuts = Extension.create({
  name: 'toolShortcuts',
  priority: 1000,

  addOptions() {
    return {
      /** 사진 고르는 창은 Decap 쪽에 있습니다 — 편집기가 직접 못 열어 손잡이를 받습니다 */
      pickImage: () => {},
      /** 링크 주소를 묻는 것도 마찬가지입니다 (prompt 는 편집기 밖에서 띄웁니다) */
      pickLink: () => {},
      /** 색·형광펜은 이 블로그만 쓰는 마크라 명령 이름을 밖에서 받습니다 */
      colors: [],
    }
  },

  addKeyboardShortcuts() {
    const editor = this.editor
    const map = {
      'Mod-Shift-x': () => editor.chain().focus().toggleStrike().run(),
      'Mod-Alt-y': () => editor.chain().focus().toggleHighlight().run(),
      'Mod-\\': () => editor.chain().focus().unsetAllMarks().run(),
      'Mod-k': () => {
        this.options.pickLink()
        return true
      },
      'Mod-Alt-p': () => {
        this.options.pickImage()
        return true
      },
    }

    /*
      글자 색은 ⌘⌥⇧1~5, 색 빼기는 ⌘⌥⇧0 입니다.

      하니는 이 자리(⌘⌥⇧1~5)를 본문 크기에 쓰는데 여기서는 본문 크기를 뺐습니다.
      비는 자리에 색을 얹었습니다 — 제목이 ⌘⌥1~3 이라 ⇧ 하나만 더 누르면 되는
      짝이 됩니다.
    */
    this.options.colors.forEach((color, i) => {
      map['Mod-Alt-Shift-' + (i + 1)] = () =>
        editor.chain().focus().setTextColor(color.k).run()
    })
    map['Mod-Alt-Shift-0'] = () => editor.chain().focus().unsetTextColor().run()

    return map
  },
})
