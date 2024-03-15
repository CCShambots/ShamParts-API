import {OnshapeDocument} from "./OnshapeDocument";
import configJson from "../../config.json";

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
    }
}