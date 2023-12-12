const fs = require("fs");

const EMPTY_ROW_MULTIPLIER = 1000000;

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let image = fs.readFileSync(process.argv[2]).toString().split("\n");
for (let i in image) {
  image[i] = image[i].split("");
}

const arrayColumn = (array, index) => {
  return array.map((x) => {
    return x[index];
  });
};

const emptyColumns = [];

for (let i = 0; i < image[0].length; i++) {
  const column = arrayColumn(image, i);
  if (!column.includes("#")) {
    emptyColumns.push(i);
  }
}

const emptyRows = [];

for (let i = 0; i < image.length; i++) {
  if (!image[i].includes("#")) {
    emptyRows.push(i);
  }
}

const getDistance = (pointA, pointB) => {
  const xA = Number(pointA[0]);
  const xB = Number(pointB[0]);
  const yA = Number(pointA[1]);
  const yB = Number(pointB[1]);
  let distance = 0;
  for (let i = Math.min(xA, xB); i < Math.max(xA, xB); i++) {
    if (emptyRows.includes(i)) {
      distance += EMPTY_ROW_MULTIPLIER;
    } else {
      distance++;
    }
  }
  for (let i = Math.min(yA, yB); i < Math.max(yA, yB); i++) {
    if (emptyColumns.includes(i)) {
      distance += EMPTY_ROW_MULTIPLIER;
    } else {
      distance++;
    }
  }
  return distance;
};

let starCount = 1;
let starLocations = [];

for (let i in image) {
  for (let j in image[i]) {
    if (image[i][j] == "#") {
      starLocations[starCount] = [i, j];
      starCount++;
    }
  }
}

let lengthsSum = 0;

for (let i = 1; i < starLocations.length; i++) {
  for (let j = i + 1; j < starLocations.length; j++) {
    lengthsSum += getDistance(starLocations[i], starLocations[j]);
  }
}
console.log(lengthsSum);
