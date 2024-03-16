import configJson from "../../config.json";
import {Onshape} from "./Onshape";

export class OnshapeAssembly {
    id: string
    name: string
    os_key: string
    thumbnail: string

    constructor(id: string, name: string, thumbnail:string) {
        this.id = id
        this.name = name
        this.os_key = configJson.onshape_auth_code
        this.thumbnail = thumbnail;
    }

    public static fromJSON(json: any): OnshapeAssembly {
        return new OnshapeAssembly(json.id, json.name, Onshape.parseThumbnailInfo(json.thumbnailInfo.sizes));
    }
}