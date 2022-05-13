import fs from "fs";
import path from "path";
require('dotenv').config();

class FilesConfig {
    path: string;
    name: string;
    ext: string;
    constructor() {
        this.path = process.env.FILES_PATH || "..\\static";
        this.name = process.env.FILES_NAME || "out";
        this.ext = process.env.FILES_EXT || ".txt";
    }
}

const getFilesLength = async (filesPath: string) => {
    return new Promise<number>((resolve, reject) => fs.readdir(path.resolve(__dirname, filesPath), (err, data) => {
        if (err) {
            return reject(err);
        }
        resolve(data.length);
    }))
}

const readFile = (path: string) => {
    return new Promise<string>((resolve, reject) => fs.readFile(path, { encoding: "utf-8" }, (err, data: string) => {
        if (err) {
            return reject(err);
        }
        resolve(data);
    }))
}

const getDataArr = async (folder: string, file: string) => {
    const data = await readFile(path.resolve(__dirname, folder, file))
    return data.split(/\r?\n/);
}

const getAllDataArr = async (filesCfg: FilesConfig, filesCount: number) => {
    let arr: string[][] = [];
    for (let i = 0; i < filesCount; i++) {
        arr.push(await getDataArr(filesCfg.path, `${filesCfg.name}${i}${filesCfg.ext}`));
    }
    return arr;
}

const uniqueValues = (arr: string[][]) => {
    let result: string[] = [];
    for (let i = 0; i < arr.length; i++) {
        result = result.concat(arr[i]);
    }
    return [... new Set(result)].length;
}

// const existInAllFiles = async (arr: string[][]) => {
//     let temp: string[][] = [];
//     for (let i = 0; i < arr.length; i++) {
//         temp.push([... new Set(arr[i])]);
//     }

//     let result: string[] = [];
//     for (let i = 0; i < temp[0].length; i++) {
//         let count = 1;
//         for (let j = 1; j < temp.length; j++) {
//             if (temp[j].includes(temp[0][i])) {
//                 count++;
//             } else {
//                 break;
//             }
//         }
//         if (count === arr.length) {
//             result.push(temp[0][i]);
//         }
//     }

//     return result.length;
// }

const existInAllFiles = (arr: string[][], count: number = arr.length) => {
    let temp: string[] = [];
    for (let i = 0; i < arr.length; i++) {
        temp = temp.concat([... new Set(arr[i])]);
    }

    const map = new Map();
    for (let el of temp) {
        let counter = map.get(el);
        map.set(el, counter ? counter + 1 : 1);
    }
    const result: string[] = [];
    for (let [el, counter] of map.entries())
        if (counter >= count) {
            result.push(el);
        }
    return result.length;
}

const existInAtLeast = async (arr: string[][]) => {
    return existInAllFiles(arr, 10);
}

const init = async () => {
    try {
        const filesCfg: FilesConfig = new FilesConfig();
        const length = await getFilesLength(filesCfg.path)
        const arr = await getAllDataArr(filesCfg, length)

        console.log(`Files count: ${length}\n`);

        console.time('Time');

        console.log("Unique values: " + await uniqueValues(arr));
        console.log("Exist in all files: " + await existInAllFiles(arr));
        console.log("Exist in at least at 10: " + await existInAtLeast(arr) + "\n");

        console.timeEnd('Time');
    } catch (error) {
        console.log(error);
    }
}

init();

function foo(arr: string[], copies: number) {
}
