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

const boxes = Array.from({ length: 256 }, () => []);
input.forEach((step) => {
  const operation = step.match(/[-=]/g)[0];
  const [label, focalLength] = step.split(operation);
  const hashCode = getHashCode(label);

  if (operation === "=") {
    const currentIndex = boxes[hashCode].findIndex((x) =>
      x.hasOwnProperty(label)
    );
    if (currentIndex !== -1) {
      boxes[hashCode][currentIndex][label] = focalLength;
    } else {
      const newContent = {};
      newContent[label] = focalLength;
      boxes[hashCode].push(newContent);
    }
  } else {
    const currentIndex = boxes[hashCode].findIndex((x) =>
      x.hasOwnProperty(label)
    );
    if (currentIndex !== -1) {
      boxes[hashCode].splice(currentIndex, 1);
    }
  }
});

let sum = 0;
for (let i in boxes) {
  for (let j in boxes[i]) {
    const slot = 1 + Number(j);
    const focalLength = Number(Object.values(boxes[i][j])[0]);
    const box = 1 + Number(i);
    sum += slot * focalLength * box;
  }
}

console.log(sum);
