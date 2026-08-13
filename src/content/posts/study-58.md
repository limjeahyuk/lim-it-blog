---
title: '[ MySQL ] 여러 가지 정보들'
pubDate: 2022-11-11
category: study
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/58
---
### 프로시저

#### 프로시저란?

프로시저란 SQL server 에서 제공하는 프로그래밍 기능입니다.  
쿼리문을 마치 하나의 메서드 형식으로 만들고 어떠한 동작을 일괄적으로 처리하는 용도로 사용.

쿼리문이 항상 짧은 것이 아니라 여러개의 테이블을 조인하고 거기에 조건도 넣어줌으로써  
하나의 쿼리가 엄청나게 긴 쿼리문이 생기게 됩니다.

이러한 여러개의 쿼리를 사용할 때 마다 코드에 작성해주면 너무 불편하고 코드 자체도 너무 길어지기 때문에  
프로시저에 저장하고 저장된 프로시저를 호출하여 프로그래밍을 하는 것이 훨씬 효율적입니다.

#### 프로시저 장점

1.  하나의 요청으로 여러 sql문을 실행 할 수 있습니다.
2.  네트워크 소요 시간을 줄일 수 있습니다.
    -   만약 동일한 쿼리를 1000번 2000번 호출하는 것보다 sp를 이용해서 구현한다면 sp를 호출할 때  
        한 번만 네트워크를 경유하기 때문에 네트워크 소요시간을 줄이고 성능을 개선할 수 있습니다.
    -   sp : Stored PROCEDURE
3.  개발 업무를 구분 해서 개발 가능합니다.
    -   DBMS 개발하는 조직에서는 데이터베이스 관련 처리하는 SP를 만들어 API 처럼 제공하고  
        애플리케이션 개발자는 SP를 호출하여 사용하는 형식으로 역할을 구분해서 개발 가능합니다.

#### 프로시저 단점

1.  처리 성능이 낮습니다.
    -   문자나 숫자 연산에 저장 프로시저를 사용한다면 오히려 c나 java보다 느린 성능을 가집니다.
2.  디버깅이 어려움
3.  DB확장이 매우 힘듦
    -   서비스 사용자가 많아져 서버수를 늘려야할 때 DB 수를 늘리는 것보다 WAS의 수를 늘리는 것이  
        더 효율 적입니다.
    -   대부분의 개발에서는 DB에는 최소한의 부담만 주고 대부분의 로직은 WAS에서 처리할 수 있게 합니다.

#### 프로시저 작성 .sql

```bash
DROP PROCEDURE IF EXISTS Account.admin_SelectAppSettings;

DELIMITER //
CREATE PROCEDURE Account.admin_SelectAppSettings (
    IN _appID             VARCHAR(32)
)
BEGIN

        SELECT appID, settings
        FROM Account.AppSettings
        WHERE appID = _appID;

END //
DELIMITER ;
```

* * *

### WAS ?

#### Web Application Server

DB 조회나 다양한 로직 처리를 요구하는 동적인 컨텐츠를 제공하기 위해 만들어진 Application Server HTTP를 통해  
컴퓨터나 장치에 애플리케이션을 수행해주는 미들웨어 이다.

#### WAS 역할

WAS = WebServer + WebContainer

WebServer 기능들을 구조적으로 분리하여 처리하고자 하는 목적으로 제시.  
\> 분산 트랜잭션, 보안, 메시징, 쓰레드 처리 등의 기능을 처리하는 분산 환경에서 사용  
\> 주로 DB 서버와 같이 수행.

#### WAS 의 주요 기능

1.  프로그램 실행 환경과 DB 접속 기능 제공
2.  여러 개의 트랜잭션 관리
3.  업무를 처리하는 비즈니스 로직 수행.

#### WAS가 필요한 이유

