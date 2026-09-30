---
author: student
title: "ReactQuery "
slug: reactquery
description: "2026 ReactQuery "
heroImage: https://res.cloudinary.com/m1zcmsux/image/upload/c_limit,f_auto,q_auto,w_1600/v1790727981/fj71fod5pxq1lahq6vib.png
pubDate: 2026-09-29
draft: false
secret: false
---
## React Query ( TanStack Query )

> 2026 최신에는 React 뿐 아니라 다른 여러 환경에서 ReactQuery를 사용하기 위해서 이름을 TanStack Query로 변경했습니다.



React 개발을 하다 보면 가장 큰 고민 중 하나는 바로 상태 관리와 서버 통신입니다.

그리고 프론트를 하다보면 화면 구성은 비교적 쉽게 하겠는데 서버 통신에서 생각보다 애를 먹기도 합니다.



과거에는 Redux와 useEffect를 조합해서 데이터를 가져오고 로딩과 에러 상태를 수동으로 관리했습니다.

이는 엄청나게 반복되는 코드로써 보일러 플레이트를 유발햇씁니다.



이러한 문제를 우아하게 해결하며 프론트엔드 생태계의 사실상 표준으로 자리 잡은 기술이 React Qeury 입니다.

### React Query를 사용하는 이유

React Query가 등장한 가장 근본적인 이유는 프론트엔드 애플리케이션의 상태를 클라이언트 상태와 서버 상태로 분리하기 위함입니다.



<div class="table-wrap"><table style="min-width: 213px;"><colgroup><col style="width: 163px;"><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><td colspan="1" rowspan="1" colwidth="163"><p><strong>구분</strong></p></td><td colspan="1" rowspan="1"><p><strong>클라이언트 상태 (Client State)</strong></p></td><td colspan="1" rowspan="1"><p><strong>서버 상태 (Server State)</strong></p></td></tr><tr><td colspan="1" rowspan="1" colwidth="163"><p><strong>정의</strong></p></td><td colspan="1" rowspan="1"><p>브라우저 안에서만 유효한 동적 데이터</p></td><td colspan="1" rowspan="1"><p>데이터베이스 등 서버에 저장된 데이터</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="163"><p><strong>특징</strong></p></td><td colspan="1" rowspan="1"><p>항상 최신 상태 (동기적), 클라이언트가 완전한 통제권을 가짐</p></td><td colspan="1" rowspan="1"><p>비동기적이며, 여러 사용자가 공유하므로 언제든 '오래된 데이터(Stale)'가 될 수 있음</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="163"><p><strong>예시</strong></p></td><td colspan="1" rowspan="1"><p>모달 창 열림/닫힘, 다크모드 여부, 입력 폼 텍스트</p></td><td colspan="1" rowspan="1"><p>게시글 목록, 사용자 프로필 정보, 댓글</p></td></tr><tr><td colspan="1" rowspan="1" colwidth="163"><p><strong>도구</strong></p></td><td colspan="1" rowspan="1"><p>Zustand, Context API, Redux</p></td><td colspan="1" rowspan="1"><p><strong>React Query</strong>, SWR</p></td></tr></tbody></table></div>



React Query는 관리가 까다롭고 지속적인 동기화가 필요한 서버 상태 관리를 전담하여, 프론트엔드 코드의 복잡도를 획기적으로 낮춰줍니다.

### React Query 의 핵심 기능

React Query를 도입하면 다음과 같은 강력한 이점을 얻을 수 있습니다.

1. 강력한 캐싱
   - 한 번 가져온 데이터를 메모리에 저장하고ㅡ 지정한 시간 동안 동일한 요청이 들어오면 서버를 거치지 않고 캐시된 데이터를 즉시 보여줍니다.
2. 자동 동기화
   - 사용자가 브라우저 탭을 다시 포커스하거나 네트워크가 재연결될 때 백그라운드에서 자동으로 최신 데이터를 가져옵니다.
3. 상태 관리 자동화
   - 데이터를 가져오는 중, 실패 등의 비동기 라이프사이클 상태를 기본으로 제공하여 useState 남발을 막아줍니다.
4. 낙관적 업데이트
   - 서버 응답을 기다리지 않고 UI를 먼저 성공한 것 처럼 업데이트하여 압도적인 사용자 경험을 제공합니다.

### 데이터 생명 주기

Reaact Query가 캐시된 데이터를 관리하는 라이프 사이클은 크게 5가지 상태로 나뉩니다.

- Fetching
  - 서버에서 데이터를 가져오고 있는 로딩 상태
- Fresh
  - 데이터가 막 도착하여 가장 신성한 상태입니다.
  - 이 기간에는 컴포넌트가 다시 마운트되어도 서버에 재 요청을 하지 않습니다.
- Stale
  - 데이터가 낡은 상태입니다.
  - 기본적으로 데이터를 받아오는 즉시 Stale 상태가 되며, 이상태의 데이터는 화면에 보여지면서 동시에 백그라운드에서 조용히 서버에 최신 데이터를 다시 요청합니다.
- Inactive
  - 해당 데이터를 사용하는 컴포넌트가 화면에서 사라져 데이터가 쓰이지 않는 상태입니다.
- Deleted
  - Inactive 상태로 일정 시간이 지나면 가비지 컬렉터에 의해 메모리에서 완전히 사라집니다.

### 기본 사용법

#### useQuery ( GET )

서버에서 데이터를 조회할 때는 useQuery 훅을 사용합니다.

