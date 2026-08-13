---
title: 'Dynamic Programming이란?'
pubDate: 2025-12-11
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/95
---
> 큰 문제를 작은 부분 문제로 쪼갠 뒤,  
> 그 부분 문제 결과를 저장해 두고 재사용해서 중복 계산을 없애는 알고리즘 기법

**Dynamic Programming을 하려면 아래 두가지 특징을 만족해야합니다.**

1.  중복되는 부분 문제 (Overlapping Subproblems)
2.  최적 부분 구조 (Optimal Substructure)

**Overlapping Subproblems**

문제를 쪼개다 보면 비슷한 작은 문제를 여러번 풀게 되는 경우

예시) 피보나치 수열

![](/images/study-95/1.png)

→ F(n-1) 계산 안에 또 F(n-2) 가 나오고,

다른 가지에서도 또 F(n-2)가 나오게 됩니다.

계속해서 중복되는 것을 볼 수 있습니다.

**Optimal Substructure**

전체 문제의 최적 해가 **부분 문제들의 최적 해로부터 만들어지는 구조**

예시) 피보나치 수열

피보나치 수열과 유사하게 최적 부분 구조는 F(n) = F(n-1) + F(n-2) 입니다

피보나치 수열에서 (n-1)번째 항과 (n-2)번째 항으로 n번째 항을 계산하는 것.

* * *

#### **Top-Down 과 Bottom-Up**

DP에 대해서 공부하다보면 나오는 방식입니다.

**Top-Down**

> 문제 정의를 바로 푸는 방식, 필요한 애만 계산하는 스타일

-   큰 문제 → 작은 문제로 내려가면서 푸는 방식
-   보통 재귀 + 메모이제이션 형태로 구현합니다.
-   흐름:
    1.  내가 구하고 싶은 최종값 (예: f(n))을 먼저 부릅니다.
    2.  그걸 풀기 위해 더 작은 문제 (예: f(n-1), f(n-2))를 재귀로 호출.
    3.  계산한 값은 cache / memo 같은 곳에 저장.
    4.  같은 입력으로 다시 호출되면 저장된 값 재사용.

**Bottom-UP**

> 점화식대로 천천히 테이블을 채우는 방식입니다. 모든 상태를 한 번씩 계산하는 스타일

-   작은 문제 → 큰 문제로 올라가면서 푸는 방식
-   보통 반복문 + 배열의 형태
-   흐름:
    1.  가장 작은 상태 (예: dp\[0\], dp\[1\]) 부터 값을 채운다.
    2.  그 값을 이용해서 점점 더 큰 인덱스를 채움 ( dp\[2\], dp\[3\], ... )
    3.  마지막에 dp\[n\]에 도달하면 그게 정답.

* * *

#### **피보나치 수열을 이용한 예시**

```swift
    let testValues = [10, 20, 30, 35, 40]   // 점점 늘려보기
    
    // 1. 순수 재귀 (Naive, 비추천)
    func fibNaive(_ n: Int) -> Int {
        if n <= 1 { return n }
        return fibNaive(n - 1) + fibNaive(n - 2)
    }

    // 2. Top-Down (재귀 + 메모이제이션)
    func fibTopDown(_ n: Int) -> Int {
        var memo = Array(repeating: -1, count: n + 1)

        func dfs(_ x: Int) -> Int {
            if x <= 1 { return x }
            if memo[x] != -1 { return memo[x] }   // 이미 계산된 값 있으면 재사용

            let value = dfs(x - 1) + dfs(x - 2)
            memo[x] = value
            return value
        }

        return dfs(n)
    }

    // 3. Bottom-Up (반복문)
    func fibBottomUp(_ n: Int) -> Int {
        if n <= 1 { return n }

        var dp = Array(repeating: 0, count: n + 1)
        dp[0] = 0
        dp[1] = 1

        for i in 2...n {
            dp[i] = dp[i - 1] + dp[i - 2]
        }

        return dp[n]
    }
```

코드를 작성후 사용을 해보겠습니다.

```swift
for n in testValues {
    print("===== n = \(n) =====")
    measureTime(label: "Naive      ") {
        fibNaive(n)
    }
    measureTime(label: "Top-Down   ") {
        fibTopDown(n)
    }
    measureTime(label: "Bottom-Up  ") {
        fibBottomUp(n)
    }
    print("")
}
```

해당 결과물은 아래와 같습니다.

