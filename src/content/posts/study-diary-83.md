---
title: 'SD. Xcode git 연동 및 branch 관리'
pubDate: 2023-06-20
category: ios/study-diary
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/83
---
### 목표

제가 회사에서 정말 열심히 공부하고 구글링 하고 ChatGPT한테도 물어보면서 꽤 많은 것을 만드는데

따로 정리를 안 하니까 며칠 뒤면 다 까먹고 그러더라고요..

제가 평생 여기 있을 것도 아니고 제 포트폴리오를 만들려면 열심히 공부하고 터득한 것을 좀 정리를 해놔야겠다!

그러던 도중 최근에 유도를 하다가 허리에 무리가 크게 갔는지 제2차 허리디스크 파여...ㄹ... 일 뻔했지만

오늘 사진 찍어보니까 그냥 근육이 좀 많이 놀랬다고 하더라고요.. 그래도 허리가 진짜 안 좋다고 운동은 좀 쉬라고..

운동도 쉴 겸 그동안 git 한 곳에다가 앱 하나 만들어서 만든 기능들을 최대한 넣어서 git에 저장을 해볼 예정입니다!!.

네 줄 요약

1\. 허리가 아파서 운동을 못 가서 매우 슬프다.

2\. 운동도 못하는 데 공부라도 할 예정.

3\. 이제까지 한 것들 git에 저장을 하면서 나만의 diary를 만들 예정.

4\. 나중에 나는 엄청 돈 많이 벌거니까!

* * *

### Xcode Git 연동.

우선 xcode에 git 계정을 연동을 해야 합니다.

**xcode의 setting - Accounts에 들어갑니다.**

![](/images/study-diary-83/1.png)

**왼쪽 아래 + 버튼을 눌러줍니다.**

그러면 뜨는 창에서 **GitHub를 찾아서 클릭**합니다. ( **Enterprise X** )

그러면 GitHub 계정 이메일과 Token을 작성하는 창이 나타납니다.

![](/images/study-diary-83/2.png)

GitHub에서 자신인 것을 인증할 수 있는 토큰을 발급받은 후 사용을 해야 합니다.

그럼 토큰 발급을 위해서 GitHub 홈페이지에 가야겠죠.

**GitHub 홈페이지에서 로그인 후 오른쪽 상단에 자신의 프로필 클릭 후 Settings에 들어갑니다.**

![](/images/study-diary-83/3.png)

**이후 Developer settings 클릭**

![](/images/study-diary-83/4.png)

**Personal access tokens > Tokens ( classic ) > Generate new token > Generate new token ( classic )**

![](/images/study-diary-83/5.png)

그러면 Note와 여러 체크박스들이 나타나게 됩니다.

Note는 해당 token이 뭐 하는 건지 나타내는 이름표정도..?

그 이후 여러 체크박스들은 해당 토큰으로 어디까지 접근을 할 수 있게 할 것인지 권한을 부여하는 부분입니다.

레포지토리에 push 및 기타 작업만 하고 대규모 작업은 하지 않는다면 repo 쪽만 클릭해도

큰 문제는 없을 것 같습니다.

![](/images/study-diary-83/6.png)

이후 생성 버튼을 클릭을 하면 토큰이 나오게 됩니다.

해당 토큰은 git의 레포지토리 접근 권한을 가지고 있기 때문에 어딘가에 노출이 되면..

절대로 좋지는 않을 것 같네요 ㅎ\_ㅎ

**토큰을 복사 후 Xcode에 넣어줍니다.**

![](/images/study-diary-83/7.png)

이후 다시 Setting에 들어가게 되면 GitHub가 생긴 것을 볼 수 있습니다.

(b˙◁˙ )b (b˙◁˙ )b (b˙◁˙ )b

이후 New Project를 만들 때

![](/images/study-diary-83/8.png)

체크를 하고 Create를 하게 되면 새로운 레포지토리가 되는 폴더가 만들어집니다.

.git 이 있다면 체크가 되지 않습니다.

### 새로운 레포지토리 GitHub 추가

![](/images/study-diary-83/9.png)

Navigator에 Source Control Navigator 영역...이라고 하는 데 대충 저 부분 클릭합시다!

( 이런 용어 하나하나 다 외우는 게 좋을 듯하네요... 뭔가 무식이 탄로 나는 느낌;; )

아무튼 Repositories 도 클릭해 주고 왼쪽 맨 밑에... 부분이 있을 것입니다.

**클릭 후 New "프로젝트이름" Remote... 를 클릭해 줍니다.**

![](/images/study-diary-83/10.png)

클릭하게 되면 레포지토리에 이름, 설명, 공개 및 비공개를 설정할 수 있는 창이 뜨게 됩니다.

