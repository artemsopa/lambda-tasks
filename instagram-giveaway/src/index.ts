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

const getDataArr = (folder: string, file: string) => readFile(path.resolve(__dirname, folder, file))
    .then((data: string) => data.split(/\r?\n/))
    .then((data: string[]) => { return data });

const uniqueValues = async (filesCfg: FilesConfig, filesCount: number) => {
    let dataFiles: string[] = []
    for (let i = 0; i < filesCount; i++) {
        let temp = await getDataArr(filesCfg.path, `${filesCfg.name}${i}${filesCfg.ext}`);
        dataFiles = dataFiles.concat([...new Set(temp)]);
    }
    return [...new Set(dataFiles)].length;
}

const existInAllFiles = async (filesCfg: FilesConfig, filesCount: number) => {
    let count: number = 0;
    for (let i = 0; i < filesCount; i++) {
        count += (await getDataArr(filesCfg.path, `${filesCfg.name}${i}${filesCfg.ext}`)).length;
    }
    return count;
}

const existInAtLeastTen = async (filesCfg: FilesConfig) => {
    return existInAllFiles(filesCfg, 10)
}

const init = (): void => {
    const filesCfg: FilesConfig = new FilesConfig();
    getFilesLength(filesCfg.path)
    .then((count: number) => {
        console.log(`Files count: ${count}`);
        uniqueValues(filesCfg, count).then((count: number) => console.log(`Unique values: ${count}`));
        existInAllFiles(filesCfg, count).then((count: number) => console.log(`Exist in all files: ${count}`));
        existInAtLeastTen(filesCfg).then((count: number) => console.log(`Exist in at least 10 files: ${count}`));
    });
}

init();