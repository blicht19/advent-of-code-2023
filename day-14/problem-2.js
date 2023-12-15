const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");
for (let i in input) {
  input[i] = input[i].split("");
}

const tiltNorth = (row, column) => {
  for (let i = row; i > 0; i--) {
    if (input[i - 1][column] !== ".") {
      return;
    }
    input[i - 1][column] = "O";
    input[i][column] = ".";
  }
};

const tiltSouth = (row, column) => {
  for (let i = row; i < input.length - 1; i++) {
    if (input[i + 1][column] !== ".") {
      return;
    }
    input[i + 1][column] = "O";
    input[i][column] = ".";
  }
};

const tiltEast = (row, column) => {
  for (let i = column; i < input[row].length - 1; i++) {
    if (input[row][i + 1] !== ".") {
      return;
    }
    input[row][i + 1] = "O";
    input[row][i] = ".";
  }
};

const tiltWest = (row, column) => {
  for (let i = column; i > 0; i--) {
    if (input[row][i - 1] !== ".") {
      return;
    }
    input[row][i - 1] = "O";
    input[row][i] = ".";
  }
};

const northCycle = () => {
  for (let i in input) {
    for (let j in input[i]) {
      if (input[i][j] === "O") {
        tiltNorth(i, j);
      }
    }
  }
};

const southCycle = () => {
  for (let i = input.length - 1; i >= 0; i--) {
    for (let j in input[i]) {
      if (input[i][j] === "O") {
        tiltSouth(i, j);
      }
    }
  }
};

const eastCycle = () => {
  for (let i = input[0].length - 1; i >= 0; i--) {
    for (let j in input) {
      if (input[j][i] === "O") {
        tiltEast(j, i);
      }
    }
  }
};

const westCycle = () => {
  for (let i = 0; i < input[0].length; i++) {
    for (let j in input) {
      if (input[j][i] === "O") {
        tiltWest(j, i);
      }
    }
  }
};

const cycle = () => {
  northCycle();
  westCycle();
  southCycle();
  eastCycle();
};

const NUM_CYCLES = 1000000000;

/* I initially solved this by finding that 1000 cycles gets you the correct solution.
 * This general solution was based on kwshi's solution
 * https://github.com/kwshi/advent-of-code/blob/main/python/2023/14.py*/

const stateMap = {};
stateMap[input.toString] = 0;
let start, length;
for (let i = 1; i < NUM_CYCLES; i++) {
  cycle();
  const currentInput = input.toString();
  if (currentInput in stateMap) {
    start = stateMap[currentInput];
    length = i - stateMap[currentInput];
    break;
  } else {
    stateMap[currentInput] = i;
  }
}

let current = Object.keys(stateMap).find(
  (key) => stateMap[key] === start + ((NUM_CYCLES - start) % length)
);
current = current.split(",");

const currentLines = [];

while (current.length) {
  currentLines.push(current.splice(0, input[0].length));
}

let sum = 0;
for (let i in currentLines) {
  const rockCount = currentLines[i].filter((x) => {
    return x === "O";
  }).length;
  sum += (input.length - i) * rockCount;
}

console.log(sum);
