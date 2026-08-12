import { webcrypto } from 'node:crypto'

/**
 * 비밀글 — 빌드할 때 본문을 잠그고, 읽는 사람 브라우저에서 풉니다.
 *
 * ⚠ 이 파일은 **빌드할 때만** 돕니다. 클라이언트 코드에서 import 하면
 *   비밀번호가 번들에 박혀서 나갑니다. 절대 `<script>` 안에서 쓰지 마세요.
 *   (푸는 쪽 코드는 SecretGate.astro 안에 따로 들어 있고, 거기에는
 *   비밀번호가 아니라 암호문만 넘어갑니다.)
 *
 * 왜 이렇게까지 하냐면 — 「JS로 가려두기」는 비밀글이 아닙니다.
 * 페이지 소스를 보면 본문이 그대로 있습니다. 정적 사이트라 서버에서
 * 막을 방법이 없으니, 본문 자체를 암호문으로 내보내는 수밖에 없습니다.
 * 비밀번호를 모르면 브라우저에도 본문이 없습니다.
 */

/** PBKDF2 반복 횟수. 폰에서 푸는 데 0.2~0.4초쯤 걸립니다. */
export const ITERATIONS = 200_000

const te = new TextEncoder()

/**
 * 비밀글 비밀번호. `.env` 나 Vercel 환경변수에서 옵니다.
 *
 * 글마다 다른 비밀번호를 두지 않고 하나로 갑니다 — 글마다 다르면
 * 파일에 적어둬야 하는데, 그러면 저장소에 비밀번호가 남습니다.
 */
export function getSecretPassword(): string | undefined {
  const fromVite = import.meta.env.SECRET_POST_PASSWORD
  const fromNode = process.env.SECRET_POST_PASSWORD
  const value = (fromVite ?? fromNode ?? '').trim()
  return value.length > 0 ? value : undefined
}

export type SealedContent = {
  salt: string
  iv: string
  data: string
  iterations: number
}

async function deriveKey(password: string, salt: Uint8Array) {
  const base = await webcrypto.subtle.importKey(
    'raw',
    te.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )
}

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  return Buffer.from(bytes as ArrayBuffer).toString('base64')
}

/** 본문 HTML을 AES-GCM 으로 잠급니다. salt·iv 는 글마다 새로 뽑습니다. */
export async function sealHtml(
  html: string,
  password: string,
): Promise<SealedContent> {
  const salt = webcrypto.getRandomValues(new Uint8Array(16))
  const iv = webcrypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const data = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    te.encode(html),
  )

  return {
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(data),
    iterations: ITERATIONS,
  }
}

/**
 * 비밀글인데 비밀번호가 없으면 빌드를 세웁니다.
 *
 * 그냥 넘어가면 본문이 평문으로 배포됩니다 — 비밀글이라고 써놓고
 * 실제로는 다 보이는 상태가 제일 나쁩니다.
 */
export function requireSecretPassword(postId: string): string {
  const password = getSecretPassword()
  if (!password) {
    throw new Error(
      [
        `비밀글 「${postId}」 을 잠글 비밀번호가 없습니다.`,
        '',
        'SECRET_POST_PASSWORD 를 정해 주세요.',
        '  로컬: 저장소 맨 위에 .env 파일을 만들고',
        '        SECRET_POST_PASSWORD=고른비밀번호',
        '  배포: Vercel → Settings → Environment Variables 에 같은 이름으로',
        '',
        '(비밀번호가 없는 채로 빌드하면 본문이 그대로 배포됩니다. 그래서 멈춥니다.)',
      ].join('\n'),
    )
  }
  return password
}
