const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

const getNumbersFromStrings = (strings) => {
  let numbers = [];
  for (let i = 0; i < strings.length; i++) {
    numbers[i] = Number(strings[i]);
  }
  return numbers;
};

const getSeeds = (seedsLine) => {
  const numberStrings = seedsLine.split(" ");
  numberStrings.shift();
  const stringNumbers = getNumbersFromStrings(numberStrings);
  let seeds = [];
  stringNumbers.forEach((number, index) => {
    if (index % 2 === 0) {
      seeds.push({ start: number, end: number + stringNumbers[index + 1] });
    }
  });
  return seeds;
};

const getMappedValue = (value, map) => {
  const mapKeys = Array.from(map.keys());
  for (let i in mapKeys) {
    const key = mapKeys[i];
    if (value >= key.start && value < key.end) {
      const difference = value - key.start;
      return map.get(key).start + difference;
    }
  }
  return value;
};

const lines = fs.readFileSync(process.argv[2]).toString().split(/\n+/g);
const seeds = getSeeds(lines[0]);
const maps = [];

let currentMap = new Map();
for (let i = 2; i < lines.length; i++) {
  if (/.*-to.* map:/g.test(lines[i])) {
    maps.push(currentMap);
    currentMap = new Map();
  } else {
    const numbers = getNumbersFromStrings(lines[i].split(" "));
    currentMap.set(
      { start: numbers[1], end: numbers[1] + numbers[2] },
      { start: numbers[0], end: numbers[0] + numbers[2] }
    );
  }
}

let minValue = Infinity;

seeds.forEach((seed) => {
  for (let i = seed.start; i < seed.end; i++) {
    let value = i;
    for (let j in maps) {
      value = getMappedValue(value, maps[j]);
    }
    if (value < minValue) {
      minValue = value;
    }
  }
});

console.log(minValue);
