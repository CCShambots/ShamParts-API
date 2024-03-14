
export class OnshapeDocument {
    id: number
    name: string

    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }

    public static fromJSON(json: any): OnshapeDocument {
        return new OnshapeDocument(json.id, json.name)
    }
}