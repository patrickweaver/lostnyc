const badWords = require('bad-words');
const filter = new badWords();

module.exports = function(stringArray) {
  var profane = false;
  for (var i in stringArray) {
    const string = stringArray[i];
    if (filter.isProfane(string)) {
       profane = true; 
    }
  }
  return profane;
}