1.  웹 페이지는 정적 컨텐츠와 동적 컨텐츠가 모두 존재.
    1.  사용자의 요청에 맞게 적정한 동적 컨텐츠를 만들어 제공
    2.  만약 Web Server만을 이용한다면 사용자가 원하는 요청에 대한 결과값을 모두 미리 만들어 놓고 서비스를 해야합니다.
    3.  하지만 이렇게 수행하기에는 자원이 부족
2.  WAS를 통해 요청에 맞는 데이터를 DB에서 가져와서 비즈니스 로직에 맞게 그때 그때 결과를 만들어서 제공함으로써  
    자원을 효율적으로 사용할 수 있다.

#### WAS가 Web Server의 기능도 모두 수행하면?

1.  기능을 분리하여 서버 부하 방지.
    1.  WAS는 DB 조회나 다양한 로직을 처리하느라 바쁘기 때문에 단순한 정적 컨텐츠는 Web Server에서  
        빠르게 클라이언트에 제공하는 것이 좋다.
    2.  WAS는 기본적으로 동적 컨텐츠를 제공하기 위해 존재하는 서버
    3.  만약 정적 컨텐츠 요청까지 WAS가 처리한다면 정적 데이터 처리로 인해 부하가 커지게 되고  
        동적 컨텐츠의 처리가 지연됨에 따라 수행 속도가 느려짐.
    4.  페이지 노출 시간이 늘어남.
2.  물리적으로 분리하여 보안 강화
    1.  SSL에 대한 암복호화 처리에 Web Server를 사용.

즉, **자원 이용의 효율성 및 장애 극복, 배포 및 유지보수의 편의성** 을 위해 Web Server 와 WAS 를 분리한다.

**Web Server를 WAS 앞에 두고 필요한 WAS들을 Web Server에 플러그인 형태로 설정하면 더욱 효율적인 분산 처리가 가능하다.**

* * *

#### SQL Security 옵션

DEFINER : 스포어드 프로그램이 기본적으로 가지는 옵션. stored 프로그램을 작성한 유저. 프로그램이 실행 될 때의 권한.  
SQL Security 옵션 : 프로그램을 실행할 때 누구의 권한으로 실행할지 결정하는 옵션입니다.

Definer / sp가 기본적으로 가지는 옵션. sp를 생성한 사용자를 의미합니다. ( 기본값 )  
Invoker / 해당 프로그램을 호출한 사용자를 의미합니다.

DEFINER는 모든 stored 프로그램이 기본적으로 가지는 옵션.  
SQL Security 옵션은 stored PROCEDURE와 stored 함수, View 만 가질 수 있습니다.

```bash
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

어떤 사용자가 정의하든 상관없이 프로시저에는 'admin'@'localhost'의 DEFINER 계정이 할당됩니다.  
기본 보안 특성이 DEFINER이기 때문에  
어떤 사용자가 호출 했는지에 관계 없이 해당 계정의 권한으로 실행 됩니다.

```bash
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

프로시저에는 여전히 'admin'@'localhost'의 DEFINER가 있지만  
이 경우 호출하는 사용자의 권한으로 실행됩니다.  
따라서 호출자에 대한 권한과 테이블에 대한 권한이 있는지 여부에 따라 프로시저가 성공하거나 실패합니다.

* * *

### 쿼리문

#### 중복키 제약 조건에 위배 되었을 때

**DUPLICATE KEY**

데이터 삽입 시, 중복키 제약 조건에 위배 되면 ON DUPLICATE KEY UPDATE 아래에 지정한 필드가 수정됩니다.

```bash
INSERT INTO member (NAME, price, cnt) VALUES ('kim', 1000, 0) 
ON DUPLICATE KEY UPDATE 
  price = price * 2, 
  cnt = cnt + 1;
```

name 값이 중복이 된다면 price와 cnt가 수정이 되게 됩니다.

사용하기 위해서는 테이블에 PRIMARY KEY 혹은 UNIQUE index가 필요합니다.

**INSERT IGNORE**

중복키 제약조건에 위배되면 Insert 를 무시합니다.

