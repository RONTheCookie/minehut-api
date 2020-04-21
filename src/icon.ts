import BaseManager from "./baseManager";
import Minehut from ".";

export default interface Icon {
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

export class IconManager extends BaseManager<Icon[]> {
	constructor(client: Minehut) {
		super(client, "/servers/icons");
	}
}
