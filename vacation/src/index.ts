import fs from "fs";
import path from "path";
//require('dotenv').config();

interface UserJSON {
    _id: string;
    name: string;
}

interface WeekendDateJSON {
    _id: string;
    user: User;
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

const readFile = (path: string) => {
    return new Promise<string>((resolve, reject) => fs.readFile(path, { encoding: "utf8" }, (err, data: string) => {
        if (err) {
            return reject(err);
        }
        resolve(data);
    }))
}


const init = () => {
    readFile(path.resolve(__dirname, "data.json")).then((data: string) => {
        let weks: WeekendDateJSON[] = [];
        weks = JSON.parse(data);
        console.log(weks);
    } );
}

init();