import BaseManager from "./baseManager";
import Minehut from ".";

interface Plugin {
    id: string;
    name: string;
    credits: number;
    platform: "java";
    desc: string;
    descExtended: string;
    version: string;
    disabled: boolean;
    fileName: string;
    configFileName: string;
    created: Date;
    lastUpdated: Date;
}

interface RawPlugin {
    id: string;
    name: string;
    credits: number;
    platform: "java";
    desc: string;
    desc_extended: string;
    version: string;
    disabled: boolean;
    fileName: string;
    config_file_name: string;
    created: number;
    last_updated: number;
}

export class PluginManager extends BaseManager<RawPlugin[], Plugin[]> {
    constructor(client: Minehut) {
        super(client, "/plugins_public")
    }

    async transform(data: RawPlugin[]): Promise<Plugin[]> {
        
    }
}
