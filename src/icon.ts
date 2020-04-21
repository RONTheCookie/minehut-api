import BaseManager from "./baseManager";
import Minehut from ".";

export default interface Icon {
	id: string;
	displayName: string;
	iconName: string;
	price: number;
	rank: "EPIC" | "RARE" | "LEGENDARY" | "COMMON" | "UNCOMMON";
	available: boolean;
	disabled: boolean;
	created: number;
	lastUpdated: number;
}

export class IconManager extends BaseManager<Icon[]> {
	constructor(client: Minehut) {
		super(client, "/servers/icons");
	}
}
