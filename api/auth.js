// Decap CMS 의 GitHub 로그인 1단계.
// 브라우저를 GitHub 인증 화면으로 보냅니다.
//
// 필요한 환경변수 (Vercel):
//   OAUTH_GITHUB_CLIENT_ID
//   OAUTH_GITHUB_CLIENT_SECRET

import { randomBytes } from 'node:crypto'

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID

  if (!clientId) {
    res.status(500).send('OAUTH_GITHUB_CLIENT_ID 가 설정되지 않았습니다.')
    return
  }

  const host = req.headers['x-forwarded-host'] ?? req.headers.host
  const proto = req.headers['x-forwarded-proto'] ?? 'https'
  const state = randomBytes(16).toString('hex')

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `${proto}://${host}/api/callback`)
  url.searchParams.set('scope', 'repo,user')
  url.searchParams.set('state', state)

  // state 를 쿠키에 담아 콜백에서 대조합니다 (CSRF 방지).
  res.setHeader(
    'Set-Cookie',
    `decap_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  )
  res.redirect(302, url.toString())
}
