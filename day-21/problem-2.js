const fs = require("fs");

class CustomSet {
  constructor() {
    this.map = new Map();
    this[Symbol.iterator] = this.values;
  }

  add(item) {
    this.map.set(JSON.stringify(item), item);
  }

  values() {
    return Array.from(this.map.values());
  }

  delete(item) {
    return this.map.delete(JSON.stringify(item));
  }

  has(item) {
    return this.map.has(JSON.stringify(item));
  }
}

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let sLocation = [];
let input = fs.readFileSync(process.argv[2]).toString().split("\n");
for (let i in input) {
  input[i] = input[i].split("");
  if (sLocation.length === 0) {
    const sColumn = input[i].indexOf("S");
    if (sColumn !== -1) {
      sLocation = [Number(i), sColumn];
    }
  }
}

/** I was stumped on this one. Thanks to HyperNeutrino again https://youtu.be/9UOMZSL0JTg?si=DBJz-S_An1uKAtY1 */

const size = input.length;
const steps = 26501365;

const gridWidth = Math.floor(steps / size) - 1;

const oddGrids = Math.pow(Math.floor(gridWidth / 2) * 2 + 1, 2);
const evenGrids = Math.pow(Math.floor((gridWidth + 1) / 2) * 2, 2);

const fill = (startLocation, steps) => {
  const answers = new CustomSet();
  const seen = new CustomSet();
  seen.add(startLocation);

  const queue = [[...startLocation, steps]];

  while (queue.length > 0) {
    const [row, column, steps] = queue.shift();

    if (steps % 2 === 0) {
      answers.add([row, column]);
    }

    if (steps === 0) {
      continue;
    }

    for (const [nextRow, nextColumn] of [
      [row + 1, column],
      [row - 1, column],
      [row, column + 1],
      [row, column - 1],
    ]) {
      if (
        nextRow < 0 ||
        nextRow >= input.length ||
        nextColumn < 0 ||
        nextColumn >= input[0].length ||
        input[nextRow][nextColumn] === "#" ||
        seen.has([nextRow, nextColumn])
      ) {
        continue;
      }
      seen.add([nextRow, nextColumn]);
      queue.push([nextRow, nextColumn, steps - 1]);
    }
  }

  return answers.values().length;
};

const topCorner = fill([size - 1, sLocation[1]], size - 1);
const rightCorner = fill([sLocation[0], 0], size - 1);
const bottomCorner = fill([0, sLocation[1]], size - 1);
const leftCorner = fill([sLocation[0], size - 1], size - 1);

const floorDivide = Math.floor(size / 2) - 1;
const smallTopRight = fill([size - 1, 0], floorDivide);
const smallBottomRight = fill([0, 0], floorDivide);
const smallTopLeft = fill([size - 1, size - 1], floorDivide);
const smallBottomLeft = fill([0, size - 1], floorDivide);

const floorDivideBig = Math.floor((size * 3) / 2) - 1;
const bigTopRight = fill([size - 1, 0], floorDivideBig);
const bigBottomRight = fill([0, 0], floorDivideBig);
const bigTopLeft = fill([size - 1, size - 1], floorDivideBig);
const bigBottomLeft = fill([0, size - 1], floorDivideBig);

const oddPoints = fill(sLocation, size * 2 + 1);
const evenPoints = fill(sLocation, size * 2);

console.log(
  oddGrids * oddPoints +
    evenGrids * evenPoints +
    topCorner +
    rightCorner +
    bottomCorner +
    leftCorner +
    (gridWidth + 1) *
      (smallTopRight + smallTopLeft + smallBottomRight + smallBottomLeft) +
    gridWidth * (bigBottomLeft + bigBottomRight + bigTopLeft + bigTopRight)
);
