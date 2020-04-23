export { Minehut } from "./minehut";
export { ServerManager, Server } from "./objects/server";
export { Plugin, PluginManager } from "./objects/plugin";
export { Icon, IconManager } from "./objects/icon";
export {
    DetailedServer,
    DetailedServerManager
} from "./objects/detailedServer";

export class MinehutError extends Error {
    name = "MinehutError";
    constructor(message: string, public path: string, public status: string) {
        super(message);
        Error.captureStackTrace(this, MinehutError);
    }
}
