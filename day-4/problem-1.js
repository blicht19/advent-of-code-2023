const fs = require("fs");
const readline = require("readline");

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

const getLineScore = (line) => {
  const numbersString = getNumbersSection(line);
  const sections = numbersString.split("|");
  const winningNumberSet = new Set(getNumberArray(sections[0]));
  const numbersYouHaveSet = new Set(getNumberArray(sections[1]));
  let score = 0;
  numbersYouHaveSet.forEach((number) => {
    if (winningNumberSet.has(number)) {
      if (score > 0) {
        score *= 2;
      } else {
        score = 1;
      }
    }
  });
  return score;
};

const getTotalScore = async (fileName) => {
  const fileStream = fs.createReadStream(fileName);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let sum = 0;

  for await (const line of rl) {
    sum += getLineScore(line);
  }

  return sum;
};

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

getTotalScore(process.argv[2]).then((sum) => console.log(sum));
