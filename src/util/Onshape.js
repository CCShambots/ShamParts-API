"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onshape = void 0;
const OnshapeDocument_1 = require("./OnshapeDocument");
const config_json_1 = __importDefault(require("../../config.json"));
const OnshapeAssembly_1 = require("./OnshapeAssembly");
function fetchFromOnshape(url) {
    return fetch(`https://cad.onshape.com/api/v6/${url}`, {
        method: "GET",
        headers: {
            "Authorization": "Basic " + config_json_1.default.onshape_auth_code
        }
    });
}
exports.Onshape = {
    getDocuments(query) {
        return fetchFromOnshape(`documents?q=${query}&filter=9&owner=${config_json_1.default.onshape_team_id}`)
            .then((response) => response.json()).then((json) => {
            return json.items.map((item) => {
                return OnshapeDocument_1.OnshapeDocument.fromJSON(item);
            });
        });
    },
    getAssemblies(documentId, workspaceID) {
        return fetchFromOnshape(`documents/d/${documentId}/w/${workspaceID}/elements?withThumbnails=true`)
            .then((response) => response.json()).then((json) => {
            const filteredForAssemblies = json.filter(e => e.elementType === "ASSEMBLY");
            return filteredForAssemblies.map((item) => OnshapeAssembly_1.OnshapeAssembly.fromJSON(item));
        });
    },
    parseThumbnailInfo(sizes) {
        var _a, _b;
        const filtered = sizes.filter(e => e["size"] === "300x300");
        return (_b = (_a = filtered[0]) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : "";
    }
};
//# sourceMappingURL=Onshape.js.map