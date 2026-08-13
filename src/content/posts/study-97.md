---
title: 'Garbage Collection 과 ARC'
pubDate: 2025-12-16
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/97
---
> Garbage Collection은 더이상 쓰이지 않는 객체를 자동으로 찾아서 대신 정리해주는 시스템입니다.

개발자가 메모리 해제 로직을 일일이 해주지 않더라도 사용하지 않는 객체는 모아서 대신 정리를 해줍니다.

* * *

#### **왜 Garbage Collection이 필요할까?**

메모리는 일단 new, malloc 같은 걸로 **할당하면**,  
어느 순간엔 **반드시 해제**해 줘야 합니다.

-   직접 해제해야 하는 언어(C, C++, 옛날 Objective-C)에서는:
    -   해제를 깜빡하면 → **메모리 누수 (Memory Leak)**
    -   너무 일찍 해제하면 → 이미 사라진 메모리에 접근하는 **댕글링 포인터(dangling pointer)**, 크래시
-   사람이 이걸 100% 완벽하게 관리하는 건 생각보다 매우 어렵습니다.

그래서 **Java, C#, JavaScript, Kotlin 등** 많은 언어는

> “개발자가 해제까지 직접 신경 쓰지 말고,  
> 메모리 할당만 하고 쓰다가 더 이상 필요 없으면  
> 런타임이 알아서 치워줄게”

라는 방향을 택했고, 그게 **Garbage Collection**입니다.

* * *

#### **Mark & Sweep** 

GC 구현은 여러 가지가 있지만, 가장 클래식한 구조는 **Mark & Sweep**입니다.

1.  **Mark 단계**
    -   Root에서 시작해서, 참조를 타고 내려가며
    -   도달 가능한 객체들에 “마크(mark)”를 찍습니다.
    -   “얘는 살아 있는 객체야!”라고 표시하는 단계.
2.  **Sweep 단계**
    -   힙 영역 전체를 훑으면서
    -   마크가 찍혀 있지 않은 객체들을 찾아 **해제(free)** 합니다.
    -   마크가 찍힌 애들은 “살려두고”, 안 찍힌 애들은 버리는 것.
3.  **Compact 과정**
    -   Sweep 이후 분산된 객체들을 Heap의 시작 주소로 모아
    -   메모리가 할당된 부분과 그렇지 않은 부분으로 압축.

* * *

#### **Heap 메모리의 구조**

> heap 영역은 동적으로 레퍼런스 데이터가 저장되는 공간, GC의 대상이 되는 공간입니다.

Heap 영역은 처음 설계 될 때 아래 2가지를 전제하여 설계 되었습니다.

1.  대부분의 객체는 금방 접근 불가능한 상태가 된다
2.  오래된 객체에서 새로운 객체로의 참조는 아주 적게 존재한다.

**객체는 대부분 일회성이며, 메모리에 오랫동안 남아있는 경우는 드물다는 것**입니다.

그렇기에 Heap 영역을 두가지로 나눴습니다.

1.  Young 영역
2.  Old 영역

![](/images/study-97/1.png)

**Young 영역 (Minor GC)**

-   새로게 생성된 객체가 할당 되는 영역
-   대부분의 객체가 금방 접근 불가능한 상태가 되기 때문에, 많은 객체가 Young 영역에서 생성되었다가 사라집니다.

**Old 영역 (Major GC)**

-   Young 영역에서 Reachable 상태를 유지하여 살아남은 객체가 복사되는 영역
-   Young 영역보다 크게 할당되며, 영역의 크기가 큰 만큼 가비지는 적게 발생합니다.

young 영역에서 생겼다가 전체적으로 차게 객체를 확인을 합니다.

그 때 더이상 사용하지 않는 다고 판단을 하게 되면 그때 Old로 넘어가게 됩니다.

아주 간단하게 설명했지만, Young 영역에는 Eden과 Survivor 영역으로 나누어져 있어서 더욱 고도화 되어 있습니다.

* * *

#### **Garbage Collection의 장점**

1.  **개발자가 메모리 해제를 직접 관리하지 않아도 됨**
    -   free(), delete 위치 고민 X
    -   해제 타이밍 놓쳐서 누수/크래시 나는 경우 줄어듦
2.  **댕글링 포인터 문제 감소**
    -   “이미 해제된 메모리를 다시 사용하는” 버그가 현저히 줄어듦
3.  **생산성↑, 유지보수성↑**
    -   비즈니스 로직에 집중하기 좋고,
    -   복잡한 객체 그래프 구조에서도 비교적 마음 편하게 코딩 가능

