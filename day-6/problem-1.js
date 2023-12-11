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
const times = lines[0].match(regex);
const distances = lines[1].match(regex);

const boatRaces = [];

for (let i in times) {
  boatRaces.push({
    time: Number(times[i]),
    distance: Number(distances[i]),
  });
}

let product = 1;

boatRaces.forEach((boatRace) => {
  let ways = 0;
  for (let i = 1; i < boatRace.time; i++) {
    const distanceTraveled = distanceFunction(i, boatRace.time);
    if (distanceTraveled > boatRace.distance) {
      ways++;
    }
  }
  product *= ways;
});

console.log(product);
