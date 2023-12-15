const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");

for (let i in input) {
  input[i] = input[i].split("");
}

const directions = {
  north: "NORTH",
  south: "SOUTH",
  east: "EAST",
  west: "WEST",
};

const getNextLocation = (row, column, directionTraveled) => {
  switch (input[row][column]) {
    case "|":
      if (directionTraveled === directions.north) {
        return [row - 1, column, directions.north];
      } else if (directionTraveled === directions.south) {
        return [row + 1, column, directions.south];
      } else {
        throw new Error(
          `Invalid direction: traveling ${directionTraveled} at |`
        );
      }
    case "-":
      if (directionTraveled === directions.east) {
        return [row, column + 1, directions.east];
      } else if (directionTraveled === directions.west) {
        return [row, column - 1, directions.west];
      } else {
        throw new Error(
          `Invalid direction: traveling ${directionTraveled} at -`
        );
      }
    case "7":
      if (directionTraveled === directions.east) {
        return [row + 1, column, directions.south];
      } else if (directionTraveled === directions.north) {
        return [row, column - 1, directions.west];
      } else {
        throw new Error(
          `Invalid direction: traveling ${directionTraveled} at 7`
        );
      }
    case "J":
      if (directionTraveled === directions.east) {
        return [row - 1, column, directions.north];
      } else if (directionTraveled === directions.south) {
        return [row, column - 1, directions.west];
      } else {
        throw new Error(
          `Invalid direction: traveling ${directionTraveled} at J`
        );
      }
    case "L":
      if (directionTraveled === directions.west) {
        return [row - 1, column, directions.north];
      } else if (directionTraveled === directions.south) {
        return [row, column + 1, directions.east];
      } else {
        throw new Error(
          `Invalid direction: traveling ${directionTraveled} at L`
        );
      }
    case "F":
      if (directionTraveled === directions.west) {
        return [row + 1, column, directions.south];
      } else if (directionTraveled === directions.north) {
        return [row, column + 1, directions.east];
      } else {
        throw new Error(
          `Invalid direction: traveling ${directionTraveled} at F`
        );
      }
    default:
      throw new Error(`Invalid pipe character ${input[row][column]}`);
  }
};

const findS = (inputArray) => {
  for (let i in inputArray) {
    for (let j in inputArray[i]) {
      if (input[i][j] === "S") {
        return [Number(i), Number(j)];
      }
    }
  }
};

const sLocation = findS(input);

const northS = input[sLocation[0] - 1][sLocation[1]];
const southS = input[sLocation[0] + 1][sLocation[1]];
const eastS = input[sLocation[0]][sLocation[1] + 1];

let currentRow;
let currentColumn;
let currentDirection;
if (northS === "|" || northS === "F" || northS === "7") {
  currentRow = sLocation[0] - 1;
  currentColumn = sLocation[1];
  currentDirection = directions.north;
} else if (southS === "|" || southS === "L" || southS === "J") {
  currentRow = sLocation[0] + 1;
  currentColumn = sLocation[1];
  currentDirection = directions.south;
} else if (eastS === "-" || eastS === "7" || eastS === "J") {
  currentRow = sLocation[0];
  currentColumn = sLocation[1] + 1;
  currentDirection = directions.east;
} else {
  currentRow = sLocation[0];
  currentColumn = sLocation[1] - 1;
  currentDirection = directions.west;
}

let count = 1;
while (input[currentRow][currentColumn] !== "S") {
  count++;
  [currentRow, currentColumn, currentDirection] = getNextLocation(
    currentRow,
    currentColumn,
    currentDirection
  );
}

console.log(count / 2);
