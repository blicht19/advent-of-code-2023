const fs = require("fs");
const readline = require("readline");

if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

const getNumber = (line) => {
  let firstDigit;
  let lastDigit;
  for (char of line) {
    if (!isNaN(char)) {
      if (firstDigit == null) {
        firstDigit = char;
      } else {
        lastDigit = char;
      }
    }
  }
  if (lastDigit == null) {
    lastDigit = firstDigit;
  }
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
    sum += getNumber(line);
  }
  return sum;
};

getSum(process.argv[2]).then((sum) => console.log(sum));
