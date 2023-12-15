const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString();
const rightLeft = input.match(/[RL]+\n/g)[0].replace("\n", "");
const mapLines = input.match(/.{3} = \(.{3}, .{3}/g);

const mappings = {};
for (let i in mapLines) {
  const [key, values] = mapLines[i].split(" = (");
  const [left, right] = values.split(", ");

  mappings[key] = { L: left, R: right };
}

const getDistanceToEnd = (node) => {
  let count = 0;
  let currentNode = node;

  while (true) {
    if (currentNode.charAt(2) === "Z") {
      return count;
    }

    const direction = rightLeft.charAt(count % rightLeft.length);
    currentNode = mappings[currentNode][direction];
    count++;
  }
};

/* leastCommonMultiple based on this StackOverflow answer:
 * https://stackoverflow.com/a/31302607 */
const leastCommonMultiple = (integerArray) => {
  const greatestCommonDenominator = (a, b) => {
    return !b ? a : greatestCommonDenominator(b, a % b);
  };

  const lcm = (a, b) => {
    return (a * b) / greatestCommonDenominator(a, b);
  };

  let multiple = integerArray[0];

  integerArray.forEach((integer) => {
    multiple = lcm(multiple, integer);
  });

  return multiple;
};

const distances = [];
for (let key in mappings) {
  if (key.charAt(2) === "A") {
    distances.push(getDistanceToEnd(key));
  }
}

console.log(leastCommonMultiple(distances));
