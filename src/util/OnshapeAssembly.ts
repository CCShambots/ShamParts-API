import configJson from "../../config.json";

export class OnshapeAssembly {
    id: string
    name: string
    os_key: string

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
        this.os_key = configJson.onshape_auth_code
    }
}