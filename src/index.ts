import fetch from "node-fetch";
import Icon, { IconManager } from "./icon";
import { ServerManager } from "./server";

export default class Minehut {
	BASE_URL = "https://api.minehut.com";
	icons: IconManager = new IconManager(this);
	server: ServerManager = new ServerManager(this);

	async fetchJSON(path: string) {
		const res = await fetch(this.BASE_URL + path);
		if (!res.ok)
			throw new Error(
				`http error while fetching ${path}: ${res.statusText}`
			);
		return await res.json();
	}
}
