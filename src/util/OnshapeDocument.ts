import configJson from "../../config.json";
import {Onshape} from "./Onshape";

export class OnshapeDocument {
    id: string
    name: string
    thumbnail: string
    default_workspace: string

    constructor(id: string, name: string, thumbnail:string, default_workspace:string) {
        this.id = id
        this.name = name
        this.thumbnail = thumbnail;
        this.default_workspace = default_workspace;
    }

    public static fromJSON(json: any): OnshapeDocument {
        return new OnshapeDocument(json.id, json.name, Onshape.parseThumbnailInfo(json.thumbnail.sizes), json.defaultWorkspace.id);
    }
}