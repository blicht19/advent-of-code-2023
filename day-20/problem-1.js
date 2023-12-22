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

const queue = [];
let lowPulses = 0;
let highPulses = 0;
let i;

for (i = 1; i <= 1000; i++) {
  queue.push({
    source: "button",
    pulseValue: false,
    destinations: ["broadcaster"],
  });
  while (queue.length > 0) {
    const nextPulse = queue.shift();
    for (const destination of nextPulse.destinations) {
      if (nextPulse.pulseValue) {
        highPulses++;
      } else {
        lowPulses++;
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
}

console.log(lowPulses * highPulses);
