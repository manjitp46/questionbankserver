import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { BaseObject } from "../Utils/BaseObject";
import { HTTPServer } from "../Core/Interfaces/HTTPServer";
import { BaseRestResource } from "./Interfaces/BaseRestResource";
import { QuestionService } from "../DataStore.ts/QuestionService";

export class Questions extends BaseObject implements BaseRestResource {
  initialize(httpServer: HTTPServer): void {
    httpServer.post("/addquestion", this.addQuestion.bind(this));
  }

  public async addQuestion(
    req: Request,
    res: Response,
    next: Function
  ): Promise<any> {
    let reqBody = req.body;
    this.Logger.debug(reqBody);
    var responseToReturn = {};
    var responseStatusCode = this.HTTP_CODES.HTTP_RESOURCE_CREATED;
    responseToReturn["Message"] = "Succesfully Added";
    responseToReturn["ErrorCode"] = 0;
    responseToReturn["Data"] = null;
    if (
      !reqBody.categoryid ||
      !reqBody.question ||
      !reqBody.options ||
      !reqBody.answer ||
      !reqBody.questiontype
    ) {
      responseStatusCode = this.HTTP_CODES.BAD_REQUEST;
      responseToReturn["Message"] = "Mandatory params are missing!";
      responseToReturn["ErrorCode"] = -1;
    } else {
      reqBody["questionid"] = uuid();
      let questionService = new QuestionService();
      try {
        let result = await questionService.addQuestionToDB(reqBody);
        responseToReturn["Data"] = result.ops;
      } catch (error) {
          throw error;
      }
    }
    res.status(responseStatusCode).send(responseToReturn);
  }
}
