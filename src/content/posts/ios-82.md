---
title: 'UIView animate'
pubDate: 2023-06-18
category: ios
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/82
---
회사 작업을 하면서 swift 관련해서 엄청나게 많은 기능을 배우고 사용을 하고 있습니다.

블로그에 작성을 해야하는 데 그럴 시간까지는 없어서... 거기다 회사 코드라서 쓰기 애매하더라구요,...

지금부터라도 최대한 작성해보자!!

* * *

### 하고 싶은 것

Slider를 만들 것입니다.

![](/images/ios-82/1.png)

대충 이런 형식의 슬라이드를 만들 것입니다.

해당 슬라이드를 설명을 해드리면...

-   전체적인 틀
    -   슬라이드가 올라올때 Dimming View가 Pop 형식으로 뜬 후 content 올라오고 X 버튼 올라오는 애니메이션이 있어야합니다.
    -   해당 슬라이드는 화면 밖에서 이미 로딩이 완료 되어 있어야합니다.
    -   custom ViewController를 만들어서 가져와서 쓸수 있도록 만들 예정.
    -   사용하는 입장에서 최대한 추가 코드를 작성하지 않도록...
-   Content 영역
    -   UIView를 파라미터로 받아서 받아온 UIView를 띄워줄 것 입니다.
    -   추가로 webView를 띄울 경우가 많을 듯 해서 기본적으로 화면 밖에서 로딩이 완료 되어 있어야 합니다.
-   Dimming View
    -   그냥 불투명한 View이며 X 버튼과 Dimming View를 눌렀을 때 슬라이드가 내려가고 Dimming View가 사라져야합니다.

* * *

### 구현

```swift
import UIKit

public class customSlider: UIViewController {
    private let contentView: UIView
    private let rootViewController: UIViewController
    
    public init(rootVC: UIViewController, contentView: UIView) {
        self.rootViewController = rootVC
        self.contentView = contentView
        super.init(nibName: nil, bundle: nil)
    }
}
```

rootViewController와 ContentView를 받아옵니다.

해당 슬라이드는 화면 밖에서 이미 모든 로딩이 완료가 되어 있어야합니다.

그렇기 때문에 present 방식으로 여는 것보다 addChild를 이용해서 자식VC로 설정을 해놔야합니다.

그 때 부모VC에서 자식으로 설정 완료 했다고 말해주는 함수가

```swift
    // 부모 VC에 didMove 함수 동작.
    override public func didMove(toParent parent: UIViewController?) {
        print("didmove")
        self.view.frame.origin.y = self.view.frame.size.height
    }
```

didMove입니다.

didMove 함수를 받았을 때 slider의 y를 화면의 높이로 변경해줍니다.

이 말인 즉슨, 휴대폰 화면 밑으로 VC를 이동을 시킨다는 뜻입니다.

사용자 눈에는 보이지 않도록 변경을 합니다.

이 후 slider setting 하는 부분을 다 didMove에 넣어줍니다.

contentView Setting

```swift
    // constraint
    
    var contentBottomConstraint: NSLayoutConstraint?
    var dismissBtnBottomConstraint: NSLayoutConstraint?

    private func setupView(){
        view.backgroundColor = .clear
        // top 만 cornerRadius
        contentView.layer.cornerRadius = 16
        contentView.clipsToBounds = true
        contentView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            contentView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        ])
        
        let heightConstraint = contentView.heightAnchor.constraint(equalToConstant: 300)
        heightConstraint.priority = .defaultHigh
        heightConstraint.isActive = true
        
        contentBottomConstraint = contentView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: 300)
        contentBottomConstraint?.isActive = true
        
    }
```

contentView 또한 slider 화면 밑으로 보냅니다.

아까 sliderVC 도 화면 밑으로 보냈는데... contentView는 sliderVC의 화면 밑으로..? 왜요???

우선 나머지 코딩 다 하고 알려드리겠습니다.

contentView도 위치 시켰으니 DimmingView와 btn도 위치시키겠습니다.

```swift
    private func setupDimmingView(){
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissAction))
        backgroundView.addGestureRecognizer(tapGesture)
        NSLayoutConstraint.activate([
            backgroundView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            backgroundView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            backgroundView.topAnchor.constraint(equalTo: view.topAnchor),
            backgroundView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func setDismissBtn(){
        NSLayoutConstraint.activate([
            dismissBtn.centerXAnchor.constraint(equalTo: view.centerXAnchor)
        ])
        
        dismissBtnBottomConstraint = dismissBtn.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: 300)
        dismissBtnBottomConstraint?.isActive = true
        
    }
```

말로 뭔가 설명하려니까 정말 어렵네요...

직접 고민하면서 코딩하다보면 어느정도 이해가 될듯 한데...

그림으로 설명해드리겠습니다.

![](/images/ios-82/2.png)

왼쪽 부터 오른쪽으로 나아가는 것입니다.

