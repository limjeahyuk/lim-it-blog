---
title: 'SD. Slide 구현'
pubDate: 2023-06-21
category: ios/study-diary
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/84
---
전 게시물에서 만들어 둔 프로젝트에 이제 하나하나 class를 만들어서 사용을 할 것입니다.

구현하는 순서는 정말 뒤죽박죽, 하고 싶은 거 먼저 막 할 예정입니다.

최대한 사용을 할 때 편리하게 만들 것이며 원하는 기능을 최대한 구현해보도록 하겠습니다.

**제가 사용하는 것이 정답은 절대 아니고 더욱 편리한 방법도 아닙니다.**

**그저 제가 혼자서 구글링 하면서 구현하다가 성공한 것을 올리는 것입니다.**

**효율도 매우 안 좋을 수도 있다는 점 알려드리겠습니다.**

가장 먼저 구현할 것은 Slide 입니다.

요새 정말 재미있게 구현하고 있습니다.

꼭 블로그에 올리고 싶었습니다.

* * *

### 디자인

![](/images/study-diary-84/1.png)

\- 공통

1\. content는 사용자에게 UIView를 받아올 것입니다.

2\. 아래에서 위로 올라오는 애니메이션을 사용할 것입니다.

3\. 슬라이드를 제외한 부분은 DimmingView로 클릭하면 슬라이드가 내려가고

   반투명해서 전에 ViewController의 View들이 보입니다.

\- 왼쪽 ( Double Slider )

1\. 아래에 있는 content가 먼저 올라오고 이어서 위에 있는 content가 올라옵니다.

2\. 아래의 content는 webView를 사용해서 loading이 완료되어있어야 합니다.

    즉, 보이지는 않지만 세팅은 되어있어야 합니다.

\- 오른쪽 ( title Slider )

1\. title과 content를 사용자에게 받아옵니다.

* * *

### 기본 설정.

먼저 branch를 따줍니다.

오늘이 6월 20일이니까 "feature/CMP-620"으로 만들어주도록 할게요

![](/images/study-diary-84/2.png)

여기다가 만들도록 하겠습니다.

![](/images/study-diary-84/3.png)

먼저 Navigation으로 날짜별로 이동하는 것 먼저 만들어야 하는 데.. 오늘은 슬라이드가 만들고 싶네요

다음에 정리하도록 하고 우선 만드는 것에 집중하도록 하죠

우선 대충 ViewController 쪽에 버튼을 만들어주도록 합니다.

둘 다 constraints를 설정해서 위치 지정해 주도록 하고요

위에는 Double 아래는 Title이라고 해주도록 하겠습니다.

![](/images/study-diary-84/4.png)

**command + N을** 이용해서 DoubleSlide.swift 파일을 만들어줍니다.

* * *

### Double Slide

UIViewController class로 만들어줍니다.

```swift
import UIKit

public class DoubleSlide: UIViewController {
    
}
```

먼저 인스턴스를 쭉 추가해 주도록 하겠습니다.

1\. dimmingView ( 뒷배경 )

2\. contentSlide ( 아래 슬라이드 틀 )

3\. contentView ( 아래 슬라이드 내용 )

4\. subContentSlide ( 상단 슬라이드 틀 )

5\. subContentView ( 상단 슬라이드 내용 )

6\. rootViewController ( 부모 VC )

여기서 사용자에게 받아야 할 부분은 **contentView**와 **rootViewController입니다.**

그렇게 인스턴스와 init 작성해 보도록 하겠습니다.

```swift
import UIKit

public class DoubleSlide: UIViewController {
    
    private let contentView: UIView
    private let rootViewController: UIViewController
    
    private lazy var dimmingView: UIView = {
       let view = UIView()
        view.backgroundColor = UIColor.black.withAlphaComponent(0.3)
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var contentSlide: UIView = {
        let view = UIView()
        view.backgroundColor = .white
        view.layer.cornerRadius = 16
        view.layer.maskedCorners = CACornerMask(arrayLiteral: .layerMinXMinYCorner, .layerMaxXMinYCorner)
        view.clipsToBounds = true
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var subContentSlide: UIView = {
        let view = UIView()
        view.backgroundColor = .white
        view.layer.cornerRadius = 16
        view.clipsToBounds = true
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var subContentView: UIImageView = {
        let imageView = UIImageView()
        imageView.backgroundColor = .white
        imageView.image = UIImage(named: "SubContentImage")
        imageView.translatesAutoresizingMaskIntoConstraints = false
        return imageView
    }()
    
    public init(rootVC: UIViewController, contentView: UIView){
        self.rootViewController = rootVC
        self.contentView = contentView
        super.init(nibName: nil, bundle: nil)
    }
    
    required public init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    public override func viewDidLoad() {
        super.viewDidLoad()
    }
}
```

