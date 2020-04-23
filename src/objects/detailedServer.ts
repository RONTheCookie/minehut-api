import { Icon, IconResolvable } from "./icon";
import { Plugin, PluginResolvable } from "./plugin";
import { KVManager } from "../managers/kvManager";
import { Minehut } from "../minehut";
import FormData from "form-data";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";

interface RawDetailedServer {
    credits_per_day: number;
    visibility: boolean;
    _id: string;
    owner: string;
    name: string;
    name_lower: string;
    creation: number;
    platform: "java";
    port: number;
    last_online: number;
    motd: string;
    server_properties: RawServerProps;
    suspended: boolean;
    purchased_icons: string[];
    active_plugins: string[];
    purchased_plugins: string[];
    online: boolean;
    maxPlayers: number;
    playerCount: number;
    players: string[];
}

interface RawDetailedServerResponse {
    server: RawDetailedServer;
}

interface RawServerProps {
    enable_command_block: boolean;
    level_name: string;
    level_type: string;
    gamemode: number;
    difficulty: number;
    generator_settings: string;
    announce_player_achievements: boolean;
    allow_nether: boolean;
    generate_structures: boolean;
    max_players: number;
    spawn_protection: number;
    allow_flight: boolean;
    force_gamemode: boolean;
    hardcore: boolean;
    level_seed: string;
    pvp: boolean;
    resource_pack: string;
    resource_pack_sha1: string;
    spawn_animals: boolean;
    spawn_mobs: boolean;
    view_distance: number;
}

interface ServerProps {
    enableCommandBlock: boolean;
    levelName: string;
    levelType: string;
    gamemode: number;
    difficulty: number;
    generatorSettings: string;
    announcePlayerAchievements: boolean;
    allowNether: boolean;
    generateStructures: boolean;
    maxPlayers: number;
    spawnProtection: number;
    allowFlight: boolean;
    forceGamemode: boolean;
    hardcore: boolean;
    levelSeed: string;
    pvp: boolean;
    resourcePack: string;
    resourcePackSha1: string;
    spawnAnimals: boolean;
    spawnMobs: boolean;
    viewDistance: number;
}

export interface DetailedServer {
    creditsPerDay: number;
    visibility: boolean;
    id: string;
    owner: string;
    name: string;
    creation: Date;
    platform: "java";
    port: number;
    lastOnline: Date;
    motd: string;
    serverProperties: ServerProps;
    suspended: boolean;
    purchasedIcons: Icon[];
    activePlugins: Plugin[];
    online: boolean;
    maxPlayers: number;
    playerCount: number;
    players: string[];
}

export class DetailedServer {
    constructor(public client: Minehut) {}

