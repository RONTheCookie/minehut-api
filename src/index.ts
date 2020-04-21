import fetch from "node-fetch";
import RawIcon, { IconManager } from "./icon";
import { ServerManager } from "./server";

export default class Minehut {
	BASE_URL = "https://api.minehut.com";
	icons: IconManager = new IconManager(this);
	servers: ServerManager = new ServerManager(this);

	async fetchJSON(path: string) {
		const res = await fetch(this.BASE_URL + path);
		if (!res.ok)
			throw new Error(
				`HTTP error while fetching ${path}: ${res.statusText}`
			);
		return await res.json();
	}
}