* * *

#### **Garbage Collection의 단점 / 트레이드오프**

1.  **런타임 오버헤드**
    -   GC가 돌아가는 동안 CPU를 사용
    -   GC 주기가 길면 메모리 많이 먹고,
    -   주기가 짧으면 오버헤드가 자주 발생
2.  **Stop-the-world (멈춤) 가능성**
    -   전통적인 GC는 수집 과정에서 잠깐이라도  
        **모든 스레드를 멈추고(Stop-the-world)** 작업하는 경우가 있어서,
    -   짧은 시간이라도 렉/프레임 드랍처럼 느껴질 수 있음.
    -   요즘은 이를 줄이기 위한 “Incremental GC”, “Concurrent GC” 등 기술들이 많음.
3.  **메모리 사용량이 더 클 수 있음**
    -   GC는 어느 정도 여유를 두고 돌아가야 하기 때문에,
    -   “수동 관리(C/C++)”보다 **메모리를 넉넉하게 사용하는 경향**이 있음.

* * *

#### **ARC (Automatic Reference Counting)**

저는 Swift 개발자로써 개발하면서 GC는 들어보질 못했습니다.

그 이유는,

**Swift, Objective-C(iOS/macOS)는 “GC가 아니라 ARC”를 사용합니다.**

-   **ARC (Automatic Reference Counting)**:
    -   컴파일러가 retain, release 호출을 자동으로 삽입해서
    -   **참조 카운트(reference count)** 기반으로 메모리를 관리
    -   “레퍼런스를 하나 더 잡으면 +1, 버리면 -1, 0이 되면 해제”
-   GC와 ARC의 큰 차이

항목

GC

ARC

관점

런타임에서 주기적으로 “안 쓰는 객체” 스캔

컴파일 타임에 retain/release 코드 삽입

기준

Reachability(도달 가능성)

Reference Count(참조 카운트)

해제 타이밍

보통 “언제 정확히 해제될지” 예측이 어렵고, GC 타이밍에 따라 다름

참조 카운트가 0이 되는 **순간 바로 해제** (deterministic)

장점

개발자는 메모리 관리 신경 덜 써도 됨, 순환 참조도 GC가 처리 가능(알고리즘에 따라)

GC의 Stop-the-world 없음, 실시간성이 좋음, 예측 가능한 해제 타이밍

단점

Stop-the-world, 오버헤드, 타이밍 불확실성

강한 순환 참조는 개발자가 직접 끊어줘야 함  
(weak, unowned)

* * *

#### **ARC 예제**

```swift
class Person {
    let name: String
    
    init(name: String) {
        self.name = name
        print("\(name) init")
    }
    
    deinit {
        print("\(name) deinit")
    }
}

func arcBasicExample() {
    print("=== ARC Basic Example ===")

    var p1: Person? = Person(name: "혁쨩")
    // 여기서는 참조 카운트 = 1 (p1이 참조 중)

    p1 = nil
    // 참조 카운트 = 0 이 되는 순간 deinit 호출
}
```

정상적으로 deinit이 되어서 메모리 해제가 자동으로 되는 것을 볼 수 있습니다.

```swift
class Owner {
    let name: String
    var pet: Pet?
    
    init(name: String) {
        self.name = name
        print("Owner \(name) init")
    }
    
    deinit {
        print("Owner \(name) deinit")
    }
}

class Pet {
    let name: String
    var owner: Owner?   // 기본은 strong
//    weak var owner: Owner?   // weak로 변경 > 약한참조
    
    init(name: String) {
        self.name = name
        print("Pet \(name) init")
    }
    
    deinit {
        print("Pet \(name) deinit")
    }
}

func strongCycleExample() {
    print("=== Strong Reference Cycle Example ===")

    var owner: Owner? = Owner(name: "혁쨩")
    var pet: Pet? = Pet(name: "멍멍이")

    owner?.pet = pet   // Owner → Pet strong
    pet?.owner = owner // Pet → Owner strong (순환!)

    owner = nil
    pet = nil
    // 참조 카운트가 서로 1씩 남아 있어서 deinit이 안 불림
    // pet을 weak로 변경시 강한 참조가 없어져서 둘 다 deinit 호출 됨.
}
```

weak를 사용하지 않았을 때는 강한 참조로 인해서 deinit이 불리지 않습니다.

하지만 Weak를 넣어주게 되면 자동으로 강함참조가 풀리게 되면서

카운트가 0이 되어서 자동으로 메모리가 deinit 되는 것을 볼 수 있습니다.
