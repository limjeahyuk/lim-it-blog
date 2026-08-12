---
title: 'TimerController'
pubDate: 2025-11-12
category: ios/beeptimer
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/91
---
운동 타이머(인터벌) 앱을 만들다 보면 “시간/휴식”, “진행/일시정지/대기”의 **상태 전이**와 “마지막 설정 유지” 같은 **경험 요소**가 핵심입니다. 이 글에서는 TimerController 하나로 **상태 머신 + 시간 계산 + 영구 저장**까지 정리하는 방법을 공유합니다.

**Timer Controller 기능.**

-   **Phase**: time ↔ rest 두 단계
-   **State**: idle / running(start,end) / paused(remaining)
-   **configure(title:time:rest:sets:)** 로 설정을 주입
-   **start / pause / resume / stop** 으로 컨트롤
-   **UserDefaults(JSON)** 로 마지막 시작 설정을 저장/복원 (saveLastUsed / loadLastUsed)
-   UI에서는 **한 개의 컨트롤러 인스턴스**를 최상위에서 .environmentObject 로 공유

**한 개의 컨트롤러 인스턴스**

```swift
struct RootView: View {
    @StateObject private var controller = TimerController()

    var body: some View {
        TabView {
            MainTimerView()
                .environmentObject(controller)

            TimerLibraryView(onPick: { model in
                // model → (time, rest, sets)로 변환 후:
                controller.configure(title: model.title, time: t, rest: r, sets: s)
                controller.saveLastUsed()  // “시작 시에만 저장”을 원하면 start()에서 호출
                controller.stop()
                controller.start()
            })
            .environmentObject(controller)
        }
    }
}

struct MainTimerView: View {
    @EnvironmentObject var controller: TimerController
    
}
```

Controller를 여러개를 만들게 되면 당연하겠지만 공유가 불가능합니다.

그렇기 때문에 RootView에서 한개의 Controller를 만든 후 environmentObject를 이용하여 넘겨줘야합니다.

자식 뷰에서는 @EnvironmentObject 를 이용하여 받을 수 있습니다.

**UserDefaults(JSON) 로 마지막 시작 설정을 저장/복원**

앱을 껏다가 켰을 때 최근까지 실행하고 있던 타이머를 실행시키기 위해서는 앱 내부에 저장하는 것이 필요했습니다.

```swift
// 저장
    struct LastConfig: Codable {
        let title: String
        let time: Int
        let rest: Int
        let sets: Int
        let updatedAt: Date
    }

    let lastConfigKey = "lastConfigKey"

    // 저장
    func saveLastUsed() {
        let cfg = LastConfig(
            title: timerTitle,
            time: Int(timeSec),
            rest: Int(restSec),
            sets: totalSets,
            updatedAt: Date()
        )
        if let data = try? JSONEncoder().encode(cfg) {
            UserDefaults.standard.set(data, forKey: lastConfigKey)
        }
    }

    // 로드
    func loadLastUsed() -> LastConfig? {
        guard let data = UserDefaults.standard.data(forKey: lastConfigKey),
              let cfg = try? JSONDecoder().decode(LastConfig.self, from: data)
        else { return nil }
        return cfg
    }
```

이런식으로 UserDefault에 간편하게 저장 또는 로드를 했습니다.

만약 앱을 껏다가 키더라도 전에 했던 세팅값으로 되도록 구현 했습니다.

이것과 동일하게 세팅에서도 방금까지 켜져있는 것을 보여주는 것이 필요했습니다.

![](/images/beeptimer-91/1.jpg)

Timer3가 지금 사용중인 Timer 입니다.

빨간색으로 처리 하고 가장 상단에 보여지기 위해서

```swift
import RealmSwift
import SwiftUI

enum ActiveProgramStore {
    private static let key = "ActiveProgramStore"

    static func setActive(_ p: RTimerProgram) {
        UserDefaults.standard.set(p._id.stringValue, forKey: key)
    }

    static func activeId() -> ObjectId? {
        guard let s = UserDefaults.standard.string(forKey: key) else { return nil }
        return try? ObjectId(string: s)
    }

    static func isActive(_ p: RTimerProgram, activeId: ObjectId?) -> Bool {
        guard let activeId else { return false }
        return p._id == activeId
    }

    static func clearIfMatches(_ p: RTimerProgram) {
        if activeId() == p._id {
            UserDefaults.standard.removeObject(forKey: key)
        }
    }
}
```

이처럼 사용했습니다.

여기서 고유한 ID인 ObjectID 사용이 필요했기에 RealmID와 함께 사용했습니다.

그렇게 하여 isActive를 이용하여 타이머들을 순서 정리와 현재 있는 것의 색상을 변경하는 등

여러가지를 할 수 있었습니다.
