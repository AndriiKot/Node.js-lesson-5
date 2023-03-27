# Node.js-lesson-5
Node.js Lesson 5

___
```node
let  counter = 0;

module.exports.counterStep = function () {
 counter++;
}
module.exports.displayCounter = function () {
 console.log('Counter is', counter)
}

```

```node
const  myModule = require(node: './myModule1.js')

myModule.displayCounter()
myModule.counterStep()
myModule.displayCounter()
console.log(myModule.counter)     // Counter is 0
                                  // Counter is 1


// console.log(counter)          // ReferensError
```
