const readline = require("readline");

const getWordsString =
  "Hello. Enter 10 words or digits devidig them in spaces: ";
const selectSortingString =
  "How would you like to sort values:\n1. Words by name (from A to Z);\n2. Show digits from the smallest;\n3. Show digits from the biggest;\n4. Words by quantity of letters;\n5. Only unique words.\n\nSelect (1 - 5) and press ENTER: ";
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

const selectSorting = async (num, data, stdLine) => {
  switch (num) {
    case "1":
      console.log(1, data);
      break;
    case "2":
      console.log(2, data);
      break;
    case "3":
      console.log(3, data);
      break;
    case "4":
      console.log(4, data);
      break;
    case "5":
      console.log(5, data);
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
