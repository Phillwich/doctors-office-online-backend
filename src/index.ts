import "reflect-metadata";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";

import createContainer from "./dependencyInjection/container";
import "./controller/userController";
import "./controller/authController";
import "./controller/registerController";
import "./controller/surgeryController";
import "./controller/appointmentController";

(async () => {
    const container = await createContainer();
    const port = process.env.PORT || 3000
    
    let server = new InversifyExpressServer(container);
    server.setConfig((application) => {
        application.use(cors());
        application.use(bodyParser.urlencoded({ extended: true }));
        application.use(bodyParser.json());
    });

    const app = server.build();
    app.listen(port, () => console.log("Application is running on port 3000"));
})()