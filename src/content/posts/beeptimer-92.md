---
title: 'Dynamic Island 구현 / Live Activity'
pubDate: 2025-11-13
category: ios/beeptimer
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/92
---
저는 운동을 할 때 인터벌 타이머를 가장 많이 사용합니다.

주로 쉬는 시간에 타이머를 켜는 데.. 그냥 타이머 화면만 보기에는 너무 심심합니다.

그 쉬는 시간 1분동안 멍하니 있으려니 왜이리 시간이 긴지... 또 잠깐 다른 거 하고 오면 1분만 쉰다는게 2~3분 쉬게 되더라구요

그래서 Dynamic Island에서 타이머가 나오면 너무 편리했습니다.

그 기능을 만들어보려고 합니다.

* * *

### 기본 설정

먼저 App에 Widget Extension을 만들어 줍니다.

File > New > target...

Include Live Activity를 반드시 체크해주세요.

![](/images/beeptimer-92/1.png)

먼저 앱이 LiveActivity가 된다는 것을 알려야하기에

info.plist에 추가를 해줘야합니다.

![](/images/beeptimer-92/2.png)

이 후에는 작업을 하면 됩니다.

widget과 동일하게 widget과 앱의 데이터와 연동을 하기 위해서는 App파일을 widget 폴더에서 참조를 할 필요가 있습니다.

그렇기때문에 Swift 파일을 Target Membership에 추가를 해줘야합니다.

![](/images/beeptimer-92/3.png)

이런식으로 하면 Widget의 코드를 App에서 App의 코드를 Widget에서 사용이 가능합니다.

이런식으로 데이터를 연결을 해줬습니다.

Dynamic Island를 만들기 위해서는 Dynamic Island의 View 구조부터 알아야한다고 생각합니다.

dynamic에는 여러개가 있습니다.

![](/images/beeptimer-92/4.png)

\- 확장이 된 expanded

\- 기본형 compact

\- 작은 minimal

확장형은 꾸욱 눌렀을때 커지면서 보여지는 화면입니다.

내부 View는 Leading / center / Trailing / Buttom 으로 나뉘어져 있습니다.

각각 위치를 알아두면 원하는 대로 꾸미기 좋을 것 으로 보여집니다.

compact는 그냥 기본적으로 보여지는 화면인데

Leading과 Trailing으로 나누어져 있는 것을 볼 수 있습니다.

minimal의 경우에는 LiveActivity가 두개 이상 켜졌을 경우에 뜹니다.

확인을 하기 위해서는 간단하게 핫스팟을 켜면 두개로 보여질 것입니다.

![](/images/beeptimer-92/5.jpg)

이런 것을 알고서 코드를 보면

```swift
struct BeepTimerWidgetLiveActivity: Widget {
// ... (생략)
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: BeepTimerWidgetAttributes.self) { context in
            // 잠금화면(확장) 뷰
            HStack {
                if context.state.phase == "done" {
                    Image(systemName: "checkmark.circle.fill")
                } else {
                    Text(context.state.endTime, style: .timer)
                        .font(.title3)
                        .monospacedDigit()
                }
                Spacer()
            }
            .padding()
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.center) {
                    if context.state.phase == "done" {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.largeTitle)
                    } else {
                        Text(context.state.endTime, style: .timer)
                            .font(.largeTitle)
                            .monospacedDigit()
                    }
                }

            } compactLeading: {
                let (mode, status) = self.modeAndStatus(from: context.state)
                
                TimerPhaseRingIcon(mode: mode, status: status)
            } compactTrailing: {
               EmptyView()
            } minimal: {
                let (mode, status) = self.modeAndStatus(from: context.state)
                
                TimerPhaseRingIcon(mode: mode, status: status)
            }
        }
    }
}
```

