const getHalfLength = (reflectionPoint, length) => {
  return Math.min(length - reflectionPoint - 1, reflectionPoint + 1);
};

const getStringAtReflectionPoint = (string, reflectionPoint) => {
  const halfLength = getHalfLength(reflectionPoint, string.length);
  return string.substring(
    reflectionPoint - halfLength + 1,
    reflectionPoint + halfLength + 1
  );
};

const getArrayAtReflectionPoint = (stringArray, reflectionPoint) => {
  const halfLength = getHalfLength(reflectionPoint, stringArray.length);
  return stringArray.slice(
    reflectionPoint - halfLength + 1,
    reflectionPoint + halfLength + 1
  );
};

const isPalindrome = (string) => {
  if (string.length === 1) {
    return true;
  }

  if (string.charAt(0) !== string.slice(-1)) {
    return false;
  }

  if (string.length > 2) {
    return isPalindrome(string.substring(1, string.length - 1));
  }

  return true;
};

const arrayIsPalindrome = (stringArray) => {
  if (stringArray.length === 1) {
    return true;
  }

  if (stringArray[0] !== stringArray.at(-1)) {
    return false;
  }

  if (stringArray.length > 2) {
    return arrayIsPalindrome(stringArray.slice(1, stringArray.length - 1));
  }

  return true;
};

const getColumnReflectionPoints = (pattern) => {
  const patternLines = pattern.split("\n");
  const firstLine = patternLines[0];
  const reflectionPoints = [];

  for (let i = 0; i < firstLine.length - 1; i++) {
    let isReflectionPoint = isPalindrome(
      getStringAtReflectionPoint(firstLine, i)
    );
    for (let j = 1; j < patternLines.length; j++) {
      if (isReflectionPoint) {
        isReflectionPoint = isPalindrome(
          getStringAtReflectionPoint(patternLines[j], i)
        );
      } else {
        break;
      }
    }
    if (isReflectionPoint) {
      reflectionPoints.push(i);
    }
  }
  return reflectionPoints;
};

const getRowReflectionPoints = (pattern) => {
  const stringArray = pattern.split("\n");
  const reflectionPoints = [];

  for (let i = 0; i < stringArray.length - 1; i++) {
    if (arrayIsPalindrome(getArrayAtReflectionPoint(stringArray, i))) {
      reflectionPoints.push(i);
    }
  }

  return reflectionPoints;
};

const getPatternNumber = (pattern) => {
  let sum = 0;
  const columnReflectionPoints = getColumnReflectionPoints(pattern);
  const rowReflectionPoints = getRowReflectionPoints(pattern);

  columnReflectionPoints.forEach((point) => {
    sum += 1 + point;
  });

  rowReflectionPoints.forEach((point) => {
    sum += (1 + point) * 100;
  });

  return sum;
};

const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Requires filename as argument");
  process.exit(1);
}

let input = fs.readFileSync(process.argv[2]).toString();
input = input.split(/\n\s*\n/);

let sum = 0;

input.forEach((section) => {
  sum += getPatternNumber(section);
});

console.log(sum);
