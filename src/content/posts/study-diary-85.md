---
title: 'SD. Slider 구현 part.2'
pubDate: 2023-06-22
category: ios/study-diary
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/85
---
전 포스팅에서 Double Slider를 구현했습니다.

문제가 두 가지가 있었습니다.

1\. 아래의 contentView는 webView를 사용할 것이고 loading이 완료되어야 합니다.

보이지는 않지만 세팅은 되어있어야 한다는 점.

2\. DimmingView가 같이 올라와서 조금 어색하다는 점.

이 두 가지를 고쳐보도록 하겠습니다.

* * *

### addChild

ViewController를 여는 방식으로는 present 방식도 있지만 addChild를 이용해서 자식 VC로 추가해서 올리는 방법이 있습니다.

이 방식을 사용하도록 하겠습니다.

그럼 present는 삭제를 하고 addChild를 사용하도록 하겠습니다.

```swift
private lazy var doubleSlider: DoubleSlide = {
        let vc = DoubleSlide(rootVC: self, contentView: DashBoardView())
        return vc
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        // Do any additional setup after loading the view.
        
        self.addChild(doubleSlider)
        doubleSlider.didMove(toParent: self)
        self.view.addSubview(doubleSlider.view)
        
    }
```

ViewController에 작성을 했습니다.

인스턴스를 만들어 준 후 **viewController의 자식VC로 doubleSlider를 추가.**

didMove() , **자식 추가 되었다는 것을 doubleSlider에 알려줬습니다.**

해당 뷰에 doubleSlider의 뷰를 추가했습니다.

이렇게 하면 VC를 자식 VC로 추가를 할 수 있게 되었습니다.

저희는 사용자가 최대한 코드를 작성하지 않는 것이 목표이기 때문에  
addChild 이후 3줄의 코드를 DoubleSlider()에서 사용하도록 변경할 것입니다.

```swift
    public func setDoubleSlide(){
        self.rootViewController.addChild(self)
        self.didMove(toParent: self.rootViewController)
        self.rootViewController.view.addSubview(self.view)
    }
```

위와 동일하지만 받아온 rootViewcontroller로 변경해준 모습입니다.

여기서 didMove가 가장 중요합니다.

자식뷰에서 연결이 되었다는 것을 알 수 있는 유일한 부분 이기 때문에 연결을 해줘야 합니다.

didMove를 사용하게 되면 **override func didMove()** 여기가 실행되게 됩니다.

그렇기에 viewDidLoad에서 실행되던 부분을 didMove()로 옮겨줘야 합니다.

```swift
    public override func didMove(toParent parent: UIViewController?) {
        
        self.view.frame.origin.y = self.view.frame.size.height
        
        view.addSubview(dimmingView)
        view.addSubview(sContentSlide)
        sContentSlide.addSubview(sContentView)
        view.addSubview(contentSlide)
        contentSlide.addSubview(contentView)
        
        
        setDimmingView()
        setContentView()
        setSubContentView()
    }
```

화면에서 보이면 안 되기 때문에 y값을 화면 크기의 맨 끝으로 보내줍니다.

이렇게 되면 사용자는 보이지 않지만 로딩은 다 되게 됩니다.

이제 버튼 클릭 시 마치 밑에서 위로 올라오는 애니메이션만 넣으면 되겠죠?

애니메이션을 넣을 때 처음 위치를 정해주지 않는다면 새롭게 생기는 애니메이션도 나오게 됩니다.

저는 아래에서 위로 올라오는 애니메이션만 가지고 싶은데 자꾸 View가 생기는 애니메이션도 같이 나오더라고요...

그래서 이리저리 찾아보다가 방법을 알아냈습니다.

우선 처음에 애니메이션 할 View들을 화면 밑으로 위치시켜줄게요.

Bottom만 변경하면 됩니다.

