import { Request, Response } from "express";

import { BaseObject } from "../Utils/BaseObject";
import { HTTPServer } from "../Core/Interfaces/HTTPServer";
import { BaseRestResource } from "./Interfaces/BaseRestResource";

export class Category extends BaseObject implements BaseRestResource {
  initialize(httpServer: HTTPServer): void {
    httpServer.get("/listcategory", this.listAllCategory.bind(this));
  }

  private async listAllCategory(
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> {
      var responseToReturn = {};
      responseToReturn["Data"] = [
          {
              "categoryid": "1",
              "name": "Manjit"
          }
          
      ]
      responseToReturn["Message"] = "Succesfully GOT";
      responseToReturn["ErrorCode"] = 0;

      res.status(this.HTTP_CODES.HTTP_OK).send(responseToReturn)
  }
}
