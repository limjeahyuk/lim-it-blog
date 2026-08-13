---
title: '[swift] 모듈화 Library / framework'
pubDate: 2023-02-19
category: ios
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/76
---
framework를 만들어야하는 상황이 왔습니다. 그런데 애초에 framework를 잘 모르니까 만들면서도 감이 안 잡히네요..

열심히 정리를 해보도록 하겠습니다.

#### Library와 framework

처음에 Library와 framework 차이 부터 매우 헷갈리더라고요...

찾아보면 다들 비유를 엄청 열심히 해주시는 데 다 비슷한 맥락이였습니다.

그 중 그나마 가장 이해가 되었던 비유로는..

햄버거 가게를 차린다고 가정을 하겠습니다.

그럴때 프레임워크를 사용하면 맥도날드 프레임워크와 버거킹 프레임워크를 사용할 수 있고

사용하게 되면 맥도날드는 맥도날드 버거만 만들 수 있으며 버거킹 프레임워크는 버거킹 버거만 만들수 있습니다.

그에 비해 라이브러리는 패티 라이브러리가 존재하며 패티 라이브러리를 사용하여 자기만의 버거를 만들 수 있습니다.

뭐... 이런 이야기였는데.. 갑자기 무슨 버거냐 그럴 수도 있겠네요.. 그냥 흘러가듯 들어주세요 ㅎㅎ;;

**Library.**

프로그램이 연결할 수 있는 패키징 된 object 파일의 모음들.

**framework.**

.h 파일. 이미지 등등 리소스들을 bundle파일로 묶은 것입니다.

framework 안에 Library 가 들어갈 수 있다고 합니다.

framework는 좀 큰 개념이고 Library는 framework 보다는 좀 작은 개념이라고 생각하면 편할 것 같아요.

* * *

#### Library

\- Static Library 정적 라이브러리

정적 라이브러리는 컴파일 (link) 될 때 Library를 exe.file(실행파일)에 복사하여 사용합니다..

실행파일에 라이브러리가 들어가 있기 때문에 라이브러리 함수를 사용하는 데 추가적인 작업이 필요없습니다.

하지만 그만큼 실행파일도 커지기 때문에 로딩 시간이 길어지게 됩니다.

\- Dynamic Library 동적 라이브러리 **DLL**

동적 라이브러리는 동적으로 link하여 사용하는 라이브러리입니다.

실행파일에서 사용할 수 있도록 필요한 가장 최소한의 정보만을 포함하여 링크하거나,

아예 독립적으로 DLL을 로드 / 사용 / 해제가 가능하다고 합니다

정적 과는 반대로 실행파일의 몸집이 static에 비해서는 작기 때문에 로딩시간이 빠른 편입니다.

하지만 함수를 사용하는 데는 추가적인 작업을 어느정도 해줘야하는 편입니다.

* * *

#### Framework

\- static Framework 정적 프레임워크

static Linker를 통해 static Library 코드가 exefile에 포함 됩니다. > 메모리에 library 전체가 들어가게 됩니다.

static Library가 복사되므로 static Framework를 여러 Framework에서 사용하면 코드 중복이 발생합니다.

![](/images/ios-76/1.png)

그림에서 볼 수 있듯이 Static Library 자체가 복사되어 exe file에 저장이 되므로 메모리가 많이 사용됩니다.

용량이 크고 첫 로딩 시간이 오래걸린다는 단점이 있습니다.

그래도 라이브러리 함수는 바로바로 사용 가능하기에 런타임 속도는 빠릅니다.

\- Dynamic Framework 동적 프레임워크

주소 자체를 실행 파일에 저장한 후 static Linker를 이용해서 stack으로 필요한 라이브러리를 사용합니다.

주소 정보는 Heap에 저장을 합니다.

![](/images/ios-76/2.png)

references만 Heap에 저장을 하여 사용하기 때문에 메모리는 static 보다는 훨씬 작습니다.

메모리 효율이 좋고 로딩 시간도 빠른 편입니다.

하지만 함수 사용시에 references를 사용해야하기에 런타임 속도가 static보다는 느린 편입니다.

* * *

참조

[https://ios-development.tistory.com/1004](https://ios-development.tistory.com/1004)

[https://hucet.tistory.com/43](https://hucet.tistory.com/43)

[https://luyin.tistory.com/201](https://luyin.tistory.com/201)

[https://stackoverflow.com/questions/148747/what-is-the-difference-between-a-framework-and-a-library](https://stackoverflow.com/questions/148747/what-is-the-difference-between-a-framework-and-a-library)
