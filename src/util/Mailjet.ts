import configJson from "../../config.json";
import {LibraryResponse, SendEmailV3_1} from "node-mailjet";

const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    configJson.mj_api_key_public,
    configJson.mj_api_key_private,
    {
        config: {

        },
        options: {}
    }
);

export async function sendVerificationEmail(email: string, name: string, verificationToken: string) {

    console.log(`Sending verification email to: ${email}`);

    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: configJson.sender_email,
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
                    "ip": configJson.ip_address
                },
                TemplateLanguage: true,
                Subject: 'Verify Your ShamParts Account',
                HTMLPart: '' +
                    '<h3>{{var:name}}, thanks for signing up for ShamParts!</h3><br />' +
                    'Click the below to verify your account: ' +
                    '<a href="{{var:ip}}user/verify?token={{var:verificationToken}}" target="_blank">Verify Account</a><br/>' +
                    'If this wasn\'t you, please click this link below to cancel the account\'s creation: ' +
                    '<a href="{{var:ip}}user/cancel?token={{var:verificationToken}}" target="_blank">Cancel Account Creation</a><br/>'
                ,
                TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click the link below to verify your account: http://localhost:3000/user/verify?token={{var:verificationToken}}',
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    const { Status } = result.body.Messages[0];

    console.log(`Email status: ${Status}`)

    return Status;
}

export async function sendPasswordResetEmail(email: string, name: string, verificationToken: string) {

    console.log(`Sending password reset email to: ${email}`);

    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: configJson.sender_email,
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
                    "ip": configJson.ip_address
                },
                TemplateLanguage: true,
                Subject: 'Reset Your ShamParts Password',
                HTMLPart: '' +
                    '<h3>{{var:name}}, click the link below to reset your Shamparts password!</h3><br />' +
                    'Click the below to reset your password: ' +
                    '<a href="{{var:ip}}user/resetPassword?token={{var:verificationToken}}" target="_blank">Reset Password</a><br/>'
                ,
                TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click the link below to verify your account: http://localhost:3000/user/verify?token={{var:verificationToken}}',
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    const { Status } = result.body.Messages[0];

    console.log(`Email status: ${Status}`)

    return Status;
}

