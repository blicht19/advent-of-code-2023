const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let [workflowList, partList] = fs
  .readFileSync(process.argv[2])
  .toString()
  .split("\n\n");

workflowList = workflowList.split("\n");
partList = partList.split("\n");

const workflows = {};

workflowList.forEach((workflow) => {
  let [name, info] = workflow.split("{");
  info = info.substring(0, info.length - 1);
  info = info.split(",");

  const rules = [];
  for (let i = 0; i < info.length - 1; i++) {
    const [evaluation, goto] = info[i].split(":");
    const category = evaluation.charAt(0);
    const comparison = evaluation.charAt(1);
    const value = Number(evaluation.substring(2, evaluation.length));
    rules.push({ category, comparison, value, goto });
  }
  const nonMatchedState = info[info.length - 1];
  workflows[name] = { rules, nonMatchedState };
});

const parts = [];
partList.forEach((part) => {
  const currentPart = {};
  let line = part.substring(1, part.length - 1).split(",");
  line.forEach((pair) => {
    const [key, value] = pair.split("=");
    currentPart[key] = Number(value);
  });
  parts.push(currentPart);
});

const evaluateRules = (part, workflow) => {
  const rules = workflow.rules;
  for (let i in rules) {
    if (
      (rules[i].comparison === ">" &&
        part[rules[i].category] > rules[i].value) ||
      (rules[i].comparison === "<" && part[rules[i].category] < rules[i].value)
    ) {
      return rules[i].goto;
    }
  }
  return workflow.nonMatchedState;
};

const isPartAccepted = (part, currentEvaluation) => {
  if (currentEvaluation === "A") {
    return true;
  }
  if (currentEvaluation === "R") {
    return false;
  }

  return isPartAccepted(
    part,
    evaluateRules(part, workflows[currentEvaluation])
  );
};

const getPartSum = (part) => {
  return part.x + part.m + part.a + part.s;
};

const acceptedParts = [];
parts.forEach((part) => {
  if (isPartAccepted(part, "in")) {
    acceptedParts.push(part);
  }
});

let sum = 0;
acceptedParts.forEach((acceptedPart) => {
  sum += getPartSum(acceptedPart);
});

console.log(sum);
