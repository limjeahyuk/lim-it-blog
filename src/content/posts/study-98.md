---
title: 'Cache란'
pubDate: 2025-12-16
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/98
---
개발하면서 정말 많이 들어본 Cache

> 캐시는 자주 쓰는 데이터를 빨리 꺼내 쓰려고, 더 가까운 곳에 한 번 더 복사해 두는 임시 저장소 입니다.

간단하게 택배로 예시를 들자면

택배를 우리집까지 배송을 할 때 한 개씩 들고서 옮기지 않습니다.

우선 택배를 지역별로 분류를 하여 지역 근처로 모두 모아 놓고 그 다음 거기서 배달을 시작합니다.

이처럼 그나마 빠른 곳에 넣어두고 거기서 먼저 찾아서 사용을 하는 구조입니다.

* * *

#### 왜 캐시가 필요한가?

-   **용량 크고 싼 저장소** → 느림 (디스크, 네트워크, DB)
-   **용량 작고 비싼 저장소** → 빠름 (RAM, CPU 캐시)

문제는 자주 쓰는 데이터를 매번 **느린 곳(디스크, 서버, DB)**에서 가져오면  
→ 속도가 너무 느려집니다.

그래서

1.  한 번 읽어온 데이터나,
2.  앞으로 또 쓸 가능성이 높은 데이터는

**더 빠른 곳에 복사해 두고**, 다음번에 그걸 먼저 쓰는 게 캐시입니다.

* * *

#### **캐시의 장점**

1.  성능 향상
    -   응답속도 향상
    -   네트워크나 디스크 대신 메모리에서 바로 꺼내서 속도가 확 빨라집니다.
    -   CPU 레벨에서는 L1 / L2 캐시 덕분에 RAM 접근 보다 훨씬 빠르게 연산 가능합니다.
2.  부하 감소 & 비용 절감
    -   서버 / DB / 외부 API 호출 횟수가 줄어듭니다. → 인프라 부하 감소
    -   외부 유로 API라면 호출 횟수 줄어들면서 비용 절감.
3.  사용자 경험 개선
    -   리스트, 이미지, 상세 페이지 등 다시 열었을 때 바로 뜨는 느낌이 들게 됩니다.
    -   네트워크가 잠깐 불안정해도 캐시 덕분에 어느정도 버틸 수 있습니다.

#### **캐시의 단점**

1.  **캐시와 원본이 안 맞아질 수 있음 / 오래된 데이터 (stale data) 문제**
    -   원본이 바뀌었는데 캐시가 그대로면 → 구 데이터 보여줄 수 있음
    -   그래서 **만료 시간(Expiration)**, **버전, ETag** 같은 걸로 관리
2.  **메모리를 많이 쓸 수 있음**
    -   캐시라고 다 쌓아두면 → 결국 RAM 잡아 먹음 → OOM 리스크
    -   LRU(Least Recently Used) 같은 정책으로 **오래 안 쓴 것부터 버리기**
3.  **잘못 설계하면 오히려 느려짐**
    -   캐시 키 설계, 히트율이 안 나오면
    -   “캐시에 접근하는 비용 + 미스 나서 다시 원본 가는 비용”이 합쳐지면서  
        애매해질 수 있음

* * *

#### **그러면 어떤 데이터를 캐시에 저장?**

1.  가져오는 데 오래 걸리거나 비싼데, 여러번 재사용되는 것.
    -   네트워크 요청 결과 (API 응답)
    -   디스크/DB에서 읽어야 하는 데이터
    -   복잡한 연산 결과 (예: 큰 리스트 정렬, 필터, 파싱 결과)
2.  자주 읽히고 자주 바뀌지 않는 정보들.
    -   설정값, 환경 정보, 공통 코드/데이터
    -   인기 게시글 목록, 카테고리 리스트, 국가/도시 목록
    -   공통으로 쓰는 레퍼런스 데이터 (예: 코드 테이블)
