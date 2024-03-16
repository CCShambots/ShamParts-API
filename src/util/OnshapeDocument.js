"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeDocument = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
const Onshape_1 = require("./Onshape");
class OnshapeDocument {
    constructor(id, name, thumbnail, default_workspace) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.os_key = config_json_1.default.onshape_auth_code;
        this.default_workspace = default_workspace;
    }
    static fromJSON(json) {
        return new OnshapeDocument(json.id, json.name, Onshape_1.Onshape.parseThumbnailInfo(json.thumbnail.sizes), json.defaultWorkspace.id);
    }
}
exports.OnshapeDocument = OnshapeDocument;
//# sourceMappingURL=OnshapeDocument.js.map