

const generateWord = (wordLength) => {
  var randomWords = require('random-words');
  var length = 0;
  var answer = null;

  while (length !== wordLength) {
    let word = randomWords({exactly: 1, maxLength: wordLength})[0];
    length = word.length;
    answer = word;
  }
  return answer;
}


const isAlpha = (keyCode) => /^[a-zA-Z]/.test(String.fromCharCode(keyCode));

const exceptions = ['every'];

// TODO: Use different API or make exception list
// "every" is apparantly not a word according to this API
const isValidWord = (guess) => {
  return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + guess)
    .then((res) => res.json())
    .then((result) => {return exceptions.includes(guess) || Array.isArray(result)})
}
export {generateWord, isAlpha, isValidWord}
