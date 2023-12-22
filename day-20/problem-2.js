const nodes = {};

class Broadcaster {
  constructor(destinationKeys) {
    this.destinations = destinationKeys;
  }

  pulse(pulseValue) {
    return pulseValue;
  }
}

class FlipFlop {
  constructor(destinationKeys) {
    this.destinations = destinationKeys;
    this.on = false;
  }

  pulse(pulseValue) {
    if (pulseValue) {
      return;
    } else {
      this.on = !this.on;
      return this.on;
    }
  }
}

class Conjunction {
  constructor(destinationKeys) {
    this.destinations = destinationKeys;
    this.sourceInputs = {};
  }

  addSource(key) {
    this.sourceInputs[key] = false;
  }

  pulse(pulseValue, source) {
    this.sourceInputs[source] = pulseValue;
    for (const key in this.sourceInputs) {
      if (!this.sourceInputs[key]) {
        return true;
      }
    }
    return false;
  }
}

const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

const input = fs.readFileSync(process.argv[2]).toString().split("\n");

for (const line of input) {
  let [node, destinations] = line.split(" -> ");
  destinations = destinations.split(", ");
  if (node.charAt(0) !== "%" && node.charAt(0) !== "&") {
    nodes["broadcaster"] = new Broadcaster(destinations);
  } else {
    const key = node.substring(1, node.length);
    nodes[key] =
      node.charAt(0) === "%"
        ? new FlipFlop(destinations)
        : new Conjunction(destinations);
  }
}

for (const key in nodes) {
  if (!(nodes[key] instanceof Conjunction)) {
    for (const destination of nodes[key].destinations) {
      if (nodes[destination] instanceof Conjunction) {
        nodes[destination].addSource(key);
      }
    }
  }
}

/* Explanation by user mebeim on Reddit helped me understand how to solve this https://www.reddit.com/r/adventofcode/comments/18ltr8m/comment/ke48wv2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button&rdt=35843
 * This wouldn't work on a more general problem but whatever.
 */

const queue = [];
let inputsToInputsToRx = ["pq", "fg", "dk", "fm"];
let i = 1;
const cycleCounts = [];

while (inputsToInputsToRx.length > 0) {
  queue.push({
    source: "button",
    pulseValue: false,
    destinations: ["broadcaster"],
  });
  while (queue.length > 0) {
    const nextPulse = queue.shift();
    for (const destination of nextPulse.destinations) {
      if (inputsToInputsToRx.includes(destination) && !nextPulse.pulseValue) {
        inputsToInputsToRx = inputsToInputsToRx.filter((x) => {
          return x !== destination;
        });
        cycleCounts.push(i);
      }
      const destinationNode = nodes[destination];
      if (destinationNode === undefined) {
        continue;
      }
      const pulse = destinationNode.pulse(
        nextPulse.pulseValue,
        nextPulse.source
      );
      if (pulse === undefined) {
        continue;
      }

      queue.push({
        source: destination,
        pulseValue: pulse,
        destinations: destinationNode.destinations,
      });
    }
  }
  i++;
}

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

console.log(leastCommonMultiple(cycleCounts));
