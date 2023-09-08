//dom
let table = document.querySelector("table"); //get table
let keys = Array.from(document.querySelectorAll(".keyTile")); //get keyboard keys
//

let isGameOver = false;
let guesses = table.rows.length; //number of guesses
let wordLength = table.rows[0].cells.length; //letters in word

let rows = table.rows;
let answer;
const wordList = ["loser", "gnome", "staff"];
function newGame() {
  answer = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
}

window.addEventListener("load", function () {
  newGame();
});

//add listenes for virual keys
keys.map((key) => {
  key.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case "ENTER":
        // alert(e.target.innerText.toLowerCase());
        processInput(e.target.innerText.toLowerCase());
        break;
      case "←":
        // alert("backspace");
        processInput("backspace");
        break;

      default:
        // alert("key" + e.target.innerText.toLowerCase());
        processInput("key" + e.target.innerText.toLowerCase());
        break;
    }
  });
});

//add listener for real keyboard
document.addEventListener("keyup", (e) => {
  if (
    (e.code >= "KeyA" && e.code <= "KeyZ") ||
    e.code.toLowerCase() === "backspace" ||
    e.code.toLocaleLowerCase() === "enter"
  ) {
    // alert(e.code.toLowerCase());
    processInput(e.code.toLowerCase());
  }
});

function processInput(key) {
  switch (key) {
    case "enter":
      checkWord();
      break;
    case "backspace":
      deleteLetter();
      break;
    default:
      inputLetter(key);
      break;
  }
}

function inputLetter(key) {
  if (!isGameOver) {
    let currRow = document.getElementsByClassName("unchecked")[0];
    let cells = currRow.cells;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerText === "") {
        cells[i].innerText = key[3];
        break;
      }
    }
  }
}

function deleteLetter() {
  let currRow = document.getElementsByClassName("unchecked")[0];
  let cells = currRow.cells;
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].innerText !== "") {
      cells[i].innerText = "";
      break;
    }
  }
}

async function checkWord() {
  if (!isGameOver) {
    try {
      let guess = "";

      let answerLettersCount = countChars(answer);
      let currRow = document.getElementsByClassName("unchecked")[0];
      currRow.classList.remove("error-input");
      let cells = currRow.cells;

      //dont process words < 5 letters
      if (cells[cells.length - 1].innerText === "") {
        return;
      }

      //smotrim slovo
      for (let i = 0; i < cells.length; i++) {
        guess += cells[i].innerText;
      }

      const wordExists = await isWordExist(guess);
      console.log(guess);
      if (wordExists) {
        //change buttons letter colors
        for (let i = 0; i < cells.length; i++) {
          let currKey = document.getElementById(cells[i].innerText);
          if (cells[i].innerText === answer[i] && answerLettersCount[cells[i].innerText] > 0) {
            cells[i].classList.add("correct");
            answerLettersCount[cells[i].innerText]--;
            if (!currKey.classList.contains("correct")) {
              currKey.classList.add("correct");
              currKey.classList.remove("present");
            }
          }
        }
        for (let i = 0; i < cells.length; i++) {
          let currKey = document.getElementById(cells[i].innerText);

          if (
            cells[i].innerText != answer[i] &&
            answer.includes(cells[i].innerText) &&
            answerLettersCount[cells[i].innerText] > 0
          ) {
            cells[i].classList.add("present");
            answerLettersCount[cells[i].innerText]--;

            if (!currKey.classList.contains("correct")) {
              currKey.classList.add("present");
            }
          }
          if (!cells[i].classList.contains("correct") && !cells[i].classList.contains("present")) {
            cells[i].classList.add("wrong");
          }
          if (!currKey.classList.contains("correct") && !currKey.classList.contains("present")) {
            currKey.classList.add("wrong");
          }
        }
        if (guess.length === answer.length) currRow.classList.remove("unchecked");
      } else {
        currRow.classList.add("error-input");
      }
      checkGameOver(guess);
    } catch (error) {
      console.log("Ошибка", error);
    }
  }
}

function countChars(str) {
  return str.split("").reduce((r, c) => ((r[c] = (r[c] || 0) + 1), r), {});
}

async function getWordFromDict(word) {
  const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
  return res.json();
}

async function isWordExist(word) {
  let res = await getWordFromDict(word);
  if (res.title === "No Definitions Found") {
    return false;
  } else {
    return true;
  }
}

function checkGameOver(guess) {
  if (guess === answer) {
    let answerTable = document.getElementById("answerTable");
    answerTable.style.display = "block";
    answerTable.classList.add("correct");
    answerTable.innerText = answer;
    alert("you win");
    isGameOver = true;
    return true;
  }
  if (document.getElementsByClassName("unchecked").length === 0) {
    alert("you lose");
    answerTable.style.display = "block";
    answerTable.classList.add("wrong");
    answerTable.innerText = answer;
    isGameOver = true;
    return true;
  }
  return false;
}
