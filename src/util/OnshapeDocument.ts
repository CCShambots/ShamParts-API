import configJson from "../../config.json";

export class OnshapeDocument {
    id: string
    name: string
    thumbnail: string
    os_key: string
    default_workspace: string

    constructor(id: string, name: string, thumbnail:string, default_workspace:string) {
        this.id = id
        this.name = name
        this.thumbnail = thumbnail;
        this.os_key = configJson.onshape_auth_code
        this.default_workspace = default_workspace;
    }

    public static fromJSON(json: any): OnshapeDocument {
        var sorted = json.thumbnail.sizes.filter(e => e["size"] === "300x300");

        console.log(json)

        return new OnshapeDocument(json.id, json.name, sorted[0]?.href ?? "", json.defaultWorkspace.id);
    }
}