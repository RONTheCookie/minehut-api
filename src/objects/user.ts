import { Server } from "./server";
import { Minehut } from "../minehut";
import { KVManager } from "../managers/kvManager";
import { DetailedServer } from "./detailedServer";

interface RawUser {
    _id: string;
    email: string;
    email_verified: boolean;
    email_sent_at: number;
    email_code: string;
    credits: number;
    last_login: number;
    last_password_change?: number;
    minecraft_link_code?: string;
    minecraft_last_link_time?: number;
    minecraft_name?: string;
    minecraft_uuid?: string;
    max_servers: number;
    servers: string[];
}

interface RawUserResponse {
    user: RawUser;
}

interface User {
    id: string;
    emailInfo: {
        email: string;
        verified: boolean;
        sentAt: Date;
        code: string;
    };
    credits: number;
    lastLogin: Date;
    lastPasswordChange?: number;
    minecraftInfo?: {
        linkCode?: string;
        lastLinkTime?: Date;
        username?: string;
        uuid?: string;
    };
    maxServers: number;
    servers: DetailedServer[];
}
class User {
    //noserver cache or static why not cache,
    constructor(public client: Minehut) {}
    async fromRawUser(user: RawUser) {
        this.id = user._id;
        this.emailInfo = {
            email: user.email,
            verified: user.email_verified,
            sentAt: new Date(user.email_sent_at),
            code: user.email_code
        };
        this.credits = user.credits;
        this.lastLogin = new Date(user.last_login);
        this.lastPasswordChange = user.last_password_change;
        if (user.minecraft_last_link_time)
            this.minecraftInfo = {
                linkCode: user.minecraft_link_code,
                lastLinkTime: new Date(user.minecraft_last_link_time),
                username: user.minecraft_name,
                uuid: user.minecraft_uuid
            };
        this.maxServers = user.max_servers;
        this.servers = await Promise.all(
            user.servers.map((id) => this.client.servers.fetchOne(id))
        );
    }
}

export class UserManager extends KVManager<RawUserResponse, User> {
    constructor(client: Minehut) {
        super(client, "/users/%s");
    }

    async transform(key: string, { user }: RawUserResponse): Promise<User> {
        const servers = await Promise.all(
            user.servers.map((id: string) => this.client.servers.fetchOne(id))
        );
        //  u remove my code
        const u = new User(this.client);
        u.fromRawUser(user);
        return u;
    }
}

export { User };