```bash
INSERT IGNORE INTO member (NAME, price, cnt) VALUES ('kim', 1000, 0);
```

신규로 입력되는 레코드를 무시하는 방식입니다.  
처음 값은 무조건 유지를 한다는 차이점이 있습니다.

**REPLACT INTO**

중복키 제약조건에 위배되면 해당 레코드를 삭제하고 다시 삽입합니다.

```bash
REPLACE INTO member (NAME, price, cnt) VALUES ('kim', 1000, 0);
```

전에 데이터가 삭제되고 다시 삽입됩니다.  
AUTO\_INCREMENT로 ID값을 지정했더라면 ID값이 변합니다.

* * *

#### 변수 선언

프로시저에서 변수를 선언할 때 사용합니다.

```bash
DECLARE _count INT;
```

DECLARE \_(@)변수명 데이터 형식;  
변수 범위는 선언된 시점부터 이를 선언했던 sp가 끝날 때 까지 계속 됩니다.

변수 값 설정

변수가 처음 선언되면 그 값은 NULL로 설정됩니다.

변수에 값을 할당하려면 SET 문을 사용합니다.

```bash
DECLARE @Name VARCHAR(50), @Age INT;

SET @Name = 'GGMOUSE';
SET @Age = 10;
```

* * *

#### DECLARE EXIT HANDLER FOR SQLEXCEPTION

```bash
BEGIN
        DECLARE _now DATETIME(3) DEFAULT NOW(3);
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT
                FALSE AS `result`,
                323305896 AS `status`,
                NULL AS `balance`; #Exception
        END;
```

에러가 났을 때 바로 밑에 BEGIN ~ END 구문을 실행 후 sp를 종료합니다.

#### DECLARE CONTINUE GANDLER FOR SQLEXCEPTION

```bash
DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    -- 여기에 에러 처리 구문 추가
  END;
```

에러가 났을 때 에러 처리 구문 실행 후 다음 쿼리를 계속 실행합니다.

#### DECLARE ... HANDLER 구문 분석

```bash
DECLARE [handler_action] HANDLER [condition_value] [statement]
```

\[handler\_action\]

-   CONTINUE : 계속 진행.
-   EXIT : 중지 , 종료

\[condition\_value\]

-   mysql\_error\_code : MySQL 에러 코드 ( number 값 )
-   SQLSTATE \[VALUE\] :  
    5자리의 문자로 정의 된 , SQL상태값  
    ' 00 ' 으로 시작하는 경우가 정상.  
    SQLSTATE는 ODBC 에서 정의된 상태값이므로, mysql의 에러 코드와 100% 매칭되지는 않음.
-   condition\_name : 미리 정의한 조건의 상수값.

예) mysql 에러코드 1051 발생시의 에러

```bash
DECLARE CONTINUE HANDLER FOR 1051
  BEGIN
  -- body of handler
  END;
```

또는

```bash
DECLARE no_such_table CONDITION FOR 1051;
DECLARE CONTINUE HANDLER FOR no_such_table
  BEGIN
  -- body of handler
  END;
```

-   SQLWARNING : SQLSTATE 값이 '01'로 시작하는 경우
-   NOT FOUND : SQLSTATE 값이 '02'로 시작하는 경우
-   SQLEXCEPTION : SQLSTATE값이 '00', '01', '02'로 시작하지 않는 경우

\[statement\] : 조건 만족시 실행할 구문

주의 사항  
\[statement\] 위치에 ITERATE 또는 LEAVE 구문을 사용할 수 없음.

* * *

#### SELECT INTO

```bash
Select count(*) into _count from …
```

select 해서 나온 결과를 \_count에 넣어줍니다,

기본적으로 한 테이블에서 새로운 테이블로 정보를 복사할 때 사용합니다.

* * *

#### DATE

시간 더하기  
DATE\_ADD ( 기준 날짜, INTERVAL )

