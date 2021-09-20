'use strict';

// write your code here
const startButton = document.querySelector('.button');
const rows = [...document.querySelectorAll('.field-row')];
let arrayOfCells = [];
let score = 0;
const scoreButton = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

// set 0 for all arrayItem
for (let i = 0; i < 4; i++) {
  arrayOfCells.push([0, 0, 0, 0]);
}

// refresh table with arrayItem value
function refreshCells() {
  if (arrayOfCells.includes(2048)) {
    messageWin.className = 'message message-win';
  }

  for (let i = 0; i < 4; i++) {
    const row = rows[i];
    const rowChild = [...row.children];

    for (let j = 0; j < 4; j++) {
      if (arrayOfCells[i][j] === 0) {
        rowChild[j].textContent = '';
        rowChild[j].className = 'field-cell';
      } else {
        const valueOfArrayItem = arrayOfCells[i][j];

        rowChild[j].textContent = valueOfArrayItem;
        rowChild[j].className = `field-cell field-cell--${valueOfArrayItem}`;
      }
    }
  }

  scoreButton.textContent = score;
}

// set value for random table item
const setRandomCells = () => {
  let firstIndex;
  let secondIndex;
  const valuesForRandom = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

  do {
    firstIndex = Math.floor(Math.random() * 4);
    secondIndex = Math.floor(Math.random() * 4);
  } while (arrayOfCells[firstIndex][secondIndex] !== 0);

  const randomIndex = Math.floor(Math.random() * valuesForRandom.length);

  arrayOfCells[firstIndex][secondIndex] = valuesForRandom[randomIndex];
};

const rotationMatrix = (matrix) => {
  const newMatrix = [];

  for (let i = 0; i < 4; i++) {
    const matrixRow = [];

    for (let j = 3; j > -1; j--) {
      matrixRow.push(matrix[j][i]);
    }
    newMatrix.push(matrixRow);
  }

  return newMatrix;
};

const backRotationMatrix = (matrix) => {
  const newMatrix = [];

  for (let i = 3; i > -1; i--) {
    const matrixRow = [];

    for (let j = 0; j < 4; j++) {
      matrixRow.push(matrix[j][i]);
    }
    newMatrix.push(matrixRow);
  }

  return newMatrix;
};

const checkFreeMoveHorizontal = (matrix) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (matrix[i][j] === matrix[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
};

const checkFreeMoveVertical = (matrix) => {
  const reverseMatrix = rotationMatrix(matrix);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (reverseMatrix[i][j] === reverseMatrix[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
};

const arrayCompare = (matrix1, matrix2) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (matrix1[i][j] !== matrix2[i][j]) {
        return false;
      } else {
        continue;
      }
    }
  }

  return true;
};

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    score = 0;

    arrayOfCells.map(row => {
      for (let i = 0; i < row.length; i++) {
        row[i] = 0;
      }
    });
  } else {
    setRandomCells();
    setRandomCells();
  }

  startButton.classList.toggle('start');
  startButton.classList.toggle('restart');

  const messageOfstart = document.querySelector('.message-start');

  messageOfstart.classList.toggle('hidden');

  if (startButton.classList.contains('start')) {
    startButton.textContent = 'Start';
  } else {
    startButton.textContent = 'Restart';
  }

  refreshCells();
});

