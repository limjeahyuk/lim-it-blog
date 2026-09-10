/**
 * XML·JSON 에 못 들어가는 제어문자를 걷어냅니다 (탭·개행·복귀는 남깁니다).
 *
 * 티스토리에서 옮겨온 글 8편에 백스페이스(U+0008)가 박혀 있었습니다 —
 * 화면에서는 안 보이는데 **RSS 를 통째로 깨뜨립니다.** XML 1.0 이 이
 * 문자들을 아예 금지해서, 한 글자 때문에 피드 전체가 파싱 실패가 됩니다
 * (2026-09-10 에 네이버가 "RSS 형식이 올바르지 않다"로 잡아냈습니다).
 *
 * ⚠ 자바스크립트의 `\s` 는 이것들을 안 잡습니다 — 아래 `\s+` 로 공백을
 *   모으는 것만으로는 안 없어집니다. 그래서 따로 걷습니다.
 *
 * 파일 8편은 그때 고쳤지만, 이건 **다음 한 글자를 막는 자리**입니다.
 * 폰에서 글을 쓰다 붙여넣은 것에 섞여 들어와도 피드가 안 깨집니다.
 */
export function stripControl(text: string): string {
  return text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
}

/**
 * 본문 앞부분을 잘라 meta description 으로 씁니다.
 *
 * 티스토리에서 옮겨온 116개에는 `description` 이 거의 없습니다. 그렇다고
 * 전부 SITE_DESCRIPTION 으로 채우면 117개 글의 설명이 전부 같아져서,
 * 검색 결과에서 어느 글인지 구분이 안 됩니다. 그래서 본문에서 뽑습니다.
 *
 * ⚠ 화면에 보이는 소개문(`description`)과는 다릅니다. 이건 `<head>` 에만
 *   들어갑니다 — 없는 소개문을 지어내서 카드에 띄우지 않습니다.
 */
export function excerpt(body: string | undefined, max = 155): string {
  if (!body) return ''

  const text = stripControl(body)
    .replace(/```[\s\S]*?```/g, ' ') // 코드 블록
    .replace(/`[^`]*`/g, ' ') // 인라인 코드
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크는 글자만 남김
    .replace(/<[^>]+>/g, ' ') // HTML 태그
    .replace(/^\s{0,3}([#>]+|[-*+]|\d+\.)\s+/gm, '') // 머리글·인용·목록 표시
    .replace(/^\s*([-*_]\s*){3,}$/gm, ' ') // 구분선
    .replace(/[*_~]/g, '') // 강조 기호
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= max) return text

  // 자를 자리를 마지막 공백으로 물립니다 (한국어는 공백이 없을 수도 있어서 그때는 그냥 자릅니다).
  const cut = text.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`
}
