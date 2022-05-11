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

const uniqueValues = async (filesCfg: FilesConfig, filesCount: number) => {
    let res: string[] = [];
    for (let i = 0; i < filesCount; i++) {
        let temp = await getDataArr(filesCfg.path, `${filesCfg.name}${i}${filesCfg.ext}`);
        res = res.concat([... new Set(temp)]);
    }
    return res.length;
}

const existInAllFiles = async (filesCfg: FilesConfig, filesCount: number) => {
    let res: string[] = [];
    for (let i = 0; i < filesCount; i++) {
        let temp = await getDataArr(filesCfg.path, `${filesCfg.name}${i}${filesCfg.ext}`);
        res = res.concat([... new Set(temp)]);
    }
    return [... new Set(res)].length;
}

const existInAtLeastTen = async (filesCfg: FilesConfig) => {
    return await existInAllFiles(filesCfg, 10);
}

const init = async () => {
    try {
        const filesCfg: FilesConfig = new FilesConfig();
        const length = await getFilesLength(filesCfg.path)

        console.log(`Files count: ${length}\n`);

        console.time('Time');

        console.log("Unique values: " + await uniqueValues(filesCfg, length));
        console.log("Exist in all files: " + await existInAllFiles(filesCfg, length));
        console.log("Exist in at least at 10: " + await existInAtLeastTen(filesCfg) + "\n");

        console.timeEnd('Time');
    } catch (error) {
        console.log(error);
    }
}

init();
