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

  const text = body
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
