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
exports.sendServerVerification = exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const config_json_1 = __importDefault(require("../../config.json"));
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(config_json_1.default.mj_api_key_public, config_json_1.default.mj_api_key_private, {
    config: {},
    options: {}
});
function sendVerificationEmail(email, name, verificationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Sending verification email to: ${email}`);
        const data = {
            Messages: [
                {
                    From: {
                        Email: config_json_1.default.sender_email,
                        Name: "ShamParts"
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Variables: {
                        "name": name,
                        "verificationToken": verificationToken,
                        "ip": config_json_1.default.ip_address
                    },
                    TemplateLanguage: true,
                    Subject: 'Verify Your ShamParts Account',
                    HTMLPart: '' +
                        '<h3>{{var:name}}, thanks for signing up for ShamParts!</h3><br />' +
                        'Click this link to verify your account: ' +
                        '<a href="{{var:ip}}/user/verify?token={{var:verificationToken}}" target="_blank">Verify Account</a><br/>' +
                        'If this wasn\'t you, please click this link to cancel the account\'s creation: ' +
                        '<a href="{{var:ip}}/user/cancel?token={{var:verificationToken}}" target="_blank">Cancel Account Creation</a><br/>',
                    TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click this link below to verify your account: http://localhost:3000/user/verify?token={{var:verificationToken}}',
                },
            ],
        };
        const result = yield mailjet
            .post('send', { version: 'v3.1' })
            .request(data);
        const { Status } = result.body.Messages[0];
        console.log(`Email status: ${Status}`);
        return Status;
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
function sendPasswordResetEmail(email, name, verificationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Sending password reset email to: ${email}`);
        const data = {
            Messages: [
                {
                    From: {
                        Email: config_json_1.default.sender_email,
                        Name: "ShamParts"
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Variables: {
                        "name": name,
                        "verificationToken": verificationToken,
                        "ip": config_json_1.default.ip_address
                    },
                    TemplateLanguage: true,
                    Subject: 'Reset Your ShamParts Password',
                    HTMLPart: '' +
                        '<h3>{{var:name}}, click this link to reset your Shamparts password!</h3><br />' +
                        'Click the below to reset your password: ' +
                        '<a href="{{var:ip}}/user/resetPasswordPage?token={{var:verificationToken}}" target="_blank">Reset Password</a><br/>',
                    TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click the link below to verify your account: http://localhost:3000/user/verify?token={{var:verificationToken}}',
                },
            ],
        };
        const result = yield mailjet
            .post('send', { version: 'v3.1' })
            .request(data);
        const { Status } = result.body.Messages[0];
        console.log(`Email status: ${Status}`);
        return Status;
    });
}
exports.sendPasswordResetEmail = sendPasswordResetEmail;
function sendServerVerification(email, name, verificationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Sending server verification email to: ${email}`);
        const data = {
            Messages: [
                {
                    From: {
                        Email: config_json_1.default.sender_email,
                        Name: "ShamParts"
                    },
                    To: [
                        {
                            Email: email,
                        },
                    ],
                    Variables: {
                        "name": name,
                        "verificationToken": verificationToken,
                        "ip": config_json_1.default.ip_address
                    },
                    TemplateLanguage: true,
                    Subject: 'Verify New ShamParts Server',
                    HTMLPart: '' +
                        '<h3>A new ShamParts Server has been registered: {{var:name}}</h3><br />' +
                        'Click the below to verify : ' +
                        '<a href="{{var:ip}}/server/verify?token={{var:verificationToken}}" target="_blank">Verify Server</a><br/>' +
                        'If this server shouldn\'t exist, please click this link below to cancel the new server: ' +
                        '<a href="{{var:ip}}/server/deny?token={{var:verificationToken}}" target="_blank">Deny Server</a><br/>',
                    TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click the link below to verify your account: http://localhost:3000/user/verify?token={{var:verificationToken}}',
                },
            ],
        };
        const result = yield mailjet
            .post('send', { version: 'v3.1' })
            .request(data);
        const { Status } = result.body.Messages[0];
        console.log(`Email status: ${Status}`);
        return Status;
    });
}
exports.sendServerVerification = sendServerVerification;
//# sourceMappingURL=Mailjet.js.map