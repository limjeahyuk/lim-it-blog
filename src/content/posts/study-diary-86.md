---
title: 'SD. Slider 구현 part.3'
pubDate: 2023-06-23
category: ios/study-diary
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/86
---
전 포스팅에서는 addChild를 이용해서 VC를 관리를 했으며

VC를 애니메이션을 통해서 사용자에게 보이는 슬라이드를 만들었습니다.

이번에는 좀 다른 방식으로 present를 사용해서 보이도록 하겠습니다.

추가로 Title 형식을 좀 넣어보도록 하겠습니다.

![](/images/study-diary-86/1.png)

* * *

### TitleSlide

```swift
import UIKit

public class TitleSlide: UIViewController{
    
    public override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    
}
```

바로 swift 파일 하나 만들어줬습니다.

DoubleSlide와 동일하게 만들어야 할 컴포넌트를 생각해 보도록 하죠.

1\. DimmingView

2\. ContentSlide

3\. TitleView

4\. Title

5\. dismissBtn

6\. ContentView

이 정도 되겠네요. 추가로 사용자에게 받을 값들은 Title과 ContentView 정도 되겠네요.

```swift
import UIKit

public class TitleSlide: UIViewController{
    
    private var contentView: UIView
    private var titleText: String!
    
    private var dimmingView: UIView = {
       let view = UIView()
        view.backgroundColor = UIColor.black.withAlphaComponent(0.3)
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var contentSlide: UIView = {
        let view = UIView()
        view.backgroundColor = .white
        view.layer.cornerRadius = 16
        view.clipsToBounds = true
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var titleView: UIView = {
       let view = UIView()
        view.backgroundColor = .white
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
    
    private lazy var titleLabel: UILabel = {
       let label = UILabel()
        label.text = titleText
        label.textAlignment = .left
        label.font = .systemFont(ofSize: 18.0, weight: .bold)
        label.numberOfLines = 0
        label.textColor = .black
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private lazy var dismissBtn: UIButton = {
        let btn = UIButton(type: .system)
        btn.setImage(UIImage(systemName: "xmark"), for: .normal)
        btn.tintColor = .systemGray
        btn.addTarget(self, action: #selector(dismissAction), for: .touchUpInside)
        btn.translatesAutoresizingMaskIntoConstraints = false
        return btn
    }()
    
    public init(contentView: UIView, titleText: String) {
        self.contentView = contentView
        self.titleText = titleText
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    public override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    // MARK: - objc func
    @objc func dismissAction(){
        print("dismissAction")
        dismiss(animated: true, completion: nil)
    }
    
}
```

컴포넌트 만들어주고 init으로 받아올 수 있게 까지 만들었습니다.

위 부분에서는 어려운 게 없으니까 그냥 넘어가도록 하겠습니다.

이제 위치 조정을 들어가도록 하겠습니다.

```swift
    public override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .clear
        
        setDimmingView()
        setContentSlide()
        setTitleView()
    }
    
    private func setDimmingView(){
        view.addSubview(dimmingView)
        
        NSLayoutConstraint.activate([
            dimmingView.topAnchor.constraint(equalTo: view.topAnchor),
            dimmingView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            dimmingView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            dimmingView.bottomAnchor.constraint(equalTo: view.bottomAnchor)

        ])
        
    }
    
    private func setContentSlide(){
        
        view.addSubview(contentSlide)
        
        NSLayoutConstraint.activate([
            contentSlide.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 58),
            contentSlide.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            contentSlide.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            contentSlide.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        contentSlide.addSubview(titleView)
        contentSlide.addSubview(contentView)
        
        NSLayoutConstraint.activate([
            titleView.topAnchor.constraint(equalTo: contentSlide.topAnchor),
            titleView.leadingAnchor.constraint(equalTo: contentSlide.leadingAnchor),
            titleView.trailingAnchor.constraint(equalTo: contentSlide.trailingAnchor),
            titleView.heightAnchor.constraint(equalToConstant: 60),
            
            contentView.topAnchor.constraint(equalTo: titleView.bottomAnchor),
            contentView.leadingAnchor.constraint(equalTo: contentSlide.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: contentSlide.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: contentSlide.bottomAnchor)
        ])
    }
    
    private func setTitleView(){
        
        titleView.addSubview(titleLabel)
        titleView.addSubview(dismissBtn)
        
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: titleView.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: titleView.leadingAnchor, constant: 20),
            
            dismissBtn.topAnchor.constraint(equalTo: titleView.topAnchor, constant: 20),
            dismissBtn.trailingAnchor.constraint(equalTo: titleView.trailingAnchor, constant: -20)
        ])
    }
```

