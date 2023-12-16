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

const beams = new Set();

const radiateRight = (row, column) => {
  const beam = { row: row, column: column, direction: directions.right };
  const key = JSON.stringify(beam);
  if (beams.has(key)) {
    return;
  } else {
    beams.add(key);
  }
  for (let i = column; i < input[row].length; i++) {
    switch (input[row][i]) {
      case ".":
      case "#":
        input[row][i] = "#";
        break;
      case "-":
      case "=":
        input[row][i] = "=";
        break;
      case "/":
      case "?":
        input[row][i] = "?";
        radiateUp(row - 1, i);
        return;
      case "\\":
      case ">":
        input[row][i] = ">";
        radiateDown(row + 1, i);
        return;
      case "|":
      case "!":
        input[row][i] = "!";
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
    switch (input[row][i]) {
      case ".":
      case "#":
        input[row][i] = "#";
        break;
      case "-":
      case "=":
        input[row][i] = "=";
        break;
      case "/":
      case "?":
        input[row][i] = "?";
        radiateDown(row + 1, i);
        return;
      case "\\":
      case ">":
        input[row][i] = ">";
        radiateUp(row - 1, i);
        return;
      case "|":
      case "!":
        input[row][i] = "!";
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
  for (let i = row; i < input.length; i++) {
    switch (input[i][column]) {
      case ".":
      case "#":
        input[i][column] = "#";
        break;
      case "-":
      case "=":
        input[i][column] = "=";
        radiateLeft(i, column - 1);
        radiateRight(i, column + 1);
        return;
      case "/":
      case "?":
        input[i][column] = "?";
        radiateLeft(i, column - 1);
        return;
      case "\\":
      case ">":
        input[i][column] = ">";
        radiateRight(i, column + 1);
        return;
      case "|":
      case "!":
        input[i][column] = "!";
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
    switch (input[i][column]) {
      case ".":
      case "#":
        input[i][column] = "#";
        break;
      case "-":
      case "=":
        input[i][column] = "=";
        radiateLeft(i, column - 1);
        radiateRight(i, column + 1);
        return;
      case "/":
      case "?":
        input[i][column] = "?";
        radiateRight(i, column + 1);
        return;
      case "\\":
      case ">":
        input[i][column] = ">";
        radiateLeft(i, column - 1);
        return;
      case "|":
      case "!":
        input[i][column] = "!";
        break;
    }
  }
};

radiateRight(0, 0);

let sum = 0;
input.forEach((line) => {
  const row = line.join();
  const matches = row.match(/[#=?>!]/g);
  if (matches != null) {
    sum += matches.length;
  }
});

console.log(sum);
