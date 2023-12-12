const fs = require("fs");

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

const insertDotInRowsAtIndex = (index) => {
  for (let i in image) {
    image[i].splice(index + 1, 0, ".");
  }
};

const getDistance = (pointA, pointB) => {
  return (
    Math.abs(Number(pointA[0]) - Number(pointB[0])) +
    Math.abs(Number(pointA[1]) - Number(pointB[1]))
  );
};

for (let i = 0; i < image[0].length; i++) {
  const column = arrayColumn(image, i);
  if (!column.includes("#")) {
    insertDotInRowsAtIndex(i);
    i++;
  }
}

for (let i = 0; i < image.length; i++) {
  if (!image[i].includes("#")) {
    image.splice(i + 1, 0, new Array(image[i].length).fill("."));
    i++;
  }
}

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
    console.log(
      starLocations[i],
      starLocations[j],
      getDistance(starLocations[i], starLocations[j])
    );
    lengthsSum += getDistance(starLocations[i], starLocations[j]);
  }
}

console.log(lengthsSum);
