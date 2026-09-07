/*
  /admin — 사진을 **떨어뜨리거나 붙여넣으면** Cloudinary 로 올립니다.

  ⚠ 이 파일은 소스입니다. 실제로 불러오는 것은 `public/admin/editor.js` 예요.
    고쳤으면 `npm run admin` 을 돌리세요.

  왜 직접 올리나 (2026-09-07 에 Cloudinary 로 옮긴 뒤로):

  - Decap 위젯이 주는 `onPersistMedia` 는 **저장소(GitHub)로** 올립니다.
    base64 커밋이라, 사진을 Cloudinary 로 옮긴 이유(§6-5)와 정면으로
    부딪힙니다. 떨어뜨린 사진만 `.git` 에 쌓이게 됩니다.
  - Decap 이 쓰는 Cloudinary **미디어 라이브러리 위젯**은 `show()`/`hide()`
    뿐이라, 손에 든 File 을 그 창에 건넬 방법이 없습니다 (번들에서 확인).

  그래서 남는 길은 브라우저에서 Cloudinary 로 바로 올리는 것뿐이고, 그러려면
  **unsigned 업로드 프리셋**이 필요합니다 (`config.yml` 의 `upload_preset`).

  ⚠ **프리셋 이름은 공개됩니다.** 저장소가 공개이고 `config.yml` 은 그대로
    배포됩니다 — 남이 그 프리셋으로 올릴 수 있다는 뜻입니다. 막는 자리는
    코드가 아니라 **Cloudinary 콘솔의 프리셋 설정**입니다 (폴더 고정 ·
    최대 용량 · 허용 형식). 서명 방식으로 바꾸려면 api_secret 을 들고 있는
    서버리스 함수가 하나 더 필요합니다 (§8 에 적어 뒀습니다).

  ⚠ **`api_secret` 을 여기에도, config.yml 에도 적지 마세요.** unsigned
    업로드는 secret 없이 프리셋 이름만으로 올라갑니다.
*/
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

/** Cloudinary 가 unsigned 업로드에서 받아 주는 한 장 최대 용량. */
const MAX_BYTES = 10 * 1024 * 1024

/*
  `default_transformations` 를 주소 조각으로 옮기는 표.

  ⚠ **왜 직접 만드나.** 「사진」 단추로 넣으면 Decap 이 `asset.derived[0]`
    을 씁니다 — Cloudinary 가 그 변환을 먹여서 따로 만들어 둔 주소입니다
    (번들에서 확인). 직접 올리면 원본 주소만 돌아와서, 그대로 두면 폰 원본
    5MB 가 본문에 박힙니다. 두 경로가 **같은 주소 모양**이 되도록 여기서
    같은 변환을 붙입니다.

  목록에 없는 키는 그냥 버립니다 — 모르는 것을 주소에 적는 것보다 낫습니다.
*/
const SHORT = {
  width: 'w',
  height: 'h',
  crop: 'c',
  quality: 'q',
  fetch_format: 'f',
  format: 'f',
  gravity: 'g',
  dpr: 'dpr',
  effect: 'e',
  angle: 'a',
}

/**
 * `{ width: 1600, crop: 'limit' }` → `c_limit,w_1600`.
 *
 * Cloudinary 가 만드는 derived 주소가 짧은 이름 알파벳 순이라 그것에 맞춥니다.
 */
export function transformSegment(params) {
  if (!params) return ''
  return Object.keys(params)
    .filter((k) => SHORT[k] && params[k] != null && params[k] !== '')
    .map((k) => SHORT[k] + '_' + params[k])
    .sort()
    .join(',')
}

/**
 * 올리고 받은 주소에 변환을 끼워 넣습니다.
 *
 * `…/image/upload/v1/a.jpg` → `…/image/upload/c_limit,w_1600/v1/a.jpg`
 */
export function withTransform(url, params) {
  const seg = transformSegment(params)
  if (!seg || typeof url !== 'string') return url
  const at = url.indexOf('/upload/')
  if (at === -1) return url
  const head = at + '/upload/'.length
  return url.slice(0, head) + seg + '/' + url.slice(head)
}

