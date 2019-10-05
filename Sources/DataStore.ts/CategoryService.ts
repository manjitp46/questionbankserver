import { BaseObject } from "../Utils/BaseObject";
import { MongoDataStore } from "./MongoDataStore";

export class CategoryService extends BaseObject {
  db: any;
  COLLECTION_NAME: string = "category";
  public constructor() {
    super();
    this.db = MongoDataStore.db;
  }

  // private createIndexes() {
  //   let result = this.db.collection(this.COLLECTION_NAME).createIndex()
  // }

  public async addCategory(categoryObj: object): Promise<any> {
    try {
      let results = await this.db
        .collection(this.COLLECTION_NAME)
        .insertOne(categoryObj);
      return results;
    } catch (e) {
      throw e;
    }
  }
  public async getCategory(): Promise<any> {
    try {
      this.Logger.debug("Listing Results");
      let results = await this.db.collection(this.COLLECTION_NAME).find({});
      this.Logger.debug(await results.toArray());
      return await results.toArray();
    } catch (e) {
      throw e;
    }
  }

  public async isCategoryExists(categoryID: Array<any>): Promise<boolean> {
    try {
      let distinctCategoryID = await this.db
        .collection(this.COLLECTION_NAME)
        .distinct("categoryid");
      var result = categoryID.filter(i => {
        return distinctCategoryID.indexOf(i) == -1;
      });
      return true ? result.length === 0 : false;
    } catch (error) {
      throw error;
    }
  }
}
