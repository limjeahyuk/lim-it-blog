---
title: 'TypeScript를 이용한 core서버 api 구축'
pubDate: 2022-10-21
category: study
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/56
---
회사에 들어와서 회사 코드를 보면서 공부를 했습니다. 

역시 코드는 직접 만들어 봐야 가장 잘 익힐 것 같아서 직접 만들어 보기로 결심했습니다!.

front로 들어와서 server까지 같이 만지려니까 어색하고 좀 힘들었지만...  
해야하니까!! 해봤어요!

심지어 front도 nextjs를 사용하고 back은 typescript랑 nodejs... 아우 어려우ㅓ!!

* * *

우선 대충 설명을 하자면...

next의 경우 서버와 클라이언트를 한 번에 사용할 수 있도록 해줍니다.  
하지만 저의 경우 core 서버가 따로 존재하기에 api를 한 번 더 호출 하도록 하였습니다.

기본적으로 next라면 pages 안에 api 폴더도 따로 있겠지만 저는 pages 폴더와 별개로 api 폴더를 생성했습니다.

* * *

### **next? node?**

항상 하던 대로 코어서버를 키고 client를 키려고 명령어를 쳤습니다.  
우선 저는 개발자 전용으로 켜야하기에 **npm dev**를 쳤습니다.

client가 코어서버와 이어지지 않더라구요. db가 안 불러와지는 느낌! 시작부터 어렵다..

```bash
// package.json
"scripts": {
		"dev": "next dev -p 8090",
		"debug": "node --inspect=9229 index.js",
		"build": "next build",
		"start": "node index.js",
		"prod_start": "npm run build && NODE_ENV=production node index.js"
	},
```

npm dev가 안되는 이유를 알아보기 위해 package.json을 들어가봤습니다.

뭐,... 이게 뭔지 하나도 모르겠지만... 부팀장님의 도움을 받아서 알았어요!! **^ㅁ^b**

package.json에서 보면  
"dev" 는 next로 시작합니다.  
"debug"는 node로 시작합니다.

만약 기본적인 next라면 next로 시작해도 괜찮았을 것입니다.  
하지만 위에서 설명한 대로 저희 프로젝트는 api가 pages 폴더 밖에 있습니다.

그 말인 즉슨 next로 하게 되면 api가 실행되지 않는 다는 것입니다.

그렇기에 dev로 시작했을 때 db가 호출 되지 않았던 것이고요.

node로 실행을 해줘야 client 전체 api폴더 까지 같이 실행이 됩니다.

package.json을 잘 확인해야 한다는 것과 둘의 차이점을 알았네요..

**npm start는 안되는 이유**  
개발자 모드인 dev 나 debug와 다르게  
start의 경우 진짜 모든 것을 빌드하기에 시간도 오래걸리고  
개발 할 때는 쓸모 없는 것 까지 모두 열리게 됩니다.

* * *

### **Next 파일 기반 라우트**

페이지도 열리고 서버까지 연결 했겠다. 작업을 시작하도록 하겠습니다.

![](/images/study-56/1.png)

제가 사용할 탭을 만들어 줬습니다.

위에서 말 한 것 처럼 저희 코드는 next 입니다.

이제 까지 했던 것은 REACT입니다. nextjs는 react와 완전 다른가요? 라고 하면 아닙니다.

next도 react입니다. 좀 더 편리하게 사용할 수 있도록 해주는 프레임 워크일 뿐입니다.

여러 차이점이 있겠지만 제가 느낀 큰 차이점은 **파일 기반 라우팅**입니다.

**react의 경우** url 설정을 하나하나 해줘야 했습니다.  
이 컴포넌트는 haru/lim/jea/hyuk 이런식으로 router 설정을 다 해줘야 했습니다.

**NEXTJS의 경우  
**파일 기반 라우팅으로 pages 폴더 안에 넣은 것대로 router가 설정이 됩니다.  
무슨 말이냐면... pages 폴더 안에 haru 폴더 안에 lim.js 파일이 있다면  
자동으로 haru/lim이 적용이 됩니다.

또 다른 차이점이 존재하지만 그것은 나중에 포스팅 할께요!

아무튼 탭을 만들기 위해 pages 폴더 안에 파일을 만들고 탭 부분에 추가했습니다.  
그 페이지에 우선 AppUser 테이블의 몇가지 정보를 조회해서 뿌려주도록 하겠습니다.

* * *

### **SP**

제가 예전에 node로 프로젝트를 했을 때는 코드에서 쿼리문을 하나하나 적었습니다.

하지만 여기서는 sp라는 것을 사용합니다.

