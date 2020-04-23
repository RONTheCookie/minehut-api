import { Minehut } from "../minehut";

export abstract class KVManager<O, T> {
    constructor(public client: Minehut, private url: string) {}
    cache: Map<string, T> = new Map();

    async fetch(key: string, cacheEnabled: boolean = true): Promise<T> {
        const cacheVal = this.cache.get(key);
        if (cacheVal && cacheEnabled) {
            return cacheVal;
        }
        const res = await this.transform(
            key,
            (await this.client.fetch(this.url.split("%s").join(key))) as O
        );
        if (cacheEnabled) this.cache.set(key, res);
        return res;
    }

    abstract async transform(key: string, data: O): Promise<T>;
}
