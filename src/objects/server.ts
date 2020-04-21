import { Icon } from "./icon";
import { BaseManager } from "../managers/baseManager";
import { Minehut } from "../minehut";
import { DetailedServerManager, DetailedServer } from "./detailedServer";

interface BaseServer {
    playerCount: number;
    online: boolean;
    timeNoPlayers: number;
    name: string;
    motd: string;
    maxPlayers: number;
    visibility: boolean;
    platform: "java";
    players: string[];
    starting: boolean;
    stopping: boolean;
    status: "ONLINE";
}

interface RawServer extends BaseServer {
    _id: string;
    icon?: string;
    lastMetricsUpdate: number;
    lastStatusChange: number;
    lastSave: number;
    startedAt: number;
    updated: number;
}

export interface Server extends BaseServer {
    id: string;
    icon?: Icon;
    lastMetricsUpdate: Date;
    lastStatusChange: Date;
    lastSave: Date;
    startedAt: Date;
    updated: Date;
}

interface RawServerResponse {
    servers: RawServer[];
    total_players: number;
    total_servers: number;
}

export class ServerManager extends BaseManager<RawServerResponse, Server[]> {
    detailed: DetailedServerManager = new DetailedServerManager(this.client);
    constructor(client: Minehut) {
        super(client, "/servers");
    }

    // Just a shortcut

    async fetchOneByName(
        key: string,
        cacheEnabled: boolean = true
    ): Promise<DetailedServer> {
        return await this.detailed.fetchByName(key, cacheEnabled);
    }

    async fetchOne(
        key: string,
        cacheEnabled: boolean = true
    ): Promise<DetailedServer> {
        return await this.detailed.fetch(key, cacheEnabled);
    }

    async transform(data: RawServerResponse): Promise<Server[]> {
        const icons = await this.client.icons.fetch();
        return await Promise.all(
            data.servers.map(async (raw) => ({
                id: raw._id,
                lastMetricsUpdate: new Date(raw.lastMetricsUpdate),
                lastSave: new Date(raw.lastSave),
                lastStatusChange: new Date(raw.lastStatusChange),
                maxPlayers: raw.maxPlayers,
                motd: raw.motd,
                name: raw.name,
                online: raw.online,
                platform: raw.platform,
                playerCount: raw.playerCount,
                players: raw.players,
                startedAt: new Date(raw.startedAt),
                starting: raw.starting,
                status: raw.status,
                stopping: raw.stopping,
                timeNoPlayers: raw.timeNoPlayers,
                updated: new Date(raw.updated),
                visibility: raw.visibility,
                icon: icons.find((x) => x.iconName == raw.icon)
            }))
        );
    }
}
