import Repositories from "../repository/repository";
import InfoServ from './infoServ';

export class BodyS {
    name: string;
    age: number;
    hobbies: string[];
    constructor(name: string, age: number, hobbies: string[]) {
        this.name = name;
        this.age = age;
        this.hobbies = hobbies;
    }
}

export class InfoS {
    urlPath: string;
    body: BodyS[];
    constructor(urlPath: string, body: BodyS[]) {
        this.urlPath = urlPath;
        this.body = body;
    }
}

export interface IInfoServ {
    getInfo(url: string): Promise<BodyS[]>;
    createInfo(info: InfoS): Promise<BodyS[]>;
}

export class Deps {
    repos: Repositories;
    constructor(repos: Repositories) {
        this.repos = repos;
    }
}

export class Services {
    infos: IInfoServ;
    constructor(deps: Deps) {
        this.infos = new InfoServ(deps.repos.infos);
    }
}