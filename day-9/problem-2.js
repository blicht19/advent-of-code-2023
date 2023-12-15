const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");
const lines = [];

for (let i in input) {
  const line = input[i].split(" ");
  for (let j in line) {
    line[j] = Number(line[j]);
  }
  lines.push(line);
}

const getDifferencesArray = (line) => {
  const differences = [];
  for (let i = 0; i < line.length - 1; i++) {
    differences.push(line[i + 1] - line[i]);
  }
  return differences;
};

const getPreviousValue = (line) => {
  const diffArrays = [];
  let diffs = getDifferencesArray(line);

  while (diffs.filter((a) => a !== 0).length > 0) {
    diffArrays.push(diffs);
    diffs = getDifferencesArray(diffs);
  }

  let previousValue = 0;
  for (let i = diffArrays.length - 1; i >= 0; i--) {
    previousValue = diffArrays[i][0] - previousValue;
  }

  return line[0] - previousValue;
};

let sum = 0;
for (let i in lines) {
  sum += getPreviousValue(lines[i]);
}

console.log(sum);
