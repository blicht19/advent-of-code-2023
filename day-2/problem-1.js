const fs = require("fs");
const readline = require("readline");

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const getNumber = (numericString) => {
  return Number(numericString.match(/[0-9]{1,3}/g)[0]);
};

const getCounts = (countsString) => {
  const regex = /[0-9]{1,2} (red|green|blue)/g;
  const counts = {
    red: 0,
    green: 0,
    blue: 0,
  };
  const countStrings = countsString.match(regex);
  countStrings.forEach((count) => {
    if (count.includes("red")) {
      counts.red = getNumber(count);
    } else if (count.includes("green")) {
      counts.green = getNumber(count);
    } else if (count.includes("blue")) {
      counts.blue = getNumber(count);
    }
  });
  return counts;
};

const gameIsValid = (gameString) => {
  let valid = true;
  const gameSubStrings = gameString.split(";");
  try {
    gameSubStrings.forEach((gameSubString) => {
      const counts = getCounts(gameSubString);
      if (
        counts.red > MAX_RED ||
        counts.green > MAX_GREEN ||
        counts.blue > MAX_BLUE
      ) {
        throw new Error("Invalid count");
      }
    });
  } catch (e) {
    return false;
  }
  return valid;
};

const getId = (line) => {
  const lineSubStrings = line.split(":");
  if (gameIsValid(lineSubStrings[1])) {
    return getNumber(lineSubStrings[0]);
  }
  return 0;
};

const getSum = async (fileName) => {
  let sum = 0;
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    sum += getId(line);
  }
  return sum;
};

if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

getSum(process.argv[2]).then((sum) => console.log(sum));
