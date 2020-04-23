import { Minehut } from "../src";
let minehut: Minehut;

beforeEach(() => {
    minehut = new Minehut();
});
test("it gets a icon", async () => {
    const res = await minehut.icons.resolve("GOLDEN_PICKAXE");
    expect(res).toEqual({
        id: "5e74715ead31770058c5f29e",
        displayName: "Golden Pickaxe",
        iconName: "GOLDEN_PICKAXE",
        price: 1700,
        rank: "EPIC",
        available: false,
        disabled: false,
        created: res?.created, // so it ignores this
        lastUpdated: res?.lastUpdated
    });
    expect(res?.created.getTime()).toBeTruthy();
    expect(res?.lastUpdated.getTime()).toBeTruthy();
});

test("it doesnt cache icons when told to not", async () => {
    await minehut.icons.fetch(false);
    expect(minehut.icons.cache).toBeFalsy();
});

test("it does cache icons when told to", async () => {
    await minehut.icons.fetch();
    expect(minehut.icons.cache).toBeTruthy();
});
