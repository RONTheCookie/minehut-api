export { Minehut } from "./minehut";
export { ServerManager, Server } from "./objects/server";
export { Plugin, PluginManager } from "./objects/plugin";
export { Icon, IconManager } from "./objects/icon";
export {
    DetailedServer,
    DetailedServerManager
} from "./objects/detailedServer";

export class MinehutAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Minehut API Error";
        Error.captureStackTrace(this, MinehutAPIError);
    }
}