**\- UIView.layer.cornerRedius**

cornerRedius를 설정하게 되면 4개의 모서리 모두 둥글게 됩니다.

만약 상단만 하고 싶다면 **view.layer.maskedCorners = CACornerMask를** 사용해 주면 됩니다.

![](/images/study-diary-84/5.png)

인스턴스는 설정 완료 된 것 같네요!!

그럼 이제 화면 위치 설정 을 해주도록 하겠습니다.

![](/images/study-diary-84/6.png)

```swift
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        setDimmingView()
        setContentView()
        setSubContentView()
    }
    
    private func setContentView(){
        // contentSlide 설정.
        view.addSubview(contentSlide)

        NSLayoutConstraint.activate([
            contentSlide.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            contentSlide.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            contentSlide.heightAnchor.constraint(equalToConstant: 300),
            contentSlide.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        // contentView 설정
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        contentSlide.addSubview(contentView)
        
        NSLayoutConstraint.activate([
            contentView.leadingAnchor.constraint(equalTo: contentSlide.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: contentSlide.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: contentSlide.bottomAnchor),
            contentView.topAnchor.constraint(equalTo: contentSlide.topAnchor),
        ])
    }
    
    private func setSubContentView(){
        // subContentSlide 설정.
        view.addSubview(sContentSlide)

        NSLayoutConstraint.activate([
            sContentSlide.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 10),
            sContentSlide.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -10),
            sContentSlide.heightAnchor.constraint(equalToConstant: 150),
            sContentSlide.bottomAnchor.constraint(equalTo: contentSlide.topAnchor, constant: -10)
        ])
        
        // subContentView 설정
        
        sContentSlide.addSubview(sContentView)
        
        NSLayoutConstraint.activate([
            sContentView.leadingAnchor.constraint(equalTo: sContentSlide.leadingAnchor, constant: 10),
            sContentView.trailingAnchor.constraint(equalTo: sContentSlide.trailingAnchor, constant: -10),
            sContentView.bottomAnchor.constraint(equalTo: sContentSlide.bottomAnchor, constant: -10),
            sContentView.topAnchor.constraint(equalTo: sContentSlide.topAnchor, constant: 10),
        ])
    }
    
    
    private func setDimmingView(){
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissAction))
        dimmingView.addGestureRecognizer(tapGesture)
        view.addSubview(dimmingView)
        
        NSLayoutConstraint.activate([
            dimmingView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            dimmingView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            dimmingView.topAnchor.constraint(equalTo: view.topAnchor),
            dimmingView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    @objc private func dismissAction(){
        dismiss(animated: true, completion: nil)
    }
```

우선 present 방식으로 열어주도록 하겠습니다.

```swift
@IBAction func doubleBtnAction(_ sender: Any) {
        let doubleSlide = DoubleSlide(rootVC: self, contentView: DashBoardView())
        doubleSlide.modalPresentationStyle = .overFullScreen
        present(doubleSlide, animated: true)
    }
```

여기서 DashBoardView()는 웹뷰로 채워진 View입니다. 이렇게 해서 클릭을 하게 되면!

![](/images/study-diary-84/7.png)

이런 식으로 나오게 됩니다.

present 방식으로 했기 때문에 dismiss로 하면 닫히는 것까지 됩니다.

여기까지 하면 우선 슬라이드는 되는데 문제가 두 가지가 있습니다.

* * *

### 문제

1\. "아래의 content는 webView를 사용해서 loading이 완료되어있어야 합니다.

    즉, 보이지는 않지만 세팅은 되어있어야 합니다."

이 부분이 충족이 되지 않습니다.

2\. DimmingView도 같이 올라옵니다. Dimming View는 Pop으로 떴으면 좋겠습니다.

다음 게시물에서 두 가지 문제점을 바로 잡도록 하겠습니다.
