const fs = require("fs");
const readline = require("readline");

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

const getPower = (line) => {
  const lineSubStrings = line.split(";");
  let counts = [];

  lineSubStrings.forEach((subString) => {
    counts.push(getCounts(subString));
  });

  const reds = counts.map((count) => {
    return count.red;
  });

  const greens = counts.map((count) => {
    return count.green;
  });

  const blues = counts.map((count) => {
    return count.blue;
  });

  return Math.max(...reds) * Math.max(...greens) * Math.max(...blues);
};

const getPowerSum = async (fileName) => {
  let sum = 0;
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const lineSubStrings = line.split(":");
    sum += getPower(lineSubStrings[1]);
  }
  return sum;
};

if (process.argv.length < 3) {
  console.log("Usage: node " + process.argv[1] + " FILENAME");
  process.exit(1);
}

getPowerSum(process.argv[2]).then((sum) => console.log(sum));
