/* This is based on a solution by HyperNeutrino https://youtu.be/g3Ms5e7Jdqo?si=FnFBRIBU1ZYgyNc1 */

const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

const cache = {};

const count = (configuration, numbers) => {
  if (configuration === "") {
    return numbers.length === 0 ? 1 : 0;
  } else if (numbers.length === 0) {
    return configuration.includes("#") ? 0 : 1;
  }

  const key = configuration + numbers.toString();
  if (key in cache) {
    return cache[key];
  }

  let result = 0;

  if (configuration[0] === "." || configuration[0] === "?") {
    result += count(configuration.slice(1), numbers);
  }

  if (
    (configuration[0] === "#" || configuration[0] === "?") &&
    numbers[0] <= configuration.length &&
    !configuration.slice(0, numbers[0]).includes(".") &&
    (numbers[0] === configuration.length || configuration[numbers[0]] !== "#")
  ) {
    result += count(configuration.slice(numbers[0] + 1), numbers.slice(1));
  }

  cache[key] = result;
  return result;
};

const input = fs.readFileSync(process.argv[2]).toString().split("\n");

let total = 0;

input.forEach((line) => {
  let [configuration, numbers] = line.split(" ");
  configuration += ("?" + configuration).repeat(4);
  numbers += ("," + numbers).repeat(4);
  numbers = numbers.split(",");
  for (let i in numbers) {
    numbers[i] = Number(numbers[i]);
  }
  total += count(configuration, numbers);
});

console.log(total);
