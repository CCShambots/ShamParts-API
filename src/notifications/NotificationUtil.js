"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
function sendNotification(tokens, title, body) {
    fetch(config_json_1.default.leader_ip + "/user/sendNotif", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "firebase_tokens": tokens,
            "title": title,
            "body": body,
            "server_token": config_json_1.default.server_token
        })
    });
}
exports.sendNotification = sendNotification;
//# sourceMappingURL=NotificationUtil.js.map