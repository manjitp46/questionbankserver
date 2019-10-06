import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { BaseObject } from "../Utils/BaseObject";
import { HTTPServer } from "../Core/Interfaces/HTTPServer";
import { BaseRestResource } from "./Interfaces/BaseRestResource";
import { CategoryService } from "../DataStore.ts/CategoryService";
import { AnswerService } from "../DataStore.ts/AnswerService";

export class Answer extends BaseObject implements BaseRestResource {
  initialize(httpServer: HTTPServer): void {
    httpServer.post('/answer', this.attemptAnswer.bind(this));
  }

  public async attemptAnswer(req: Request, res: Response, next: Function) {
    var responseToReturn = {};
    var responseStatusCode = this.HTTP_CODES.HTTP_OK;
    responseToReturn["Message"] = "Succesfully Added";
    responseToReturn["ErrorCode"] = 0;
    responseToReturn["Data"] = null;
    var answerService = new AnswerService();
    try {
        var reqBody = req.body;
        var result = await answerService.attemptAnswer(reqBody);
        responseToReturn["Data"] = result;
    } catch (error) {
        throw error;
    }
    res.status(responseStatusCode).send(responseToReturn);
  }
}
