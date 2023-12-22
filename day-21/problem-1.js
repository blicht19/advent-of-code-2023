const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let sLocation = [];
let input = fs.readFileSync(process.argv[2]).toString().split("\n");
for (let i in input) {
  input[i] = input[i].split("");
  if (sLocation.length === 0) {
    const sColumn = input[i].indexOf("S");
    if (sColumn !== -1) {
      sLocation = [Number(i), sColumn];
    }
  }
}

const getAdjacentLocations = (coordinates) => {
  const [row, column] = coordinates;
  const adjacent = [];

  if (row > 0 && input[row - 1][column] !== "#") {
    adjacent.push([row - 1, column]);
  }
  if (column > 0 && input[row][column - 1] !== "#") {
    adjacent.push([row, column - 1]);
  }
  if (row < input.length - 1 && input[row + 1][column] !== "#") {
    adjacent.push([row + 1, column]);
  }
  if (column < input[0].length - 1 && input[row][column + 1] !== "#") {
    adjacent.push([row, column + 1]);
  }
  return adjacent;
};

const STEPS = 64;
let currentLocations = new Set();
currentLocations.add(JSON.stringify(sLocation));

for (let i = 0; i < STEPS; i++) {
  const locations = Array.from(currentLocations);
  currentLocations = new Set();
  for (const location of locations) {
    const coordinates = JSON.parse(location);
    const adjacentLocations = getAdjacentLocations(coordinates);
    for (const adjacent of adjacentLocations) {
      currentLocations.add(JSON.stringify(adjacent));
    }
  }
}

console.log(currentLocations.size);
