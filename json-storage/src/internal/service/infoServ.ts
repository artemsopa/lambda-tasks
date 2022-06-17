import { Body, Info } from "../domain/infoSchema";
import { IInfoRepo } from "../repository/repository";
import { BodyS, InfoS, IInfoServ } from "./service";

class InfoServ implements IInfoServ {
    private infoRepo: IInfoRepo;

    constructor(infoRepo: IInfoRepo) {
        this.infoRepo = infoRepo;
    }

    async getInfo(url: string): Promise<BodyS[]> {
        const infosRepo = await this.infoRepo.getInfo(url);
        const infos: BodyS[] = [];
        infosRepo?.body.forEach(item => infos.push(new BodyS(item.name, item.age, item.hobbies)))
        return infos;
    }

    async createInfo(info: InfoS): Promise<BodyS[]> {
        const pushBody: Body[] = [];
        info.body.forEach(item => pushBody.push(new Body(item.name, item.age, item.hobbies)))
        const pushInfo: Info = new Info(info.urlPath, pushBody);
        const infosRepo = await this.infoRepo.createInfoBody(pushInfo)
        const infos: BodyS[] = [];
        infosRepo?.body.forEach(item => infos.push(new BodyS(item.name, item.age, item.hobbies)))
        return infos;
    }
}

export default InfoServ;