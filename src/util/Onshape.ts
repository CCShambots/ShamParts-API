import {OnshapeDocument} from "./OnshapeDocument";
import configJson from "../../config.json";
import {OnshapeAssembly} from "./OnshapeAssembly";

function fetchFromOnshape(url:string) {
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
        return fetchFromOnshape(`documents/d/${documentId}/w/${workspaceID}/elements`)
            .then((response) => response.json()).then((json) => {

                console.log(json)

            var filteredForAssemblies = json.filter(e => e.elementType === "ASSEMBLY")

            return filteredForAssemblies.map((item: any) => {
                return new OnshapeAssembly(item.id, item.name)
            })
        });
    }
}