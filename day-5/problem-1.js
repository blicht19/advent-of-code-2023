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
  return getNumbersFromStrings(numberStrings);
};

const getNextLowestKey = (map, key) => {
  const mapKeys = getNumbersFromStrings(Object.keys(map));
  const filteredKeys = mapKeys.filter((currentKey) => {
    return key >= currentKey;
  });
  return filteredKeys.at(-1) ?? -1;
};

const lines = fs.readFileSync(process.argv[2]).toString().split(/\n+/g);
const seeds = getSeeds(lines[0]);

let seedsMap = {};
seeds.forEach((seed) => {
  seedsMap[seed] = seed;
});

const updateSeedsMap = (seeds) => {
  seeds.forEach((seed) => {
    const seedValue = seedsMap["" + seed];
    const key = getNextLowestKey(currentMap, seedValue);
    let value = seedValue;
    if (key !== -1) {
      const keyString = "" + key;
      const keyDifference = seedValue - key;
      if (keyDifference < currentMap[keyString].range) {
        value = currentMap[keyString].rangeStart + keyDifference;
      }
    }
    seedsMap[seed] = value;
  });
};

let currentMap = {};
for (let i = 2; i < lines.length; i++) {
  if (/.*-to.* map:/g.test(lines[i])) {
    updateSeedsMap(seeds);
    currentMap = {};
  } else {
    const numbers = getNumbersFromStrings(lines[i].split(" "));
    currentMap[numbers[1]] = {
      rangeStart: numbers[0],
      range: numbers[2],
    };
  }
}

updateSeedsMap(seeds);

const locations = Object.values(seedsMap);
console.log(Math.min(...locations));
