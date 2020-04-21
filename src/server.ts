import Icon from "./icon";
import BaseManager from "./baseManager";
import Minehut from ".";

interface Server {
	_id: string;
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
	exited: boolean;
	status: "ONLINE";

	icon?: Icon;
	lastMetricsUpdate: number;
	lastStatusChange: number;
	lastSave: number;
	startedAt: number;
	updated: number;
}

export class ServerManager extends BaseManager<Server[]> {
	constructor(client: Minehut) {
		super(client, "/servers");
	}

	async postfetch(data: Server[]): Promise<Server[]> {
		return await Promise.all(
			data.map(async (server) => {
				server.icon = (await this.client.icons.fetch()).find(
					(icon) => icon.icon_name
				);
				return server;
			})
		);
	}
}