3.  조금 정도의 구 데이터를 호용해도 되는 것.
    -   배너 목록, 추천 리스트
    -   오늘의 인기 글, 인기 상품
    -   날씨 요약, 환율(실시간이 아니어도 되는 수준)
4.  사이즈가 적당한 것들.
    -   적당히 작은 JSON, 썸네일, 리스트 일부 등
    -   “조금 쌓여도 메모리를 다 먹어버리지 않을 것들”

* * *

#### **캐시의 종류**

**하드웨어 / OS 레벨 캐시**

1.  **CPU 캐시 (L1, L2, L3)**
    -   CPU 내부/근처에 있는 초고속 메모리
    -   RAM보다 훨씬 빠름, 대신 용량 작음
2.  **페이지 캐시 / 디스크 캐시**
    -   OS가 디스크에서 읽어온 블록을 메모리에 캐시
    -   같은 파일을 다시 읽으면 디스크가 아니라 메모리에서 꺼냄

**애플리케이션 레벨 캐시**

1.  **인메모리 캐시**
    -   프로세스 메모리에 두는 캐시
    -   예: Swift NSCache, Java ConcurrentHashMap 기반 캐시, Node.js에서 Map 등
2.  **디스크 캐시**
    -   앱 로컬 디스크에 저장하는 캐시 (파일, DB, key-value 등)
    -   예: 이미지 파일 캐시, SQLite/Realm에 저장하는 로컬 캐시
3.  **분산 캐시**
    -   Redis, Memcached 같은 **별도 캐시 서버**
    -   여러 서버 인스턴스가 같이 접근할 수 있는 캐시

**네트워크 / 웹 레벨 캐시**

1.  **브라우저 캐시**
    -   JS, CSS, 이미지 등 정적 파일을 로컬에 저장
    -   HTTP 헤더(Cache-Control, ETag, Last-Modified 등)로 동작 제어
2.  **CDN / Reverse Proxy 캐시**
    -   Cloudflare, Akamai 같은 CDN이 정적/동적 응답을 전 세계 엣지 서버에 캐시
    -   사용자와 가까운 곳에서 응답 → 빠름

* * *

#### **예제**

```swift
import Foundation
import UIKit

// 캐시 키는 NSString, 값은 UIImage 라고 가정
final class ImageCache {
    static let shared = ImageCache()
    
    private let cache = NSCache<NSString, UIImage>()
    
    private init() {
        // 옵션: 캐시 제한 설정 (예: 최대 50개)
        cache.countLimit = 50
    }
    
    func image(forKey key: String) -> UIImage? {
        return cache.object(forKey: key as NSString)
    }
    
    func setImage(_ image: UIImage, forKey key: String) {
        cache.setObject(image, forKey: key as NSString)
    }
    
    func remove(forKey key: String) {
        cache.removeObject(forKey: key as NSString)
    }
    
    func removeAll() {
        cache.removeAllObjects()
    }
}

func loadImage(from urlString: String, completion: @escaping (UIImage?) -> Void) {
    // 1) 캐시에서 먼저 시도
    if let cached = ImageCache.shared.image(forKey: urlString) {
        print("캐시 히트")
        completion(cached)
        return
    }
    
    print("캐시 미스 → 네트워크 요청")
    
    guard let url = URL(string: urlString) else {
        completion(nil)
        return
    }
    
    URLSession.shared.dataTask(with: url) { data, _, _ in
        guard let data = data,
              let image = UIImage(data: data) else {
            DispatchQueue.main.async { completion(nil) }
            return
        }
        
        // 2) 내려받은 이미지 캐시에 저장
        ImageCache.shared.setImage(image, forKey: urlString)
        
        DispatchQueue.main.async {
            completion(image)
        }
    }.resume()
}
```

-   **장점**
    -   같은 URL 이미지 재요청 시, 네트워크 안 타고 메모리에서 바로 반환
-   **주의**
    -   countLimit, totalCostLimit 등을 잘 설정해서 메모리 과다 사용 방지
    -   앱 종료 시 캐시는 사라짐 → 필요하면 디스크 캐시와 병행
