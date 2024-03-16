import {OnshapeDocument} from "./OnshapeDocument";
import configJson from "../../config.json";
import {OnshapeAssembly} from "./OnshapeAssembly";
import {Part} from "../entity/Part";

function fetchFromOnshape(url:string) {
    console.log(`https://cad.onshape.com/api/v6/${url}`)
    return fetch(`https://cad.onshape.com/api/v6/${url}`, {
        method: "GET",
        headers: {
            "Authorization": "Basic " + configJson.onshape_auth_code
        }
    });
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
    getPartsFromAssembly(documentId:string, workspaceID:string, assemblyId:string):Promise<Part[]> {
        return fetchFromOnshape(`assemblies/d/${documentId}/w/${workspaceID}/e/${assemblyId}/bom?indented=false&thumbnail=true&generateIfAbsent=true`)
            .then((response) => response.json()).then((json) => {
                console.log(json)

                return json.items.map((item: any) => {
                    return null;
                    // return new Part(item.partId, item.partName, item.partNumber, item.quantity, item.thumbnail);
                })
        });
    },

    parseThumbnailInfo(sizes:any[]):string {
        const filtered = sizes.filter(e => e["size"] === "300x300");

        return filtered[0]?.href ?? ""
    }
}