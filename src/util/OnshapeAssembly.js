"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeAssembly = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
class OnshapeAssembly {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.os_key = config_json_1.default.onshape_auth_code;
    }
}
exports.OnshapeAssembly = OnshapeAssembly;
//# sourceMappingURL=OnshapeAssembly.js.map