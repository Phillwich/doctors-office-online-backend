import { controller, interfaces, httpPost } from "inversify-express-utils";
import { Connection, Repository, getRepository } from "typeorm";
import { inject } from "inversify";
import { Response, Request } from "express";
import * as config from "config"

import { Appointment } from "../entity/Appointment";

@controller('/appointment')
class AppointmentController implements interfaces.Controller {
  private connection: Connection;
  private appointmentRepository: Repository<Appointment>;

  constructor(@inject(Connection) connection: Connection) {
    this.connection = this.connection;
    this.appointmentRepository = getRepository(Appointment);
  }

}

export default AppointmentController