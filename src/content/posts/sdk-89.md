---
title: 'CocoaPod / Podfile 관련한 내용 정리'
pubDate: 2024-07-15
category: ios/sdk
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/89
---
Podfile은 기본적으로 cocoaPod을 사용하기 위한 파일입니다.

그렇다면 cocoaPod이란?

> 라이브러리 의존성 관리 매니저  
> CocoaPods란 Object-C 또는 Swift에서 라이브러리를 사용할 수 있게 도와주는 모듈입니다.

cocoaPod은 2011년에 처음 공개되고 지금까지 사용되고 있는 만큼

-   **풍부한 라이브러리 지원** / 오래된 역사를 가지고 있는 만큼 수많은 라이브러리가 존재하고 있습니다.
-   **넓은 커뮤니티** / 커뮤니티가 크고 활성화 되어 있어서 수많은 에러에 대한 해결책을 나름 쉽게 찾을 수 있습니다.
-   **편리한 버전관리** / 특정 버전을 명시하여 프로젝트 안정성을 유지할 수 있습니다.

위와 같은 장점이 있습니다.

하지만 장점이 있으면 단점도 있는 법.

-   **빌드 시간 증가** / Podfile.lock을 업데이트하고 의존성을 설치하는 과정에서 빌드 시간이 증가합니다.
-   **Rudy의존성** / CocoaPod은 Rudy 기반이므로, Rudy 환경 설정이 필요합니다.
-   **third-party** / 현재 SPM이 나온 지 꽤 된 시점에서 third-party인 cocoaPod은 SPM보다 조금 불편한 점이 있을 수 있습니다.

SPM과 비교를 안 해 볼수는 없을 듯합니다...

이 부분은 나중에 따로 해보도록 하고.. CocoaPod을 사용하기 위해서는 어떻게 해야하는지 작성해보겠습니다.

1\. CocoaPod 설치.

```swift
sudo gem install cocoapods
```

2\. Podfile 만들기

cocoaPod을 사용하려는 프로젝트에 들어가서 아래 코드를 작성해줍니다.

```swift
pod init
```

이렇게 하면 podfile이 생성되는 것을 볼 수 있습니다.

약간의 차이가 있을 수 있지만 podfile의 내용은 아래와 같을 것입니다.

```swift
use_frameworks!

platform :ios, '10.0'

target 'limTestSDK_Example' do
  pod 'limTestSDK', :path => '../'
  pod 'Alamofire'

end
```

뭐 여러가지가 있겠지만... 가장 먼저 pods을 설치하는 부분이 가장 중요할 것입니다.

**pod {library Name}**

이렇게 사용하려는 library 이름을 작성해주면 됩니다.

예시를 들어서 **Alamofire**를 설치해보도록 하겠습니다,

podfile을 수정했다면 바로 터미널로 가서 pod 업데이트를 진행합니다.

```swift
pod install --repo-update
```

**pod install** -> 설치.

**\--repo-update** -> 업데이트

그냥 **pod install만** 해도 큰 문제 없지만... 저는 -**\-repo-update**까지 해주는 편입니다.

그렇게 했으면 정상적으로 깔리지 않는 사람이 분명 존재할 것입니다.

![](/images/sdk-89/1.png)

뭐 하나 쉽게쉽게 가지를 않네....

**\[!\] Oh no, an error occurred**

읽기도 힘든 에러가 엄청나게 나타나는 경우가 있습니다.

주로 m1에서 나타나는 이슈입니다.

이 부분은 arch를 추가해주면 쉽게 해결됩니다.

```swift
arch -x86_64 pod install --repo-update
```

정상적으로 깔리는 것 볼 수 있습니다.

![](/images/sdk-89/2.png)

그리고 다시 workspace에 들어가보면..

![](/images/sdk-89/3.png)

정상적으로 들어가 있는 것을 볼 수 있습니다.

빠르게 설치하는 법은 알겠고.. 이제 좀 세부적인 부분을 설명해드리겠습니다.

```swift
use_frameworks!

platform :ios, '10.0'

target 'limTestSDK_Example' do
  pod 'limTestSDK', :path => '../'
  pod 'Alamofire'

  target 'limTestSDK_Tests' do
    inherit! :search_paths

    
  end
end
```

**use\_frameworks!**

> 내가 설치를 희망하는 libarary들을 Dynamic으로 설치할 것인지, Static으로 설치할 것인지 나타내는 문구입니다.

