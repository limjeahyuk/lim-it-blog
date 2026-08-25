/**
 * 소개문의 첫 문장.
 *
 * Service 목록 카드가 `tagline` 한 줄만으로는 뭘 하는 물건인지 안
 * 알려줘서 한 문장을 더 붙입니다. **없는 문장을 새로 쓰지 않으려고**
 * `summary` 에 이미 있는 첫 문장을 그대로 씁니다 (§6).
 */
export function leadSentence(text: string): string {
  const cut = text.indexOf('. ')
  return cut === -1 ? text : text.slice(0, cut + 1)
}
