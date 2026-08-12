---
title: 'Auto Layout 장단점'
pubDate: 2025-12-20
category: ios/study-diary
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/103
---
> 뷰의 위치와 크기를 절대 좌표가 아니라,  
> 다른 뷰 / 컨테이너와의 관계로 표현하는 레이아웃 시스템

Xcode에서 직접 확인을 해보면

아래와 같이 뷰에 제약조건(Constraints)을 정의하여 화면에 띄웁니다.

![](/images/study-diary-103/1.png)

Align Center X to: Superview 와 Align Center Y to: Superview 로 되어있는 것을 보아

SuperView의 정중앙에 위치 하고 있는 것을 알 수 있습니다.

또한 크기는 120, 50 으로 이루어져있습니다.

AutoLayout을 정의할때는 해당 뷰의 위치와 크기를 정확히 알 수 있어야합니다.

그 값이 최소 4가지 정도 됩니다.

예를 들어서

위 예제 처럼 위치를 알 수 있는 정보와 크기를 알수 있는 width / height 값.

또는 아래 예제처럼 상하좌우의 간격.

![](/images/study-diary-103/2.png)

엥? 이러면 크기값은요?

상하좌우 간격만 알면 자동으로 View의 크기도 파악이 가능합니다.

* * *

#### **Auto Layout의 장점**

**1) 다양한 화면 크기 대응 (반응형 UI)**

iPhone의 종류가 여러가지 인 것 처럼 화면 크기도 제각각 입니다.

그 때마다 하나하나 조정을 해줘야하는 데

Auto Layout을 사용하면 **하나의 레이아웃 정의로 여러 기기를 커버할 수 있습니다.**

**2) 방향 회전에 유연**

예전에는 가로 / 세로마다 frame 계산을 새로 해야했습니다.

하지만 AutoLayout은 가로 / 세로가 바뀌어도 Constraint 재계산만으로 레이아웃이 자동으로 재배치됩니다.

→ **별도의 if/else 없이도 회전 대응이 자연스럽게 되는 편입니다.**

**3) 동적 콘텐츠에 강함.**

라벨 텍스트 또는 셀 높이 같이 내용에 따라서 길이가 달라지는 동적 콘텐츠에도 강점입니다.

Constraint만 잘 잡아두면 라벨이 알아서 늘어나고 다른 뷰들이 그에 맞게 재배치 됩니다.

**4) StoryBoard를 사용하면 시각적으로 작업이 가능합니다.**

StoryBoard / XIB 에서 드래그를 이용하여 배치가 가능합니다.

그렇게 만들어진 뷰를 보면서 쉽게 파악이 가능합니다.

* * *

#### **AutoLayout 단점**

**1) 개념이 많습니다.**

-   Constraint
-   intrinsic content size
-   hugging / compression resistance
-   priority
-   contentLayoutGuide, frameLayoutGuide
-   NSLayoutConstraint, NSLayoutAnchor, VFL…

이처럼 처음 접하게 되면 새로운 용어에 익숙해지기 힘듭니다.

2) 디버깅이 쉽지 않습니다.

제약 조건이 서로 충돌하거나 부족하면:

-   콘솔에 “Unable to simultaneously satisfy constraints” 같은 경고
-   실제 화면에서는 의도와 다른 레이아웃이 나옴

 특히

-   우선순위(priority) 조합
-   hugging/compression 값 충돌
-   hugging 낮게 줬는데 다른 데서 잡혀버리는 경우

어떤 Constraint가 문제인지 파악하는 데 시간이 많이 들 수 있음.

3) 성능 오버헤드

-   Auto Layout은 내부적으로 제약들을 기반으로 **선형 방정식 시스템을 풀어서 레이아웃 계산**을 합니다.
-   단순히 frame 한 번 계산하는 것보다 계산 비용이 큼.
-   일반적인 앱 수준에서는 큰 문제 없지만,
    -   **셀 수가 많은 리스트 + 복잡한 constraint** 조합에서는
    -   스크롤 성능에 영향을 줄 수 있음.
-   그래서:
    -   내부적으로는 UICollectionView 등에서 셀/레이아웃 최적화를 많이 해 둠.
    -   그래도 필요시에는 **Constraint 수 줄이기 / 중첩 뷰 줄이기** 같은 튜닝이 필요.

* * *

**Auto Layout은 “뷰들의 위치/크기를 관계(Constraint)로 표현해,  
다양한 기기/언어/상황에서도 UI가 자연스럽게 적응하도록 해주는 레이아웃 시스템”이다.**  
장점은 다양한 해상도와 동적 콘텐츠에 강하고, 의도를 선언적으로 표현할 수 있다는 점이고,  
단점은 개념과 디버깅이 복잡하고, 지나치게 복잡한 Constraint 조합은 성능/가독성에 부담을 줄 수 있다는 점이다.
