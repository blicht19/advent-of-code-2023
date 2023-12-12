const fs = require("fs");

const readFileArray = (fileName) => {
  const array = fs.readFileSync(fileName).toString().split("\n");
  for (i in array) {
    array[i] = array[i].split("");
  }
  return array;
};

const getNumberLocationsInLine = (line) => {
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

const getNumberLocations = (array) => {
  const numberLocations = [];
  for (index in array) {
    const numberStringIndices = getNumberLocationsInLine(array[index]);
    numberStringIndices.forEach((location) => {
      numberLocations.push({
        y: Number(index),
        start: location.start,
        end: location.end,
      });
    });
  }
  return numberLocations;
};

const getAsteriskLocations = (array) => {
  const locations = [];
  for (y in array) {
    for (x in array[y]) {
      if (array[y][x] === "*") {
        locations.push({
          y: Number(y),
          x: Number(x),
        });
      }
    }
  }
  return locations;
};

const getAdjacentNumberLocations = (y, x, numberLocations, array) => {
  let adjacentNumbers = [];
  if (y - 1 >= 0) {
    const aboveNumbers = numberLocations.filter((location) => {
      return (
        location.y === y - 1 &&
        ((location.start >= x - 1 && location.start <= x + 1) ||
          (location.end > x - 1 && location.end < +x + 2))
      );
    });
    adjacentNumbers = [...adjacentNumbers, ...aboveNumbers];
  }
  if (x + 1 < array[y].length) {
    const rightNumbers = numberLocations.filter((location) => {
      return location.y === y && location.start === x + 1;
    });
    adjacentNumbers = [...adjacentNumbers, ...rightNumbers];
  }
  if (y + 1 < array.length) {
    const belowNumbers = numberLocations.filter((location) => {
      return (
        location.y === y + 1 &&
        ((location.start >= x - 1 && location.start <= x + 1) ||
          (location.end > x - 1 && location.end < +x + 2))
      );
    });
    adjacentNumbers = [...adjacentNumbers, ...belowNumbers];
  }
  if (x - 1 >= 0) {
    const leftNumbers = numberLocations.filter((location) => {
      return location.y === y && location.end === x;
    });
    adjacentNumbers = [...adjacentNumbers, ...leftNumbers];
  }
  return adjacentNumbers;
};

const getNumberFromCoordinates = (array, lineNumber, start, end) => {
  return Number(array[lineNumber].join("").substring(start, end));
};

if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

const array = readFileArray(process.argv[2]);
const asterisks = getAsteriskLocations(array);
const numbers = getNumberLocations(array);

let sum = 0;

for (index in asterisks) {
  const adjacentNumbers = getAdjacentNumberLocations(
    asterisks[index].y,
    asterisks[index].x,
    numbers,
    array
  );
  if (adjacentNumbers.length === 2) {
    sum +=
      getNumberFromCoordinates(
        array,
        adjacentNumbers[0].y,
        adjacentNumbers[0].start,
        adjacentNumbers[0].end
      ) *
      getNumberFromCoordinates(
        array,
        adjacentNumbers[1].y,
        adjacentNumbers[1].start,
        adjacentNumbers[1].end
      );
  }
}

console.log(sum);
