
export class OnshapeDocument {
    id: number
    name: string
    thumbnail: string

    constructor(id: number, name: string, thumbnail) {
        this.id = id
        this.name = name
        this.thumbnail = thumbnail;
    }

    public static fromJSON(json: any): OnshapeDocument {
        var sorted = json.thumbnail.sizes.sort((a, b) => {
            return parseInt(a.size.split("x")[0]) - parseInt(b.size.split("x")[0]);
        })

        return new OnshapeDocument(json.id, json.name, sorted[0].href)
    }
}