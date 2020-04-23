import { Minehut, FileManager } from "../src";
import { config } from "dotenv";
config();
let minehut: Minehut;

beforeEach(async () => {
    minehut = new Minehut();
    await minehut.login(process.env.EMAIL || "", process.env.PASSWORD || "");
});

it("makes a tree", async () => {
    const srv = minehut.user?.servers.find((s) => s.name == "tsapitest1");
    if (!srv || !srv.online)
        throw new Error("tsapitest1 isnt online or wasnt found");
    const fileman = new FileManager(minehut, srv.id);
    await fileman.traverseTree();
    expect(fileman.treeRoot.children.length).toBeGreaterThan(5);
    console.log(fileman.treeRoot.children.map((x) => x.children.length));
});
