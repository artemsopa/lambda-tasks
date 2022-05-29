const readline = require("readline");

const getWordsString =
  "Hello. Enter 10 words or digits devidig them in spaces: ";
const selectSortingString =
  "How would you like to sort values:\n1. Words by name (from A to Z);\n2. Show digits from the smallest;\n3. Show digits from the biggest;\n4. Words by quantity of letters;\n5. Only unique words.\n6. Only unique values.\n\nSelect (1 - 6) and press ENTER: ";
const errorString = "ERROR! Try existing sorting number: ";
const exitString = "Good bye! Come back again!";

function prompt(question, stdLine) {
  return new Promise((resolve, reject) => {
    stdLine.question(question, (answer) => {
      if (answer === "exit") {
        stdLine.close();
        reject(exitString);
      } else resolve(answer);
    });
  });
}

const filterNaN = (item) => {
  return isNaN(item) ? true : false;
};

const filterNum = (item) => {
  return Number(item) ? true : false;
};

const selectSorting = async (num, data, stdLine) => {
  const arr = data.split(" ");
  switch (num) {
    case "1":
      console.log(
        arr.filter((item) => filterNaN(item)).sort((a, b) => a.localeCompare(b))
      );
      break;
    case "2":
      console.log(
        arr
          .filter((item) => filterNum(item))
          .sort((a, b) => {
            return a - b;
          })
      );
      break;
    case "3":
      console.log(
        arr
          .filter((item) => filterNum(item))
          .sort((a, b) => {
            return b - a;
          })
      );
      break;
    case "4":
      console.log(
        arr
          .filter((item) => filterNaN(item))
          .sort((a, b) => {
            return a.length - b.length;
          })
      );
      break;
    case "5":
      console.log([...new Set(arr.filter((item) => filterNaN(item)))]);
      break;
    case "6":
      console.log([...new Set(arr)]);
      break;
    default:
      const existing = await prompt(errorString, stdLine);
      await selectSorting(existing, data, stdLine);
  }
};

const getWords = async (stdLine) => {
  try {
    const data = await prompt(getWordsString, stdLine);
    const method = await prompt(selectSortingString, stdLine);
    await selectSorting(method, data, stdLine);
    await getWords(stdLine);
  } catch (error) {
    console.log(error);
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

getWords(rl);
