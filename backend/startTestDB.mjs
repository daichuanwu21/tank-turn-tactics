import { MongoMemoryReplSet } from "mongodb-memory-server-core";

const mongod = new MongoMemoryReplSet({
  instanceOpts: [
    {
      port: 27017,
      priority: 100,
      storageEngine: "wiredTiger",
    },
    {
      port: 27018,
      priority: 50,
      storageEngine: "wiredTiger",
    },
    {
      port: 27019,
      priority: 1,
      storageEngine: "wiredTiger",
    },
  ],
  binary: {
    version: "6.0.7",
    systemBinary: "/usr/bin/mongod",
  },
  replSet: {
    ip: "127.0.0.1",
  },
});

mongod.start().then(() => console.log(mongod.getUri()));
