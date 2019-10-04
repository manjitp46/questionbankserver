import {HTTPServer} from '../../Core/Interfaces/HTTPServer';

export interface BaseRestResource {
    initialize(httpServer: HTTPServer): void;
}