```
// 전체 조회 sp 
DROP PROCEDURE IF EXISTS Account.GetTestUser;
DELIMITER //
CREATE PROCEDURE Account.GetTestUser()
BEGIN
SELECT userID, nickname, gender, birthDate, createDateTime, lastUpdateDateTime
    FROM AppUser;
END//
DELIMITER ;

call Account.GetTestUser();
```

-   DROP PROCEDURE 를 이용하여 만약에 있거나 전에 있던 같은 이름의 sp를 삭제합니다.
-   DELIMITER 의 경우 문장을 구분 해주는 것 입니다.
-   CREATE PROCEDURE 를 이용하여 sp를 만듭니다.
-   BEGIN 다음 우리가 원하는 쿼리문을 작성합니다.
-   끝났을 때는 END를 작성해줍니다.
-   call의 경우 잘 만들어졌는 지 확인 해줍니다.

* * *

### **database**

sp를 call 하는 부분을 작성했습니다.  
제가 혼자 작성했다고 해도 어느정도 회사에서 만들어 놓은 코드도 좀 있기에  
그 부분은 삭제를 하고 올리도록 할께요..!!

return connection.call<Account.userTest>("Account.GetTestUser", \[\]).then((results) => results.rows);

<> 의 경우 type을 지정해줘야합니다.  
본격적으로 typescript이기에 모든 것에 타입을 지정해줘야합니다.

타입 지정은 잠깐 넘기고 그다음 ()안에 Account.GetTestUser는 저희가 위에서 만든 sp입니다.  
call을 이용하여 호출을 했습니다.

그다음 , \[\] 의 경우 sp 에 보낼 params를 말하고 있습니다.  
sp에서도 params는 필요가 없었기에 빈 배열로 보냈습니다.

.then 그렇게 나온 결과를 return 하고 있습니다.

#### **<Account.GetTestUser>**

![](/images/study-56/2.png)

이 부분은 sp를 돌려서 나온 결과 값의 타입을 지정해주는 곳입니다.  
이 말은 즉슨 받을 결과값이 없다면 안 적어도 됩니다.

왼쪽 사진 처럼 저는 model.d.ts라는 파일에 type을 지정해줬습니다.

그냥 따로 <> 안에 적어도 상관없습니다.

userTest의 항목들을 보게 되면 sp에서 받는다고 select 옆에 적었던 항목과  
동일 하다는 것을 알 수 있습니다.

* * *

### **Controller**

여기서는 주로 params의 타입을 체크해주고 database로 보내줍니다.  
또한 어떤 방식으로 client에서 api를 보내왔는지에 따라서 나뉩니다.

```bash
export = __api({ version: "1.0.0" })
    .get<{}>((req, res) => {
        return __rewardDB.Account.connect.readonly.open((connection) => {
            return __rewardDB.Account.userTest.select(connection, {

            });
        }).then(results => {
        return results
    })
})
```

-   .get<{}>은 역시 params가 없기에 빈칸으로 나뒀습니다.
-   Account.userTest.select가 database로 보내는 구간입니다.

* * *

### **api**

드디어 클라이언트로 넘어갑니다.

```bash
get: async (req, res) => {
        try {
            let params = {
                path: "/account/user/test",
            };
            const result = await client.get(params);
            res.status(200);
            res.json(result.data);
        } catch (err) {
            __logging.error(err.toString());
            res.status(err.statusCode || 500);
            res.json(err.body || { message: err.message });
        }
    },
```

-   get 방식으로 api를 보낼 것입니다.
-   controller의 /account/user/test의 get 방식으로 찾아서 보냅니다.

* * *

### **pages**

```bash
const getUserTest = async () => {
    const result = await client.get({
      path: "/api/haru/lim",
    });
    if (result.ok) {
        console.log("ddd");
      setData(result.json);
    } else {
      alert("전체조회 실패");
    }
  };
```

-   항상 보던 api를 보내는 함수입니다.
-   전체 조회를 먼저 해야하기에 async await를 이용하여 동기로 불러왔습니다.

* * *

### **결과**

![](/images/study-56/3.png)

대충 이정도로 만들 수 있었습니다.  
여러가지 기능도 했지만...  
database나 controller 코드를 올리기는 좀 부담이 있기에... sp 만 올리도록 할께요!

* * *

### **여러가지 SP**

#### **Filter sp**

```
DROP PROCEDURE IF EXISTS Account.FilterTestUser;
DELIMITER //
CREATE PROCEDURE Account.FilterTestUser(
IN _searchType varchar(32),
IN _searchText varchar(32)
)
BEGIN

    SELECT userID, nickname, gender, birthDate, createDateTime, lastUpdateDateTime
    FROM AppUser
        where IF(_searchText IS NULL OR LENGTH(_searchText) < 1, TRUE,
            (IF(_searchType = 0, userID like CONCAT('%', _searchText , '%'),
                nickname like CONCAT('%', _searchText, '%'))));
END//
DELIMITER ;

call Account.FilterTestUser(0, '');
```

