const fs = require("fs");

const isSymbol = (character) => {
  const regex = /\.|\d/g;
  return !regex.test(character);
};

/* isValidPosition and getAdjacentElements based on example from from https://www.geeksforgeeks.org/find-all-adjacent-elements-of-given-element-in-a-2d-array-or-matrix/ */

const isValidPosition = (y, x, yLength, xLength) => {
  return y >= 0 && x >= 0 && y < yLength && x < xLength;
};

const getAdjacentElements = (array, y, x) => {
  const yLength = array.length;
  const xLength = array[0].length;
  let adjacent = [];

  if (isValidPosition(y - 1, x - 1, yLength, xLength)) {
    adjacent.push(array[y - 1][x - 1]);
  }
  if (isValidPosition(y, x - 1, yLength, xLength)) {
    adjacent.push(array[y][x - 1]);
  }
  if (isValidPosition(y, x + 1, yLength, xLength)) {
    adjacent.push(array[y][x + 1]);
  }
  if (isValidPosition(y + 1, x, yLength, xLength)) {
    adjacent.push(array[y + 1][x]);
  }
  if (isValidPosition(y + 1, x + 1, yLength, xLength)) {
    adjacent.push(array[y + 1][x + 1]);
  }
  if (isValidPosition(y + 1, x - 1, yLength, xLength)) {
    adjacent.push(array[y + 1][x - 1]);
  }
  if (isValidPosition(y - 1, x + 1, yLength, xLength)) {
    adjacent.push(array[y - 1][x + 1]);
  }
  return adjacent;
};

const isPartNumberDigit = (array, y, x) => {
  const adjacentElements = getAdjacentElements(array, y, x);

  for (index in adjacentElements) {
    if (isSymbol(adjacentElements[index])) {
      return true;
    }
  }
  return false;
};

const getNumberStrings = (line) => {
  const lineString = line.join("");
  const regex = /\d+/g;
  const numberStringIndices = [];
  while ((match = regex.exec(lineString))) {
    numberStringIndices.push({
      start: match.index,
      end: regex.lastIndex,
    });
  }
  return numberStringIndices;
};

const isValidPartNumber = (numberStringIndices, lineIndex, array) => {
  for (let i = numberStringIndices.start; i < numberStringIndices.end; i++) {
    if (isPartNumberDigit(array, lineIndex, i)) {
      return true;
    }
  }
  return false;
};

const getSum = (array) => {
  let sum = 0;
  for (i in array) {
    const numberStringIndices = getNumberStrings(array[i]);
    for (j in numberStringIndices) {
      if (isValidPartNumber(numberStringIndices[j], Number(i), array)) {
        sum += Number(
          array[i]
            .join("")
            .substring(numberStringIndices[j].start, numberStringIndices[j].end)
        );
      }
    }
  }
  return sum;
};

const readFileArray = (fileName) => {
  const array = fs.readFileSync(fileName).toString().split("\n");
  for (i in array) {
    array[i] = array[i].split("");
  }
  return array;
};

if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

const inputArray = readFileArray(process.argv[2]);
console.log(getSum(inputArray));
