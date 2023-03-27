let counter = 0

module.export = function () {
 console.log(module)
 counter++
 console.log('Counter is', counter)
}