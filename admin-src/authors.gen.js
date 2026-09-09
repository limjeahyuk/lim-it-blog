/* 자동 생성 — scripts/sync-authors.mjs. 손으로 고치지 마세요.
   원본은 src/data/authors.json 이고 /admin 의 「에디터」가 고칩니다.

   ⚠ 이것은 **마지막 빌드 기준**입니다. 폰에서 에디터를 더해도 다음 배포까지는
     여기 안 들어옵니다 — 그래서 skin.js 는 「에디터」 화면을 한 번 열 때
     본 명단을 이 브라우저에 적어 두고 그것을 먼저 씁니다. */

export const AUTHOR_NAMES = {
  "student": "학생",
  "developer": "개발자",
  "pm": "기획자",
}

/** 저자별 글 수. 「에디터」의 「글 N편」과 지울 수 있는지 판정에 씁니다. */
export const AUTHOR_COUNTS = {
  "developer": 15,
  "student": 116,
}

/** 「에디터」 카드에 그리는 명단. 순서는 authors.json 그대로입니다. */
export const AUTHOR_LIST = [
  {
    "id": "student",
    "name": "학생",
    "bio": "임재혁, 코딩 및 AI 관련 공부를 진행 하는 중이에요! 🔥",
    "color": "blue",
    "initial": "S",
    "count": 116
  },
  {
    "id": "developer",
    "name": "개발자",
    "bio": "임재혁, 개발을 하면서 생기는 것들 기록합니다.",
    "color": "red",
    "initial": "D",
    "count": 15
  },
  {
    "id": "pm",
    "name": "기획자",
    "bio": "임재혁, 새로운 것을 만들기 위한 기획을 정리 해보도록 할께요!",
    "color": "green",
    "initial": "P",
    "count": 0
  }
]
