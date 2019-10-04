import { Logger } from "../Logger";
import { ServerConfigs } from "../Config/ServerConfigs";
import { HTTP_CODES } from "../HTTP_CODES/index";
import * as UserRolesConfigs from "../Config/UserRolesConfigs.json";
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';


export class BaseObject {
  public Logger: Logger;
  protected ServerConfigs: any;
  public NODE_ENV: string;
  protected HTTP_CODES: any;
  protected GENERAL_ERROR: any;
  protected UserRolesConfigs: any;
  public constructor() {
    this.Logger = new Logger();
    this.ServerConfigs = ServerConfigs;
    this.NODE_ENV = process.env["NODE_ENV"] || "dev"; // default running environment is always dev
    this.HTTP_CODES = HTTP_CODES;
    this.UserRolesConfigs = UserRolesConfigs;
    this.GENERAL_ERROR = {
      Message: "Internal server error",
      Data: null,
      ErrorCode: -1
    };
  }

  public getUserHomeDirectory() {
    return os.homedir();
  }

  public createDirectoryIfNotExist(path:string) {
    if(!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
  }
  
  public getWorkingFolderPath() {
    var appName = this.ServerConfigs.appName;
    return path.join(this.getUserHomeDirectory(),appName)
  }

  public createApplicationPID() {
    this.Logger.info("Creating Application pid: ", process.pid)
    var workingFolderPath = this.getWorkingFolderPath();
    this.createDirectoryIfNotExist(workingFolderPath);
    fs.writeFileSync(path.join(workingFolderPath,"pid"),process.pid,'utf-8');
    this.Logger.info("SuccessFully created PID @: ", path.join(workingFolderPath,"pid"))
  }

  public deleteApplicationPID() {
    var workingFolderPath = this.getWorkingFolderPath();
    this.Logger.info("Deleing PID @",path.join(workingFolderPath,"pid"));
    this.createDirectoryIfNotExist(workingFolderPath);
    fs.unlinkSync(path.join(workingFolderPath,"pid"));
    this.Logger.info("SuccessFully deleted PID @",path.join(workingFolderPath,"pid"));
  }
  public checkIFApplicationAlreadyRunning() {
    var workingFolderPath = path.join(this.getWorkingFolderPath(),"pid");
    return fs.existsSync(workingFolderPath);
  }
}

// code for handling ctrl+c event
//  putting inside base object because every class as base object
process.on("SIGINT", function () {
  process.exit();
});

process.on('exit',()=>{
  var bs = new BaseObject();
  bs.Logger.info("Stopping Application")
  bs.deleteApplicationPID();
  bs.Logger.info("Application Stopped...")
})
