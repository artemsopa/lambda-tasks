import mongoose from "mongoose";

const newDB = async (user: string, password: string, name: string) => {
    try {
        const client = await mongoose.connect(
            `mongodb+srv://${user}:${password}@cluster0.qs6q0vv.mongodb.net/${name}?retryWrites=true&w=majority`
        );
        console.log("Db connected successfuly");
        return client;
    } catch (error) {
        console.log(error);
    }
}

export default newDB;