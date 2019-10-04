import { BaseCommand } from "./Interfaces/BaseCommand";
import { RestServer } from "../Core/RestServer";
export class RestServerCommand implements BaseCommand {
  processCommandAction(args: any, cb: Function): void {
    var restServer = new RestServer();
    var command = args.command;
    // console.log(args)
    switch (command) {
      case "start":
        console.log("executing command start");
        restServer.startRestServer(cb);
        cb();
        break;
      case "stop":
        restServer.stopRestServer(restServer,cb);
        cb();
        break;
      case "restart":
        cb();
        break;
      default:
        console.log("Invalid option", "valid options are",["start","stop","restart"])
        cb();

    }
  }
  registerCommand(vorpalApp: any): void {
    vorpalApp
      .command("restserver <command>", "Server related commands.")
      .description("Manage restserver start stop restart")
      .autocomplete(["start", "stop", "restart"])
      .option("-f","forcefully restart")
      .option("-s","silently")
      .action(this.processCommandAction);
  }
}