> \===== n = 10 =====  
> Naive      : result = 55, time = 0.000001 sec  
> Top-Down   : result = 55, time = 0.000003 sec  
> Bottom-Up  : result = 55, time = 0.000055 sec  
>   
> \===== n = 20 =====  
> Naive      : result = 6765, time = 0.000069 sec  
> Top-Down   : result = 6765, time = 0.000002 sec  
> Bottom-Up  : result = 6765, time = 0.000007 sec  
>   
> \===== n = 30 =====  
> Naive      : result = 832040, time = 0.008298 sec  
> Top-Down   : result = 832040, time = 0.000003 sec  
> Bottom-Up  : result = 832040, time = 0.000009 sec  
>   
> \===== n = 35 =====  
> Naive      : result = 9227465, time = 0.064296 sec  
> Top-Down   : result = 9227465, time = 0.000002 sec  
> Bottom-Up  : result = 9227465, time = 0.000007 sec  
>   
> \===== n = 40 =====  
> Naive      : result = 102334155, time = 0.617817 sec  
> Top-Down   : result = 102334155, time = 0.000003 sec  
> Bottom-Up  : result = 102334155, time = 0.000011 sec

아주 간단한 하나의 수일때는 Native가 더 빠를지 몰라도 숫자가 아주 조금만 높아져도 엄청난 차이를 보여주고 있습니다.

바로 결과로 보여지기 때문에 위 방식을 사용해주는 것이 엄청난 도움이 됩니다.

* * *

**Top-Down**

-   **방식**: F(n)을 구하려고 할 때,  
    재귀적으로 F(n-1), F(n-2)를 호출하면서 필요한 값만 계산
-   **구현 스타일**: 재귀 + 메모이제이션
-   **장점**
    -   문제의 수학적 정의 → 코드로 바로 옮기기 쉬움
    -   로직 이해가 직관적
-   **단점**
    -   재귀 깊이가 깊어지면 스택 문제 가능
    -   Swift에서는 너무 큰 n에 비추천

**Bottom-Up**

-   **방식**: F(0), F(1)부터 시작해서 F(2), F(3)… 순서대로 배열을 채움
-   **구현 스타일**: 반복문 + 배열(또는 변수 두 개)
-   **장점**
    -   재귀 없이 안정적
    -   성능/메모리 예측이 쉬움
    -   공간 최적화 간단
-   **단점**
    -   계산 순서를 직접 설계해야 해서,  
        처음엔 Top-Down보다 덜 직관적으로 느껴질 수 있음

* * *

**Top-Down이 더 편한 경우**

1.  **문제 정의가 재귀적으로 딱 떠오를 때**
    -   예: f(n) = max(f(n-1), f(n-2) + something) 이런 모양
    -   트리 DP, 그래프 DP 같이 구조가 재귀적인 경우
2.  **상태 공간이 크지만 실제로 쓰는 경우가 일부일 때**
    -   모든 상태를 다 계산할 필요가 없고
    -   진짜 필요해진 상태만 계산해도 될 때
3.  **처음 문제를 이해하고 점화식을 만들 때 디버깅용**
    -   일단 Top-Down으로 구현해 보고
    -   맞는지 확인한 뒤, 나중에 Bottom-Up으로 바꾸기도 함
4.  **코드 가독성을 문제 정의에 밀접하게 맞추고 싶을 때**
    -   면접에서 “정의 → 점화식 → 재귀 코드” 흐름 보여주기 좋음

**Bottom-Up이 더 좋은 경우**

1.  **입력 크기가 크고, 재귀 깊이가 너무 깊어질 수 있을 때**
    -   예: n이 10^5, 10^6 수준
    -   이때 재귀는 안전하지 않음 → Bottom-Up 필수
2.  **전형적인 1D/2D DP 테이블 문제**
    -   예: 배낭 문제, LCS, 편집 거리(Edit Distance), LIS DP 버전 등
    -   dp\[i\]\[j\] 테이블을 왼쪽→오른쪽, 위→아래 이런 식으로 채우는 문제들
3.  **성능/메모리 추적이 명확해야 할 때**
    -   반복문만 도니까 시간/공간 예측이 쉬움
    -   디버깅 시 print(dp)로 상태를 한 번에 볼 수 있음
4.  **공간 최적화를 하고 싶을 때**
    -   이전 행/이전 열만 필요해서 2줄짜리 배열로 줄이는 패턴 등
    -   이건 Bottom-Up에서 더 자연스럽게 보임
