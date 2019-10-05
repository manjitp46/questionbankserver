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

  private async seachQuestionWithCategory(category: Array<string>) {
    try {
      var query = { categoryid: { $in: category } };
      var result = await this.db.collection(this.COLLECTION_NAME).find(query);
      return result.toArray();
    } catch (e) {
      throw e;
    }
  }

  public async refactorQuestionAndOptionSequence(categoryid: Array<string>) {
    let _this = this;
    let allQuestions = await this.seachQuestionWithCategory(categoryid);
    allQuestions = _this.shuffle(
      allQuestions.map((item: any, index: number) => {
        if (item.options) {
          item.options = _this.shuffle(item.options);
        }
        return item;
      })
    );
    return allQuestions;
  }

  public async listQuestions(params: object) {
    try {
      let allQuestions = await this.refactorQuestionAndOptionSequence(
        params["categoryid"]
      );
      return allQuestions;
    } catch (error) {
      throw error;
    }
  }
}
