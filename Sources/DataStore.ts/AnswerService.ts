import { BaseObject } from "../Utils/BaseObject";
import { MongoDataStore } from "./MongoDataStore";
import e = require("express");

export class AnswerService extends BaseObject {
  db: any;
  COLLECTION_NAME: string = "answersubmission";
  constructor() {
    super();
    this.db = MongoDataStore.db;
  }

  public async addAnswerAttempt(answer: object): Promise<any> {
    this.Logger.info("Saving Answer attempt", answer);
    try {
      var result = await this.db
        .collection(this.COLLECTION_NAME)
        .insertOne(answer);
      return result.ops;
    } catch (error) {
      throw error;
    }
  }

  public async getAnswerAttemptByID(answerID: string): Promise<any> {
    // this.Logger.info("Saving Answer attempt", answer);
    try {
      var result = await this.db
        .collection(this.COLLECTION_NAME)
        .find({
          attemptid: answerID
        })
        .project({
          _id: 0,
          "questiongenerated.answer": 0,
          "questiongenerated.categoryid": 0
        });
      result = await result.toArray();
      this.Logger.debug(result[0]);
      return await result[0];
    } catch (error) {
      throw error;
    }
  }

  public async attemptAnswer(questionObj: object): Promise<any> {
    try {
      var result;
      var query = {};
      var isQuestionExists = await this.checkIfQuestionIsAlreadyAnswered(
        questionObj
      );
      this.Logger.debug(isQuestionExists);
      if (!isQuestionExists.resultfound) {
        query = {
          $addToSet: {
            answers: {
              questionid: questionObj["questionid"],
              optionselected: questionObj["optionselected"]
            }
          }
        };
        this.Logger.debug(
          JSON.stringify({ attemptid: questionObj["attemptid"] })
        );

        result = await this.db
          .collection(this.COLLECTION_NAME)
          .updateOne({ attemptid: questionObj["attemptid"] }, query);
      } else {
        var queryObj = `answers\.${isQuestionExists.questionIndex}\.optionselected`;
        query["$set"] = {};
        query["$set"][queryObj] =   questionObj["optionselected"];
        this.Logger.debug("Query is",query)
        // query = {
        //   $set: {
        //     queryObj: questionObj["optionselected"]
        //   }
        // };
        this.Logger.debug(
          {
            attemptid: questionObj["attemptid"],
            "answers.questionid": questionObj["questionid"]
          },
          query
        );
        result = await this.db.collection(this.COLLECTION_NAME).updateOne(
          {
            attemptid: questionObj["attemptid"],
            "answers.questionid": questionObj["questionid"]
          },
          query
        );
      }

      return result;
    } catch (error) {
      throw e;
    }
  }

  private async checkIfQuestionIsAlreadyAnswered(
    questionObj: object
  ): Promise<any> {
    try {
      let query = {
        "answers.questionid": "6bb2af4d-b326-42ad-bc9c-eaee27898572"
      };
      var result = this.db.collection(this.COLLECTION_NAME).find(query);
      result = await result.toArray();
      var returnResult = {
        resultfound: result.length > 0,
        questionIndex: this.getQuestionIndex(
          (result.length > 0 && result[0]) || {},
          questionObj["questionid"]
        )
      };
      this.Logger.debug("Got Result as", returnResult);
      return returnResult;
    } catch (error) {
      throw e;
    }
  }

  private getQuestionIndex(answerObj: object, questionId: string) {
    if (answerObj["answers"]) {
      return answerObj["answers"].findIndex((item: any, index: number) => {
        return item["questionid"] === questionId;
      });
    }
  }
}
