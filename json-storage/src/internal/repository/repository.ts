import mongoose from "mongoose";
import { Info } from "../domain/infoSchema";
import InfoRepo from "./infoRepo";

export interface IInfoRepo {
    db: typeof mongoose;
    getInfo(url: string): Promise<Info | null>;
    createInfoBody(info: Info): Promise<Info>;
}

class Repositories {
    infos: IInfoRepo;

    constructor(db: typeof mongoose) {
        this.infos = new InfoRepo(db);
    }
}

export default Repositories;