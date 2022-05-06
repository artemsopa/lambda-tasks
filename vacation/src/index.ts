import fs from "fs";
import path from "path";
require('dotenv').config();

class Configs {
    input: string;
    output: string;
    constructor() {
        this.input = process.env.INPUT_JSON || "input.json";
        this.output = process.env.OUTPUT_JSON || "output.json";
    }
}

interface UserJSON {
    _id: string;
    name: string;
}

interface WeekendDateJSON {
    _id: string;
    user: UserJSON;
    usedDays: number;
    startDate: string;
    endDate: string;
    status: string;
}

class User {
    userId: string;
    name: string;
    weekendDates: WeekendDate[];
    constructor(userId: string, name: string) {
        this.userId = userId;
        this.name = name;
        this.weekendDates = []
    }
}

class WeekendDate {
    startDate: string;
    endDate: string;
    constructor(startDate: string, endDate: string) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

const readFileAsync = (file: string) => {
    return new Promise<string>((resolve, reject) => fs.readFile(path.resolve(__dirname, file),
        { encoding: "utf8" }, (err, data: string) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        }))
}

const writeFileAsync = (file: string, data: string) => {
    return new Promise((reject) => fs.writeFile(path.resolve(__dirname, file),
        data, (err) => {
            if (err) {
                return reject(err);
            }
        }))
}

const getUniqueList = (arr: WeekendDateJSON[]) => {
    let users: User[] = [];

    arr.forEach(val => {
        let user = users.find(item => item.userId == val.user._id);
        if (!user) {
            user = new User(val.user._id, val.user.name)
            users.push(user);
        }
        user.weekendDates.push(new WeekendDate(val.startDate, val.endDate));
    })

    return users;
}

const printList = (users: User[]) => {
    users.forEach(user => {
        console.log(`${user.userId} ${user.name}:`);
        user.weekendDates.forEach(date => {
            console.log(`  { ${date.startDate} — ${date.endDate} }`);
        })
        console.log()
    })
    return users;
}

const init = () => {
    const cfg = new Configs();
    readFileAsync(cfg.input)
        .then((data: string) => JSON.parse(data) as WeekendDateJSON[])
        .then((data: WeekendDateJSON[]) => getUniqueList(data))
        .then((data: User[]) => printList(data))
        .then((data: User[]) => writeFileAsync(cfg.output, JSON.stringify(data, null, "\t")))
}

init();