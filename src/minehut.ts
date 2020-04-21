import fetch, { Headers } from "node-fetch";
import { IconManager } from "./objects/icon";
import { ServerManager } from "./objects/server";
import { PluginManager } from "./objects/plugin";
import { UserManager, User } from "./objects/user";

export class Minehut {
    BASE_URL = "https://api.minehut.com";
    icons: IconManager = new IconManager(this);
    servers: ServerManager = new ServerManager(this);
    plugins: PluginManager = new PluginManager(this);
    users: UserManager = new UserManager(this);
    user?: User;
    auth?: { sessionId: string; token: string };

    async fetchJSON(path: string, method: string = "GET", body?: object) {
        const settings = {
            method,
            headers: {
                "User-Agent": `node-minehut-api/${
                    require("../package.json").version
                }`,
                Authorization: "",
                "X-Session-Id": ""
            },
            body: JSON.stringify(body)
        };
        if (this.auth) {
            settings.headers.Authorization = this.auth.token;
            settings.headers["X-Session-Id"] = this.auth.sessionId;
        }
        const res = await fetch(this.BASE_URL + path, settings);
        if (!res.ok)
            throw new Error(
                `HTTP error while fetching ${path}: ${res.statusText}`
            );
        if (process.env.DEBUG == "minehut-api")
            console.debug(`HTTP GET ${path}`);
        return await res.json();
    }

    async login(email: string, password: string) {
        const res = (await this.fetchJSON("/users/login", "POST", {
            email,
            password
        })) as {
            _id: string;
            token: string;
            servers: string[];
            sessionId: string;
        };
        this.auth = { sessionId: res.sessionId, token: res.token };
        this.user = await this.users.fetch(res._id);
    }
}
