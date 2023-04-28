// var for api
const endpointW = "https://random-word-api.herokuapp.com/word?length=";
const endpointD = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// var for game ui
const game = document.getElementById('game');
const livesDisplay = document.getElementById('lives-display');
const hintBut = document.getElementById('hint-button');
const hintContainer = document.getElementById('hint-container');

// var for pop up
const popUp = document.getElementById('pop-up');
const bkg = document.getElementById('background');
const defHead = document.getElementById('def-head');
const defContainer = document.getElementById('def-container');
const nextLevel = document.getElementById('next-level');

// var for switching keyboard layout
const keys = document.getElementById('keys');
const keyboard = document.getElementById('keyboard');
const alphabetical = document.getElementById('alpha');
const frequency = document.getElementById('freq');

// set up array for keyboard
const keyLayout = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']

// set up array for alphabetical keyboard
const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

// set up array for frequency keyboard
const vowels = ['e', 'a', 'i', 'o', 'u', 'y'];
const consonants = ['r', 't', 'n', 's', 'l', 'c', 'd', 'p', 'm', 'h', 'g', 'b', 'f', 'w', 'k', 'v', 'x', 'z', 'j', 'q'];

// object for keeping track of letter colors
let letterStateBackup = {
  a: 'white',
  b: 'white',
  c: 'white',
  d: 'white',
  e: 'white',
  f: 'white',
  g: 'white',
  h: 'white',
  i: 'white',
  j: 'white',
  k: 'white',
  l: 'white',
  m: 'white',
  n: 'white',
  o: 'white',
  p: 'white',
  q: 'white',
  r: 'white',
  s: 'white',
  t: 'white',
  u: 'white',
  v: 'white',
  w: 'white',
  x: 'white',
  y: 'white',
  z: 'white'
}

// https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/
// make a copy of the object
let letterState = JSON.parse(JSON.stringify(letterStateBackup));

// function for resetting color between words
function resetColor() {
  // reset the object to default
  letterState = JSON.parse(JSON.stringify(letterStateBackup));

  // remove classes from all keyboard buttons
  for (let i = 0; i < document.getElementsByClassName('letter-div').length; i++) {
    document.getElementsByClassName('letter-div')[i].classList = 'letter-div'; 
  }
}

  // remove classes from all keyboard buttons
  for (let i = 0; i < document.getElementsByClassName('letter-div').length; i++) {
    document.getElementsByClassName('letter-div')[i].classList = 'letter-div'; 
  }


// set up counters / data
let length = 3;
let guess = [];
let livesCounter = 20;
let answer;
let aArray;
let defArray = [];
let userHintCount = 5;
let remHintCount = 0;


// function for getting word from api
function getWord() {
  let query = endpointW + length;
  let response = fetch(query);

  fetch(query)
    .then(response => response.json())
    //.then(console.log(response))
    .then(data => {
      
      // get word from api
      answer = data[0];
      console.log(answer);

      // split word into array
      aArray = answer.split('');
    })
    .then(() => {
      // display answer onto pop-up
      defHead.innerHTML = `${answer.toUpperCase()}:`;
    })
    
    // call getDef function
    .then(() => getDef())

  .catch((error) => {
      console.error('Error:', error);
    })
}

// function for getting definition
function getDef() {
  let query = endpointD + answer;
  let response = fetch(query);

  fetch(query)
    .then(response => response.json())
    //.then(console.log(response))
    
    .then(data => {
      for (i = 0; i < data[0].meanings.length; i++) {
        
        // get data from object
        defArray.push(data[0].meanings[i].definitions[0].definition);

        // set up data for hint button
        remHintCount = defArray.length;
        hintCounter = 0;
        console.log(defArray);
      }
    })
    
    .then(() => {
      // display definition onto pop-up
      for (i = 0; i < defArray.length; i++) {
        let defDisplay = document.createElement('p');
        defDisplay.innerHTML = `${i + 1}. ${defArray[i]}`;
        defContainer.append(defDisplay);
      }
    })
    .then(displayHintCount)
    .then(() => {
      bkg.classList.remove('visible');
    })
    .catch((error) => {
      console.error('Error:', error);
      getWord();
    })
}