```swift
// constraint
    var contentBottomConstraint: NSLayoutConstraint?
    var sContentBottomConstraint: NSLayoutConstraint?
    
    contentBottomConstraint = contentSlide.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: 300)
    contentBottomConstraint?.isActive = true
    
    sContentBottomConstraint = sContentSlide.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: 150)
    sContentBottomConstraint?.isActive = true
```

변경 후..

애니메이션 추가를 해주겠습니다.

```swift
    // MARK: - Animation
    private func aniContentView(aniTime: TimeInterval){
        UIView.animate(withDuration: aniTime) {
            self.contentBottomConstraint?.isActive = false
            self.contentBottomConstraint = self.contentSlide.bottomAnchor.constraint(equalTo: self.view.bottomAnchor)
            self.contentBottomConstraint?.isActive = true
            
            // view 새로고침 (필수)
            self.view.layoutIfNeeded()
        }
    }
    
    private func aniSContentView(aniTime: TimeInterval){
        UIView.animate(withDuration: aniTime) {
            self.sContentBottomConstraint?.isActive = false
            self.sContentBottomConstraint = self.sContentSlide.bottomAnchor.constraint(equalTo: self.contentSlide.topAnchor, constant: -10)
            self.sContentBottomConstraint?.isActive = true
            
            self.view.layoutIfNeeded()
        }
    }
```

자 이거를 버튼 클릭 시 호출해야 하기에 public으로 하나 만들어줄게요

```swift
    public func openDoubleSlide(){
        self.view.frame.origin.y = 0
        aniContentView(aniTime: 1.0)
        aniSContentView(aniTime: 1.5)
    }
```

아 먼저 y 축을 0으로 맞춰줘야 합니다.

그럼 이제 다 사용을 해보면 에러가 나더라고요!! ㅎ하핳..

viewDidLoad를 삭제 안 해서 그러더라고요... 삭제해 주세요!

ViewController

```swift
private lazy var doubleSlider: DoubleSlide = {
        let vc = DoubleSlide(rootVC: self, contentView: DashBoardView())
        return vc
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        // Do any additional setup after loading the view.
        
        doubleSlider.setDoubleSlide()
    }

    @IBAction func doubleBtnAction(_ sender: Any) {
        doubleSlider.openDoubleSlide()
    }
```

\- setDoubleSlide() : addChild 이후 화면을 밑에서 로드.

\- openDoubleSlide() : 올라오는 애니메이션

이후 버튼 클릭을 하면 잘 올라옵니다!!!! 

자동으로 dimmigView 문제도 해결되었습니다   
ヾ(๑╹ヮ╹๑)ﾉ”ヾ(๑╹ヮ╹๑)ﾉ”ヾ(๑╹ヮ╹๑)ﾉ”

이제 마지막 dimmigView를 클릭 시 내려가는 것까지 완벽하게 해내봐요

```swift
    @objc private func dismissAction(){
        UIView.animate(withDuration: 2.0) {
            self.contentBottomConstraint?.isActive = false
            self.contentBottomConstraint = self.contentSlide.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: 300)
            self.contentBottomConstraint?.isActive = true
            
            self.sContentBottomConstraint?.isActive = false
            self.sContentBottomConstraint = self.sContentSlide.bottomAnchor.constraint(equalTo: self.view.bottomAnchor, constant: 150)
            self.sContentBottomConstraint?.isActive = true
            
            self.view.layoutIfNeeded()
        }completion: { _ in
            self.view.frame.origin.y = self.view.frame.size.height
        }
    }
```

이렇게 까지 하면 완성~!!

DoubleSlide가 완성되었어요!!

다음에는 두 번째 Slide > TitleSlide를 만들어 볼게요!

TitleSlide는 Present 방식으로 구현해볼 예정이에요

그럼 다음에 뵙겠습니다.

![](/images/study-diary-85/1.png)

* * *

### 개선사항

\- 애니메이션 올라오기 전까지 DimmingView가 클릭되지 않도록 구현.

\-... 생각나면 추가할게요
