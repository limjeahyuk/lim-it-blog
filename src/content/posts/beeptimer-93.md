---
title: 'LiveActivity 업데이트'
pubDate: 2025-11-14
category: ios/beeptimer
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/93
---
> LiveActivity를 언제 업데이트를 하는 게 좋을까?

LiveActivity 구현을 하면서 생각이 들었습니다.

LiveActivity는 앱이 Background로 갈 때만 필요한 데...

앱 실행 중에도 LiveActivity를 업데이트 또는 생성을 계속 하면 좋은 점이 하나도 없는 거 아닌가?

> **앱이 포그라운드일 때는 Live Activity 업데이트를 거의 하지 않는 방식이 가장 좋습니다.**  
> → 즉, “background로 갈 때만 update” 방식이 **성능·전력·안정성 모두에서 더 바람직함**  
> → 지금 사용 중인 구조가 매우 좋음.

* * *

#### 포그라운드에서 Live Activity 업데이트를 자주 하면 왜 안 좋을까?

1) **Live Activity 업데이트는 생각보다 꽤 무겁습니다**

-   위젯 프로세스가 깨어남 (extension process 활성화)
-   데이터를 decode/encode
-   위젯 렌더링 발생
-   Dynamic Island/Lock Screen UI 업데이트 발생

만약 포그라운드에서 1초마다 업데이트된다면?  
→ 기기 배터리, CPU, UI 스케줄링 모두 부담됩니다.

2) **포그라운드 상태에서는 Live Activity UI가 보이지 않습니다**

-   Live Activity는 **홈 화면·잠금 화면·Dynamic Island**에서만 보여요.
-   앱 안에서는 LiveActivity가 안 보이니까  
    굳이 업데이트해봤자 **사용되지 않는 업데이트**가 됩니다.

즉, **백그라운드에서만 필요한 기능**입니다.

3) 애플 권장사항

-   포그라운드에서는 Live Activity 업데이트 최소화
-   필요할 때만 업데이트
-   배터리 절약

애플 문서에서도 Live Activity는 "필요한 순간 최소한의 업데이트"가 원칙입니다.

* * *

### 왜 “Background 진입 시에만 update” 하는게 최고인가?

사용 패턴을 기준으로 보면:

패턴 1 — 사용자가 앱을 보고 있을 때

-   앱 UI가 타이머를 보여줌  
    → Live Activity의 의미 없음

패턴 2 — 앱을 닫거나 화면을 끌 때

-   숫자 / 상태 변화가 Live Activity에서 보여져야 함  
    → **이 순간에만 정확한 상태를 sync시키면 충분함**

즉 Live Activity는 “백그라운드 표현용”이기 때문에:

-   **포그라운드 → 백그라운드 갈 때 1번 sync**
-   그 이후로는 시간이 자동으로 흘러감 (Text(endTime, style: .timer) 방식)

이게 가장 효율적인 구조입니다.

* * *

### 실사용 기준 비교

  

**방식**

장점

단점

추천

**① 포그라운드에서도 계속 update**

실시간 정보 정확도 ↑

배터리 소모 큼, 위젯 프로세스 깨어남, 불필요한 렌더링

❌ 비추천

**② 백그라운드로 갈 때만 update**

전력 효율 최고, OS 권장, 안정적

포그라운드 상태에서 Live Activity는 약간 지연될 수 있음(하지만 어차피 안 보임)

⭐ **최고 방식**

**③ start/pause 시점에서만 update**

필요할 때만 update

background 진입 타이밍 sync 안되면 표시가 약간 밀릴 수도

⭕ 보조적으로만 추천

* * *

### 최적의 방식은? (애플 권장)

1.  **타이머 시작(start)/일시정지(pause) 시 Live Activity 생성 & 1회 업데이트**
2.  **앱이 background로 갈 때 현재 상태를 딱 한 번 더 update**
3.  **그 이후는 Live Activity의 타이머 기능(Text(endTime,style:.timer))에 맡김**
4.  **포그라운드에서 반복 업데이트 없음**

즉 “초당 update 없음” → 효율 극대화.

* * *

### 결론

 “앱 사용 중에는 update를 하지 않음”

 Live Activity는 background를 위한 기능

→ background 진입 시점에서만 확정된 상태를 update하면 됨
