---
title: '[swift] WKWebview Js 연동 / Bridge'
pubDate: 2023-01-21
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/69
---
#### Bridge란?

하이브리드 앱을 개발 할 때 앱과 웹을 연결해야 할 때가 있습니다.  
앱과 웹을 이어주는 다리 역할을 하는 것을 Bridge라고 합니다.

연결은 App( iOS ) ↔︎ JS로 합니다.

![](/images/storyboard-69/1.png)

https://gradler.tistory.com/33 에서 가지고 온 표 입니다

크게 보면 2가지로 볼 수 있습니다.

iOS > Front

Front > iOS

또한 2가지 안에서도 또 2가지로 param를 넘겨주나 안넘겨주나로 또 나눌 수 있습니다.

정리해보면

1\. ios > Front

-   변수 x
-   변수 o

2\. Front > iOS

-   변수 x
-   변수 o

* * *

**기본 세팅**

저의 경우 ios는 storyboard로 만들었으며 swift용어를 사용했습니다.

front의 경우 react로 web페이지를 만들었습니다.

![](/images/storyboard-69/2.png)

위와 같이 구현을 했습니다.

그렇게 해서 native에서 web으로 web에서 native로 연결하면서 작동되도록 구현해봤습니다.

* * *

#### **iOS -> Front**

1\. 변수 x

-   Front

![](/images/storyboard-69/3.png)

cunstomEvent()를 만들어 줍니다.

그 안에 함수를 넣고 추가해줍니다.  
컴포넌트가 삭제 되었을 때는 eventListener 삭제를 해줍니다.

-   Native

```swift
webView.evaluateJavaScript(“window.dispatchEvent(titleColorChange)”)
```

js에서 만들어준 함수를 실행할 부분에 넣어줍니다.  
ex) iOS button 클릭시 JS 함수 실행.

**결과**

![](/images/storyboard-69/4.png)

2\. 변수 o

-   Front

```swift
useEffect(() => {
   window.key값 = {
     titleHandler: (item) => {
        // 구현 로직
     }
   }
},[])
```

-   iOS

```swift
// optional 제거
let contText:String = self.contTextField.text ?? ""

webview.evaluateJavaScript("javascript:window.key값.titleHandler('\(contText)')"){(result, error)in
    print("ddd")
}
```

1.1 과 동일 하게 evaluateJavascript를 사용하여

key값. 함수명 ( params ) 를 이용해서 접근하고 JS에 전달해줍니다.

**결과**

![](/images/storyboard-69/5.png)

* * *

#### **Front -> iOS**

0\. 공통

WKScriptMessageHandler를 사용해서 js에서 건네주는 message를 받아와야합니다.

그렇기 때문에 webView를 새롭게 configuration과 함께 만들어야합니다.

```swift
    // MARK: - properties
    var webview : WKWebView!
    @IBOutlet weak var webView: WKWebView!
    
    // MARK: - Helper
    private func setupSecondView(){
        
    let controller = WKUserContentController()
    controller.add(self, name: "js에서 넘겨주는 메세지 key 값")
        
    let config = WKWebViewConfiguration()
    config.userContentController = controller
        
    // webview를 configuration 추가해서 만든 후 view에 올라가 있는 webView에 추가합니다.
    webview = WKWebView(frame: .zero, configuration: config)
    webView.addSubview(webview)
        
    // webview 조정하면서 넣은 제약조건을 넣어줍니다.
    webview.translatesAutoresizingMaskIntoConstraints = false
    webview.topAnchor.constraint(equalTo: webView.topAnchor).isActive = true
    webview.bottomAnchor.constraint(equalTo: webView.bottomAnchor).isActive = true
    webview.leadingAnchor.constraint(equalTo: webView.leadingAnchor).isActive = true
    webview.trailingAnchor.constraint(equalTo: webView.trailingAnchor).isActive = true
        
    }
    
    // MARK: - WKScriptMessageHandler
    extension SecondViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
      switch message.name{
        case "js에서 넘겨주는 메세지 key 값":
          // 메세지 받은 후 실행할 로직
        default:
            break
        }
    } 
}
```

JS로 부터 message를 받아올 때 기본 세팅 입니다.

1\. 변수 x

-   front

```swift
window.webkit?.messageHandlers.key값.postMessage(true);
```

메세지를 보내는 구간에 위 코드를 사용해줍니다.  
보낼 params는 없기 때문에 true를 설정해줬습니다.

-   iOS

```swift
// 위 기본 세팅에서... 

// MARK: - Helper
private func setupDSecondView(){
...
controller.add(self, name: "key값")
...
}

// MARK: - WKScriptMessage
extension SecondViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name{
        case "key값":
            self.titleLabel.textColor = .red
        default:
            break
        }
    }
}
```

key 값을 front와 동일하게 한 후

controller 추가 해주세요.

WKScriptMessage에 switch 문을 사용해서

