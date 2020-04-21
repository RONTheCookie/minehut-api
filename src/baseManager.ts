import Minehut from ".";

abstract class BaseManager<O, T> {
	constructor(public client: Minehut, private url: string) {}
	cache?: T;

	async fetch(noCache: boolean = false): Promise<T> {
		if (this.cache && !noCache) return this.cache;
		const res = await this.transform(
			(await this.client.fetchJSON(this.url)) as O
		);
		if (!noCache) this.cache = res;
		return res;
	}

	abstract async transform(data: O): Promise<T>;
}

export default BaseManager;
