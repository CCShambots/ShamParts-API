"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeDocument = void 0;
class OnshapeDocument {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    static fromJSON(json) {
        return new OnshapeDocument(json.id, json.name);
    }
}
exports.OnshapeDocument = OnshapeDocument;
//# sourceMappingURL=OnshapeDocument.js.map