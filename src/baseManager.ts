import Minehut from ".";

abstract class BaseManager<O, T> {
	constructor(public client: Minehut, private url: string) {}
	cache?: T;

	async fetch(cache: boolean = true): Promise<T> {
		if (this.cache && cache) {
			return this.cache;
		}
		const res = await this.transform(
			(await this.client.fetchJSON(this.url)) as O
		);
		if (cache) this.cache = res;
		return res;
	}

	abstract async transform(data: O): Promise<T>;
}

export default BaseManager;
