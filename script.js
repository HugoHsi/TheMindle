console.log('test');
var randomWords = require('random-words');

document.getElementById('test').addEventListener('click', () => {
    console.log(randomWords());
})
