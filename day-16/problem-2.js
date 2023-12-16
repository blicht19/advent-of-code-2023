const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");
for (let i in input) {
  input[i] = input[i].split("");
}

const directions = {
  up: "UP",
  down: "DOWN",
  left: "LEFT",
  right: "RIGHT",
};

const getEnergized = (currentInput, startRow, startColumn, direction) => {
  const inputArray = JSON.parse(JSON.stringify(currentInput));
  const beams = new Set();

  const radiateRight = (row, column) => {
    const beam = { row: row, column: column, direction: directions.right };
    const key = JSON.stringify(beam);
    if (beams.has(key)) {
      return;
    } else {
      beams.add(key);
    }
    for (let i = column; i < inputArray[row].length; i++) {
      switch (inputArray[row][i]) {
        case ".":
        case "#":
          inputArray[row][i] = "#";
          break;
        case "-":
        case "=":
          inputArray[row][i] = "=";
          break;
        case "/":
        case "?":
          inputArray[row][i] = "?";
          radiateUp(row - 1, i);
          return;
        case "\\":
        case ">":
          inputArray[row][i] = ">";
          radiateDown(row + 1, i);
          return;
        case "|":
        case "!":
          inputArray[row][i] = "!";
          radiateUp(row - 1, i);
          radiateDown(row + 1, i);
          return;
      }
    }
  };

  const radiateLeft = (row, column) => {
    const beam = { row: row, column: column, direction: directions.left };
    const key = JSON.stringify(beam);
    if (beams.has(key)) {
      return;
    } else {
      beams.add(key);
    }
    for (let i = column; i >= 0; i--) {
      switch (inputArray[row][i]) {
        case ".":
        case "#":
          inputArray[row][i] = "#";
          break;
        case "-":
        case "=":
          inputArray[row][i] = "=";
          break;
        case "/":
        case "?":
          inputArray[row][i] = "?";
          radiateDown(row + 1, i);
          return;
        case "\\":
        case ">":
          inputArray[row][i] = ">";
          radiateUp(row - 1, i);
          return;
        case "|":
        case "!":
          inputArray[row][i] = "!";
          radiateUp(row - 1, i);
          radiateDown(row + 1, i);
          return;
      }
    }
  };

  const radiateDown = (row, column) => {
    const beam = { row: row, column: column, direction: directions.down };
    const key = JSON.stringify(beam);
    if (beams.has(key)) {
      return;
    } else {
      beams.add(key);
    }
    for (let i = row; i < inputArray.length; i++) {
      switch (inputArray[i][column]) {
        case ".":
        case "#":
          inputArray[i][column] = "#";
          break;
        case "-":
        case "=":
          inputArray[i][column] = "=";
          radiateLeft(i, column - 1);
          radiateRight(i, column + 1);
          return;
        case "/":
        case "?":
          inputArray[i][column] = "?";
          radiateLeft(i, column - 1);
          return;
        case "\\":
        case ">":
          inputArray[i][column] = ">";
          radiateRight(i, column + 1);
          return;
        case "|":
        case "!":
          inputArray[i][column] = "!";
          break;
      }
    }
  };

  const radiateUp = (row, column) => {
    const beam = { row: row, column: column, direction: directions.up };
    const key = JSON.stringify(beam);
    if (beams.has(key)) {
      return;
    } else {
      beams.add(key);
    }
    for (let i = row; i >= 0; i--) {
      switch (inputArray[i][column]) {
        case ".":
        case "#":
          inputArray[i][column] = "#";
          break;
        case "-":
        case "=":
          inputArray[i][column] = "=";
          radiateLeft(i, column - 1);
          radiateRight(i, column + 1);
          return;
        case "/":
        case "?":
          inputArray[i][column] = "?";
          radiateRight(i, column + 1);
          return;
        case "\\":
        case ">":
          inputArray[i][column] = ">";
          radiateLeft(i, column - 1);
          return;
        case "|":
        case "!":
          inputArray[i][column] = "!";
          break;
      }
    }
  };

  switch (direction) {
    case directions.up:
      radiateUp(startRow, startColumn);
      break;
    case directions.down:
      radiateDown(startRow, startColumn);
      break;
    case directions.left:
      radiateLeft(startRow, startColumn);
      break;
    case directions.right:
      radiateRight(startRow, startColumn);
      break;
  }

  let sum = 0;
  inputArray.forEach((line) => {
    const row = line.join();
    const matches = row.match(/[#=?>!]/g);
    if (matches != null) {
      sum += matches.length;
    }
  });

  return sum;
};

let sums = [];

sums.push(getEnergized(input, 0, 0, directions.down));
sums.push(getEnergized(input, 0, 0, directions.right));

sums.push(getEnergized(input, 0, input[0].length - 1, directions.down));
sums.push(getEnergized(input, 0, input[0].length - 1, directions.left));

sums.push(getEnergized(input, input.length - 1, 0, directions.up));
sums.push(getEnergized(input, input.length - 1, 0, directions.right));

sums.push(
  getEnergized(input, input.length - 1, input[0].length - 1, directions.up)
);
sums.push(
  getEnergized(input, input.length - 1, input[0].length - 1, directions.left)
);

for (let i = 1; i < input.length - 1; i++) {
  sums.push(getEnergized(input, i, 0, directions.right));
  sums.push(getEnergized(input, i, input[i].length - 1, directions.left));
}

for (let i = 1; i < input[0].length - 1; i++) {
  sums.push(getEnergized(input, 0, i, directions.down));
  sums.push(getEnergized(input, input.length - 1, i, directions.up));
}

console.log(Math.max(...sums));