```javascript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function TodoList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['todos'], // 이 키를 기반으로 캐싱합니다.
    queryFn: () => axios.get('/todos').then(res => res.data),
  });

  if (isLoading) return <span>로딩 중...</span>;
  if (isError) return <span>에러 발생: {error.message}</span>;

  return (
    <ul>
      {data.map(todo => <li key={todo.id}>{todo.title}</li>)}
    </ul>
  );
}
```

#### useMutation ( POST , PUT , DELETE )

데이터를 생성 수정 삭제할 때는 useMutation 훅을 사용합니다.

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function AddTodo() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newTodo) => axios.post('/todos', newTodo),
    onSuccess: () => {
      // 추가 성공 시, 기존 'todos' 캐시를 무효화하여 목록을 다시 불러오게 만듭니다.
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ title: '새 할 일' })}>
      할 일 추가
    </button>
  );
}
```

### Query Key Factory 패턴

queryKey는 데이터를 고유하게 식별하고 언제 리페치 할 지 결정하는 가장 중요한 식별자입니다.

프로젝트가 커지면 키 관리가 어려워지므로 실무에서는 Query Key Factory 패턴을 활용해 키를 구조화 합니다.

#### 팩토리 정의

```
// queries/todoKeys.js
export const todoKeys = {
  all: ['todos'],
  lists: () => [...todoKeys.all, 'list'],
  list: (filters) => [...todoKeys.lists(), { filters }],
  details: () => [...todoKeys.all, 'detail'],
  detail: (id) => [...todoKeys.details(), id],
};
```

이 패턴을 사용하면 데이터를 수정하고 나서 무효화(Invalidation)를 할 때 매우 정교한 제어가 가능합니다.

- `queryClient.invalidateQueries({ queryKey: todoKeys.all })`: 게시물 관련 모든 쿼리(리스트, 상세) 무효화
- `queryClient.invalidateQueries({ queryKey: todoKeys.lists() })`: 리스트 쿼리들만 무효화 (상세 페이지 캐시는 유지)
- `queryClient.invalidateQueries({ queryKey: todoKeys.detail(5) })`: 특정 5번 게시물만 정확히 무효화

### 낙관적 업데이트 구현

좋아요 버튼이나 장바구니 수량 조절처럼 결과를 쉽게 예측할 수 있는 액션은, 서버 응답을 기다리지 않고 UI를 먼저 조작하는 낙관적 업데이트를 적용하면 좋습니다.

```javascript
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

function LikeButton({ postId }) {
  const queryClient = useQueryClient();
  const queryKey = ['post', postId];

  const { data: post } = useQuery({
    queryKey,
    queryFn: () => axios.get(`/posts/${postId}`).then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: () => axios.post(`/posts/${postId}/like`),

    onMutate: async () => {
      // 1. 기존 페칭 요청 취소 (레이스 컨디션 방지)
      await queryClient.cancelQueries({ queryKey });

      // 2. 에러 롤백을 위해 이전 데이터 백업
      const previousPost = queryClient.getQueryData(queryKey);

      // 3. UI 즉각 업데이트 (캐시 데이터 직접 수정)
      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        likes: old.likes + 1,
      }));

      return { previousPost };
    },

    onError: (err, variables, context) => {
      // 4. 에러 발생 시 백업해둔 데이터로 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(queryKey, context.previousPost);
      }
    },

    onSettled: () => {
      // 5. 성공/실패 여부 무관하게 최종적으로 서버 상태와 동기화
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <button onClick={() => mutation.mutate()}>
      ❤️ {post?.likes ?? 0}
    </button>
  );
}
```

> 주의점 : 낙관적 업데이트는 결제 상태 변경처럼 중요한 비즈니스 로직에는 적합하지 않으며, 실패했을 때의 리스크가 적은 곳에만 선택적으로 사용해야합니다.

### 요즘 트렌드

React Query는 여전히 개발자 선호도 1위의 표준 기술이지만, 프로젝트 상황에 따라 다른 도구를 선택하거나 새로운 패러다임과 결합하고 있습니다.

### 대안 라이브러리들

- **SWR (by Vercel):** React Query보다 훨씬 가볍고 API가 단순합니다. 복잡한 기능이 필요 없는 Next.js 프로젝트에서 자주 쓰입니다.
- **RTK Query:** 이미 Redux Toolkit으로 전역 상태를 무겁게 관리 중인 프로젝트라면, 스토어와 결합된 RTK Query가 훌륭한 대안입니다.
- **Apollo Client:** 백엔드가 일반적인 REST API가 아니라 GraphQL로 구축되어 있다면, GraphQL에 특화된 Apollo를 선택하는 것이 표준입니다.

### React Server Components (RSC)

가장 큰 변화는 Next.js App Router와 React 19를 기점으로 한 **서버 컴포넌트**의 등장입니다.

과거에는 화면을 그리기 위한 초기 데이터조차 React Query가 클라이언트에서 페칭했다면, 

현재 트렌드는 초기 렌더링용 데이터는 서버 컴포넌트가 직접 가져오고, 사용자 상호작용으로 발생하는 클라이언트 측 동적 업데이트(무한 스크롤, 실시간 갱신 등)는 React Query가 담당하는 방식으로 역할 분담이 이루어지고 있습니다.

## 마무리

React Query는 단순히 서버 데이터를 가져오는 도구를 넘어, 프론트엔드 비동기 상태 관리의 패러다임을 바꾼 강력한 라이브러리입니다. 

`useQuery`와 `useMutation`의 기초부터 Query Key 구조화, 그리고 낙관적 업데이트를 통한 UX 개선까지 익혀둔다면, 어떤 복잡한 애플리케이션에서도 견고하고 우아한 데이터를 관리할 수 있을 것입니다.

