const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");

const plan = [];
input.forEach((line) => {
  let [, , hex] = line.split(" ");
  hex = hex.replace(/[()]/g, "");
  const direction = hex.charAt(hex.length - 1);
  const distance = hex.substring(1, hex.length - 1);
  plan.push({ direction, distance: BigInt("0x" + distance) });
});

const absoluteValue = (x) => {
  return x < 0n ? -x : x;
};

const vertices = [];
let x = 0n;
let y = 0n;
vertices.push({ x, y });

let perimeter = 0n;
plan.forEach((instruction) => {
  switch (instruction.direction) {
    case "3":
      y += instruction.distance;
      break;
    case "1":
      y -= instruction.distance;
      break;
    case "0":
      x += instruction.distance;
      break;
    case "2":
      x -= instruction.distance;
      break;
  }
  perimeter += instruction.distance;
  vertices.push({ x, y });
});

vertices.pop();

const shoeLace = (vertices) => {
  let xy = 0n;
  let yx = 0n;
  for (let i = 0; i < vertices.length - 1; i++) {
    xy += BigInt(vertices[i].x) * BigInt(vertices[i + 1].y);
    yx += BigInt(vertices[i].y) * BigInt(vertices[i + 1].x);
  }
  xy += BigInt(vertices.at(-1).x * vertices[0].y);
  yx += BigInt(vertices.at(-1).y * vertices[0].x);

  return absoluteValue(xy - yx) / 2n;
};

console.log(shoeLace(vertices) + perimeter / 2n + 1n);
