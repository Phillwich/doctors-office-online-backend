import { controller, interfaces, httpPost } from "inversify-express-utils";
import { Connection, Repository, getRepository } from "typeorm";
import { Response, Request } from "express";
import { inject } from "inversify";

import AuthMiddleware from "../middleware/authMiddleware";
import { Appointment } from "../entity/Appointment";
import { User } from "../entity/User";
import { Surgery } from "../entity/Surgery";

@controller('/appointment')
class AppointmentController implements interfaces.Controller {
  private connection: Connection;
  private appointmentRepository: Repository<Appointment>;
  private surgeryRepository: Repository<Surgery>;  
  private userRepository: Repository<User>;

  constructor(@inject(Connection) connection: Connection) {
    this.connection = this.connection;
    this.appointmentRepository = getRepository(Appointment);
    this.surgeryRepository = getRepository(Surgery);
    this.userRepository = getRepository(User);
  }

  @httpPost("/", AuthMiddleware)
  private async createAppointment(request: Request, response: Response): Promise<Response> {
    const newAppointment: Appointment = request.body.appointment
    const userId: string = newAppointment.userId
    const surgeryId: string = newAppointment.surgeryId

    let appointment: Appointment
    try {
      appointment = await this.appointmentRepository.save(newAppointment)
    } catch (error) {
      return response.status(500).json({
        message: "Konnte keinen Termin erstellen"
      })
    }

    try {
      const user: User = await this.userRepository.findOne(userId)
      user.appointments.push(appointment._id)
      await this.userRepository.update(userId, user)
    } catch (error) {
      return response.status(500).json({
        message: "Konnte Termin nicht dem Nutzer hinzufügen"
      })
    }

    try {
      const surgery: Surgery = await this.surgeryRepository.findOne(surgeryId)
      surgery.appointments.push(appointment._id)
      await this.surgeryRepository.update(surgeryId, surgery)
    } catch (error) {
      return response.status(500).json({
        message: "Konnte Termin der Praxis nicht hinzufügen"
      })
    }

    return response.status(200).json({
      message: "Termin wurde erstellt und hinzugefügt"
    })
  }
}

export default AppointmentController