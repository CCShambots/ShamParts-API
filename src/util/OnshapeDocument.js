"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeDocument = void 0;
const Onshape_1 = require("./Onshape");
class OnshapeDocument {
    constructor(id, name, thumbnail, default_workspace) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.default_workspace = default_workspace;
    }
    static fromJSON(json) {
        return new OnshapeDocument(json.id, json.name, Onshape_1.Onshape.parseThumbnailInfo(json.thumbnail.sizes), json.defaultWorkspace.id);
    }
}
exports.OnshapeDocument = OnshapeDocument;
//# sourceMappingURL=OnshapeDocument.js.map