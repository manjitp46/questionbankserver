import { RequestHandler } from "express";

export interface HTTPServer {
  get(url: string, requestHandler: RequestHandler, authRequired?: Function): void;

  post(url: string, requestHandler: RequestHandler, authRequired?: Function): void;

  del(url: string, requestHandler: RequestHandler, authRequired?: Function): void;

  put(url: string, requestHandler: RequestHandler): void;
}