위치 조정까지 마쳤습니다.

그럼 이제 사용자 쪽에서는 

```swift
    private lazy var titleSlide: TitleSlide = {
        let vc = TitleSlide(contentView: UIView(), titleText: "타이틀")
        return vc
    }()
    
        override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        // Do any additional setup after loading the view.
        
        titleSlide.modalPresentationStyle = .overFullScreen
    }
    
        @IBAction func titleBtnAction(_ sender: Any) {
        self.present(titleSlide, animated: true)
    }
```

이렇게 사용하면 됩니다.

![](/images/study-diary-86/2.png)

이런 식으로 나오게 됩니다.

음.. 근데 좀 문제가 몇 개 보입니다..

1\. slide가 밑에도 둥글어버림.

2\. dimmingView도 같이 아래에서 위로 올라옴 ( pop이길 원함 )

문제를 알았으니 한번 고쳐봅시다!

* * *

### 문제해결

전체가 둥근 거는 저번 포스팅에서 고쳤었죠

```swift
    private lazy var contentSlide: UIView = {
        let view = UIView()
        view.backgroundColor = .white
        view.layer.cornerRadius = 16
        view.layer.maskedCorners = CACornerMask(arrayLiteral: .layerMinXMinYCorner, .layerMaxXMinYCorner)
        view.clipsToBounds = true
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()
```

해결!! ς(>‿<.) ς(>‿<.) ς(>‿<.)

두 번째 dimmingView는 pop형식이기를 바랍니다.

저는 present를 직접 함수를 만들었습니다. 무슨 소리냐?

먼저 처음에 dimmingView를 투명하게 만든 다음 present가 다 되면 그때 dimmingView 투명도를 1로 만들었습니다.

그렇게 되면 pop 된 것처럼 보이겠죠

그것을 한 번에 다 해주는 present 함수를 만들어서 사용자는 간편하게 present만 쓰면 다 되도록 구현했습니다.

```swift
    private func setDimmingView(){
        dimmingView.alpha = 0.0
        
        view.addSubview(dimmingView)
        
        NSLayoutConstraint.activate([
            dimmingView.topAnchor.constraint(equalTo: view.topAnchor),
            dimmingView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            dimmingView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            dimmingView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func dimmingPop(){
        dimmingView.alpha = 1.0
    }
    
    public func present(_ rootVC: UIViewController, animated: Bool, completion: @escaping() -> Void){
        self.modalPresentationStyle = .overFullScreen
        rootVC.present(self, animated: animated) {
            completion()
            self.dimmingPop()
        }
    }
```

이렇게 하고 사용자는 한 줄만 사용하면 나타납니다.

```swift
titleSlide.present(self, animated: true) {
            print("done")
        }
```

이렇게 하면 원하는 대로 잘 나오는 것을 볼 수 있습니다.

* * *

### 개선할 점

1\. DimmingView가 슬라이드 올라가기 전에 pop 형식으로 나타났으면 좋겠습니다.

2\. titleSlide.present() 이 부분에 completion: nil을 박으면 에러가 나타납니다. nil도 가능하게 만들기.

3. 

* * *

이렇게 두 가지 Slide를 만들었습니다.

계속해서 고치고 새로운 것을 만들어 볼 예정입니다. 감사합니다. ^^

[https://github.com/limjeahyuk/StudyDiary](https://github.com/limjeahyuk/StudyDiary)
