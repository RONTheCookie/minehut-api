import { KVManager } from "../managers/kvManager";
import { Minehut } from "..";
enum FileNodeType {
    DIRECTORY,
    FILE
}
interface FileNode {
    name: string;
    type: FileNodeType;
    blocked: boolean;
    children: FileNode[];
    parent?: FileNode;
    path: string;
}

interface RawFileNode {
    name: string;
    directory: boolean;
    blocked: boolean;
}

interface RawFileListResponse {
    files: RawFileNode[];
}
interface RawFileReadResponse {
    content: string;
}
export class File {
    constructor(
        public name: string,
        public type: FileNodeType,
        public blocked: boolean = false
    ) {}
}

export class FileManager extends KVManager<RawFileReadResponse, File> {
    constructor(client: Minehut, public serverID: string) {
        super(client, `/file/${serverID}/read/%s`);
    }
    treeRoot: FileNode = {
        type: FileNodeType.DIRECTORY,
        name: "",
        blocked: false,
        children: [],
        path: "/"
    };

    async traverseTree(current: FileNode = this.treeRoot) {
        if (current.type == FileNodeType.FILE) {
            current.parent?.children.push(current);
        } else {
            const { files } = (await this.client.fetchJSON(
                `/file/${this.serverID}/list${current.path}`
            )) as RawFileListResponse;
            files
                .map(
                    (f) =>
                        ({
                            blocked: f.blocked,
                            children: [],
                            name: f.name,
                            path: current.path + `/${f.name}`,
                            type: f.directory
                                ? FileNodeType.DIRECTORY
                                : FileNodeType.FILE,
                            parent: current
                        } as FileNode)
                )
                .forEach(async (f) => {
                    current.children.push(f);
                    await this.traverseTree(f);
                });
        }
        if (!current.parent) this.treeRoot = current;
    }

    async transform(
        key: string,
        { content }: RawFileReadResponse
    ): Promise<File> {
        throw new Error("unimplemented");
    }
}
