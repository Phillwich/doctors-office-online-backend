import "reflect-metadata";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";

import createContainer from "./dependencyInjection/container";
import "./controller/userController";
import "./controller/authController";
import "./controller/registerController";
import "./controller/surgeryController";

(async () => {
    const container = await createContainer();

    let server = new InversifyExpressServer(container);
    server.setConfig((application) => {
        application.use(cors());
        application.use(bodyParser.urlencoded({ extended: true }));
        application.use(bodyParser.json());
    });

    const app = server.build();
    app.listen(3000, () => console.log("Application is running on port 3000"));
})()