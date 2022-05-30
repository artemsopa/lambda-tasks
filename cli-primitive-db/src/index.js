const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

const readFileAsync = (file) => {
  return new Promise((resolve, reject) =>
    fs.readFile(
      path.resolve(__dirname, file),
      { encoding: "utf8" },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      }
    )
  );
};

const appendFileAsync = (file, name, gender, age) => {
  return new Promise((reject) =>
    fs.appendFile(
      path.resolve(__dirname, file),
      `{\n\t"name": "${name}",\n\t"gender": "${gender}",\n\t"age": ${age}\n},`,
      (err) => {
        if (err) {
          return reject(err);
        }
      }
    )
  );
};

const nameQuestion = {
  type: "input",
  message: "Enter user's name. To cancel press ENTER:",
  name: "name",
  // validate: (input) => {
  //   return input.length < 5 ? "ERROR! Enter the name longer 4 symbols!" : true;
  // },
  // filter: (input) => {
  //   return input.length < 5 ? "" : input;
  // },
};

const infoQuestions = [
  {
    type: "list",
    message: "Choose your gender:",
    choices: ["male", "female"],
    name: "gender",
  },
  {
    type: "number",
    message: "Enter your age:",
    name: "age",
    validate: (input) => {
      return (
        (Number.isInteger(input) && Number(input) > 0 && Number(input) < 100) ||
        "ERROR! Enter a valid age greater then 0 and less then 100!"
      );
    },
    filter: (input) => {
      return Number.isNaN(input) || Number(input) < 1 || Number(input) > 100
        ? ""
        : input;
    },
  },
];

const searchQuestion = {
  type: "confirm",
  message: "Would you to search values in DB?",
  name: "isSearch"
};

const selectQuestion = {
  type: "input",
  message: "Enter user's name you wanna find in DB:",
  name: "name",
};

const createUser = async (name) => {
  const info = await inquirer.prompt(infoQuestions);
  await appendFileAsync("data.txt", name, info.gender, info.age);
}

const getUser = async () => {
  const confirm = await inquirer.prompt(searchQuestion);
  if (confirm.isSearch) {
    const str = await readFileAsync("data.txt");
    const data = JSON.parse("[" + str.slice(0, -1) + "]");
    console.log(data);
    const select = await inquirer.prompt(selectQuestion);
    const user = data.find(user => user.name === select.name);
    console.log("User", select.name, user ? `was found.\n${JSON.stringify(user)}` : "not found.");
  }
}

const main = async () => {
  try {
    const input = await inquirer.prompt(nameQuestion);
    if (input.name === "") {
      await getUser();
    } else {
      await createUser(input.name);
      await main();
    }
  } catch (error) {
    console.log(error);
  }
};

main();
