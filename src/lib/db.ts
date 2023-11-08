import { MongoClient, ServerApiVersion } from "mongodb";

// TODO: Better get env
const clusterUrl = import.meta.env.MONGODB_CLUSTER_URL ?? "";
const username = import.meta.env.MONGODB_USERNAME ?? "";
const password = import.meta.env.MONGODB_PASSWORD ?? "";
const database = import.meta.env.MONGODB_DATABASE ?? "";

console.log("TESTING");
console.log(clusterUrl);
console.log(username);
console.log(password);
console.log(database);

const uri = clusterUrl
    .replace("<username>", username)
    .replace("<password>", password);

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export { client, database };
