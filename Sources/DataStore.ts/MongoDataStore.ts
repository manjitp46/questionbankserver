import { MongoClient, Db } from "mongodb";
import { BaseObject } from "../Utils/BaseObject";

export class MongoDataStore extends BaseObject {
  public static db: any;
  private constructor() {
    super();
  }

  private getConnectionParams(): object {
    let dbConfig = this.ServerConfigs.dbConfigs[this.NODE_ENV];
    let serverOptions = dbConfig.serverOptions;
    let dbName = dbConfig.dbName;
    let connectionString = `${dbConfig.scheme}${dbConfig.host}:${dbConfig.port}`;
    this.Logger.info("Prepared DBConnection String as ", connectionString);
    this.Logger.debug(serverOptions);
    return { connectionString, serverOptions, dbName };
  }

  private async connect(): Promise<void> {
    try {
      let connectionParams = this.getConnectionParams();
      let connection = await MongoClient.connect(
        connectionParams["connectionString"]
      );
      this.Logger.info("Connected to db");
      MongoDataStore.db = connection.db(connectionParams["dbName"]);
      return MongoDataStore.db;
    } catch (error) {
      this.Logger.error("Not connected to db", error);
    }
  }

  public static async getInstance() {
    if (MongoDataStore.db) {
      return MongoDataStore.db;
    } else {
      MongoDataStore.db = await new MongoDataStore().connect();
      return MongoDataStore.db;
    }
  }
}
