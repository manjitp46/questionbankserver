import { Commands } from "../Commands";
import Vorpal = require("vorpal");
import { BaseObject } from "../Utils/BaseObject";


class QuestionBankApp extends BaseObject{
  constructor() {
      super();
  }

  initializeCommands(): void {
    var commander = new Vorpal();
    var input = process.argv;
    // console.log(input)
    // console.log(this.ServerConfigs.runtimeConfig[this.NODE_ENV].appDelimeter)
    if(input.length <= 2) {

      commander.delimiter(this.ServerConfigs.runtimeConfig[this.NODE_ENV].appDelimeter).show();
    }
    Commands.forEach(command => command.registerCommand(commander));
    commander.parse(input);
  }
}

new QuestionBankApp().initializeCommands();
