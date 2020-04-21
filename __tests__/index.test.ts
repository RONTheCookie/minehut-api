import Minehut from "../src";
let minehut: Minehut;

beforeEach(() => {
	minehut = new Minehut();
});
test("it gets a icon", async () => {
	expect(await minehut.icons.getByItem("GOLDEN_PICKAXE")).toEqual({
		id: "5e74715ead31770058c5f29e",
		displayName: "Golden Pickaxe",
		iconName: "GOLDEN_PICKAXE",
		price: 1700,
		rank: "EPIC",
		available: false,
		disabled: false,
		created: new Date(1584689502429),
		lastUpdated: new Date(1586279383019),
	});
});

test("it doesnt cache icons when told to not", async () => {
	await minehut.icons.fetch(true);
	expect(minehut.icons.cache).toBeFalsy();
});

test("it does cache icons when told to", async () => {
	await minehut.icons.fetch(false);
	expect(minehut.icons.cache).toBeTruthy();
});

// TODO: make this pass
test("it gets a bunch of servers", async () => {
	const servers = await minehut.servers.fetch();
	// minehut is pretty big
	expect(servers.length).toBeGreaterThan(100);
});
