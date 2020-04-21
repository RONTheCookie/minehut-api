import Minehut from "../src";
let minehut: Minehut;

beforeEach(() => {
    minehut = new Minehut();
});

test("wheter me is suspended (DetailedServer)", async () => {
    const me = await minehut.servers.detailed.fetchByName("me"); // "me" is currently suspended
    expect(me.suspended).toBe(true);
});

test("it gets a bunch of servers", async () => {
    const servers = await minehut.servers.fetch();
    // minehut is pretty big
    expect(servers.length).toBeGreaterThan(100);
});
