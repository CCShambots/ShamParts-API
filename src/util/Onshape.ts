import {OnshapeDocument} from "./OnshapeDocument";
import configJson from "../../config.json";
import {OnshapeAssembly} from "./OnshapeAssembly";
import {Part} from "../entity/Part";
import {Project} from "../entity/Project";
import Fraction from "fraction.js";

function fetchFromOnshape(url: string) {
    // console.log(`Making call to: https://cad.onshape.com/api/v6/${url}`)
    return fetch(`https://cad.onshape.com/api/v6/${url}`, {
        method: "GET",
        headers: {
            "Authorization": "Basic " + configJson.onshape_auth_code
        }
    });
}

type headerInfo = {
    name: string,
    material: string,
    quantity: string,
}

export var Onshape = {
    getDocuments(query: string): Promise<OnshapeDocument[]> {
        return fetchFromOnshape(`documents?q=${query}&filter=9&owner=${configJson.onshape_team_id}`)
            .then((response) => response.json()).then((json) => {

                return json.items.map((item: any) => {
                    return OnshapeDocument.fromJSON(item)
                })
            });
    },

    getAssemblies(documentId: string, workspaceID: string): Promise<OnshapeAssembly[]> {
        return fetchFromOnshape(`documents/d/${documentId}/w/${workspaceID}/elements?withThumbnails=true`)
            .then((response) => response.json()).then((json) => {

                const filteredForAssemblies = json.filter(e => e.elementType === "ASSEMBLY");

                return filteredForAssemblies.map((item: any) => OnshapeAssembly.fromJSON(item))
            });
    },
    async getPartsFromAssembly(project: Project): Promise<Part[]> {
        try {
            const response = await fetchFromOnshape(`assemblies/d/${project.onshape_id}/w/${project.default_workspace}/e/${project.assembly_onshape_id}/bom?indented=false&generateIfAbsent=true`);
            const json = await response.json();

            //load existing parts
            const parts = await Part.getPartsInDB();

            const headers = Onshape.getHeaders(json);
            return await Promise.all(json.rows.map(async (item: any) => {

                const headerIdToValue = item["headerIdToValue"];

                const partNumber = headerIdToValue[headers.name];
                //TODO: Correct this to actually use all data
                const partsWithThisNumber = parts.filter(e => e.onshape_element_id === item["itemSource"]["elementId"]);

                const partAlreadyExists = partsWithThisNumber.length > 0;

                const part = partAlreadyExists ? partsWithThisNumber[0] : new Part();
                if(partNumber != null) {
                    part.number = partNumber;

                } else {
                    console.log("FAIL")
                    part.number = "SOMETHING WENT VERY WRONG :("
                }

                part.project = project;

                const materialObjet = headerIdToValue[headers.material];

                if (materialObjet != null) part.material = headerIdToValue[headers.material]["displayName"];
                //Only set to unknown material if the user hasn't previously set one
                else if (part.material == null) part.material = "Unknown Material";

                part.quantityNeeded = headerIdToValue[headers.quantity];

                //Load onshape details
                part.onshape_document_id = item["itemSource"]["documentId"]
                part.onshape_wvm_id = item["itemSource"]["wvmId"]
                part.onshape_wvm_type = item["itemSource"]["wvmType"]
                part.onshape_element_id = item["itemSource"]["elementId"]
                part.onshape_part_id = item["itemSource"]["partId"]


                if(!partAlreadyExists) {
                    part.logEntries = [];

                    part.asigneeName = ''
                    part.asigneeId = -1

                    part.part_combines = []

                    part.dimensionsOverride = false;
                }

                if(!part.dimensionsOverride) {
                    let boundingBox = await this.getBoundingBox(part)

                    //Sort the bounding box from smallest to largest, round to the nearest 0.5, and convert to string, save as dimension 1, 2, and 3
                    part.dimension1 = boundingBox.sort()[0].toFixed(3)
                    part.dimension2 = boundingBox.sort()[1].toFixed(3)
                    part.dimension3 = boundingBox.sort()[2].toFixed(3)
                }

                if (!partAlreadyExists) {
                    part.quantityInStock = 0
                    part.quantityRequested = part.quantityNeeded;
                    part.thumbnail = "unloaded"
                }

                return part;
            }));
        } catch (e_1) {
            console.log(e_1);
        }
    },

    async getBoundingBox(part: Part): Promise<any> {
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
                ]

            });
    },
    getHeaders(jsonData: any): headerInfo {
        const headers = jsonData["headers"].map(e => {
            return {name: e.name, id: e.id}
        })
        return (
            {
                name: headers.filter(e => e.name.toLowerCase() === "name")[0].id,
                material: headers.filter(e => e.name.toLowerCase() === "material")[0].id,
                quantity: headers.filter(e => e.name.toLowerCase() === "quantity")[0].id,
            }
        )
    },
    getThumbnailForElement(documentId: string, workspaceID: string, wvmIdType: string, elementId: string, part: Part): Promise<string> {
        return fetchFromOnshape(`parts/d/${documentId}/${wvmIdType}/${workspaceID}/e/${elementId}?withThumbnails=true`)
            .then((response) => response.json()).then((json) => {

                try {
                    var thisEle;
                    try {
                        thisEle = json.filter(e => {
                            return e.name.trim() === part.number.trim()
                        })[0]
                    } catch (e) {
                        //means there was only one part in the element presumably
                        thisEle = json
                    }

                    return this.parseThumbnailInfo(thisEle["thumbnailInfo"].sizes)
                } catch (e) {
                    return "fail"
                }
            });

    },

    parseThumbnailInfo(sizes: any[]): string {
        const filtered = sizes.filter(e => e["size"] === "300x300");

        return filtered[0]?.href ?? ""
    }
}