import {OnshapeDocument} from "./OnshapeDocument";
import configJson from "../../config.json";
import {OnshapeAssembly} from "./OnshapeAssembly";
import {Part} from "../entity/Part";
import {AppDataSource} from "../data-source";
import {Project} from "../entity/Project";

function fetchFromOnshape(url:string) {
    console.log(`Making call to: https://cad.onshape.com/api/v6/${url}`)
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
    getDocuments(query:string):Promise<OnshapeDocument[]> {
        return fetchFromOnshape(`documents?q=${query}&filter=9&owner=${configJson.onshape_team_id}`)
            .then((response) => response.json()).then((json) => {

            return json.items.map((item: any) => {
                return OnshapeDocument.fromJSON(item)
            })
        });
    },

    getAssemblies(documentId:string, workspaceID:string):Promise<OnshapeAssembly[]> {
        return fetchFromOnshape(`documents/d/${documentId}/w/${workspaceID}/elements?withThumbnails=true`)
            .then((response) => response.json()).then((json) => {

                const filteredForAssemblies = json.filter(e => e.elementType === "ASSEMBLY");

                return filteredForAssemblies.map((item: any) => OnshapeAssembly.fromJSON(item))
        });
    },
    async getPartsFromAssembly(project:Project): Promise<Part[]> {
        try {
            const response = await fetchFromOnshape(`assemblies/d/${project.onshape_id}/w/${project.default_workspace}/e/${project.assembly_onshape_id}/bom?indented=false&generateIfAbsent=true`);
            const json = await response.json();

            //load existing parts
            const parts = await Part.getPartsInDB();

            const headers = Onshape.getHeaders(json);
            return await json.rows.map((item: any) => {

                // console.log(item)
                // console.log(headers.material)
                // console.log(item["headerIdToValue"][headers.material])

                const headerIdToValue = item["headerIdToValue"];

                const partNumber = headerIdToValue[headers.name];
                const partsWithThisNumber = parts.filter(e => e.number === partNumber);

                const partAlreadyExists = partsWithThisNumber.length > 0;

                const part = partsWithThisNumber.length > 0 ? partsWithThisNumber[0] : new Part();
                part.number = partNumber;

                part.project = project;

                const materialObjet = headerIdToValue[headers.material];

                if(materialObjet != null) part.material = headerIdToValue[headers.material]["displayName"];
                //Only set to unknown material if the user hasn't previously set one
                else if(part.material == null) part.material = "Unknown Material";

                part.quantityNeeded = headerIdToValue[headers.quantity];
                // part.thumbnail = this.parseThumbnailInfo(item["thumbnailInfo"]["sizes"])
                part.onshape_id = item["itemSource"]["elementId"]

                if(!partAlreadyExists) {
                    part.quantityInStock = 0
                    part.quantityRequested = part.quantityNeeded;
                    part.thumbnail = "unloaded"
                }

                return part;
            });
        } catch (e_1) {
            console.log(e_1);
        }
    },
    getHeaders(jsonData:any):headerInfo {
        const headers = jsonData["headers"].map(e => {return {name: e.name, id: e.id}})
        return(
            {
                name: headers.filter(e => e.name.toLowerCase() === "name")[0].id,
                material: headers.filter(e => e.name.toLowerCase() === "material")[0].id,
                quantity: headers.filter(e => e.name.toLowerCase() === "quantity")[0].id,
            }
        )
    },
    getThumbnailForElement(documentId:string, workspaceID:string, elementId:string, part:Part):Promise<string> {
        return fetchFromOnshape(`parts/d/${documentId}/w/${workspaceID}/e/${elementId}?withThumbnails=true`)
            .then((response) => response.json()).then((json) => {

                try {
                    var thisEle;
                    try {
                        thisEle = json.filter(e => e.name  === part.number)[0]
                    } catch(e) {
                        //means there was only one part in the element presumably
                        thisEle = json
                    }

                    console.log(thisEle)
                    return this.parseThumbnailInfo(thisEle["thumbnailInfo"].sizes)
                } catch (e) {
                    console.log(e)
                    console.log(json)
                    console.log(`${documentId},${workspaceID},${elementId}`)
                    return "fail"
                }
        });

    },

    parseThumbnailInfo(sizes:any[]):string {
        const filtered = sizes.filter(e => e["size"] === "300x300");

        return filtered[0]?.href ?? ""
    }
}