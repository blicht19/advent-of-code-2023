const fs = require("fs");
const readline = require("readline");

if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

const wordsToNumbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const getNumbers = (line) => {
  const regex = /(one|two|three|four|five|six|seven|eight|nine|[0-9])/g;
  let results = [];
  let match;
  while ((match = regex.exec(line)) != null) {
    regex.lastIndex -= match[0].length - 1;
    results.push(match[0]);
  }
  return results;
};

const getNumericValue = (number) => {
  if (isNaN(number)) {
    return wordsToNumbers[number.trim()];
  }
  return number;
};

const getValue = (numbers) => {
  let firstDigit = getNumericValue(numbers.at(0));
  let lastDigit = getNumericValue(numbers.at(-1));

  return Number("" + firstDigit + lastDigit);
};

const getSum = async (fileName) => {
  let sum = 0;
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    sum += getValue(getNumbers(line));
  }
  return sum;
};

getSum(process.argv[2]).then((sum) => console.log(sum));