document.addEventListener('keyup', (e) => {
  const copyArrayCells
    = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      copyArrayCells[i][j] = arrayOfCells[i][j];
    }
  }

  if (!messageWin.classList.contains('hidden')) {
    return;
  }

  const arrayFlat = arrayOfCells.flat();

  if (!arrayFlat.includes(0)) {
    if (checkFreeMoveHorizontal(arrayOfCells) === false
      && checkFreeMoveVertical(arrayOfCells) === false) {
      messageLose.className = 'message message-lose';
    }
  }

  if (!messageLose.classList.contains('hidden')) {
    return;
  }

  if (startButton.classList.contains('start')) {
    return;
  }

  for (let i = 0; i < 4; i++) {
    const newMatrix = rotationMatrix(arrayOfCells);
    const wasAdded = [];

    switch (e.keyCode) {
      case 37:
        if (!arrayFlat.includes(0)) {
          if (checkFreeMoveHorizontal(arrayOfCells) === false) {
            return;
          }
        }

        for (let j = 1; j < 4; j++) {
          if (arrayOfCells[i][j] === 0 && arrayOfCells[i][j - 1] === 0) {
            continue;
          }

          if (arrayOfCells[i][j] === 0) {
            continue;
          }

          for (let k = 0; k < j; k++) {
            if (arrayOfCells[i][k] === 0) {
              arrayOfCells[i][k] = arrayOfCells[i][j];
              arrayOfCells[i][j] = 0;
              j = k;
            }
          }

          if (arrayOfCells[i][j] === arrayOfCells[i][j - 1]) {
            if (wasAdded.includes([i, j - 1])) {
              continue;
            }
            arrayOfCells[i][j - 1] += arrayOfCells[i][j];
            arrayOfCells[i][j] = 0;
            wasAdded.push([i, j - 1]);
            score += arrayOfCells[i][j - 1];
          }
        }

        break;

      case 39:
        if (!arrayFlat.includes(0)) {
          if (checkFreeMoveHorizontal(arrayOfCells) === false) {
            return;
          }
        }

        for (let j = 2; j > -1; j--) {
          if (arrayOfCells[i][j] === 0 && arrayOfCells[i][j + 1] === 0) {
            continue;
          }

          if (arrayOfCells[i][j] === 0) {
            continue;
          }

          for (let k = 3; k > j; k--) {
            if (arrayOfCells[i][k] === 0) {
              arrayOfCells[i][k] = arrayOfCells[i][j];
              arrayOfCells[i][j] = 0;
              j = k;
            }
          }

          if (arrayOfCells[i][j] === arrayOfCells[i][j + 1]) {
            arrayOfCells[i][j + 1] += arrayOfCells[i][j];
            arrayOfCells[i][j] = 0;
            score += arrayOfCells[i][j + 1];
            continue;
          }
        }
        break;

      case 38:
        if (!arrayFlat.includes(0)) {
          if (checkFreeMoveVertical(arrayOfCells) === false) {
            return;
          }
        }

        if (checkFreeMoveVertical(arrayOfCells) === false) {
          return;
        }

        for (let j = 2; j > -1; j--) {
          if (newMatrix[i][j] === 0 && newMatrix[i][j + 1] === 0) {
            continue;
          }

          if (newMatrix[i][j] === 0) {
            continue;
          }

          for (let k = 3; k > j; k--) {
            if (newMatrix[i][k] === 0) {
              newMatrix[i][k] = newMatrix[i][j];
              newMatrix[i][j] = 0;
              j = k;
            }
          }

          if (newMatrix[i][j] === newMatrix[i][j + 1]) {
            newMatrix[i][j + 1] += newMatrix[i][j];
            newMatrix[i][j] = 0;
            score += newMatrix[i][j + 1];
            continue;
          }
        }

        arrayOfCells = backRotationMatrix(newMatrix);

        break;

      case 40:
        if (!arrayFlat.includes(0)) {
          if (checkFreeMoveVertical(arrayOfCells) === false) {
            return;
          }
        }

        for (let j = 1; j < 4; j++) {
          if (newMatrix[i][j] === 0 && newMatrix[i][j - 1] === 0) {
            continue;
          }

          if (newMatrix[i][j] === 0) {
            continue;
          }

          for (let k = 0; k < j; k++) {
            if (newMatrix[i][k] === 0) {
              newMatrix[i][k] = newMatrix[i][j];
              newMatrix[i][j] = 0;
              j = k;
            }
          }

          if (newMatrix[i][j] === newMatrix[i][j - 1]) {
            if (wasAdded.includes([i, j - 1])) {
              continue;
            }
            newMatrix[i][j - 1] += newMatrix[i][j];
            newMatrix[i][j] = 0;
            wasAdded.push([i, j - 1]);
            score += newMatrix[i][j - 1];
          }
        }
        arrayOfCells = backRotationMatrix(newMatrix);

        break;
    }
  }
  refreshCells();

  if (arrayCompare(copyArrayCells, arrayOfCells) === true) {
    return;
  }

  setRandomCells();
  refreshCells();
});
