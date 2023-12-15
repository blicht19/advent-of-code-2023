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

for (let i in input) {
  for (let j in input[i]) {
    if (input[i][j] === "O") {
      tiltNorth(i, j);
    }
  }
}

let sum = 0;
for (let i in input) {
  const rockCount = input[i].filter((x) => {
    return x === "O";
  }).length;
  sum += (input.length - i) * rockCount;
}

console.log(sum);
