"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAlphanumericKey = exports.generateSafeKey = exports.generateRandomToken = exports.generateSafeRandomToken = exports.stringToHash = void 0;
function stringToHash(string) {
    let hash = 0;
    if (string.length == 0)
        return hash.toString();
    for (let i = 0; i < string.length; i++) {
        let char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}
exports.stringToHash = stringToHash;
function generateSafeRandomToken(disallowedStrings) {
    let val = generateRandomToken();
    while (disallowedStrings.includes(val)) {
        val = generateRandomToken();
    }
    return val;
}
exports.generateSafeRandomToken = generateSafeRandomToken;
function generateRandomToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
exports.generateRandomToken = generateRandomToken;
//4-digit keys for server auths
function generateSafeKey(disallowedKeys) {
    let key = generateAlphanumericKey();
    while (disallowedKeys.includes(key)) {
        key = generateAlphanumericKey();
    }
    return key;
}
exports.generateSafeKey = generateSafeKey;
function generateAlphanumericKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }
    return key;
}
exports.generateAlphanumericKey = generateAlphanumericKey;
//# sourceMappingURL=AuthUtil.js.map