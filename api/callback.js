// Decap CMS 의 GitHub 로그인 2단계.
// GitHub 이 넘겨준 code 를 access token 으로 바꾸고,
// Decap 이 띄운 팝업창에 postMessage 로 돌려줍니다.

export default async function handler(req, res) {
  const { code, state } = req.query

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    res.status(500).send('GitHub OAuth 환경변수가 설정되지 않았습니다.')
    return
  }

  // 1단계에서 심어둔 state 와 대조합니다.
  const cookie = req.headers.cookie ?? ''
  const expected = cookie.match(/decap_oauth_state=([^;]+)/)?.[1]

  if (!state || !expected || state !== expected) {
    res.status(400).send('state 불일치. 다시 로그인해 주세요.')
    return
  }

  let payload
  try {
    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
    )
    const data = await tokenRes.json()

    payload = data.error
      ? { error: data.error_description ?? data.error }
      : { token: data.access_token, provider: 'github' }
  } catch (err) {
    payload = { error: String(err) }
  }

  const status = payload.error ? 'error' : 'success'
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`

  // 팝업 → 부모창(Decap)으로 결과 전달. 핸드셰이크 규약은 Decap 이 정한 형식입니다.
  const html = `<!doctype html>
<html><body><script>
  (function () {
    var message = ${JSON.stringify(message)};
    window.addEventListener('message', function handler() {
      window.opener.postMessage(message, '*');
    }, { once: true });
    window.opener.postMessage('authorizing:github', '*');
  })();
</script></body></html>`

  res.setHeader(
    'Set-Cookie',
    'decap_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
  )
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(html)
}
