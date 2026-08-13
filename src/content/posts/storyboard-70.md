---
title: 'Xcode simulator 작동 에러'
pubDate: 2023-01-21
category: ios/storyboard
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/70
---
Simulator 가 에러가 나서 작동하지 않을 때

강제 종료 및 재시동 하는 법.

1.  cmd 에서 작성
    -   **ps -ax | grep simdeviceio | grep -v grep**
2.  삭제
    -   전체 삭제  
        **ps ax | grep simdeviceio | grep -v grep | awk '{print $1}' | xargs kill -9**
    -   부분 삭제  
        kill -9 (ID) / kill -9 15690 이런식.
3.  Simulator 강제 종료  
    하단 메뉴에서 simulator 아이콘 우클릭 → 종료
4.  xcode **cmd + shift + K** 로 정리.
5.  **cmd + R** 재시동