    async setName(name: string) {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/change_name`, "POST", {
            name
        });
    }

    async start(service: boolean = true) {
        if (!this.client.auth) throw new Error("Not logged in.");
        if (service)
            await this.client.fetch(`/server/${this.id}/start_service`, "POST");
        else await this.client.fetch(`/server/${this.id}/start`, "POST");
    }

    async restart() {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/restart`, "POST");
    }

    async stop(service: boolean = false) {
        if (!this.client.auth) throw new Error("Not logged in.");
        if (!service)
            await this.client.fetch(`/server/${this.id}/shutdown`, "POST");
        else
            await this.client.fetch(
                `/server/${this.id}/destroy_service`,
                "POST"
            );
    }

    async setMOTD(motd: string) {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/change_motd`, "POST", {
            motd
        });
    }

    async sendCommand(command: string) {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/send_command`, "POST", {
            command
        });
    }

    async setVisibility(visibility: boolean) {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/visibility`, "POST", {
            visibility
        });
    }

    async purchaseIcon(resolvable: IconResolvable) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const icon = await this.client.icons.resolve(resolvable);
        if (!icon) throw new Error("Icon not found.");
        await this.client.fetch(`/server/${this.id}/icon/purchase`, "POST", {
            icon_id: icon
        });
    }

    async setIcon(resolvable: IconResolvable | null) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const icon = resolvable
            ? await this.client.icons.resolve(resolvable)
            : undefined;
        if (resolvable && !icon) throw new Error("Icon not found.");
        await this.client.fetch(`/server/${this.id}/icon/equip`, "POST", {
            icon_id: icon ? icon.id : undefined
        });
    }

    async editProps(props: Partial<ServerProps>) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const fetchArray: Promise<void>[] = [];
        Object.entries(props).forEach(
            ([field, value]: [
                string,
                string | boolean | number | undefined
            ]) => {
                fetchArray.push(
                    this.client.fetch(
                        `/server/${this.id}/edit_server_properties`,
                        "POST",
                        {
                            field: field.replace(
                                /[A-Z]/g,
                                (e) => "_" + e.toLowerCase()
                            ),
                            value
                        }
                    )
                );
            }
        );
        await Promise.all(fetchArray);
    }

    async installPlugin(resolvable: PluginResolvable) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const plugin = await this.client.plugins.resolve(resolvable);
        if (!plugin) throw new Error("Plugin not found.");
        await this.client.fetch(`/server/${this.id}/install_plugin`, "POST", {
            plugin: plugin.id
        });
    }

    async removePlugin(resolvable: PluginResolvable) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const plugin = await this.client.plugins.resolve(resolvable);
        if (!plugin) throw new Error("Plugin not found.");
        await this.client.fetch(`/server/${this.id}/remove_plugin`, "POST", {
            plugin: plugin.id
        });
    }

    async resetPluginData(resolvable: PluginResolvable) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const plugin = await this.client.plugins.resolve(resolvable);
        if (!plugin) throw new Error("Plugin not found.");
        await this.client.fetch(
            `/server/${this.id}/remove_plugin_data`,
            "POST",
            {
                plugin: plugin.id
            }
        );
    }

    async saveWorld() {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/save`, "POST");
    }

    async resetWorld() {
        if (!this.client.auth) throw new Error("Not logged in.");
        await this.client.fetch(`/server/${this.id}/reset_world`, "POST");
    }

    async uploadWorld(filePath: string) {
        if (!this.client.auth) throw new Error("Not logged in.");
        const e = new Error();
        filePath = path.join(
            path.dirname(
                (e.stack as string)
                    .split("\n")[2]
                    .replace(/ +at /g, "")
                    .replace(/:\d+:\d+$/, "")
            ),
            filePath
        );
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        await this.client.fetch(
            `/file/world/upload/${this.id}`,
            "POST",
            formData,
            formData.getHeaders()
        );
    }

    async reset() {
        if (!this.client.auth) throw new Error("Not logged in.");
        this.client.fetch(`/server/${this.id}/reset_all`, "POST");
    }

    async repairFiles() {
        if (!this.client.auth) throw new Error("not logged in.");
        this.client.fetch(`/server/${this.id}/repair_files`, "POST");
    }
}

export class DetailedServerManager extends KVManager<
    RawDetailedServerResponse,
    DetailedServer
> {
    constructor(client: Minehut) {
        super(client, "/server/%s");
    }

    async fetchByName(key: string, cacheEnabled: boolean = true) {
        return await this.fetch(`${key}?byName=true`, cacheEnabled);
    }

    async transform(
        key: string,
        { server }: RawDetailedServerResponse
    ): Promise<DetailedServer> {
        const s = new DetailedServer(this.client);
        const plugins = await this.client.plugins.fetch();
        const icons = await this.client.icons.fetch();
        const props = server.server_properties;
        s.activePlugins = plugins.filter((p) =>
            server.active_plugins.includes(p.id)
        );
        s.creation = new Date(server.creation);
        s.creditsPerDay = server.credits_per_day;
        s.id = server._id;
        s.lastOnline = new Date(server.last_online);
        s.maxPlayers = server.maxPlayers;
        s.motd = server.motd;
        s.name = server.name;
        s.online = server.online;
        s.owner = server.owner;
        s.platform = server.platform;
        s.playerCount = server.playerCount;
        s.players = server.players;
        s.port = server.port;
        s.purchasedIcons = icons.filter((i) =>
            server.purchased_icons.includes(i.id)
        );
        s.serverProperties = {
            allowFlight: props.allow_flight,
            allowNether: props.allow_nether,
            announcePlayerAchievements: props.announce_player_achievements,
            difficulty: props.difficulty,
            enableCommandBlock: props.enable_command_block,
            forceGamemode: props.force_gamemode,
            gamemode: props.gamemode,
            generateStructures: props.generate_structures,
            generatorSettings: props.generator_settings,
            hardcore: props.hardcore,
            levelName: props.level_name,
            levelSeed: props.level_seed,
            levelType: props.level_type,
            maxPlayers: props.max_players,
            pvp: props.pvp,
            resourcePack: props.resource_pack,
            resourcePackSha1: props.resource_pack_sha1,
            spawnAnimals: props.spawn_animals,
            spawnMobs: props.spawn_mobs,
            spawnProtection: props.spawn_protection,
            viewDistance: props.view_distance
        };
        s.suspended = server.suspended;
        s.visibility = server.visibility;
        return s;
    }
}
