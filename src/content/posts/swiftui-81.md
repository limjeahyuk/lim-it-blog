---
title: '@Binding'
slug: swiftui-81
pubDate: 2023-05-14
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/81
---
변하는 데이터를 다른 view에서 사용을 해야하는 경우가 있습니다.

그때 Binding을 사용합니다.

```bash
    // 데이터 연동
    @Binding
    var isActivated :Bool
    
    // 생성자
    init(isActivated: Binding<Bool> = .constant(false)) {
        _isActivated = isActivated
    }
```

다른 게시물에도 Binding을 설명한 것을 올린 적이 있습니다.

그 때와 다른 점은 생성자를 만들어 준 것입니다.

생성자를 만들어 줌으로써 기본값을 줘서 preview나 그런 곳에서 굳이 넣어줄 필요가 없다는 것?

그 정도 인것 같습니다.

솔직히 사용법은 똑같아서..

[https://hyuk-todayfeelsogood.tistory.com/66](https://hyuk-todayfeelsogood.tistory.com/66)

 [\[swiftUI\] @State 와 @Binding

swiftUI를 공부하면서 어려웠던 부분은 여러 가지가 있지만 그중 하나만 뽑으라고 하면 값을 넘기는 부분 이었던 것 같아요. storyBoard를 하다가 swiftUI로 넘어오다보니까 계속 storyboard랑 비교하고

hyuk-todayfeelsogood.tistory.com](https://hyuk-todayfeelsogood.tistory.com/66)

위 게시물에 좀 더 자세히 나와있습니다.

```bash
    // @State 값의 변화를 감지 -> 뷰에 적용
    @State
    private var isActive: Bool = false
    
	// 생략
		HStack{
                       MyVstackView(isActivated: $isActive)
                       MyVstackView(isActivated: $isActive)
                       MyVstackView(isActivated: $isActive)
                   } // Hstack
```

사용은 이런 식으로 사용합니다.
