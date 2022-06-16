import fs from "fs";
import path from "path";

const readFile = (filePath: string) => {
    return new Promise<string>((resolve, reject) =>
        fs.readFile(path.resolve(__dirname, filePath),
            { encoding: "utf-8" }, (err, data: string) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            }))
};

export default readFile;