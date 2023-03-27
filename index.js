const  myModule = require('./myModule1.js')

myModule.displayCounter()
myModule.counterStep()
myModule.displayCounter()
console.log(myModule.counter)     // Counter is 0
                                  // Counter is 1


// console.log(counter)          // ReferensError