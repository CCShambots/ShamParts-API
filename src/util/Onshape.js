"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onshape = void 0;
const OnshapeDocument_1 = require("./OnshapeDocument");
const config_json_1 = __importDefault(require("../../config.json"));
const OnshapeAssembly_1 = require("./OnshapeAssembly");
const Part_1 = require("../entity/Part");
function fetchFromOnshape(url) {
    console.log(`Making call to: https://cad.onshape.com/api/v6/${url}`);
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
    getPartsFromAssembly(documentId, workspaceID, assemblyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetchFromOnshape(`assemblies/d/${documentId}/w/${workspaceID}/e/${assemblyId}/bom?indented=false&generateIfAbsent=true`);
                const json = yield response.json();
                //load existing parts
                const parts = yield Part_1.Part.getPartsInDB();
                const headers = exports.Onshape.getHeaders(json);
                return yield json.rows.map((item) => {
                    // console.log(item)
                    // console.log(headers.material)
                    // console.log(item["headerIdToValue"][headers.material])
                    const headerIdToValue = item["headerIdToValue"];
                    const partNumber = headerIdToValue[headers.name];
                    const partsWithThisNumber = parts.filter(e => e.number === partNumber);
                    const partAlreadyExists = partsWithThisNumber.length > 0;
                    const part = partsWithThisNumber.length > 0 ? partsWithThisNumber[0] : new Part_1.Part();
                    part.number = partNumber;
                    const materialObjet = headerIdToValue[headers.material];
                    if (materialObjet != null)
                        part.material = headerIdToValue[headers.material]["displayName"];
                    //Only set to unknown material if the user hasn't previously set one
                    else if (part.material == null)
                        part.material = "Unknown Material";
                    part.quantityNeeded = headerIdToValue[headers.quantity];
                    // part.thumbnail = this.parseThumbnailInfo(item["thumbnailInfo"]["sizes"])
                    part.onshape_id = item["itemSource"]["elementId"];
                    if (!partAlreadyExists) {
                        part.quantityInStock = 0;
                        part.quantityRequested = 0;
                        part.thumbnail = "unloaded";
                    }
                    return part;
                });
            }
            catch (e_1) {
                console.log(e_1);
            }
        });
    },
    getHeaders(jsonData) {
        const headers = jsonData["headers"].map(e => { return { name: e.name, id: e.id }; });
        return ({
            name: headers.filter(e => e.name.toLowerCase() === "name")[0].id,
            material: headers.filter(e => e.name.toLowerCase() === "material")[0].id,
            quantity: headers.filter(e => e.name.toLowerCase() === "quantity")[0].id,
        });
    },
    parseThumbnailInfo(sizes) {
        var _a, _b;
        const filtered = sizes.filter(e => e["size"] === "300x300");
        return (_b = (_a = filtered[0]) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : "";
    }
};
//# sourceMappingURL=Onshape.js.map