import Minehut from ".";

abstract class BaseManager<T> {
	constructor(public client: Minehut, private url: string) {}
	private cache?: T;

	async fetch(noCache: boolean = false): Promise<T> {
		if (this.cache && !noCache) return this.cache;
		this.cache = (await this.client.fetchJSON(this.url)) as T;
		return await this.fetch();
	}
}

interface BaseManager<T> {
	postfetch(data: T): Promise<T>;
}

export default BaseManager;
