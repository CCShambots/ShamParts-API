import {AppDataSource} from "./data-source"
import express, {Express} from 'express';
import morgan from "morgan";
import routes from "./routes/index"
import * as http from "http";
import 'reflect-metadata';
import configJson from "../config.json";
import {Server} from "./entity/Server";
import {generateRandomToken} from "./controllers/user.controller";


AppDataSource.initialize()
    .then(async () => {
        const router: Express = express();

        if (configJson.ip_address === configJson.leader_ip) {
            //This is the leader repo, so create the database entry
            console.log("Detected this as leader server... instantiating self in database")

            //If this server already exists, just make sure it's name and IP are correct
            let server = await AppDataSource.manager.findOne(Server, {where: {ip: configJson.ip_address}})

            if (!server) {
                server = new Server();
                server.random_token = generateRandomToken();
            }

            server.name = configJson.name
            server.ip = configJson.ip_address
            server.verified = true;

            await AppDataSource.manager.save(server)
            console.log("successfully added self to database")
        } else {
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
                console.log(`Error registering with host: ${response.status} ${response.statusText}`)
                process.exit(-1);
            }

        }

        router.use(morgan("dev"));
        router.use(express.urlencoded({extended: false}));
        router.use(express.json());

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
