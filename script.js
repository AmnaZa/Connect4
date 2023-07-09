const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const message = document.getElementById("message");
const timerElement = document.getElementById("timer");
let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];
  let currentPlayer;
  let timer;

  // Random Number Between Range
  const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min;

  // Loop through array and check for same values
  const verifyArray = (arrayElement) => {
    let bool = false;
    let elementCount = 0;
    arrayElement.forEach((element, index) => {
      if (element == currentPlayer) {
        elementCount += 1;
        if (elementCount == 4) {
          bool = true;
        }
      } else {
        elementCount = 0;
      }
    });
    return bool;
  };

  // Check for game over (Last step)
  const gameOverCheck = () => {
    let truthCount = 0;
    for (let innerArray of initialMatrix) {
      if (innerArray.every((val) => val != 0)) {
        truthCount += 1;
      } else {
        return false;
      }
    }
    if (truthCount == 6) {
      message.innerText = "Game Over";
      clearInterval(timer); // Stop the timer
      startScreen.classList.remove("hide");
    }
  };

  // Check rows
  const checkAdjacentRowValues = (row) => {
    return verifyArray(initialMatrix[row]);
  };

  // Check columns
  const checkAdjacentColumnValues = (column) => {
    let colWinCount = 0,
      colWinBool = false;
    initialMatrix.forEach((element, index) => {
      if (element[column] == currentPlayer) {
        colWinCount += 1;
        if (colWinCount == 4) {
          colWinBool = true;
        }
      } else {
        colWinCount = 0;
      }
    });
    // No match
    return colWinBool;
  };

  // Get Right diagonal values
  const getRightDiagonal = (row, column, rowLength, columnLength) => {
    let rowCount = row;
    let columnCount = column;
    let rightDiagonal = [];
    while (rowCount > 0) {
      if (columnCount >= columnLength - 1) {
        break;
      }
      rowCount -= 1;
      columnCount += 1;
      rightDiagonal.unshift(initialMatrix[rowCount][columnCount]);
    }
    rowCount = row;
    columnCount = column;
    while (rowCount < rowLength) {
      if (columnCount < 0) {
        break;
      }
      rightDiagonal.push(initialMatrix[rowCount][columnCount]);
      rowCount += 1;
      columnCount -= 1;
    }
    return rightDiagonal;
  };

  const getLeftDiagonal = (row, column, rowLength, columnLength) => {
    let rowCount = row;
    let columnCount = column;
    let leftDiagonal = [];
    while (rowCount > 0) {
      if (columnCount <= 0) {
        break;
      }
      rowCount -= 1;
      columnCount -= 1;
      leftDiagonal.unshift(initialMatrix[rowCount][columnCount]);
    }
    rowCount = row;
    columnCount = column;
    while (rowCount < rowLength) {
      if (columnCount >= columnLength) {
        break;
      }
      leftDiagonal.push(initialMatrix[rowCount][columnCount]);
      rowCount += 1;
      columnCount += 1;
    }
    return leftDiagonal;
  };

  // Check diagonal
  const checkAdjacentDiagonalValues = (row, column) => {
    let diagWinBool = false;
    let tempChecks = {
      leftTop: [],
      rightTop: [],
    };
    let columnLength = initialMatrix[row].length;
    let rowLength = initialMatrix.length;

    // Store left and right diagonal array
    tempChecks.leftTop = [
      ...getLeftDiagonal(row, column, rowLength, columnLength),
    ];

    tempChecks.rightTop = [
      ...getRightDiagonal(row, column, rowLength, columnLength),
    ];
    // Check both arrays for similarities
    diagWinBool = verifyArray(tempChecks.rightTop);
    if (!diagWinBool) {
      diagWinBool = verifyArray(tempChecks.leftTop);
    }

    return diagWinBool;
  };

  // Win check logic
  const winCheck = (row, column) => {
    // If any of the functions return true, we return true
    return (
      checkAdjacentRowValues(row) ||
      checkAdjacentColumnValues(column) ||
      checkAdjacentDiagonalValues(row, column)
    );
  };
  // Timer function

  const startTimer = () => {
    let timeLeft = 60; // 1 minute
    const timerElement = document.getElementById("timer");
  
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = timeLeft;
      } else {
        clearInterval(timer); // Stop the timer
        message.innerHTML = "Time's up! Game Over";
        startScreen.classList.remove("hide");
      }
    }, 1000);
  };
  // Sets the circle to exact points
  const setPiece = (startCount, colValue) => {
    let rows = document.querySelectorAll(".grid-row");
    // Initially, it will place the circles in the last row. If no place available, we will decrement the count until we find an empty slot
    if (initialMatrix[startCount][colValue] != 0) {
      startCount -= 1;
      setPiece(startCount, colValue);
    } else {
      // Place circle
      let currentRow = rows[startCount].querySelectorAll(".grid-box");
      currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
      // Update Matrix
      initialMatrix[startCount][colValue] = currentPlayer;
      // Check for wins
      if (winCheck(startCount, colValue)) {
        message.innerHTML = `Player<span> ${currentPlayer}</span> wins`;
        clearInterval(timer); // Stop the timer
        startScreen.classList.remove("hide");
        return false;
      }
  }
  // Check if all slots are full
  gameOverCheck();
};

// When user clicks on a box
const fillBox = (e) => {
  // Get column value
  let colValue = parseInt(e.target.getAttribute("data-value"));
  // 5 because we have 6 rows (0-5)
  setPiece(5, colValue);
  currentPlayer = currentPlayer == 1 ? 2 : 1;

  playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
};

// Create Matrix
const matrixCreator = () => {
  for (let innerArray in initialMatrix) {
    let outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row");
    outerDiv.setAttribute("data-value", innerArray);
    for (let j in initialMatrix[innerArray]) {
      // Set all matrix values to 0
      initialMatrix[innerArray][j] = 0;
      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j);
      innerDiv.addEventListener("click", (e) => {
        fillBox(e);
      });
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
};

// Initialize game
const startGame = () => {
  // Between 1 and 2
  currentPlayer = generateRandomNumber(1, 3);
  container.innerHTML = "";
  matrixCreator();
  playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
  startScreen.classList.add("hide");
  startTimer();
};

// Start the game when the button is clicked
startButton.onclick = startGame;

// Reset the game
resetButton.onclick = () => {
  clearInterval(timer); // Stop the timer
  startScreen.classList.add("hide");
  startGame();
};