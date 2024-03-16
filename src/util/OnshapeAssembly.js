"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeAssembly = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
const Onshape_1 = require("./Onshape");
class OnshapeAssembly {
    constructor(id, name, thumbnail) {
        this.id = id;
        this.name = name;
        this.os_key = config_json_1.default.onshape_auth_code;
        this.thumbnail = thumbnail;
    }
    static fromJSON(json) {
        return new OnshapeAssembly(json.id, json.name, Onshape_1.Onshape.parseThumbnailInfo(json.thumbnailInfo.sizes));
    }
}
exports.OnshapeAssembly = OnshapeAssembly;
//# sourceMappingURL=OnshapeAssembly.js.map