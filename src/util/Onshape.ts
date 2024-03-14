import {OnshapeDocument} from "./OnshapeDocument";
import configJson from "../../config.json";


export var Onshape = {
    getDocuments(query:string):Promise<OnshapeDocument[]> {
        return fetch(`https://cad.onshape.com/api/v6/documents?q=${query}&filter=9&owner=${configJson.onshape_team_id}`, {
            method: "GET",
            headers: {
                "Authorization": "Basic " + configJson.onshape_auth_code
            }
        }).then((response) => response.json()).then((json) => {

            return json.items.map((item: any) => {
                return OnshapeDocument.fromJSON(item)
            })
        });
    }
}