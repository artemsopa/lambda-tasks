import mongoose from "mongoose";
import Infos, { Info } from "../domain/infoSchema";
import { IInfoRepo } from "./repository";

class InfoRepo implements IInfoRepo {
    db: typeof mongoose;

    constructor(db: typeof mongoose) {
        this.db = db;
    }

    async getInfo(url: string): Promise<Info | null> {
        return await Infos.findOne({ urlPath: url });
    }

    async createInfoBody(info: Info): Promise<Info> {
        const updated = await Infos.findOneAndUpdate(
            { urlPath: info.urlPath },
            {
                $push: {
                    body: info.body
                }
            },
            { new: true, useFindAndModify: false }
        );
        if(!updated) {
            return await Infos.create(info);
        }
        return updated;
    }
}

export default InfoRepo;