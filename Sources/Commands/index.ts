import { TestCommand } from "./TestCommand";
import { RestServerCommand } from "./RestServerCommand";
// import * as fs from 'fs';
// import * as path from 'path';
export const Commands = [
  new RestServerCommand(),
  new TestCommand()
];

// const dyCommand = [];

//  Helps to Load modules dynamically
// fs.readdirSync(__dirname).forEach((file:string, index:number)=>{
//   var fileFolderPath = path.join(__dirname, file);
//   if(!fs.lstatSync(fileFolderPath).isDirectory() && !file.includes("index")) {
//     file = require(fileFolderPath);
//     // console.log(file)
//     dyCommand.push(file)
//   }
  
// })


// console.log(Commands)
// console.log(dyCommand)