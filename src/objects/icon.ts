import { BaseManager } from "../managers/baseManager";
import { Minehut } from "../minehut";

export interface Icon {
    id: string;
    displayName: string;
    iconName: string;
    price: number;
    rank: "EPIC" | "RARE" | "LEGENDARY" | "COMMON" | "UNCOMMON";
    available: boolean;
    disabled: boolean;
    created: Date;
    lastUpdated: Date;
}

interface RawIcon {
    _id: string;
    display_name: string;
    icon_name: string;
    price: number;
    rank: "EPIC" | "RARE" | "LEGENDARY" | "COMMON" | "UNCOMMON";
    available: boolean;
    disabled: boolean;
    created: number;
    last_updated: number;
}

export type IconResolvable = string | Icon;

export class IconManager extends BaseManager<RawIcon[], Icon[]> {
    constructor(client: Minehut) {
        super(client, "/servers/icons");
    }

    async transform(data: RawIcon[]): Promise<Icon[]> {
        return data.map((icon) => ({
            available: icon.available,
            created: new Date(icon.created),
            disabled: icon.disabled,
            displayName: icon.display_name,
            id: icon._id,
            iconName: icon.icon_name,
            lastUpdated: new Date(icon.last_updated),
            price: icon.price,
            rank: icon.rank
        }));
    }

    async resolve(resolvable: IconResolvable) {
        if (!this.cache) this.cache = await this.fetch(false);
        if (typeof resolvable === "object" && resolvable.id)
            return this.cache.find((i) => resolvable.id === i.id);
        return this.cache.find((i) => resolvable === i.id);
    }
}
