import { BaseObject } from "../Utils/BaseObject";
import { MongoDataStore } from "./MongoDataStore";
import { CategoryService } from "./CategoryService";

export class QuestionService extends BaseObject {
  db: any;
  COLLECTION_NAME: string = "questions";
  cateGoryService: CategoryService;
  constructor() {
    super();
    this.db = MongoDataStore.db;
    this.cateGoryService = new CategoryService();
  }

  public async addQuestionToDB(question: object) {
    try {
      let categorIDs = question["categoryid"];
      let isCategoryExists = await this.cateGoryService.isCategoryExists(
        categorIDs
      );
      if (isCategoryExists) {
        var result = await this.db
          .collection(this.COLLECTION_NAME)
          .insertOne(question);
        return result;
      } else {
        throw new Error("Category not exists");
      }
    } catch (error) {
      throw error;
    }
  }
}
