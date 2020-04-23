import { Minehut } from "../src";
let minehut: Minehut;

beforeEach(() => {
    minehut = new Minehut();
    if (!process.env.EMAIL || !process.env.PASSWORD)
        throw new Error("specify USERNAME and PASSWORD env vars");
    minehut.login(process.env.EMAIL, process.env.PASSWORD);
});

it("makes a tree", async () => {
	
});