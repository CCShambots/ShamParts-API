import {AppDataSource} from "./data-source"
import express, {Express} from 'express';
import morgan from "morgan";
import routes from "./routes/index"
import * as http from "http";
import 'reflect-metadata';
import configJson from "../config.json";
import {Server} from "./entity/Server";
import { promises as fs } from 'fs';
import {generateSafeKey, generateSafeRandomToken} from "./util/AuthUtil"; // Use the promises API from fs module
export const firebase = require("firebase-admin")
export var firebaseActive = false;

try {
    const serviceAccount = require("../firebase.config.json")

    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount)
    })

    firebaseActive = true;
} catch (e) {
    console.log("Firebase config not found, skipping firebase initialization. If this is not the main server, this is normal.")
}

AppDataSource.initialize()
    .then(async () => {
        const router: Express = express();

        if (configJson.ip_address === configJson.leader_ip) {
            //This is the leader repo, so create the database entry
            console.log("Detected this as leader server... instantiating self in database")

            //If this server already exists, just make sure it's name and IP are correct
            let server = await AppDataSource.manager.findOne(Server, {where: {ip: configJson.ip_address}})

            let servers = await AppDataSource.manager.find(Server)

            if (!server) {
                server = new Server();
                server.random_token = generateSafeRandomToken(servers.map(e => e.random_token));
                server.key = generateSafeKey(servers.map(e => e.key));
            }

            server.name = configJson.name
            server.ip = configJson.ip_address
            server.verified = true;

            configJson.server_key = server.key;
            configJson.server_token = server.random_token;

            // Save the modified configJson back to the config.json file
            await fs.writeFile('config.json', JSON.stringify(configJson, null, 20));

            await AppDataSource.manager.save(server)
            console.log("successfully added self to database")
        } else if(configJson.server_key === "") {
            //Register with the host
            console.log(`Attempting to register with master server at: ${configJson.leader_ip}`)

            let response = await fetch(`${configJson.leader_ip}/server/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: configJson.name,
                    ip: configJson.ip_address
                }),
                signal: AbortSignal.timeout(5000)
            })

            if (response.status !== 200) {
                console.log(`Error registering with host: ${response.status} - ${response.statusText}`)
                process.exit(-1);
            } else {
                // Modify configJson here if needed
                let returned =  await response.json();

                configJson.server_key = returned.key;
                configJson.server_token = returned.random_token;

                console.log(process.cwd())

                // Save the modified configJson back to the config.json file
                await fs.writeFile('config.json', JSON.stringify(configJson, null ,2));

                console.log(`Successfully registered server with key: ${returned.key}`)
            }

        } else {
            //Just verify that the server is chilling
            console.log(`Attempting to verify connectivity to leader server... Using key ${configJson.server_key}`)

            let response = await fetch(`${configJson.leader_ip}/server/check`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: configJson.server_key
                }),
                signal: AbortSignal.timeout(5000)
            })

            if(response.status === 200) {
                console.log(`Success verifying; Server key is ${configJson.server_key}`)
            } else {
                console.log(`Error verifying with host: ${response.status} - ${response.statusText}`)
                process.exit(-1);
            }
        }

        router.use(morgan("dev"));
        router.use(express.urlencoded({extended: false}));
        router.use(express.json({ limit: "50mb"}));

        router.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept");

            if (req.method === "OPTIONS") {
                res.header("Access-Control-Allow-Methods", "GET PATCH POST PUT DELETE");
                return res.status(200).json({});
            }
            next();
        })

        router.use("/", routes)

        router.use((req, res, next) => {
            const error = new Error("Not found");
            return res.status(404).json({
                message: error.message
            })
        })

        const httpServer = http.createServer(router);
        const PORT = process.env.PORT ?? 3000;
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })

    })
    .catch((error) => console.log("Error: ", error))