**입맛에 따라 설정하시면 될 듯합니다.**

![](/images/study-diary-83/11.png)

Create를 하고 GitHub 페이지에 가보면 만들어져 있고 연동되어 있는 것을 볼 수 있습니다.!!!

( °̀ᗝ°́)و.\*･ﾟ✧  ( °̀ᗝ°́)و.\*･ﾟ✧  ( °̀ᗝ°́)و.\*･ﾟ✧

### Commit / Branch

이 부분은 제가 가장 편하다 생각하는 방식으로 설명을 드리도록 하겠습니다.

몇몇 방법이 있겠지만 그중 가장 편하신 방법으로 하시면 될 듯합니다.

예를 들면

소스트리를 사용하는 방법도 있을 테고..

터미널로 만 모든 걸 해결하시는 분도 있을 테고..

Xcode 에서 제공하는 버튼으로 하시는 분도 있을 것입니다.

제 방식을 보고 이런 식으로 할 수 도 있구나... 정도??

사실 저도 이 방법이 맞는지는 모르겠어요!

정답이 어디 있겠어요 그냥 원하는 대로 동작하고 편하면 그게 정답이지!

![](/images/study-diary-83/12.png)

이런 식으로 코드를 변경 후 **commit > push**를 해야 합니다.

**터미널에 들어가서 ls ( list 보기 ) 와 cd ( 이동 ) 을 이용해서 프로젝트에 접근을 합니다.**

![](/images/study-diary-83/13.png)

그러면 방금 코드를 변경했기에 옆에 !1이 있는 것을 볼 수 있습니다.

**git add .**

**git commit -m "message"**

를 작성해 줍니다.

![](/images/study-diary-83/14.png)

그러면  !1 > +1 > ^1 이런 식으로 바뀌는 것을 볼 수 있습니다.

저는 여기서 push는 Xcode에서 해줍니다.

![](/images/study-diary-83/15.png)

그러면 창 하나가 뜨는 데 어디로 push를 할 것인가 물어보는 곳입니다.

웬만해서는 그 부분은 건드리지 않습니다.

why? branch를 따서 main으로 push 해야 할 때는 pull request를 하는 게 안전하다고 생각.. 하기 때문입니다..!!

그래서 아무튼 push를 하고 git에 들어가서 확인해 보면

message에 적은 부분과 함께 변경되어 있는 것을 볼 수 있습니다.

그러면 branch를 따고 merge를 할 때는???

**branch는 git 페이지에서 branch를 클릭 후 New Branch를 클릭해 줍니다.**

![](/images/study-diary-83/16.png)

Branch name 적어주고 Branch source는 어떤 Branch source를 가지고 Branch를 딸 것인가입니다..

주로 main / master를 이용합니다.

![](/images/study-diary-83/17.png)

branch가 생기고 터미널로 넘어와서

**git fetch를** 해줍니다

![](/images/study-diary-83/18.png)

이후 새로운 브랜치가 나타나면

**git switch 브랜치를** 이용해서 브랜치 전환을 해줍니다.

이후 코드 변경 후 push는 위에 단계와 똑같이 해주면 됩니다.

하고 나서 main 또는 master에 merge를 하고 싶다면

![](/images/study-diary-83/19.png)

**New Pull request를 눌러줍니다.**

그러면 충돌이 안나는지 확인을 쭈욱 하다가...... ( 딱히 같은 코드를 여럿이서 고친 것이 아니라면 안 날 것이에요..!!)

merge 하라고 나오게 됩니다.

![](/images/study-diary-83/20.png)

**confirm merge를 하면 main에 잘 merge 되게 됩니다.**

여기까지 git의 기초적인 부분은 다 끝난 것 같아요!!

ദ്ദി⑉¯ ꇴ ¯⑉ )  ദ്ദി⑉¯ ꇴ ¯⑉ )  ദ്ദി⑉¯ ꇴ ¯⑉ )

솔직히 제가 하는 방식이 더 어렵고 복잡할 수 있으니 이것을 따라 안 하셔도 괜찮아요!!

이 방법이 좋은 점도 딱히.?? 없는 거 같아요

제가 처음에 이리저리 만지다가 이 방법이 되어버려서 이대로 하다가 보니..

손에 익어서 하고 있어요! 여러분도 가장 편한 방법으로 하시길 바래요 ㅎ\_ㅎ

이제부터 git 여기에다가 계속해서 어떤 기능을 만들었는지 예제파일 만들고 git commit 할 예정이에요!

나중에는 많이 커지지 않을까요?

볼거리도 많아지겠지..???

제가 끝까지 해내볼게요!!

( 이제 잘 수 있다... zzz )
