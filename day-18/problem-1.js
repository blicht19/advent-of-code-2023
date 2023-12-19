const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");

const plan = [];
input.forEach((line) => {
  const [direction, distance] = line.split(" ");
  plan.push({ direction, distance: Number(distance) });
});

const vertices = [];

let x = 0;
let y = 0;
vertices.push({ x, y });

let perimeter = 0;
plan.forEach((instruction) => {
  switch (instruction.direction) {
    case "U":
      y += instruction.distance;
      break;
    case "D":
      y -= instruction.distance;
      break;
    case "R":
      x += instruction.distance;
      break;
    case "L":
      x -= instruction.distance;
      break;
  }
  perimeter += instruction.distance;
  vertices.push({ x, y });
});

vertices.pop();

const shoeLace = (vertices) => {
  let xy = 0;
  let yx = 0;
  for (let i = 0; i < vertices.length - 1; i++) {
    xy += vertices[i].x * vertices[i + 1].y;
    yx += vertices[i].y * vertices[i + 1].x;
  }
  xy += vertices.at(-1).x * vertices[0].y;
  yx += vertices.at(-1).y * vertices[0].x;

  return 0.5 * Math.abs(xy - yx);
};

console.log(shoeLace(vertices) + perimeter / 2 + 1);
