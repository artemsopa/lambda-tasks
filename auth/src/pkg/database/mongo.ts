import { Db, MongoClient, ServerApiVersion } from "mongodb";

async function newDB(user: string, password: string, name: string): Promise<Db | undefined> {
    try {
        const client: MongoClient = new MongoClient(
            `mongodb+srv://${user}:${password}@cluster0.8i4n2.mongodb.net/${name}?retryWrites=true&w=majority`, 
            { serverApi: ServerApiVersion.v1 });
        await client.connect();
        console.log("Db connected successfuly")
        return client.db();
    } catch (error) {
        console.log(error);
    }
}

export default newDB;