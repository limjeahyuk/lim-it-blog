---
title: '[ C.5 ] Array function'
slug: react-32
pubDate: 2022-04-18
author: student
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/32
---
자바스크립트에는 array 함수가 있습니다.  
많은 React 개념이 배열 작업에 의존하기 때문에 알아 두면 엄청 유용할 것입니다.

### **\- map ( )**

![](/images/react-32/1.png)

이 처럼 map() 메서드는 호출 배열의 모든 요소에 대해 제공된 함수를 호출한 결과로 새로운 배열을 만듭니다.

 [Array.prototype.map() - JavaScript | MDN

The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

### **\- find ( )**

![](/images/react-32/2.png)

find() 메서드는 제공된 테스트 기능을 충족하는 배열의 첫 번째 요소를 반환합니다.  
map() 과는 다르게 첫 번째 하나만 반환합니다.

![](/images/react-32/3.png)

이런 식으로 속성 중 하나로 배열에서 개체 찾는 것이 가능하다.

 [Array.prototype.find() - JavaScript | MDN

The find() method returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

### **\- findIndex ( )**

![](/images/react-32/4.png)

findIndex() 메서드는 제공된 테스트 기능을 충족하는 배열의 첫번 째 요소 인덱스를 반환합니다.

find() 와 매우 비슷한 함수입니다. **만약 테스트를 통과하는 요소가 없으면 -1 을 반환합니다.  
**

 [Array.prototype.findIndex() - JavaScript | MDN

The findIndex() method returns the index of the first element in the array that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

### **\-  filter ( )**

![](/images/react-32/5.png)

filter () 메서드는 제공된 함수로 구현된 테스트를 통과하는 모든 요소가 포함된 새 배열을 만듭니다.  
find() 메서드가 처음 걸리는 하나만 반환한다면 filter() 는 포함된 모든 것을 배열로 만들어줍니다.

 [Array.prototype.filter() - JavaScript | MDN

The filter() method creates a new array with all elements that pass the test implemented by the provided function.

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

### **\- reduce ( )**

![](/images/react-32/6.png)

reduce() 메서드는 배열의 각 요소에 대해 reduce 콜백 함수를 순서대로 실행하고  
이전 요소에 대한 계산에서 반환 값을 전달합니다.  
최종 결과는 단일 값이 반환 됩니다.

 [Array.prototype.reduce() - JavaScript | MDN

The reduce() method executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements of the a

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce?v=b)

### **\- concat ( )**

![](/images/react-32/7.png)

concat () 메서드는 둘 이상의 배열을 병합하는 데 사용합니다.  
기존 배열은 건드리지 않으며 새로운 배열을 반환합니다.

 [Array.prototype.concat() - JavaScript | MDN

The concat() method is used to merge two or more arrays. This method does not change the existing arrays, but instead returns a new array.

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat?v=b)

### **\- slice ( )**

![](/images/react-32/8.png)

slice () 메서드는 배열을 인덱스를 이용하여 새로운 배열 객체로 반환합니다.  
slice ( start , end ) > end는 필수가 아니며 음수 인덱스도 사용 가능합니다.

 [Array.prototype.slice() - JavaScript | MDN

The slice() method returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified.

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

### **\- splice ( )**

![](/images/react-32/9.png)

splice () 메서드는 기존 요소를 제거하거나 교체하여 배열의 내용을 변경합니다.  
**기존 배열을 건드린다는 것을 주의해주세요.**

splice ( start , deleteCount, item )   
start > 처음 시작 인덱스  
deleteCount > start에서 몇개를 지울 것인지  
item > start 자리에 넣을 item

 [Array.prototype.splice() - JavaScript | MDN

The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place. To access part of an array without modifying it, see slice().

developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