/**
 * Decap 설정에서 Cloudinary 칸을 꺼냅니다.
 *
 * 위젯이 받는 `config` 는 Immutable Map 이라 `toJS()` 로 풀어 씁니다.
 * 평범한 객체로 들어와도 되게 둘 다 받습니다.
 */
export function readCloudinary(config) {
  if (!config) return null
  const get = (path) =>
    typeof config.getIn === 'function'
      ? config.getIn(path)
      : path.reduce((o, k) => (o == null ? o : o[k]), config)

  if (get(['media_library', 'name']) !== 'cloudinary') return null

  const raw = get(['media_library', 'config'])
  const cfg = raw && typeof raw.toJS === 'function' ? raw.toJS() : raw
  if (!cfg || !cfg.cloud_name) return null

  const list = cfg.default_transformations
  const first = Array.isArray(list) && Array.isArray(list[0]) ? list[0][0] : null

  return {
    cloudName: cfg.cloud_name,
    preset: cfg.upload_preset || '',
    transform: first || null,
  }
}

/**
 * 한 장 올리고 본문에 넣을 주소를 돌려줍니다.
 *
 * unsigned 업로드라 서명이 없습니다 — `upload_preset` 하나로 통과합니다.
 */
export async function uploadImage(file, { cloudName, preset, transform }) {
  if (!preset) {
    throw new Error(
      'Cloudinary 업로드 프리셋이 없습니다. config.yml 의 upload_preset 을 채우거나 「사진」 단추를 쓰세요.',
    )
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`사진이 너무 큽니다 (${Math.round(file.size / 1e6)}MB). 10MB 아래로 줄여 주세요.`)
  }

  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', preset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  })

  /* Cloudinary 는 실패해도 JSON 으로 이유를 적어 줍니다 — 그대로 보여
     주는 편이 "업로드 실패" 한 줄보다 고치기 쉽습니다. */
  let json = null
  try {
    json = await res.json()
  } catch (e) {
    json = null
  }
  if (!res.ok || !json || !json.secure_url) {
    const why = (json && json.error && json.error.message) || `HTTP ${res.status}`
    throw new Error(why)
  }

  return withTransform(json.secure_url, transform)
}

/* =================================================================
   올리는 동안 자리를 잡아 두는 표시.

   ⚠ **본문에 임시 노드를 넣지 않습니다.** blob: 주소를 가진 사진을 잠깐
     끼워 넣으면, 올리는 중에 다른 글자를 치는 순간 그게 마크다운으로
     나가서 **파일에 blob: 주소가 저장됩니다.** 대신 ProseMirror 의
     decoration 으로 둡니다 — 문서가 아니라 화면에만 있는 것이라 저장될
     수가 없고, 그동안 글을 쳐도 자리가 알아서 따라 움직입니다.
   ================================================================= */
const key = new PluginKey('limUploadPlaceholder')

function placeholderPlugin() {
  return new Plugin({
    key,
    state: {
      init: () => DecorationSet.empty,
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc)
        const action = tr.getMeta(key)
        if (action && action.add) {
          const el = document.createElement('span')
          el.className = 'lim-md-uploading'
          el.textContent = action.add.label
          set = set.add(tr.doc, [Decoration.widget(action.add.pos, el, { id: action.add.id })])
        }
        if (action && action.remove) {
          set = set.remove(set.find(null, null, (spec) => spec.id === action.remove.id))
        }
        return set
      },
    },
    props: {
      decorations(state) {
        return key.getState(state)
      },
    },
  })
}

/** 표시가 지금 어디에 있는지. 지워졌으면 null 입니다. */
function placeholderAt(state, id) {
  const set = key.getState(state)
  const found = set ? set.find(null, null, (spec) => spec.id === id) : []
  return found.length ? found[0].from : null
}