처음 먼저 중간 검은 동그라미가 버튼이라고 했을 때, 버튼 클릭시 먼저 sliderVC의 y축을 0 으로 변경합니다.

그렇게 되면 dimming View가 자동으로 채워지겠죠?

그후 애니메이션으로 슬라이드를 위로 올려야하기에 가장 처음 저런식으로 위치시켰던 것입니다.

그래서 setting 함수들을 추가하면

```swift
    override public func didMove(toParent parent: UIViewController?) {
        self.view.frame.origin.y = self.view.frame.size.height
        
        view.addSubview(backgroundView)
        view.addSubview(dismissBtn)
        view.addSubview(contentView)
        
        
        setupView()
        setDismissBtn()
        setupDimmingView()
    }
```

애니메이션 추가를 해보겠습니다.

```swift
    private func aniContentView(aniTime: TimeInterval){
        UIView.animate(withDuration: aniTime) {
            
            self.contentBottomConstraint?.isActive = false
            self.contentBottomConstraint = self.contentView.bottomAnchor.constraint(equalTo: self.view.bottomAnchor)
            self.contentBottomConstraint?.isActive = true
            
            self.view.layoutIfNeeded()
        }
    }
    
    private func aniDismissBtn(aniTime: TimeInterval){
        UIView.animate(withDuration: aniTime) {
            
            self.dismissBtnBottomConstraint?.isActive = false
            self.dismissBtnBottomConstraint = self.dismissBtn.bottomAnchor.constraint(equalTo: self.buzzAdNative.topAnchor, constant: -10)
            self.dismissBtnBottomConstraint?.isActive = true
            
            self.view.layoutIfNeeded()
        }
    }
```

저의 경우 constraint로 화면 구성을 했습니다. 그렇기 때문에 이런식으로 했습니다.

만약 그냥 frame으로 코딩하셨다면 더욱 쉽게 하는 방법이 구글에 있기 때문에 보고 그부분만 변경하면 됩니다.

constraint로 했을 때 frame도 마찬가지인지는 모르겠지만 **layoutIfNeeded**를 해줘야 변경이 되더라구요

애니메이션은 사용쪽에서 써줘야하기에 public 함수로 만들어줍니다.

```swift
    public func openSlider(){
        self.view.frame.origin.y = 0
        aniContentView(aniTime: 2.0)
        aniDismissBtn(aniTime: 4.0)
    }
```

자 그럼 이제 부모에서 자식뷰로 설정을 해야겠죠?

구글에서 addChild 설정하는 법을 찾아보면 아시겠지만 부모쪽에서 하단 3가지 코드를 사용해줘야합니다.

```swift
        self.addChild(customSlider)
        customSlider.didMove(toParent: self)
        self.view.addSubview(customSlider.view)
```

그런데 저는 사용자쪽에서 최대한 코드를 사용하지 않도록 하고 싶었습니다...

그래서 rootVC를 받아온 것도 있습니다.

slider class에 public함수로 만들어줍니다.

```swift
    public func setSlider(){
        self.rootViewController.addChild(self)
        self.didMove(toParent: self.rootViewController)
        self.rootViewController.view.addSubview(self.view)
    }
```

이렇게 만들고 나면 사용자 쪽에서는 

```swift
    private lazy var customSlider: customSlider = {
        let vc = customSlider(rootVC: self, contentView: DashBoardView())
        return vc
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // slider setup
        self.customSlider.setSlider()
    }    
    
    @IBAction func SliderBtnAction(_ sender: Any) {
        // slider open
        self.customSlider.openSlider()
    }
```

위에서 부터 인스턴스 만들어주고

setting 해주고 slider open 해주면 만들어준 애니메이션 대로 잘 올라가는 것을 볼 수 있습니다.

아 그리고 닫는 걸 설명안했네요...

dimmingView와 dismissbtn에 obj함수로 추가해주면 됩니다.

```swift
    @objc private func dismissAction() {
        UIView.animate(withDuration: 3.0) {
            self.contentBottomConstraint?.isActive = false
            self.contentBottomConstraint = self.contentView.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: 300)
            self.contentBottomConstraint?.isActive = true

            self.dismissBtnBottomConstraint?.isActive = false
            self.dismissBtnBottomConstraint = self.dismissBtn.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: 300)
            self.dismissBtnBottomConstraint?.isActive = true
            
            self.view.layoutIfNeeded()
        }completion: { _ in
            self.view.frame.origin.y = self.view.frame.size.height
        }
    }
```

너무 횡설수설 해서 아마 못 알아보실 거에요.. 그냥 따라서 하기 보다는 이렇게 함수를 사용하는 구나 정도..

사실 지금 독서실인데 곧 시간이 끝나서 타임어택하느라..

나중에 제가 개인 앱 만들어서 자세히 다시 설명할께요!!

그냥 제 개인 메모장 정도로 생각하려고요!

감사합니다 ㅎㅎ