-   생성을 할 때 ( 괄호 ) 안에 받아올 params를 지정해줍니다.
-   where문에 IF를 사용해서 먼저 searchText가 null이거나 아무 값이 없다면 모든 것을 조회해줍니다.
-   만약 값이 있다면 searchType이 0인가 1인가 확인을 하고 그거에 맞춰서 검색을 합니다.

**Insert SP**

```
DROP PROCEDURE IF EXISTS Account.InsertUserData;
DELIMITER //
CREATE PROCEDURE Account.InsertUserData(
IN _appID varchar(32),
IN _userID varchar(32),
IN _nickName varchar(64),
IN _gender varchar(1),
IN _birthDate varchar(8),
IN _inviteCode varchar(10),
IN _state tinyint,
IN _createDateTime datetime(3),
IN _lastUpdateDateTime datetime(3),
IN _intro varchar(100),
IN _phone varchar(11),
IN _email varchar(128)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
ROLLBACK;
            RESIGNAL;
        END;
    START TRANSACTION ;
    INSERT INTO AppUser(appID, userID, nickname, gender, birthDate, inviteCode, state, createDateTime, lastUpdateDateTime, intro)
        VALUE (_appID, _userID, _nickName, _gender, _birthDate, _inviteCode, _state, _createDateTime, _lastUpdateDateTime, _intro);

        INSERT INTO User(userID, appID, provider, providerUserID, uniqueID, phone, phoneVerified, email, emailVerified, state, createDateTime, lastUpdateDateTime)
        VALUE (_userID, _appID, '123','1234','12345',_phone,'1',_email,'1',_state,_createDateTime, _lastUpdateDateTime);
    COMMIT ;
END//
DELIMITER ;

call Account.InsertUserData('221', 'i4', '쭈1니', '여', '19980203', '123', '1','2022-10-04 13:46:31','2022-10-04 13:46:31','바보','01098767898','kdidk@naver.com');
```

-   삽입의 경우 테이블 두 개에 따로 나눠서 insert를 해줘야 했습니다.  
    그렇기에 transaction을 사용해서 진행했습니다.
-   TRANSACTION을 제외하고는 나머지는 다 같습니다.  
    받아온 값들을 잘 배치하여 INSERT를 두 번 해줬습니다.
-   항상 끝날 때는 COMMIT을 해줘야합니다!!!  
    한 번 안했다가 transaction에서 오류가 계속 뜨고 강제 종료하느라 혼났어요...

**Update SP**

```
DROP PROCEDURE IF EXISTS Account.UpdateUserData;
DELIMITER //
CREATE PROCEDURE Account.UpdateUserData(
IN _userID varchar(32),
IN _nickname varchar(64),
IN _gender varchar(1),
IN _birthDate varchar(8),
IN _intro varchar(100),
IN _now DATETIME(3),
IN _state tinyint,
IN _phone varchar(11),
IN _email varchar(128)
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
ROLLBACK;
            RESIGNAL;
        END;

    START TRANSACTION ;
    UPDATE Account.AppUser
        SET nickname = IFNULL(_nickname,nickname),
            gender = IFNULL(_gender,gender),
            birthDate = IFNULL(_birthDate,birthDate),
            intro = IFNULL(_intro,intro),
            AppUser.state = IFNULL(_state,state),
            AppUser.lastUpdateDateTime = _now
    WHERE AppUser.userID = _userID;

    UPDATE  Account.User
        SET phone = IFNULL(_phone,phone),
            email = IFNULL(_email,email),
            User.state = IFNULL(_state,state),
            User.lastUpdateDateTime = _now
        WHERE User.userID = _userID;

    COMMIT ;
END//
DELIMITER ;

call Account.UpdateUserData('r4','혁쨩','남',null,'바보','2022-10-19 08:29:47.602',2,null,'ghks@naver.com');
```

-   insert와 마찬가지로 transaction을 사용했습니다.
-   나머지는 다 같네요...

**Delete sp**

```bash
DROP PROCEDURE IF EXISTS Account.DeleteUserTest;
DELIMITER //
CREATE PROCEDURE Account.DeleteUserTest(
IN _userID varchar(32)
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
ROLLBACK;
            RESIGNAL;
        END;

    START TRANSACTION ;
    DELETE FROM Account.AppUser
        where userID = _userID;

    DELETE FROM Account.User
        where userID= _userID;
    COMMIT;
END//
DELIMITER ;

call Account.DeleteUserTest('i4');
```

-   트렌잭션을 사용하여 두가지 일을 한번에 했습니다.
