#!/usr/bin/env bash
#
# 글 발행. 빌드로 먼저 검증하고, 통과하면 커밋 + push 합니다.
#
#   npm run post                    → 커밋 메시지 자동 (날짜)
#   npm run post -- "넉백 버그 수정"   → 메시지 직접 지정
#
# 빌드가 깨지면 push 하지 않습니다. frontmatter 오타 같은 게
# 배포된 뒤에 발견되는 걸 막기 위해서입니다.

set -euo pipefail

cd "$(dirname "$0")/.."

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "✗ git 저장소가 아닙니다. 먼저 아래를 실행하세요."
  echo ""
  echo "  git init && git add -A && git commit -m 'init: devlog 블로그'"
  exit 1
fi

if [ -z "$(git status --porcelain)" ]; then
  echo "변경된 게 없습니다. 발행할 것이 없습니다."
  exit 0
fi

echo "▸ 빌드로 검증합니다..."
if ! npm run build --silent > /tmp/blog-build.log 2>&1; then
  echo ""
  echo "✗ 빌드 실패. push 하지 않았습니다."
  echo ""
  tail -30 /tmp/blog-build.log
  exit 1
fi
echo "  통과"

msg="${1:-post: $(date +%Y-%m-%d)}"

echo "▸ 커밋합니다: $msg"
git add -A
git commit -q -m "$msg"

if ! git remote get-url origin > /dev/null 2>&1; then
  echo ""
  echo "커밋은 됐지만 원격 저장소(origin)가 없어서 push 는 건너뜁니다."
  echo "GitHub 저장소를 만든 뒤 아래를 한 번 실행하세요."
  echo ""
  echo "  git remote add origin git@github.com:<계정>/<저장소>.git"
  echo "  git push -u origin main"
  exit 0
fi

echo "▸ push 합니다..."
git push -q

echo ""
echo "✓ 완료. Vercel이 1~2분 안에 배포합니다."
