let  counter = 0;

module.exports.counterStep = function () {
 counter++;
}
module.exports.displayCounter = function () {
 console.log('Counter is', counter)
}

