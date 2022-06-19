var questionsSpace = document.querySelector(".display-questions");
var displayQuestion = document.createElement('div');
var optionsList = document.createElement("div");
var questionsGuess = document.querySelector(".questions-guess");
var resultMessage = document.createElement("h1");
//create unordered list
var listEl = document.createElement("ul");

var win = document.querySelector(".win");
var lose = document.querySelector(".lose");
var timerElement = document.querySelector(".timer-count");
var startButton = document.querySelector(".start-button");

var winCounter = 0;
var loseCounter = 0;
var timer;
var timerCount;
var question;
var options;
var correct;

// Array of questions the user will answer
var questions = [
  {
    "question" : " A How do you create a function in JavaScript?",
    "options" : [
        "function = myFunction()",
        "function:myFunction()",
        "fuction myFunction()"
    ],
    "correct" : 3
  },
  {
    "question" : "B How do you call a function named 'myFunction",
    "options" : [
        "call myFunction()",
        "myFunction()",
        "call function myFunction()"
    ],
    "correct" : 2
  },
  {
    "question" : "C How to write an IF statement in JavaScript?",
    "options" : [
        "if i==5 then",
        "if (i == 5 )",
        "if i=5 then "
    ],
    "correct" : 2
  },
  {
    "question" : "D How to write an IF statement for executing some code if 'i' is NOT equal to 5?",
    "options" : [
        "if i <> 5",
        "if (i <> 5)",
        "if (i != 5)"
    ],
    "correct" : 3
  }
];

// The init function is called when the page loads 
function init() {
  getWins();
  getlosses();
}

// The startGame function is called when the start button is clicked
function startGame() {
  resetGame()
  timerCount = 15;
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true;
  //renderBlanks()
  startTimer()
  displayQuestions()
}

// The loseGame function is called when timer reaches 0
function loseGame() {
  questionsSpace.textContent = "GAME OVER";
  startButton.disabled = false;
  clearDisplayedQuestions();
  setLosses()
}

// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
  // Sets timer
  timer = setInterval(function() {
    timerCount--;
    timerElement.textContent = timerCount;
    // Tests if time has run out
    if (timerCount === 0) {
      // Clears interval
      resultMessage.textContent = '';
      clearInterval(timer);
      loseGame();
    }
  }, 1000);
}

//dispay questions on screen
function displayQuestions(){
  //randomly pick questions from the questions array
  choseQuestion = questions[Math.floor(Math.random()* questions.length)];
  //apply stringify to the question so it is readable;
  var question = JSON.stringify(choseQuestion["question"]);
  // options are stored as array so NOT need ofstringify
  options = choseQuestion["options"];
  //corret answer
  correct = choseQuestion["correct"];

  // create list elements with the options
  for (var i = 0; i< options.length; i++){
    // creating element li
    this["li"+i] = document.createElement("li");
    //assign  the value to element li the options of the question
    this["li"+i].textContent = options[i];
    //asign id to the li
    this["li"+i].setAttribute("id",i+1);
    //append list item to the unordered list
    optionsList.appendChild(this["li"+i]);
  }
  //append div on display questions
  displayQuestion.textContent = question;
  questionsSpace.appendChild(displayQuestion);
  displayQuestion.appendChild(optionsList);
}

// Updates win count on screen and sets win count to client storage
function setWins() {
  win.textContent = winCounter;
  localStorage.setItem("winCount", winCounter);
}

// Updates lose count on screen and sets lose count to client storage
function setLosses() {
  lose.textContent = loseCounter;
  localStorage.setItem("loseCount", loseCounter);
}

// These functions are used by init
function getWins() {
  // Get stored value from client storage, if it exists
  var storedWins = localStorage.getItem("winCount");
  // If stored value doesn't exist, set counter to 0
  if (storedWins === null) {
    winCounter = 0;
  } else {
    // If a value is retrieved from client storage set the winCounter to that value
    winCounter = storedWins;
  }
  //Render win count to page
  win.textContent = winCounter;
}

function getlosses() {
  var storedLosses = localStorage.getItem("loseCount");
  if (storedLosses === null) {
    loseCounter = 0;
  } else {
    loseCounter = storedLosses;
  }
  lose.textContent = loseCounter;
}

function checkWin(event) {
  displayMessage("Correct!","green");
  // This value is used in the timer function to test if win condition is met
  winCounter++
  setWins();
  //check if has answered all the questions
  checkTimer();
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);

// Calls init() so that it fires when page opened
init();

// Bonus: Add reset button
var resetButton = document.querySelector(".reset-button");

function resetGame() {
  // Resets win and loss counts
  winCounter = 0;
  loseCounter = 0;
  // Renders win and loss counts and sets them into client storage
  setWins()
  setLosses()
}

function penalise(){
  ///penalty by 3 sec
  displayMessage("Wrong","red");
  loseCounter++
  setLosses();
  timerCount = timerCount-3;
  checkTimer();
}

//check timer
function checkTimer(){
  //clear any previous displayed question
  clearDisplayedQuestions()
 if (timerCount > 0) {
     //call the next question
     displayQuestions();
  }else{
    clearInterval(timer);
   }
}

// displays the message depend on the answerd right or wrong
function displayMessage(msg,color){
  resultMessage.textContent = msg;
  questionsGuess.appendChild(resultMessage,color);
  resultMessage.setAttribute("style", "color:"+color+"; text-align:center; z-index:100;");
  questionsSpace.innerHTML += msg;
}

//function clear questions
function clearDisplayedQuestions(){
    question = '';
    options = '';
    correct = '';
    questionsSpace.innerHTML = '';
    displayQuestion.innerHTML = '';
    optionsList.innerHTML = '';
}

// Attaches event listener to button
resetButton.addEventListener("click", resetGame);

//add event listener
optionsList.addEventListener("click",function(e) {
  if (e.target.tagName === 'LI'){
    e.stopPropagation();
    //if the selected target id is equal to the correct answer calls checkwin method
    // otherwise calls penalise method
    if (e.target.id == correct)
    {
      checkWin();
    }else{
      penalise();
    }
  }
});