> dynamicIsland: { context in  
>             DynamicIsland {

로 시작하는 곳 부터 차례로 expanded / compactLeading / compactTrailing / minimal 입니다.

그럼 그 위는??

Live Activity를 만들고나면 잠금화면에서도 뜨는 것을 볼 수 있습니다.

![](/images/beeptimer-92/6.jpg)

이 부분입니다.

취향껏 사용해주시면 됩니다.

* * *

### Live Activty 활용

먼저 제가 생각한것은 Background상태에서는 auto Play 기능은 절대 하지 않는다 였습니다.

그냥 한 스탭 끝나면 다음 스탭은 직접 누르도록 그러나 화면을 보고 있을 때는 auto Play가 그대로 적용이 되도록 하고 싶었습니다.

그리고 Dynamic은 앱을 사용하고 있을 때보다 앱을 Background로 넘겼을 때 필요한 기능이라고 판단했습니다.

그러기 위해서 최소한의 리소스를 사용하면서 보여지려면?

1\. 처음에 타이머를 실행시킬때 Live를 생성.

2\. Background로 나갈때 그 상황을 그때 그때 Live로 보내서 업데이트를 진행.

3\. Background에서 끝나면 멈추고 App에서 끝나면 다음으로 알아서 작동.

첫번째 스탭으로는 앱이 백그라운드로 나가는 것을 판단해야합니다.

```swift
@Environment(\.scenePhase) var scenePhase

.onChange(of: scenePhase) { newValue in
            switch newValue {
            case .background:
                // 백그라운드로 갈 때 현재 상태 기준으로 Live Activity 동기화
                logger.d("background scene phase")
                controller.isInBackground = true
                Task { await controller.syncLiveActivityForCurrentState() }
            case .active:
                // 다시 앱으로 돌아오면 Live Activity는 유지해도 되고,
                // 원하면 끝내도 됨
                logger.d("active ground scene ")
                controller.isInBackground = false
                break
            default:
                break
            }
        }
```

최상단 View에 추가를 해주므로써 백그라운드와 포그라운드를 확인을 했습니다.

그것을 controller에 전달을 하여 Widget / App 모두가 알 수 있도록 구현했습니다.

내부에서 작동을 다르게 처리해야하기에

```swift
    func advancePhase() {
        // 포그라운드 / 백그라운드에 따라 다른 행동.
        if isInBackground {
            handleBackgroundPhaseChange()
            return
        }
        
        handleForegroundPhaseChange()
    }
```

이런식으로 각각 다르게 처리를 할 수 있었습니다.

그러면 데이터는 어떤식으로 넘겼죠?

```swift
    fileprivate func markLiveActivityDone() async {
        guard let liveActivity else { return }

        let state = BeepTimerWidgetAttributes.ContentState(
            phase: phaseString(),
            status: "done",
            endTime: Date(),
            remainSec: 0,
            setIndex: setIndex,
            totalSets: totalSets
        )

        await liveActivity.update(using: state)
    }
```

BeepTimerWidgetAttributes를 만들어서 필요한 정보들을 전부 넘길 수 있도록 했습니다.

그렇게 하면 데이터에 맞춰서 libeActivity가 업데이트가 됩니다.

#### Live Activity의 생성 및 업데이트에 대해서

두 가지 방식 비교

① 현재처럼 “포그라운드에서도 Live Activity 계속 유지”

**(= startPhase 때 Live Activity 생성/업데이트, pause 때도 update)**

* * *

✔ 장점

-   Live Activity 상태가 앱 로직과 항상 동기화됨
-   포그라운드/백그라운드 전환 시 신경 쓸 게 없음
-   “앱은 닫혀도 타이머는 이어진다”는 느낌이 강함
-   Live Activity가 갑자기 사라지는 느낌이 없음  
    → “항상 떠 있는 타이머 UI” 느낌

❌ 단점

-   Live Activity는 시스템 자원이 들어갑니다
    -   메모리도 약간(작지만 있음)
    -   업데이트도 백그라운드 프로세스에서 처리
-   앱에서 pause/resume 때마다 Live Activity update 호출  
    → 필요 이상으로 ActivityKit 호출이 많아짐
-   포그라운드 UI와 Live Activity UI가 항상 같이 움직이므로  
    관리 코드가 더 복잡해짐
-   유저가 포그라운드에서 다이나믹 아일랜드를 볼 일이 거의 없음  
    → 의미 없는 업데이트 호출이 잦아짐

* * *

② “포그라운드에서는 Live Activity 유지하지 않음”

(= **백그라운드 들어갈 때만 Live Activity 생성/업데이트**)

* * *

✔ 장점

-   ActivityKit 호출 횟수가 크게 줄어듦  
    → 성능/배터리 효율 증가
-   앱에서 실행 중일 때는 앱 UI에만 집중  
    → 불필요한 로직이 제거됨
-   코드 구조가 깔끔해짐
    -   start/pause/resume은 pure 앱 내부 로직만
    -   scenePhase == background 일 때만 Live Activity 처리
-   Live Activity는 필요한 순간에만 표시  
    → 기대되는 UX와 정확히 일치함

❌ 단점

-   앱이 포그라운드 → 백그라운드 전환 순간에만 Live Activity가 갱신되므로  
    Live Activity의 ‘시작 시점 시간’이 약간 다를 수 있음
    -   예: foreground에서 12초 남았는데  
        background로 나갈 때 한 박자 뒤에 11초로 만들어질 수 있음
-   앱이 실행 중일 때 Live Activity가 존재하지 않기 때문에  
    포그라운드에서도 다이나믹 아일랜드로 타이머 보고 싶은 유저는 불가능  
    (하지만 지금 유저는 이걸 원하지 않음 → 문제 없음)

* * *

### 아이콘

아무래도 사용자가 앱을 사용한다고 했을 때 한눈에 보여야합니다.

지금 타이머가 어떤 상황인지

minimal 에서도 보여야한다고 생각했습니다.

apple 타이머 앱을 실행해보면 아이콘이 시간에 맞춰서 원이 줄어드는 것을 볼 수 있습니다.

이렇게 하고 싶었지만... 이 부분은 좀 힘들 것으로 보여졌습니다.

그렇기에 제가 할 수 있는 부분에서 최선을 다해봤습니다.

1\. time 상태 일때

\- running / pause / done

2\. Rest 상태 일때

\- running / pause / done

3\. set가 완전히 끝날때

이 모든 것을 한 아이콘 하나로 하려니까 꽤나 힘들었습니다.

그나마 가장 생각한 방식은

Time 상태와 Rest 상태일때 정해둔 Ring Color가 있습니다.

해당 Ring Color를 여기서도 사용하기로 했습니다.

그리고 Ring안에 running이면 timer / Rest면 leaf 아이콘.

pause이면 pause.fill

done이면 check.fill

set가 완전히 끝나면 ring을 빨간색으로 하고 check로 하는 방식을 생각했습니다.

우선 image를 넣어야하기에 Assets또한 target Membership을 추가해줬습니다.

```swift
    @ViewBuilder
    private var IconImage: some View {
        switch status {
        case .paused:
            Image(systemName: "pause.fill")
        case .running:
            switch mode {
            case .time:
                Image("widgetTimer")
                    .renderingMode(.template)
                    .resizable()
                    .frame(width: 23, height: 23)
                    .foregroundColor(.white)
            case .rest:
                Image(systemName: "leaf.fill")
            }
        case .done:
            Image(systemName: "checkmark")
        }
    }
```

여기서 꽤나 고역이였던 것은 widgetTimer Image가 png로 하니 그냥 하얀색 네모가 되어버렸었습니다...

svg로 해야한다는 것을 깨달았고 너무 크기가 커도 문제라는 것을 알았습니다.

작은 widget용 svg를 하나 더 추가하고 나서야 원하는 대로 이미지가 나타났습니다

* * *

### 타이머

앱이 백그라운드일 때, **라이브 액티비티가 “혼자” 매초 숫자를 줄일 수 있는 방법은**  
사실상 Text(endTime, style: .timer) 같은 **시스템 타이머 스타일**밖에 없습니다.

우리가 직접 remainSec를 숫자로 넣으면, 그 숫자는 **우리가 업데이트 해줘야만** 바뀌는데  
백그라운드에서는 앱이 매초 깨어서 Activity.update를 부를 수가 없어요.

앱에 있는 것을 실시간으로 보여주는 것은 거의 불가능에 가깝습니다.

그렇기에 그냥 LiveActivity와 App은 따로 돌아야한다는 뜻입니다.
