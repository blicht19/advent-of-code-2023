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
      input[row][column] = "!";
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
      input[row][column] = "=";
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
      input[row][column] = "]";
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
      input[row][column] = "}";
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
      input[row][column] = "{";
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
      input[row][column] = "[";
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

const northS = sLocation[0] > 0 ? input[sLocation[0] - 1][sLocation[1]] : "";
const southS =
  sLocation[0] + 1 < input.length ? input[sLocation[0] + 1][sLocation[1]] : "";
const eastS =
  sLocation[1] + 1 < input[0].length
    ? input[sLocation[0]][sLocation[1] + 1]
    : "";

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
const startingDirection = currentDirection;

while (input[currentRow][currentColumn] !== "S") {
  [currentRow, currentColumn, currentDirection] = getNextLocation(
    currentRow,
    currentColumn,
    currentDirection
  );
}

switch (currentDirection) {
  case directions.north:
    switch (startingDirection) {
      case directions.north:
        input[currentRow][currentColumn] = "!";
        break;
      case directions.east:
        input[currentRow][currentColumn] = "[";
        break;
      case directions.west:
        input[currentRow][currentColumn] = "]";
        break;
      default:
        throw new Error("Invalid S location");
    }
    break;
  case directions.south:
    switch (startingDirection) {
      case directions.south:
        input[currentRow][currentColumn] = "!";
        break;
      case directions.east:
        input[currentRow][currentColumn] = "{";
        break;
      case directions.west:
        input[currentRow][currentColumn] = "}";
        break;
      default:
        throw new Error("Invalid S location");
    }
    break;
  case directions.east:
    switch (startingDirection) {
      case directions.east:
        input[currentRow][currentColumn] = "=";
        break;
      case directions.north:
        input[currentRow][currentColumn] = "}";
        break;
      case directions.south:
        input[currentRow][currentColumn] = "]";
        break;
      default:
        throw new Error("Invalid S location");
    }
    break;
  case directions.west:
    switch (startingDirection) {
      case directions.west:
        input[currentRow][currentColumn] = "=";
        break;
      case directions.north:
        input[currentRow][currentColumn] = "{";
        break;
      case directions.south:
        input[currentRow][currentColumn] = "[";
        break;
      default:
        throw new Error("Invalid S location");
    }
    break;
  default:
    throw new Error("Invalid direction");
}

let count = 0;
for (let i in input) {
  let line = input[i].join("");
  line = line.replace(/({=*])|(\[=*})/g, "!");
  line = line.replace(/[[{]=*[\]}]/g, "");
  const matches = line.match(/![^!]*!/g);
  for (let j in matches) {
    count += matches[j].length - 2;
  }
}

console.log(count);
