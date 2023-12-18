const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");
for (let i in input) {
  input[i] = input[i].split("");
  for (let j in input[i]) {
    input[i][j] = Number(input[i][j]);
  }
}

const directions = {
  up: "UP",
  down: "DOWN",
  left: "LEFT",
  right: "RIGHT",
};

const getNeighbors = (node) => {
  const neighbors = [];
  if (node.direction === directions.down) {
    if (node.straightCount < 3 && node.row < input.length - 1) {
      neighbors.push({
        row: node.row + 1,
        column: node.column,
        direction: directions.down,
        straightCount: node.straightCount + 1,
      });
    }
  } else if (node.row < input.length - 1 && node.direction !== directions.up) {
    neighbors.push({
      row: node.row + 1,
      column: node.column,
      direction: directions.down,
      straightCount: 1,
    });
  }

  if (node.direction === directions.up) {
    if (node.straightCount < 3 && node.row > 0) {
      neighbors.push({
        row: node.row - 1,
        column: node.column,
        direction: directions.up,
        straightCount: node.straightCount + 1,
      });
    }
  } else if (node.row > 0 && node.direction !== directions.down) {
    neighbors.push({
      row: node.row - 1,
      column: node.column,
      direction: directions.up,
      straightCount: 1,
    });
  }

  if (node.direction === directions.right) {
    if (node.straightCount < 3 && node.column < input[node.row].length - 1) {
      neighbors.push({
        row: node.row,
        column: node.column + 1,
        direction: directions.right,
        straightCount: node.straightCount + 1,
      });
    }
  } else if (
    node.column < input[node.row].length - 1 &&
    node.direction !== directions.left
  ) {
    neighbors.push({
      row: node.row,
      column: node.column + 1,
      direction: directions.right,
      straightCount: 1,
    });
  }

  if (node.direction === directions.left) {
    if (node.straightCount < 3 && node.column > 0) {
      neighbors.push({
        row: node.row,
        column: node.column - 1,
        direction: directions.left,
        straightCount: node.straightCount + 1,
      });
    }
  } else if (node.column > 0 && node.direction !== directions.right) {
    neighbors.push({
      row: node.row,
      column: node.column - 1,
      direction: directions.left,
      straightCount: 1,
    });
  }

  return neighbors;
};

const frontier = [];
const costSoFar = {};

const compareNodes = (a, b) => {
  return (
    costSoFar[
      JSON.stringify({
        row: a.row,
        column: a.column,
        direction: a.direction,
        canMoveStraight: a.straightCount < 3,
      })
    ] -
    costSoFar[
      JSON.stringify({
        row: b.row,
        column: b.column,
        direction: b.direction,
        canMoveStraight: a.straightCount < 3,
      })
    ]
  );
};

const startNode = { row: 0, column: 0, direction: null, straightCount: 0 };
frontier.push(startNode);
const key = JSON.stringify({
  row: 0,
  column: 0,
  direction: null,
  canMoveStraight: true,
});
costSoFar[key] = 0;

while (frontier.length > 0) {
  const current = frontier.shift();
  const currentKey = JSON.stringify({
    row: current.row,
    column: current.column,
    direction: current.direction,
    canMoveStraight: current.straightCount < 3,
  });

  if (
    current.row === input.length - 1 &&
    current.column === input[current.row].length - 1
  ) {
    console.log(costSoFar[currentKey]);
    break;
  }

  const neighbors = getNeighbors(current);
  neighbors.forEach((neighbor) => {
    const neighborKey = JSON.stringify({
      row: neighbor.row,
      column: neighbor.column,
      direction: neighbor.direction,
      canMoveStraight: neighbor.straightCount < 3,
    });
    const newCost =
      costSoFar[currentKey] + input[neighbor.row][neighbor.column];
    if (!(neighborKey in costSoFar) || newCost < costSoFar[neighborKey]) {
      costSoFar[neighborKey] = newCost;
      frontier.push(neighbor);
      frontier.sort(compareNodes);
    }
  });
}
