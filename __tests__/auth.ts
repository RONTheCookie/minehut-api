import dotenv from "dotenv";
import { Minehut } from "../src";
let minehut: Minehut;

beforeEach(() => {
    minehut = new Minehut();
    dotenv.config();
});

test("it logs in", async () => {
    if (process.env.EMAIL && process.env.PASSWORD) {
        await minehut.login(process.env.EMAIL, process.env.PASSWORD);
        expect(minehut.auth).toBeDefined();
        expect(minehut.user).toBeDefined();
        expect(minehut.user?.servers.length).toBeGreaterThan(0);
    }
});
