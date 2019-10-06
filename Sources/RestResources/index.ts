import { ShutDownServer } from "./ShutDownServer";
import { Category } from "./Category";
import { Questions } from "./Questions";
import { Answer } from "./Answer";

export const RestResources = [
    new ShutDownServer(),
    new Category(),
    new Questions(),
    new Answer()
];