function checkWord () {
  let query = endpointD + guess.join("");
  let response = fetch(query);
  
  fetch(query)
  .then (response => response.json())
  .then (data => {
    if (data.title === 'No Definitions Found') {
    console.log('this is not a valid word')
    for (i = 0; i < currentSquares.length; i++) {
      currentSquares[i].classList.add('red');
    }
    } else {
      submit();
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    
  })
}

function clearArray (aVar) {
  aVar.length = 0;
}

function clearHTML (v) {
  v.innerHTML = '';
}

// function for displaying regular keyboard layout
function showKeyboard() {
  // clear existing keyboard
  clearHTML(keys);

  // loop through keyLayout array and create div / function button for each entry
  for (i = 0; i < keyLayout.length; i++) {

    // create backspace button
    if (i === 10) {
      let backspace = document.createElement('button');
      backspace.innerHTML = 'BACKSPACE';
      backspace.classList.add('letter-div');
      backspace.id = 'backspace';
      // call the function for deleting letters when you hit backspace
      backspace.addEventListener('click', back);
      keys.append(backspace);
    }

    // create enter button
    if (i === 19) {
      let enter = document.createElement('button');
      enter.innerHTML = 'ENTER';
      enter.classList.add('letter-div');
      enter.id = 'enter';
      // call the function for submitting your entry
      enter.addEventListener('click', checkWord)
      keys.append(enter);
    }

    // force a line break
    if (i === 10 || i === 19) {
      let lineBreak = document.createElement('div');
      lineBreak.classList.add('line-break');
      keys.append(lineBreak);
    }

    // create letter buttons
    let letterDiv = document.createElement('button');
    letterDiv.innerHTML = keyLayout[i].toUpperCase();
    letterDiv.id = keyLayout[i];
    letterDiv.classList.add('letter-div');
    // looks weird without this styling
    // keys.style.gap = '5px 10px';
    letterDiv.addEventListener('click', () => {type(letterDiv.id.toUpperCase())});
    keys.append(letterDiv);
  }
}

// function for displaying alphabetical keyboard
function showAlpha() {
  // clear previous keyboard
  clearHTML(keys);
   // loop through each entry of alphabetical array
  for (i = 0; i < alpha.length; i++) {
// create letter buttons
    let letterDiv = document.createElement('button');
    letterDiv.innerHTML = alpha[i].toUpperCase();
    letterDiv.id = alpha[i];
    letterDiv.classList.add('letter-div');
    letterDiv.addEventListener('click', () => {type(letterDiv.id.toUpperCase())});
    keys.append(letterDiv);
  }

  // force linebreak
let lineBreak = document.createElement('div');
      lineBreak.classList.add('line-break');
      keys.append(lineBreak);

  // create backspace button
   let backspace = document.createElement('button');
      backspace.innerHTML = 'BACKSPACE';
      backspace.classList.add('letter-div');
      backspace.id = 'backspace';
      backspace.addEventListener('click', back);
      keys.append(backspace);

  // create submit button
   let enter = document.createElement('button');
      enter.innerHTML = 'ENTER';
      enter.classList.add('letter-div');
      enter.id = 'enter';
      enter.addEventListener('click', checkWord)
      keys.append(enter);
}

// display frequency keyboard
function showFreq() {
  
  // clear previous keyboard
  clearHTML(keys);

  // loop through vowels and display each
  for (i = 0; i < vowels.length; i++) {
    let letterDiv = document.createElement('button');
    letterDiv.innerHTML = vowels[i].toUpperCase();
    letterDiv.id = vowels[i];
    letterDiv.classList.add('letter-div');
    letterDiv.addEventListener('click', () => {type(letterDiv.id.toUpperCase())});
    keys.append(letterDiv);
  }

  // create backspace button
  let backspace = document.createElement('button');
      backspace.innerHTML = 'BACKSPACE';
      backspace.classList.add('letter-div');
      backspace.id = 'backspace';
      backspace.addEventListener('click', back);
      keys.append(backspace);

  // force linebreak
  let lineBreak = document.createElement('div');
  lineBreak.classList.add('line-break');
  keys.append(lineBreak);

  // loop through consonants and display each
  for (i = 0; i < consonants.length; i++) {
    let letterDiv = document.createElement('button');
    letterDiv.innerHTML = consonants[i].toUpperCase();
    letterDiv.id = consonants[i];
    letterDiv.classList.add('letter-div');
    letterDiv.addEventListener('click', () => {type(letterDiv.id.toUpperCase())});
    keys.append(letterDiv);
  }

  // create submit button
  let enter = document.createElement('button');
      enter.innerHTML = 'ENTER';
      enter.classList.add('letter-div');
      enter.id = 'enter';
      enter.addEventListener('click', checkWord)
      keys.append(enter);

}

// function for showing / updating lives counter
function showLives() {
  livesDisplay.innerHTML = "❤ " + livesCounter;
}

// function for clearing keyboard
function clearKeyboard() {
  keys.innerHTML = '';
}

// function for creating new row of boxes
function createRow() {
  // container for boxes
  let newRow = document.createElement('div');
  newRow.classList.add('row');
  // loop to create same number of boxes as length of word
  for (let i = 0; i < length; i++) {
    let newSquare = document.createElement('div');
    newSquare.classList.add('square');
    newSquare.classList.add('current');
    newRow.append(newSquare);
  }
  // append all of this into game
  game.append(newRow);
}

// displaying hint information on button
function displayHintCount() {
  hintBut.innerHTML = `${remHintCount} / ${userHintCount} Hints`
}

// reset definition array for new word

// clear hint list for new word
function clearHintDisplay() {
  hintContainer.innerHTML = '';
}

// display a new hint on each press of button
function displayHint() {
  
  // make sure user and api has more than 0 hint counters
  if (userHintCount > 0 && remHintCount > 0) {
    
    // create a new hint 
    let newHint = document.createElement('div');
    newHint.innerHTML = `${hintCounter + 1}. ${defArray[hintCounter]}`;
    hintContainer.append(newHint);

    // update data
    remHintCount--;
    userHintCount--;
    hintCounter++;

    // update button data
    displayHintCount();
  }
}

// Game Logic--------------------------------------------------------------

// function for typing with buttons
function type(letter) {
  for (let i = 0; i < length; i++) {
      let current = currentSquares[i];
      if (current.innerHTML === '') {
        // type into empty spot
        current.innerHTML = letter;
        if (guess.length < length) {
          guess.push(letter.toLowerCase());
        }
        break;
      }
    }
}

// function for deleting characters
function back() {
  for (let i = length - 1; i >= 0; i--) {
      let current = currentSquares[i];
      if (current.innerHTML !== '') {
        current.innerHTML = '';
        guess.pop();
        break;
      }
    }

  for (let i = 0; i < currentSquares.length; i++) {
    currentSquares[i].classList.remove('red');
  }
}

// function for alerting the user 
function missingLetter() {
  alert('Please fill in all the boxes');
}

// function for showing pop up after user guessed correctly
function showPopUp() {
  popUp.classList.add('visible');
  bkg.classList.add('visible');
}

// reset pop up for new word
function resetPopUp() {
  popUp.classList.remove('visible');
  bkg.classList.remove('visible');
  defHead.innerHTML = '';
  defContainer.innerHTML = '';
}

// function to update gameboard between guesses
function updateGameBoard() {
  // remove 'current' class from squares  
      // for some reason, a regular loop wouldn't work here, found this solution.
      // https://stackoverflow.com/questions/22270664/how-to-remove-a-class-from-  elements-in-pure-javascript
      Array.from(document.querySelectorAll('.square.current')).forEach((el) => el.classList.remove('current'));
      // reset for next round
      clearArray(guess);
      createRow();
      // https://www.codegrepper.com/code-examples/javascript/scroll+to+bottom+of+page+javascript
      // scroll to bottom of the page after each guess
      window.scrollTo(0, document.body.scrollHeight);
}

// function if user guessed incorrectly
function incorrect() {
  
   // if guessed incorrectly
      livesCounter--;
      showLives();
  
      // check for each letter
      for (i = 0; i < length; i++) {

        // default guesses to gray
        currentSquares[i].classList.add('gray');
          letterState[guess[i]] = 'gray';
        
        for (j = 0; j < length; j++) {
         
          // if letter exists somewhere in guess and aArray, make guess yellow
          if (guess[i] === aArray[i]) {
            currentSquares[i].classList.add('green');
            letterState[guess[i]] = 'green';
            
            // if letter is in correct spot, make green
          } else if (guess[i] === aArray[j]) {
            currentSquares[i].classList.add('yellow');
            letterState[guess[i]] = 'yellow';
          } 
        }
      }
  updateGameBoard();
}

// function for when you press enter
function submit() {
  
     // if not completely filled in
    if (guess.length < length) {
      missingLetter();
      
      // if player guesses correctly
      // https://flexiple.com/javascript-array-equality
    } else if (JSON.stringify(guess) === JSON.stringify(aArray)) {
      
      // show pop up when user guesses correctly
      showPopUp();
    } else {

      // call function for guessing incorrectly
     incorrect();
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    // loop through each entry in an object
    for (const [key, value] of Object.entries(letterState)) {
      if (value === 'green') {
        document.getElementById(key).classList.add('green');
      } else if (value === 'yellow') {
        document.getElementById(key).classList.add('yellow');
      } else if (value === 'gray') {
        document.getElementById(key).classList.add('gray');
      }
    }

}
// Game Logic--------------------------------------------------------------


// function for typing aArray into code / logic
// https://www.codeinwp.com/snippets/detect-what-key-was-pressed-by-the-user/
function input(e) {
  let keynum = e.keyCode;
  let letter = String.fromCharCode(keynum);
  
  if (keynum == 8) {
    back();
  } else if (keynum == 13) {
 checkWord();
  } else {
    
    // loop through squares to find first empty spot
    for (let i = 0; i < length; i++) {
      let current = currentSquares[i];
      if (current.innerHTML === '') {
        // type into empty spot
        current.innerHTML = letter;
        if (guess.length < length) {
          guess.push(letter.toLowerCase());
        }
        break;
      }
    }
  }
}

function showBkg () {
  bkg.classList.add('visible');
}

// event listener for keyboard input
document.addEventListener('keydown', input);

// event listener for next level after clicking button on pop-up
nextLevel.addEventListener('click', () => {
  resetPopUp();
  length++;
  clearArray(guess);
  clearHTML(game);
  clearArray(defArray);
  clearHintDisplay();
  resetColor();
  userHintCount++;
  livesCounter += 5;
  showLives();
  getWord();
  createRow();
  setTimeout(function() {
    bkg.classList.add('visible'); 
  }, 5000);
})

// event listeners for switching between keyboard layout
keyboard.addEventListener('click', showKeyboard);
alphabetical.addEventListener('click', showAlpha);
frequency.addEventListener('click', showFreq);

// event listener for displaying hint
hintBut.addEventListener('click', displayHint);

// init game
getWord();
createRow();
let currentSquares = document.getElementsByClassName('current');
showKeyboard();
showLives();


