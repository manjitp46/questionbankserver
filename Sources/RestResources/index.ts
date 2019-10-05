import { ShutDownServer } from "./ShutDownServer";
import { Category } from "./Category";
import { Questions } from "./Questions";

export const RestResources = [
    new ShutDownServer(),
    new Category(),
    new Questions()
];
