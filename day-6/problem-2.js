const fs = require("fs");

const distanceFunction = (time, maxTime) => {
  return (maxTime - time) * time;
};

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

const lines = fs.readFileSync(process.argv[2]).toString().split("\n");
const regex = /\d+/g;
const time = Number(lines[0].match(regex).join(""));
const distance = Number(lines[1].match(regex).join(""));

let min = -1;
let max = 0;
for (let i = 0; i < time; i++) {
  if (distanceFunction(i, time) > distance) {
    if (min === -1) {
      min = i;
    }
  } else if (min !== -1) {
    max = i;
    break;
  }
}

console.log(max - min);
