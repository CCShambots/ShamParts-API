"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeDocument = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
class OnshapeDocument {
    constructor(id, name, thumbnail, default_workspace) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.os_key = config_json_1.default.onshape_auth_code;
        this.default_workspace = default_workspace;
    }
    static fromJSON(json) {
        var _a, _b;
        var sorted = json.thumbnail.sizes.filter(e => e["size"] === "300x300");
        console.log(json);
        return new OnshapeDocument(json.id, json.name, (_b = (_a = sorted[0]) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : "", json.defaultWorkspace.id);
    }
}
exports.OnshapeDocument = OnshapeDocument;
//# sourceMappingURL=OnshapeDocument.js.map