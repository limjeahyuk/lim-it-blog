---
title: '[Tumbl] React CKeditor  적용. + 이미지'
pubDate: 2022-08-29
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/54
---
![](/images/react-54/1.png)

위와 같은 에디터를 만들고 싶었습니다.

input type='text'로는 한계가 있기에 editor를 설치하여 image와 글씨체 등등 여러 가지를 db에 넣고 project 페이지 띄우고 싶었습니다.

대개 ckediter는 class 형 으로 많이들 해서 많은 어려움이 있었습니다..

[https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/react.html](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/react.html)

 [React component - CKEditor 5 Documentation

Learn how to install, integrate and configure CKEditor 5 Builds and how to work with CKEditor 5 Framework, customize it, create your own plugins and custom editors, change the UI or even bring your own UI to the editor. API reference and examples included.

ckeditor.com](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/react.html)

기본적으로 제공하는 툴 조차도 class 형이었기 때문에 함수형을 선호하는 저로써는 매우 어려웠습니다...

```javascript
import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = () => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data="<p>Hello World</p>"
            onReady={editor => {
                // console.log('Editor is ready to use!', editor);
            }}
            
            onChange={(event, editor) => {
                const data = editor.getData();
            }}
            
            onBlur={(event, editor) => {
                // console.log('Blur.', editor);
            }}
            
            onFocus={(event, editor) => {
                // console.log('Focus.', editor);
            }}/>
    )
}

export default Editor
```

기본 틀을 함수형으로 사용하는 것을 찾아서 에디터 배치에는 성공했지만./.. 가장 큰 문제!!

기본 제공하는 에디터에는 이미지는 없다는 사실..

이미지를 추가하려면 plugin이라던가 editor 자체를 커스텀해야 했습니다.

커스텀하는 것은 여러 번 하다가 실패를 해서 plugin을 하는 방식을 채택했습니다.

UploadAdapter.js

```javascript
import React from "react";

export default class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(file => new Promise(((resolve, reject) => {
    
            this._initRequest();
            this._initListeners( resolve, reject, file );
            this._sendRequest( file );
        })))
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        console.log(xhr)
        xhr.open('POST', 'http://localhost:3000/img', true); // 이미지를 서버에 보내기
        xhr.responseType = 'text';
    }

    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = '파일을 업로드 할 수 없습니다.'

        xhr.addEventListener('error', () => {reject(genericErrorText)})
        xhr.addEventListener('abort', () => reject())
        xhr.addEventListener('load', () => {
            const response = xhr.response
            console.log(response);
            if(!response || response.error) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            resolve({
                default: response //업로드된 파일 주소
            })
        })
    }

    _sendRequest(file) {
        console.log(file)
        const data = new FormData()
        data.append('img',file)
        this.xhr.send(data) // formdata를 이용하여 img 저장.
    }
}
```

uploadAdapter.js 파일을 만들어 줬습니다./

함수형으로 하는 것은 도저히 찾을 수도 만들 수 도 없었기에 class 형으로 js를 만들었습니다.

이것 또한 문제가 꽤 있었지만... console.log(response)를 찍어서 default에 정확한 주소를 넣어줌으로써 성공했습니다.

Editer.js

```javascript
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './Editor.css'
import UploadAdapter from './UploadAdapter';

const Editor = ({editorChangeHandler, editorData}) => {
   

    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new UploadAdapter(loader)
        }
    }

    return <CKEditor
        
        config={{
            extraPlugins: [MyCustomUploadAdapterPlugin]
        }}
            editor={ ClassicEditor }
            data={editorData}
            onReady={ editor => {
                // You can store the "editor" and use when it is needed.
                console.log('Editor is ready to use!', editor);
                console.log(editor.getData())
            } }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                editorChangeHandler(data);
            } }
            onBlur={ ( event, editor ) => {
                // console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
                // console.log( 'Focus.', editor );
            } }
        />
}

export default Editor;
```

이렇게 두 개의 js를 만들어 주고 원하는 위치에 넣어주기만 하면

```javascript
 <div className={classes.editor}>
                    <Editor editorChangeHandler={onEditerChange} editorData={data.contents} />
                </div>
```

![](/images/react-54/2.png)

원하는 대로 작동하는 것을 볼 수 있습니다.

옆에 콘솔을 보면 <img src = "주소" />로 잘 나옵니다.

만약 img 주소를 default에 잘 넣어주지 않게 되면 이미지는 나오지만  
콘솔에는 <img />라고만 나오고 잘 작동을 하지 않는 모습을 보일 것입니다.! (경험담)
