import * as bodyParser from "body-parser";
import * as swaggerUi from "swagger-ui-express";
import { HTTPServer } from "./Interfaces/HTTPServer";
import { RequestHandler, Application } from "express";
import express from "express";
import { RestResources } from "../RestResources/index";
import { BaseObject } from "../Utils/BaseObject";
import * as swaggerDocument from "../Swagger-Docs/swagger-docs.json";
import helmet from "helmet";
import * as path from "path";
import morgan = require("morgan");

export class RestServer extends BaseObject implements HTTPServer {
  private express: Application;
  NODE_ENV: string = process.env["NODE_ENV"] || "dev";
  // initilizing dbConnection object
  dbConnection: any;
  constructor() {
    super();
  }
  get(
    url: string,
    requestHandler?: RequestHandler,
    authRequired?: Function
  ): void {
    this.addRoute("get", url, requestHandler, authRequired);
  }
  post(
    url: string,
    requestHandler?: RequestHandler,
    authRequired?: Function
  ): void {
    this.addRoute("post", url, requestHandler, authRequired);
  }
  del(
    url: string,
    requestHandler?: RequestHandler,
    authRequired?: Function
  ): void {
    this.addRoute("delete", url, requestHandler, authRequired);
  }
  put(url: string, requestHandler: RequestHandler): void {
    throw new Error("Method not implemented.");
  }

  private addRoute(
    // adding both del and delete as del is depricated but still supported in express-4
    method: "del" | "get" | "post" | "put" | "delete",
    url: string,
    requestHandler?: RequestHandler,
    authRequired?: Function
  ): void {
    let applicationPrefix =  this.ServerConfigs["applicationPrefix"];
    let applicationVersion =  this.ServerConfigs["applicationVersion"];
    if(applicationVersion) {
      url = `/${applicationVersion}`+ url;
    }
    if(applicationPrefix) {
      url = `/${applicationPrefix}` + url; 
    }
    
    if (authRequired) {
      this.express[method](url, authRequired, async (req, res, next) => {
        try {
          await requestHandler(req, res, next);
        } catch (e) {
          var dataToReturn = {};
          dataToReturn["Message"] = e.message;
          dataToReturn["ErrorCode"] = -1;
          dataToReturn["Data"] = null;
          this.Logger.error(e);
          res.status(500).send(dataToReturn);
        }
      });
    } else {
      this.express[method](url, async (req, res, next) => {
        try {
          await requestHandler(req, res, next);
        } catch (e) {
          var dataToReturn = {};
          dataToReturn["Message"] = e.message;
          dataToReturn["ErrorCode"] = -1;
          dataToReturn["Data"] = null;
          this.Logger.error(e);
          res.status(500).send(dataToReturn);
        }
      });
    }

    this.Logger.info(`Added route ${method.toUpperCase()} ${url}`);
  }

  public stopRestServer(restserver:RestServer, cb?:Function):void {
    this.Logger.info("Stopping Restserver")
    process.exitCode = 0;
  }

  public startRestServer(cb?:Function) {
    this.express = express();
    // this.dbConnection = dbConnectionObject;
    if(this.checkIFApplicationAlreadyRunning()) {
      throw Error("Application is already running")
    }
    this.setServerSpecificConfigs();
    this.configurePlugins();
    this.configureSwagger();
    this.addRestResources();
    // this.serveStaticContent();
    this.express.listen(
      this.ServerConfigs.runtimeConfig[this.NODE_ENV].port,
      this.ServerConfigs.runtimeConfig[this.NODE_ENV].host,
      () => {
        // Creating PID for application
        this.createApplicationPID();
        this.Logger.info(
          `Restserver started @ http://${
            this.ServerConfigs.runtimeConfig[this.NODE_ENV].host
          }:${this.ServerConfigs.runtimeConfig[this.NODE_ENV].port}
           To exit please press CTRL + C 
          `
        );
      }
    );
  }

  private addRestResources(): void {
    RestResources.forEach(restResource => restResource.initialize(this));
  }

  private configurePlugins(): void {
    this.express.use(helmet());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, jwt-access-token, adminEmail"
      );
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      next();
    });
  }
  private async configureSwagger(): Promise<void> {
    this.Logger.info("Setting swagger documentation");

    try {
      this.express.use(
        "/swagger",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
      );
    } catch (e) {
      this.Logger.error("Failed to setup swagger", e);
    }
  }
  private setServerSpecificConfigs(): void {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    if(this.NODE_ENV==="dev") {
      this.express.use(morgan('combined'));
    }
  }

  // private serveStaticContent(): void {
  //   this.express.use(express.static(path.join(__dirname, "../UI")));
  //   this.express.use("/", express.static(__dirname + "../UI"));
  //   this.express.get("*", (req, res) => {
  //     res.sendFile(path.join(__dirname, "../UI/index.html"));
  //   });
  // }
}

