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
    if (currentNode === "ZZZ") {
      return count;
    }

    const direction = rightLeft.charAt(count % rightLeft.length);
    currentNode = mappings[currentNode][direction];
    count++;
  }
};

console.log(getDistanceToEnd("AAA"));
