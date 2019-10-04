import { BaseObject } from "../Utils/BaseObject";
import { HTTPServer } from "../Core/Interfaces/HTTPServer";
import { BaseRestResource } from "./Interfaces/BaseRestResource";

export class ShutDownServer extends BaseObject implements BaseRestResource {
    initialize(httpServer: HTTPServer): void {
       httpServer.get("/shutdownserver", this.shutDownServer.bind(this));
    }


    private async shutDownServer(): Promise<void> {
        this.Logger.info("Shutting down server");
        process.exit();
    }

}