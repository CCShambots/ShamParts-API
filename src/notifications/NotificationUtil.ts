import configJson from "../../config.json";

export function sendNotification(tokens:string[], title:string, body:string) {
    fetch(
        configJson.leader_ip + "/user/sendNotif",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "firebase_tokens": tokens,
                "title": title,
                "body": body,
                "server_token": configJson.server_token
            })
        }
    )
}