"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onshape = void 0;
const OnshapeDocument_1 = require("./OnshapeDocument");
const config_json_1 = __importDefault(require("../../config.json"));
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
    }
};
//# sourceMappingURL=Onshape.js.map