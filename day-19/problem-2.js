const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let [workflowList] = fs.readFileSync(process.argv[2]).toString().split("\n\n");
workflowList = workflowList.split("\n");

/* Based solution by Reddit user Polaric_Spiral https://www.reddit.com/r/adventofcode/comments/18ltr8m/comment/ke48wv2/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button&rdt=35843 */

const parseRule = (rule) => {
  if (!rule.includes(":")) {
    return { value: 0, operation: 1, category: "x", goto: rule };
  }

  const [evaluation, goto] = rule.split(":");
  const category = evaluation.charAt(0);
  const comparison = evaluation.charAt(1);
  const operation = comparison === "<" ? -1 : 1;
  const value = Number(evaluation.substring(2, evaluation.length));
  return { value, operation, category, goto };
};

const workflows = {};
for (const workflow of workflowList) {
  const [key, ruleList] = workflow.replace("}", "").split("{");
  const rules = ruleList.split(",").map(parseRule);
  workflows[key] = rules;
}

const getAcceptedCount = (part, workflow = "in") => {
  if (workflow === "R") {
    return 0;
  }

  if (workflow === "A") {
    let product = 1;
    Object.values(part).forEach(([low, high]) => {
      product *= high - low + 1;
    });
    return product;
  }

  let combinations = 0;

  for (const { value, operation, category, goto } of workflows[workflow]) {
    const [low, high] = part[category];
    if ((low - value) * operation > 0) {
      if ((high - value) * operation > 0) {
        return combinations + getAcceptedCount(part, goto);
      } else {
        const nextPart = { ...part };
        nextPart[category] = [low, value - 1];
        combinations += getAcceptedCount(nextPart);
        part[category] = [value, high];
      }
    } else if ((high - value) * operation > 0) {
      const nextPart = { ...part };
      nextPart[category] = [value + 1, high];
      combinations += getAcceptedCount(nextPart);
      part[category] = [low, value];
    }
  }
};

const [x, m, a, s] = Array(4).fill([1, 4000]);
console.log(getAcceptedCount({ x, m, a, s }));
