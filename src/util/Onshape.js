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
    // console.log(`Making call to: https://cad.onshape.com/api/v6/${url}`)
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
    getPartsFromAssembly(project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetchFromOnshape(`assemblies/d/${project.onshape_id}/w/${project.default_workspace}/e/${project.assembly_onshape_id}/bom?indented=false&generateIfAbsent=true`);
                const json = yield response.json();
                //load existing parts
                const parts = yield Part_1.Part.getPartsInDB();
                const headers = exports.Onshape.getHeaders(json);
                return yield Promise.all(json.rows.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const headerIdToValue = item["headerIdToValue"];
                    const partNumber = headerIdToValue[headers.name];
                    const partsWithThisNumber = parts.filter(e => e.onshape_element_id === item["itemSource"]["elementId"]);
                    const partAlreadyExists = partsWithThisNumber.length > 0;
                    const part = partAlreadyExists ? partsWithThisNumber[0] : new Part_1.Part();
                    if (partNumber != null) {
                        part.number = partNumber;
                    }
                    else {
                        console.log("FAIL");
                        part.number = "SOMETHING WENT VERY WRONG :(";
                    }
                    part.project = project;
                    const materialObjet = headerIdToValue[headers.material];
                    if (materialObjet != null)
                        part.material = headerIdToValue[headers.material]["displayName"];
                    //Only set to unknown material if the user hasn't previously set one
                    else if (part.material == null)
                        part.material = "Unknown Material";
                    part.quantityNeeded = headerIdToValue[headers.quantity];
                    //Load onshape details
                    part.onshape_document_id = item["itemSource"]["documentId"];
                    part.onshape_wvm_id = item["itemSource"]["wvmId"];
                    part.onshape_wvm_type = item["itemSource"]["wvmType"];
                    part.onshape_element_id = item["itemSource"]["elementId"];
                    part.onshape_part_id = item["itemSource"]["partId"];
                    part.logEntries = [];
                    part.asigneeName = '';
                    part.asigneeId = -1;
                    let boundingBox = yield this.getBoundingBox(part);
                    //Sort the bounding box from smallest to largest, round to the nearest 0.5, and convert to string, save as dimension 1, 2, and 3
                    part.dimension1 = boundingBox.sort()[0].toFixed(1);
                    part.dimension2 = boundingBox.sort()[1].toFixed(1);
                    part.dimension3 = boundingBox.sort()[2].toFixed(1);
                    if (!partAlreadyExists) {
                        part.quantityInStock = 0;
                        part.quantityRequested = part.quantityNeeded;
                        part.thumbnail = "unloaded";
                    }
                    return part;
                })));
            }
            catch (e_1) {
                console.log(e_1);
            }
        });
    },
    getBoundingBox(part) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetchFromOnshape(`parts/d/${part.onshape_document_id}/${part.onshape_wvm_type}/${part.onshape_wvm_id}/e/${part.onshape_element_id}/partid/${part.onshape_part_id}/boundingboxes`)
                .then((response) => response.json()).then((json) => {
                let xDiff = json["highX"] - json["lowX"];
                let yDiff = json["highY"] - json["lowY"];
                let zDiff = json["highZ"] - json["lowZ"];
                //Convert from meters to inches and return
                return [
                    xDiff * 39.3701,
                    yDiff * 39.3701,
                    zDiff * 39.3701
                ];
            });
        });
    },
    getHeaders(jsonData) {
        const headers = jsonData["headers"].map(e => {
            return { name: e.name, id: e.id };
        });
        return ({
            name: headers.filter(e => e.name.toLowerCase() === "name")[0].id,
            material: headers.filter(e => e.name.toLowerCase() === "material")[0].id,
            quantity: headers.filter(e => e.name.toLowerCase() === "quantity")[0].id,
        });
    },
    getThumbnailForElement(documentId, workspaceID, wvmIdType, elementId, part) {
        return fetchFromOnshape(`parts/d/${documentId}/${wvmIdType}/${workspaceID}/e/${elementId}?withThumbnails=true`)
            .then((response) => response.json()).then((json) => {
            try {
                var thisEle;
                try {
                    thisEle = json.filter(e => {
                        return e.name.trim() === part.number.trim();
                    })[0];
                }
                catch (e) {
                    //means there was only one part in the element presumably
                    thisEle = json;
                }
                return this.parseThumbnailInfo(thisEle["thumbnailInfo"].sizes);
            }
            catch (e) {
                return "fail";
            }
        });
    },
    parseThumbnailInfo(sizes) {
        var _a, _b;
        const filtered = sizes.filter(e => e["size"] === "300x300");
        return (_b = (_a = filtered[0]) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : "";
    }
};
//# sourceMappingURL=Onshape.js.map