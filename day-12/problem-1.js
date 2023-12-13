const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

const input = fs.readFileSync(process.argv[2]).toString().split("\n");
const records = [];

for (let i in input) {
  const line = input[i].split(" ");
  line[1] = line[1].split(",");
  for (let j in line[1]) {
    line[1][j] = Number(line[1][j]);
  }
  const replacements = [];
  for (let i = 0; i < line[0].length; i++) {
    if (line[0][i] === "?") {
      replacements.push(i);
    }
  }
  records.push({
    springs: line[0],
    groups: line[1],
    replacements: replacements,
  });
}

const isValidArrangement = (record) => {
  const damaged = record.springs.match(/#+/g);
  if (damaged.length != record.groups.length) {
    return false;
  }

  for (let i in damaged) {
    if (damaged[i].length != record.groups[i]) {
      return false;
    }
  }
  return true;
};

const getArrangementCount = (record) => {
  let count = 0;

  for (let i = 1; i < Math.pow(2, record.replacements.length); i++) {
    let binaryNumber = i.toString(2);
    binaryNumber = binaryNumber
      .padStart(record.replacements.length, "0")
      .split("");

    let springs = record.springs;
    for (let j in record.replacements) {
      if (binaryNumber[j] === "1") {
        springs =
          springs.substring(0, record.replacements[j]) +
          "#" +
          springs.substring(record.replacements[j] + 1);
      }
    }
    if (isValidArrangement({ springs: springs, groups: record.groups })) {
      count++;
    }
  }
  return count;
};

let sum = 0;
for (let i in records) {
  sum += getArrangementCount(records[i]);
}

console.log(sum);
