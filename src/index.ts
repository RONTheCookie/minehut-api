import fetch from "node-fetch";
import RawIcon, { IconManager } from "./icon";
import { ServerManager } from "./server";

export default class Minehut {
	BASE_URL = "https://api.minehut.com";
	icons: IconManager = new IconManager(this);
	servers: ServerManager = new ServerManager(this);

	async fetchJSON(path: string) {
		const res = await fetch(this.BASE_URL + path, {
			headers: {
				"User-Agent": `minehut-api/${
					require("../package.json").version
				}`,
			},
		});
		if (!res.ok)
			throw new Error(
				`HTTP error while fetching ${path}: ${res.statusText}`
			);
		if (process.env.DEBUG == "minehut-api")
			console.debug(`HTTP GET ${path}`);
		return await res.json();
	}
}