시간 빼기  
DATE\_SUB ( 기준 날짜, INTERVAL )

예시 )

```bash
SELECT DATE_ADD(NOW(), INTERVAL 1 SECOND);
```

현재 시간에서 1초를 더하는 구문입니다.  
1 분 > 1 MINuTE  
1시간 > 1 HOUR  
...

#### CONVERT\_TZ

타임존 변경

DB에서 현재 시간을 저장하면 9시간 전으로 저장되는 경우가 있습니다.  
그럴 때 타임존을 변경하여 저장하면 제 시간에 맞춰서 저장이 됩니다.

```bash
CONVERT_TZ(NOW(),'+00:00','+09:00')
```

타임존을 9시간 후로 저장해주세요.

* * *

#### FIND\_IN\_SET

콤마로 구분되어 있는 문자열에서 매칭되는 문자가 있는 지 확인 후, 몇 번째에 있는 지 값을 리턴합니다.

```bash
FIND_IN_SET('b', 'a,b,c,d')
```

'a, b, c, d'로 되어 있는 문자열 중에서 'b'는 몇번 째에 있나요?  
\-> 2  
만약 없다면 0 을 리턴합니다.

* * *

#### 소수점 관련 함수

**ROUND 반올림.**  
ROUND(2.372) => 2  
ROUND(2.372, 1) => 2.4  
ROUND(2.372, 2) => 2.37

**CEILING 올림**  
CEILING(2.372) => 3

**FLOOR** **내림**  
FLOOR(2.372) => 2

**Round와는 다르게 올림과 내림 자릿수는 정할 수 없습니다.**

**TRUNCATE() 버림 함수  
**TRUNCATE(100.123, 0) => 100  
TRUNCATE(100.123, 1) => 100.1  
TRUNCATE(101.123, -1) => 100

* * *

#### 형변환 함수

CAST ( 변환하고 싶은 데이터 as 데이터 형식 \[ (길이) \] )  
CONVERT ( 변환하고 싶은 데이터 , 데이터 형식 \[ (길이) \] )

둘 다 데이터 형식을 변환 시켜주는 함수입니다.

* * *

#### 연산자

변수 := a  
변수에 a를 대입합니다.

같지 않음을 표현하는 연산자  
!= , ^= , <> , NOT 컬럼명 =

* * *

#### 파티션

**파티션이란?**

크기가 큰 테이블에 쿼리를 수행할 때, 인덱스를 사용한다 하더라도, 테이블의 크기가 매우 크다면 상당한 부하가 걸리게 됩니다.  
mysql은 크기가 큰 테이블을 물리적으로 여러개를 분할하는 **파티션** 기능을 제공합니다.

**파티션 형식**

mysql 파티션은 네가지 방법이 있습니다

-   Range - 범위 ( 날짜 등 )을 기반으로 파티션을 나눕니다. # 가장 흔히 사용합니다.
-   List - 코드나 카테고리 등 특정 값을 기반으로 파티션을 나눕니다.
-   Hash - 설정한 HASH 함수를 기반으로 파티션을 나눕니다. # Range, List 사용이 애매할 때
-   Key - MD5() 함수를 이용한 HASH 값을 기반으로 파티션을 나눕니다. # HASH 보다 균등

Range를 이용한 파티션의 예시

```bash
CREATE DATABASE testDB;
USE testDB;

CREATE TABLE userTable (
    userID CHAR(12) NOT NULL
    birthYear INT NOT NULL )
    
PARTITION BY RANGE(birthYear) (
PARTITION part1 VALUE LESS THAN (1970),
PARTITION part2 VALUE LESS THAN (1980),
PARTITION part3 VALUE LESS THAN (1990),
PARTITION part4 VALUE LESS THAN MAXVALUE
);
```

