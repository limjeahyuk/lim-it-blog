---
title: 타임어택 대결 모드 추가
description: 가장 기본적인 대전모드로 만들었습니다.
pubDate: 2026-08-13
author: developer
project: mineapp
draft: false
---

지뢰찾기는 원래 혼자 하는 게임이라 대전을 붙일 자리가 마땅치 않습니다.

그래도 같은 판을 누가 더 빨리 깨는지는 그대로 경기가 됩니다.

지뢰찾기 아레나의 첫 대전 모드가 스피드입니다.

![멀티 플레이 메뉴 — 종류(스피드·지뢰 대결·합동)와 난이도를 고르고, 대전 방식을 따로 정합니다](/images/mineapp-speed-race/multi-menu.png)

종류와 난이도를 한 카드에 묶고, 그 아래에 대전 방식을 따로 뒀습니다.

무엇을 할지와 누구와 할지는 다른 질문입니다. 섞으면 버튼 조합이 열두 개가 됩니다.

[시드 하나로 판이 정해지는 구조](/posts/mineapp-solo-board)를 이미 만들어 뒀기 때문에, 서버가 할 일은 많지 않았습니다.

## 서버가 내려보내는 건 이게 전부입니다

```swift
struct MatchInfo {
    let seed: UInt64
    let difficulty: Difficulty
    let safeR: Int
    let safeC: Int
    let opponentName: String
    var rule: RaceRule = .speed
    ...
}
```

보드는 안 보냅니다. 양쪽이 같은 `seed` 로 같은 배치를 만듭니다.

`safeR` 과 `safeC` 가 같이 오는 게 솔로와 다른 점입니다.

솔로는 첫 탭 자리를 안전 칸으로 삼아 그때 지뢰를 깝니다.

대전에서 그렇게 하면 두 사람의 첫 탭이 달라서 배치가 갈라집니다.

그래서 안전 칸을 서버가 정합니다.

```swift
let safeR = difficulty.rows / 2
let safeC = difficulty.cols / 2
```

한가운데입니다.

그 자리를 기준으로 지뢰를 깔고, 시작하자마자 그 주변을 열어 둔 채로 양쪽이 동시에 출발합니다.

첫 수를 아끼는 사람이 유리해지는 걸 없애려는 것도 있었습니다.

![스피드 레이스 진행 화면 — 나 30%, 클리어봇 29%, 가운데가 미리 열린 초급 보드](/images/mineapp-speed-race/race-speed.png)

## 매칭 직후 바로 시작하지 않습니다

처음에는 매칭되자마자 보드를 띄웠습니다.

그랬더니 상대를 만났다는 걸 알아채기도 전에 판이 시작돼 있었습니다.

그래서 3초 카운트다운을 넣었습니다.

![매칭 직후 — 상대를 만났어요! 클리어봇 · 카운트다운 1](/images/mineapp-speed-race/countdown.png)

여기서 하나 신경 썼습니다.

보드는 카운트다운이 끝난 뒤에 만듭니다.

매칭 시점에 만들어 두면 카운트다운 3초가 타이머에 들어갑니다. 아직 시작도 안 했는데 3초를 지고 들어가는 셈입니다.

## 진행률은 0.5초에 한 번만 보냅니다

진행바가 움직이려면 내 상태를 상대에게 계속 보내야 합니다.

그런데 칸을 열 때마다 보내면 연쇄 오픈 한 번에 수십 번이 나갑니다.

```swift
private let reportInterval: TimeInterval = 0.5

private func reportProgress() {
    guard flow == .racing, result == nil else { return }
    let now = Date()
    guard now.timeIntervalSince(lastReport) >= reportInterval else { return }
    lastReport = now
    service.report(progress: myProgress, phase: .playing, elapsed: game.elapsed, score: myScore)
}
```

진행바는 늦어도 되는 정보입니다. 0.5초 늦게 움직여도 아무도 모릅니다.

대신 승패처럼 되돌릴 수 없는 상태는 이 묶음을 타지 않고 그 자리에서 바로 보냅니다.

