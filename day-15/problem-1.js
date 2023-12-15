const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split(",");

const getHashCode = (string) => {
  let currentValue = 0;
  for (let i in string) {
    currentValue += string[i].charCodeAt(0);
    currentValue = currentValue * 17;
    currentValue = currentValue % 256;
  }

  return currentValue;
};

let sum = 0;
input.forEach((step) => {
  sum += getHashCode(step);
});

console.log(sum);
