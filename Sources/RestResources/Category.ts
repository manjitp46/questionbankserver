import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { BaseObject } from "../Utils/BaseObject";
import { HTTPServer } from "../Core/Interfaces/HTTPServer";
import { BaseRestResource } from "./Interfaces/BaseRestResource";
import { CategoryService } from "../DataStore.ts/CategoryService";
import e = require("express");

export class Category extends BaseObject implements BaseRestResource {
  initialize(httpServer: HTTPServer): void {
    httpServer.get("/listcategory", this.listAllCategory.bind(this));
    httpServer.post("/addcategory", this.addCategory.bind(this));
  }

  private async listAllCategory(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    var responseToReturn = {};
    var responseStatusCode = this.HTTP_CODES.HTTP_OK;
    responseToReturn["Message"] = "Succesfully Added";
    responseToReturn["ErrorCode"] = 0;
    responseToReturn["Data"] = null;
    var categoryService = new CategoryService();
    try {
      var results = await categoryService.getCategory();
      responseToReturn["Data"] = results;
    } catch (error) {
      throw e;
    }
    res.status(responseStatusCode).send(responseToReturn);
  }

  private async addCategory(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
    var responseToReturn = {};
    var responseStatusCode = this.HTTP_CODES.HTTP_RESOURCE_CREATED;
    responseToReturn["Message"] = "Succesfully Added";
    responseToReturn["ErrorCode"] = 0;
    responseToReturn["Data"] = null;

    var requestBody = req.body;
    if (!requestBody || !requestBody.name) {
      responseToReturn["ErrorCode"] = -1;
      responseToReturn["Message"] = "Name is mandatory parameter!";
      responseStatusCode = this.HTTP_CODES.BAD_REQUEST;
    } else {
      requestBody["categoryid"] = uuid();
      var categoryService = new CategoryService();
      try {
        var result = await categoryService.addCategory(requestBody);
        responseToReturn["Data"] = result.ops;
      } catch (error) {
        throw e;
      }
    }
    res.status(responseStatusCode).send(responseToReturn);
  }
}
