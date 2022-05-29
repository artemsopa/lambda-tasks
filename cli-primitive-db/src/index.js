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

const appendFileAsync = (file, data) => {
  return new Promise((reject) =>
    fs.appendFile(path.resolve(__dirname, file), data, (err) => {
      if (err) {
        return reject(err);
      }
    })
  );
};

const nameQuestion = {
  type: "input",
  message: "Enter the user's name. To cancel press ENTER:",
  name: "name",
  validate: (input) => {
    if (input === "") {
      return true;
    }
    return input.length < 5 ? "ERROR! Enter the name longer 4 symbols!" : true;
  },
  filter: (input) => {
    return input.length < 5 ? "" : input;
  },
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

const createPerson = async () => {
  try {
    const input = await inquirer.prompt(nameQuestion);
    if (input.name === "") {
      const data = await readFileAsync("data.txt");
      console.log(data);
    } else {
      const info = await inquirer.prompt(infoQuestions);
      const user = {
        name: input.name,
        gender: info.gender,
        age: info.age,
      };
      console.log(user);
      await appendFileAsync("data.txt", JSON.stringify(user, null, 2));
      await createPerson();
    }
  } catch (error) {
    console.log(error);
  }
};

createPerson();