-   PARTITION BY RANGE로 지정하면 해당 열에 따라 지정된 파티션으로 테이블이 분할 됩니다.
-   RANGE의 열은 INT 또는 DATE 형식이어야 합니다.
-   위의 코드에서 보면 birthYear이 1970이하면 part1, 1971 ~ 1979면 part2  
    1980 ~ 1989 면 part3, 1990 ~ 이면 part4로 저장했습니다.

파티션을 사용하게 되면 원하는 년도의 데이터만 조회하고 나머지는 접근하지 않으니  
더욱 효율적인 조회를 했다고 볼 수 있습니다.

**파티션 수정**

```bash
ALTER TABLE userTable
    REORGANIZE PARTITION part4 INTO (
        PARTITION part4 VALUES LESS THAN (2000),
        PARTITION part5 VALUES LESS THAN (MAXVALUE)
    );
```

-   파티션 추가할 때는 ADD를 사용하면 되지만 part4가 max이기 때문에 수정해야합니다.

**주의할 점**

-   파티션 테이블에는 외래 키를 설정할 수 없습니다.
-   Primary Key, Unique Key가 존재하는 테이블에서는  
    반드시 파티션에서 사용되는 열도 PK, UK 중 한가지로 사용해야합니다.
-   sp, 스토어드 함수, 사용자 변수 등을 파티션 식에 사용할 수 없습니다.
-   임시 테이블은 파티션을 사용할 수 없습니다.
-   파티션 키에는 일부 함수만 사용할 수 있습니다.
-   MySQL은 파티션 개수 최대 1024개까지 지원합니다.
-   레인지 파티션은 연속된 범위를 사용하고 리스트 파티션은 연속되지 않은 값을 사용합니다.

* * *

#### 트리거

**트리거란?**

Table에 어떤 신호가 가해졌을 때 **미리 정해진 활동이 자동으로 실행** 되는 것  
구체적으로 특정 테이블에 INSERT, DELETE, UPDATE 같은 'DML' 문이 수행 될 때, 데이터베이스에서 자동으로 동작  
사용자 호출 필요없이 자동으로 동작합니다.

**기본 구조**

```bash
DELIMITER $$
	CREATE TRIGGER trigger_name
	{BEFORE | AFTER} {INSERT | UPDATE| DELETE }
	ON table_name FOR EACH ROW
	BEGIN
		-- 트리거 내용
	END
DELIMITER ;
```

**종류**

행 트리거 : 테이블의 행이 각각 실행됩니다.  
문장 트리거 : INSERT, DELETE, UPDATE 문에 대해서 한 번만 실행됩니다.

**이벤트 속성**

-   트리거 작동 시점
    -   After : 이벤트 발생 이후 트리거 실행
    -   befor : 이벤트 발생 이전 트리거 실행
-   이벤트
    -   Delete : 삭제했을 때 트리거 실행
    -   Insert : 삽입했을 때 트리거 실행
    -   Update : 업데이트 했을 때 트리거 실행
-   ex)
    -   before delete on A  
        A 테이블에서 데이터가 삭제 되기 전에 트리거 실행
    -   after insert on B  
        B 테이블에서 데이터가 삽입 된 이후에 트리거 실행
-   키워드
    -   OLD
        -   예전 데이터
        -   delete로 삭제된 데이터
        -   update로 바뀌기 전의 데이터
    -   NEW
        -   새 데이터
        -   insert로 삽입된 데이터
        -   update로 바뀐 후의 데이터
-   ex)

```bash
DELIMITER //
CREATE TRIGGER check_removed_name
	AFTER DELETE 			
	ON user_address_table		
    FOR EACH ROW			

-- 테이블에 백업데이터 삽입
BEGIN
	INSERT INTO removedName
		VALUES (OLD.ID, OLD.Name, OLD.Address, CURDATE() );
END
// DELIMITER ;
```

-   user\_address\_table에서 삭제 이벤트가 발동한 이후에 트리거가 작동합니다.
-   removedName 테이블에 자동으로 삭제되기 전 ID, Name, Address, CURDATE(현재날짜)를 삽입합니다.
