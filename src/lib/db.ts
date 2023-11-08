import { MongoClient, ServerApiVersion } from "mongodb";

const clusterUrl =
    import.meta.env.MONGODB_CLUSTER_URL ?? process.env.MONGODB_CLUSTER_URL;
const username =
    import.meta.env.MONGODB_USERNAME ?? process.env.MONGODB_USERNAME;
const password =
    import.meta.env.MONGODB_PASSWORD ?? process.env.MONGODB_PASSWORD;
const database =
    import.meta.env.MONGODB_DATABASE ?? process.env.MONGODB_DATABASE;

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
