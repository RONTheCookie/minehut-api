import Minehut from "../src";
let minehut: Minehut;

beforeEach(() => {
    minehut = new Minehut();
});

test("we can get some plugins", async () => {
    const plugins = await minehut.plugins.fetch();
    const towny = plugins.find((p) => p.id == "5a43f112510e8835c6d63b78");
    expect(towny?.name).toBe("Towny");
    expect(towny?.platform).toBe("java");
    expect(plugins.length).toBeGreaterThanOrEqual(10);
});
