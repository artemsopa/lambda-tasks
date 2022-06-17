import mongoose, { Schema } from "mongoose";

export class Body {
    name: string;
    age: number;
    hobbies: string[];
    constructor(name: string, age: number, hobbies: string[]) {
        this.name = name;
        this.age = age;
        this.hobbies = hobbies;
    }
}

export class Info {
    urlPath: string;
    body: Body[];
    constructor(urlPath: string, body: Body[]) {
        this.urlPath = urlPath;
        this.body = body;
    }
}

const infoSchema = new Schema<Info>({
    urlPath: { type: String, required: true, minlength: 4, unique: true },
    body: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        hobbies: [{ type: String, minlength: 2 }],
    }]
});

const Infos = mongoose.model<Info>("Info", infoSchema);

export default Infos;