/** 떨어뜨린 것 중 사진만. 원문 모드(editor.js)도 같은 것을 씁니다. */
export function imagesIn(list) {
  return Array.prototype.slice.call(list || []).filter((f) => f && /^image\//.test(f.type))
}

/**
 * 한 장씩 차례로 올립니다.
 *
 * 한꺼번에 올리지 않는 이유는 폰입니다 — 3~5MB 짜리 여러 장을 동시에
 * 올리면 어느 것도 안 끝난 것처럼 보입니다. 차례로 하면 한 장씩 들어옵니다.
 */
async function runUploads(editor, files, startPos, upload) {
  const view = editor.view
  let pos = startPos

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]
    const id = {}
    const label = files.length > 1 ? `사진 올리는 중… (${i + 1}/${files.length})` : '사진 올리는 중…'

    view.dispatch(view.state.tr.setMeta(key, { add: { id, pos, label } }))

    let url = null
    let failed = null
    try {
      url = await upload(file)
    } catch (err) {
      failed = err
    }

    const at = placeholderAt(view.state, id)
    view.dispatch(view.state.tr.setMeta(key, { remove: { id } }))

    if (failed) {
      window.alert('사진을 올리지 못했습니다.\n\n' + (failed.message || failed))
      return
    }

    /* 표시가 사라졌으면(그 자리를 지웠다는 뜻) 커서 자리에 넣습니다. */
    const where = at == null ? view.state.selection.from : at
    editor.chain().insertContentAt(where, { type: 'image', attrs: { src: url, alt: '설명' } }).run()

    /* ⚠ 다음 장은 `to` 뒤에 놓습니다. 넣고 나면 그 사진이 골라진 상태라
       `from` 은 사진 **앞**을 가리킵니다 — 그걸 쓰면 두 번째 장이 첫
       번째 앞으로 들어가서 순서가 뒤집힙니다 (재현해서 고쳤습니다). */
    pos = editor.state.selection.to
  }
}

/* =================================================================
   떨어뜨리기·붙여넣기.
   ================================================================= */
export const ImageUpload = Extension.create({
  name: 'limImageUpload',

  addOptions() {
    /* (file) => Promise<url>. 없으면 아무 일도 안 합니다 — 왕복 검사
       (scripts/check-md-roundtrip.mjs)가 부르는 기본 묶음이 그 경우입니다. */
    return { upload: null }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const options = this.options

    const take = (files, pos) => {
      const images = imagesIn(files)
      if (!images.length) return false
      if (!options.upload) {
        window.alert('사진을 올릴 자리가 설정되지 않았습니다. 「사진」 단추를 쓰세요.')
        return true
      }
      runUploads(editor, images, pos, options.upload)
      return true
    }

    return [
      placeholderPlugin(),
      new Plugin({
        props: {
          handleDrop(view, event) {
            const dt = event.dataTransfer
            const files = dt ? dt.files : null
            if (!files || !files.length) return false

            /*
              ⚠ **사진이 아니어도 기본 동작을 막습니다.** 안 막으면
                브라우저가 그 파일로 페이지를 넘겨 버려서, 쓰던 글이
                통째로 날아갑니다.
            */
            event.preventDefault()

            const at = view.posAtCoords({ left: event.clientX, top: event.clientY })
            return take(files, at ? at.pos : view.state.selection.from)
          },

          handlePaste(view, event) {
            const cd = event.clipboardData
            const files = cd ? cd.files : null
            if (!files || !files.length) return false
            if (!imagesIn(files).length) return false

            /* 스크린샷을 ⌘V 로 붙이는 자리입니다. 사진이 들어 있으면
               같이 온 text/html 은 무시합니다 — 거기 있는 <img> 는 남의
               서버 주소라 그대로 걸면 언젠가 404 가 됩니다. */
            event.preventDefault()
            return take(files, view.state.selection.from)
          },

          /* 끌고 오는 동안 본문에 점선을 둘러 어디에 떨어지는지 보여 줍니다. */
          handleDOMEvents: {
            dragover(view, event) {
              if (hasFiles(event)) view.dom.classList.add('is-dropping')
              return false
            },
            dragleave(view, event) {
              if (!event.relatedTarget || !view.dom.contains(event.relatedTarget)) {
                view.dom.classList.remove('is-dropping')
              }
              return false
            },
            drop(view) {
              view.dom.classList.remove('is-dropping')
              return false
            },
          },
        },
      }),
    ]
  },
})

function hasFiles(event) {
  const types = event.dataTransfer && event.dataTransfer.types
  if (!types) return false
  return Array.prototype.indexOf.call(types, 'Files') !== -1
}