내가 먼저 끝냈다는 사실이 0.5초 늦게 도착하면 그건 판정이 흔들리는 것입니다.

Firestore는 쓰기 횟수로 과금되기 때문에 이건 요금 문제이기도 했습니다.

## 판이 끝나지 않는 경우를 막았습니다

승패 규칙 자체는 한 줄입니다. 먼저 모든 안전 칸을 열면 이깁니다.

문제는 그게 안 일어나는 경우들이었습니다.

상대가 나가면 부전승으로 끝냅니다.

이건 지뢰를 밟아서 진 것과 구분해서 처리합니다. 결과 문구가 "상대가 나갔어요"로 달라야 합니다.

아무도 안 나가고 아무도 안 하면 판이 영원히 안 끝납니다.

그래서 자리비움 항복을 넣었습니다.

```swift
private let afkWarnSeconds: TimeInterval = 30
private let afkForfeitSeconds: TimeInterval = 120   // 경고(30초) 후 90초
```

30초 동안 조작이 없으면 경고를 띄우고, 총 2분이 지나면 항복 처리하고 매치에서 나갑니다.

상대는 부전승이 됩니다.

![자리비움 경고 배너 — 자리를 비우셨나요? 1분 28초 후 항복 · 탭하면 계속하기](/images/mineapp-speed-race/afk-warning.png)

여기서 두 번 손봤습니다.

첫째, 내 조작만 세야 합니다.

상대가 보낸 동기화도 내 보드를 바꿉니다. 그걸 활동으로 치면 내가 폰을 내려놔도 상대가 열심히 하는 동안은 타이머가 안 돕니다.

그래서 활동 콜백을 상대 동기화 경로에는 연결하지 않았습니다.

둘째, 백그라운드 시간은 안 셉니다.

전화가 오면 앱이 내려가는데 그동안 항복 시계가 도는 건 부당합니다.

화면이 비활성이면 타이머를 멈추고, 돌아오면 그 시점부터 다시 셉니다.

## 봇이 너무 빨라서 이길 수가 없었습니다

오프라인 연습용 봇이 있습니다.

스피드에서는 봇이 실제로 판을 풀지 않습니다. 완주 시각만 정해놓고 진행바를 그 시각까지 채웁니다.

스피드는 상대가 어디를 열었는지 볼 필요가 없어서, 봇에게 판을 풀리는 건 배터리 낭비였습니다.

```swift
private static func speedFinishSeconds(for d: Difficulty) -> Int {
    switch d {
    case .beginner:     return Int.random(in: 27...43)      // ≈35초
    case .intermediate: return Int.random(in: 80...120)     // ≈1분40초
    case .expert:       return Int.random(in: 360...480)    // ≈7분
    case .ultimate:     return Int.random(in: 720...1000)   // ≈14분
    }
}
```

이 숫자가 처음에는 훨씬 짧았습니다.

그런데 사람은 난이도가 올라갈수록 비선형으로 느려집니다.

초급 35초 하던 사람이 고급을 70초에 깨지 않습니다.

봇을 일정한 배율로 두면 고급부터는 아무도 못 이겼습니다.

그래서 난이도별로 따로 잡았고, 폭도 넓게 뒀습니다.

매번 같은 시각에 끝나면 몇 판 만에 봇이 몇 초짜리인지 외워지기 때문입니다.

![패배 결과 — 상대가 먼저 끝냈어요](/images/mineapp-speed-race/result-lose.png)

## 정리

판정이 단순한 모드일수록 판정 밖이 문제가 됩니다.

스피드의 승패 규칙은 한 줄인데, 실제로 코드가 붙은 곳은 카운트다운·진행률 묶기·이탈·자리비움이었습니다.

규칙이 짧다고 모드가 싼 건 아니었습니다.

늦어도 되는 정보와 늦으면 안 되는 정보는 갈라야 합니다.

둘을 같은 경로로 보내면 요금을 아끼려다 판정이 흔들리거나, 판정을 지키려다 쓰기가 폭발합니다.

진행바는 묶어서 보내고 승패는 바로 보내는 게 그 갈라짐입니다.