Dynamic으로 설치하도록 하겠습니다. -> use\_frameworks! / use\_frameworks! :linkage => :dynamic

Static으로 설치를 희망한다면 -> ( 안쓰기 ) / use\_frameworks! :linkage => :static

Podspec에 아래와 같은 글이 있다면 Dynamic으로 했을 때 문제가 되는 부분이 종종 있습니다.

```swift
s.static_framework = true
```

**platform :ios, '10.0'**

> 설치 버전

library들을 iOS 어떤 버전에서 돌아갈 수 있도록 할 것인지, 버전정보를 작성해놓습니다.

해당 버전보다 deployment 버전을 낮추게 된다면 에러가 발생할 것입니다.

**target {AppName}**

> 앱 정보.

어떤 앱에서 library를 설치해서 사용할 것인지 나타냅니다.

사용할 앱 do ~ end 내부에 pod 코드를 작성해주시면 됩니다.

**pod {Library}**

> 설치하려는 Library

설치하고 싶은 Libaray를 작성한 후 cmd 에서 pod install을 해주면 설치가 되는 방식입니다.

여기서 추가로 version을 명시하고 싶다면

```swift
pod 'SDK' // SDK 모든 버전 설치
pod 'SDK', '0.0.1' // SDK 0.0.1 버전 설치
pod 'SDK', '> 0.0.1' // SDK 0.0.1 초과 버전 설치
pod 'SDK', '>= 0.0.1' // SDK 0.0.1 이상 버전 설치
pod 'SDK', '< 0.0.1' // SDK 0.0.1 미만 버전 설치
pod 'SDK', '<= 0.0.1' // SDK 0.0.1 이하 버전 설치
pod 'SDK', '~> 0.1.1' // SDK 0.1.1 ~ 0.2 버전 설치 (0.2 이상 제외)
pod 'SDK', '~> 0.1' // SDK 0.1 ~ 1.0 버전 설치 (1.0 이상 제외)
```

이 처럼 사용해주면 됩니다.

그럼 path는? 무엇인가요?

**pod 'limTestSDK', :path => '../'**

주로 SDK를 직접 개발할 때 사용을 많이 합니다.

개발 중인 SDK 파일의 경로를 :path => {경로} 에 작성을 해주고 pod install 을 해주게 되면..

![](/images/sdk-89/4.png)

차이점이 보이실까요?

path를 작성한 파일은 Development Pods에 들어가게 되어서 직접 구현을 바로바로 할 수 있습니다.

그와 반대로 version 또는 그냥 작성을 하게 된 파일의 경우

Pods에 들어가져서 코드가 보이지 않거나... 또는 변경하려 하면 unlock을 하겠냐는 문구가 나타나게 됩니다.

**end 이후**

```swift
post_install do |installer|
  
  def installer.verify_no_static_framework_transitive_dependencies; end

    installer.pods_project.targets.each  do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
   end

   installer.pods_project.build_configuration_list.build_configurations.each do |configuration|
    configuration.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
  end
end
```

이런 코드가 추가되는 것을 볼 수 있습니다.

위 예시 코드처럼 end 이후에 추가되는 코드들은 주로 SDK 설치가 될 때 Build Setting의 값을 변경을 하라는 코드입니다.

Build Setting을 막 건드리게 되면 추후에 엄청나게 에러가 생기는 경우도 많으니 조심히 변경하는 것을 추천드립니다.

* * *

#### **Podfile.lock**

Podfile을 이용해서 SDK를 설치하고 나면 SDK 버전 정보가 담긴 Podfile.lock이 생성되게 됩니다.

만약 pod install 을 하려 하니 podfile.lock version과 관련한 에러가 나타난다면

살며시 podfile.lock을 삭제해주고 다시 깔면 됩니다.

* * *

#### **pod 삭제**

pod을 삭제해야하는 경우가 있습니다.

정말 개발 하다보면 말도 안되게 에러가 나타나는 경우가 있기 때문에 초기화 시키는 마음으로 다 삭제를 원할때가 있습니다.

```swift
pod deintegragte // pod 삭제
pod cache clean --all // pod 캐시 삭제
```

이후,

![](/images/sdk-89/5.png)

이렇게 삭제를 시킨 후에 다시 시도할때는 pod install만 해주면 그대로 다시 살아나게 됩니다.
