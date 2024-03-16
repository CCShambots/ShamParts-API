import { AppDataSource } from "./data-source"
import {Part} from "./entity/Part";
import {Onshape} from "./util/Onshape";
import express, {Express} from 'express';
import test from "./routes/test";
import morgan from "morgan";
import routes from "./routes/index"
import * as http from "http";

AppDataSource.initialize()
  .then(async () => {
    const router: Express = express();

    router.use(morgan("dev"));
    router.use(express.urlencoded({ extended: false }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept");

        if(req.method === "OPTIONS") {
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