message.name에 따라 다르게 작동시킬 것입니다.

  
만약 key값을 받았다면  
titleLabel의 textColor를 red로 해주세요.

이렇게 작성했습니다.

**결과**

![](/images/storyboard-69/6.png)

2\. 변수 o

-   front

```swift
window.webkit?.messageHandlers.textChange.postMessage("params");
```

true 대신 변수를 넣어주면 됩니다.

-   iOS

key 값은 [message.name](http://message.name/) 이였다면

params의 경우 message.body 입니다.

```swift
case "textChange":
    print(message.body)
    guard let title = message.body as? String else{
        return
    }
    self.contTextField.text = title
```

이런 식으로 사용을 하면 됩니다.

**결과**

![](/images/storyboard-69/7.png)

이렇게 나오게 됩니다.

* * *

#### **전체 코드**

-   front

```swift
import React, { useEffect, useState } from "react";

const BridgePage = () => {

    const [cont, setCont] = useState('')
    const [showCont, setShowCont] = useState('')
    const [colorChange, setColorChange] = useState(false)

    useEffect(() => {
        // window.ios 변수 이름 = new customEvent("이벤트 이름")
        window.titleColorChange = new CustomEvent("colorEvent")

        const colorEventCallback =(e) => {
            // 호출 될 때 실행되는 함수. 작동.
            setColorChange(colorChange ? false : true)
        }

        // window에 eventListener를 이름과 함수를 같이 저장.
        window.addEventListener("colorEvent", colorEventCallback)
        
        // 컴포넌트가 삭제되었을때... 다 끝나면
        return() => {
            // 삭제,
            window.removeEventListener("colorEvent",colorEventCallback)
        }
    },[colorChange])

    useEffect(() => {
       window.Native = {
        titleHandler: (item) => {
            setShowCont(item)
        }
       }
    },[])

    const changeHandler = (e) => {
        setCont(e.target.value)
        console.log(cont)
    }

    const clickHandler = () => {
        setShowCont(cont)
        setColorChange(colorChange ? false : true)

        if(cont == ""){
            window.webkit?.messageHandlers.colorChange.postMessage(true);
        }
        else{
            window.webkit?.messageHandlers.textChange.postMessage(cont);
        }

    }

    return <>
        <h2> ^ 위에는 iOS</h2>
        <hr />
        <h2> 여기서부터 js</h2>
        <br />
        <h3 style={{color:`${colorChange ? "red" : "black"}`}}>{showCont == '' ? 'none' : showCont}</h3>
        <input type="text" name="cont" value={cont} onChange={changeHandler}/>
        <button onClick={clickHandler}>확인</button>
    </>
}

export default BridgePage
```

-   iOS

```swift
import UIKit
import WebKit

class SecondViewController: UIViewController {
   
   // MARK: - properties
    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var contTextField: UITextField!
    @IBOutlet weak var connectButton: UIButton!
    
    var webview: WKWebView!
    
    // MARK: - Lifecycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupSecondView()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadurl("http://localhost:3000/bridge")     
    }
    
    // MARK: - Actions
    @IBAction func clickButton(_ sender: UIButton) {
        if self.contTextField.text?.count == 0{
            webview.evaluateJavaScript("window.dispatchEvent(titleColorChange)")
        }else{
            let contText:String = self.contTextField.text ?? ""
            webview.evaluateJavaScript("javascript:window.Native.titleHandler('\(contText)')"){(result, error)in
                print("ddd")
            }
        }
    }
    
    // MARK: - Helper
    private func setupSecondView(){
        
        let controller = WKUserContentController()
        controller.add(self, name: "colorChange")
        controller.add(self, name: "textChange")
        
        let config = WKWebViewConfiguration()
        config.userContentController = controller
        
        webview = WKWebView(frame: .zero, configuration: config)
        webView.addSubview(webview)
        
        webview.translatesAutoresizingMaskIntoConstraints = false
        webview.topAnchor.constraint(equalTo: webView.topAnchor).isActive = true
        webview.bottomAnchor.constraint(equalTo: webView.bottomAnchor).isActive = true
        webview.leadingAnchor.constraint(equalTo: webView.leadingAnchor).isActive = true
        webview.trailingAnchor.constraint(equalTo: webView.trailingAnchor).isActive = true
    }
    
    private func loadurl(_ url:String){
        guard let loadURL = URL(string: url) else{
            return
        }
        let request = URLRequest(url: loadURL)
        webview.load(request)
    }
}

extension SecondViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        switch message.name{
        case "colorChange":
            self.titleLabel.textColor = .red
        case "textChange":
            print(message.body)
            guard let title = message.body as? String else{
                return
            }
            self.contTextField.text = title
        default:
            break
        }
    }
}
```

* * *

**참고한 blog  
**[https://gradler.tistory.com/33](https://gradler.tistory.com/33)
