const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString().split("\n");
const hands = [];

for (let i in input) {
  const line = input[i].split(" ");
  hands.push({
    hand: line[0],
    bid: Number(line[1]),
  });
}

const getHandHistogram = (hand) => {
  const histogram = {
    A: 0,
    K: 0,
    Q: 0,
    T: 0,
    9: 0,
    8: 0,
    7: 0,
    6: 0,
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    J: 0,
  };
  for (let i in hand) {
    histogram[hand[i]]++;
  }
  return histogram;
};

const getHandScore = (hand) => {
  const histogram = getHandHistogram(hand);
  const counts = Object.values(histogram);

  if (counts.includes(5)) {
    return 6;
  } else if (counts.includes(4)) {
    return 5;
  } else if (counts.includes(3)) {
    if (counts.includes(2)) {
      return 4;
    }
    return 3;
  }

  const twoCount = counts.filter((count) => count === 2).length;
  switch (twoCount) {
    case 2:
      return 2;
    case 1:
      return 1;
    case 0:
    default:
      return 0;
  }
};

const highCardScore = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  9: 7,
  8: 6,
  7: 5,
  6: 4,
  5: 3,
  4: 2,
  3: 1,
  2: 0,
};

const compareHands = (a, b) => {
  let difference = getHandScore(a) - getHandScore(b);
  if (difference !== 0) {
    return difference;
  }

  for (let i in a) {
    difference = highCardScore[a[i]] - highCardScore[b[i]];
    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
};

hands.sort((a, b) => {
  return compareHands(a.hand, b.hand);
});

let sum = 0;
for (let i in hands) {
  let rank = 1 + Number(i);
  sum += rank * hands[i].bid;
}

console.log(sum);
