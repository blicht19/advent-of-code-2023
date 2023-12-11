const fs = require("fs");

const getNumbersSection = (line) => {
  let match = line.split(":")[1];
  return match.replace(/  +/g, " ");
};

const getNumberArray = (numberStringArray) => {
  const numberStrings = numberStringArray.split(" ").filter((element) => {
    return element !== "";
  });
  let numbers = [];
  numberStrings.forEach((item) => {
    numbers.push(Number(item));
  });
  return numbers;
};

const getMatchCount = (line) => {
  const numbersString = getNumbersSection(line);
  const sections = numbersString.split("|");
  const winningNumberSet = new Set(getNumberArray(sections[0]));
  const numbersYouHaveSet = new Set(getNumberArray(sections[1]));
  let matches = 0;
  numbersYouHaveSet.forEach((number) => {
    if (winningNumberSet.has(number)) {
      matches++;
    }
  });
  return matches;
};

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

const lines = fs.readFileSync(process.argv[2]).toString().split("\n");

let copiesHistogram = new Array(lines.length);
copiesHistogram.fill(1);

lines.forEach((line, index) => {
  const matchCount = getMatchCount(line);
  const copies = copiesHistogram[index];
  for (let i = index + 1; i <= index + matchCount && i < lines.length; i++) {
    copiesHistogram[i] += copies;
  }
});

let sum = 0;
copiesHistogram.forEach((count) => {
  sum += count;
});

console.log(sum);
