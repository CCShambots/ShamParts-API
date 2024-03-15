"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeDocument = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
class OnshapeDocument {
    constructor(id, name, thumbnail) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.os_key = config_json_1.default.onshape_auth_code;
    }
    static fromJSON(json) {
        var sorted = json.thumbnail.sizes.filter(e => e["size"] === "300x300");
        return new OnshapeDocument(json.id, json.name, sorted[0].href);
    }
}
exports.OnshapeDocument = OnshapeDocument;
//# sourceMappingURL=OnshapeDocument.js.map