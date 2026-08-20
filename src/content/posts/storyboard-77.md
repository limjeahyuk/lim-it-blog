---
title: '[swift] HTTP 통신 방법'
slug: storyboard-77
pubDate: 2023-02-28
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/77
---
앱이든 웹이든 뭐든 만들 때 통신은 무조건 해야합니다.

그렇기 때문에 서버와 통신을 잘 알아둬야 합니다. 우선 하는 방법 부터 알아보도록할께요

제가 배운 방식은 좀 옛날 방식 같긴한데... 영상을 보면서 배운 것이라서

우선 배운 방식을 작성하도록 할께요!

![](/images/storyboard-77/1.png)

-   AppSettingModel
-   AppSettingDataManager
-   AppSettingInput

위 3가지 swift 파일을 만들어 주겠습니다.

각각 하는 역할은

AppSettingModel : 서버 통신을 하고 받아오는 값들의 type을 지정해줍니다.

AppSettingDataManager : 서버 통신을 하는 함수 작성합니다.

AppSettingInput : 서버에게 보내는 값의 type을 지정해줍니다.

이렇게 봐도 잘 모르겠지요..?

우선 코드를 살펴 보도록 할께요!

먼저 서버 통신을 하기 위해 서버에게 보내는 값이 있을 것입니다.

( 없을 수도 있어요 )

예를 들면 로그인이라고 하면 아이디와 비밀번호가 서버에 보내는 값이겠지요?

그런 타입을 지정해준다고 생각하면 편합니다.

```swift
struct AppSettingInput: Encodable {
    var appKey : String?
}
```

저는 이런식으로 서버에게 하나의 값만 보낼 것이기에 하나만 만들었습니다.

그 다음은 받아올 값의 타입을 지정해줘야합니다.

예를 들면 로그인 하고 나서 성공 or 실패 이런 값 

또는 레시피 openAPI를 사용해서 음식 이름과 사진 레시피 내용 같은 것들의 타입을 받아올 수 있겠죠?

저의 경우는 해당 app에 관련된 key 값들을 쭈욱 받아올 것입니다.

```swift
public struct AppSettingModel: Decodable{
    var main : ASMain?
    var mediakey : String
}

struct ASMainMenu: Decodable{
    var feed: Bool
    var news: Bool
}
```

json 형식으로 받아올 때는 위처럼 struct 안에 또 struct를 넣어줘서 type을 만들어줘야합니다.

이렇게 model까지 만들었다면 이제 함수만 만들어서 사용하면 되겠죠?

Alamofire라는 Library를 사용할 것입니다.

Alamofire는 Http통신을 편하게 해주는 Library로 cocoapod 나 Swift Package Manager 를 이용해서 설치를 해주고

사용하면 됩니다.

```swift
import Foundation
import Alamofire

public class AppSettingDataManager{
    
    func AppSettingDataManger(_ parameters: AppSettingInput){
        let header : HTTPHeaders = ["Auto": "HEADER"]

        AF.request( /* 통신할 URL */,
                   method: .get,
                   parameters: parameters,
                   headers: header).validate().responseDecodable(of: AppSettingModel.self) { response in
            switch response.result{
            case .success(let result):
                apsspInit().sucessAPI(result)
                print("LIM: Success")
                print(result)
            case.failure(let error):
                print("LIM: \(error)")
            }
        }
    }
}

/* 사용법 */
AppSettingDataManager().AppSettingDataManger(parameter)
```

생각보다 간단해서 놀랐습니다.

뭐 지금은 성능보다는 되는 것에 중점을 맞췄기 때문에 간단해보일 수 있지만...

되는 게 어디에요! 점점 잘해가면 되죠

화이팅!
