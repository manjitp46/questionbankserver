import {BaseCommand} from './Interfaces/BaseCommand';
export class TestCommand implements BaseCommand {
  processCommandAction(args: any, cb:Function): void {
    throw new Error("Method not implemented.");
  }
    registerCommand(vorpalApp: any): void {
        vorpalApp.command('args', 'Show restserver related commands')
        .option('-d')
        .option('-a')
        .option('--save')
        .action(this.processCommandAction)
    }

}