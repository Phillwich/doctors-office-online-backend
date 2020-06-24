import { controller, interfaces, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { Repository, getRepository } from "typeorm";
import { Request, Response } from "express";

import { Surgery } from "../entity/Surgery";
import AuthMiddleware from "../middleware/authMiddleware";
import { Appointment } from "../entity/Appointment";
import { User } from "../entity/User";


@controller("/surgery")
class SurgeryController implements interfaces.Controller {
  private surgeryRepository: Repository<Surgery>;

  constructor() {
    this.surgeryRepository = getRepository(Surgery);
  }

  @httpPost("/", AuthMiddleware)
  private async addSurgery(request: Request, response: Response): Promise<Response> {
    const surgery: Surgery = request.body.surgery;

    const existingSurgery = await this.surgeryRepository.find({ email: surgery.email });

    console.log(existingSurgery)

    if (existingSurgery.length > 0) return response.send('Arzt Praxis existiert schon');

    const savedUser: Surgery = await (await this.surgeryRepository.insert(surgery)).raw.ops[0];

    console.log("Surgery hinzugefügt")

    return response.status(200).json({
      message: "Praxis hinzugefügt",
      data: savedUser
    });
  }

  @httpGet("/")
  private async getAllSurgeries(request: Request, response: Response): Promise<Response> {
    const surgeries: Surgery[] = await this.surgeryRepository.find({})

    return response.status(200).json({
      message: "Alle Praxen",
      data: surgeries
    })
  }

  @httpGet("/:surgeryId", AuthMiddleware)
  private async getSurgery(request: Request, response: Response): Promise<Response> {
    const surgeryId = request.params.surgeryId

    const surgery: Surgery = await this.surgeryRepository.findOne(surgeryId)

    return response.status(200).json({
      message: 'Praxis gefunden',
      data: surgery
    })
  }

  // @httpPut("/:userId")
  // private async updateSurgery(request: Request, response: Response): Promise<Response> {

  // }

  @httpDelete("/:Id")
  private async deleteSurgery(request: Request, response: Response): Promise<Response> {
    const surgeryId = request.params.Id
    try {
      await this.surgeryRepository.delete(surgeryId)
    } catch (error) {
      return response.status(500).json({
        message: "Konnte nicht die Praxis löschen"
      })
    }

    return response.status(200).json({
      message: 'Praxis erfolgreich gelöscht',
      data: surgeryId
    })
  }

  @httpPost("/:id/appointment")
  private async createAppointment(request: Request, response: Response): Promise<Response> {
    const surgeryId: string = request.params.id;
    const user: User = request.body.user;
    let surgery: Surgery

    try {
      surgery = await this.surgeryRepository.findOne(surgeryId)
    } catch (error) {
      return response.status(500).json({
        message: `Konnte keine Praxis mit der ID ${surgeryId} finden`
      })
    }

    const appointment = new Appointment("2020.06.21", "Untersuchung", "2020.06.21|11:00", "2020.06.21|12:00", user)

    surgery.appointments.push(appointment)

    try {
      await this.surgeryRepository.update(surgeryId, surgery)
    } catch (error) {
      return response.status(500).json({
        message: `Konnte keine Termin der Praxis mit der ID ${surgeryId} hinzufügen`
      })
    }

    return response.status(200).json({
      message: 'Termin erfolgreich erstellt',
      data: appointment
    })
  }

  @httpDelete("/:surgeryId/appointment/:appointmentId")
  private async deleteAppointment(request: Request, response: Response): Promise<Response> {
    const surgeryId: string = request.params.surgeryId
    const appointmentId: string = request.params.appointmentId
    let surgery: Surgery

    try {
      surgery = await this.surgeryRepository.findOne(surgeryId)  
    } catch (error) {
      return response.status(500).json({
        message: `Konnte Praxis mit der ID ${surgeryId} nicht finden`
      })
    }

    const index = surgery.appointments.findIndex(appointment => appointment.id === appointmentId)

    if (index === -1) {
      return response.status(500).json({
        message: `Keinen Termin mit der ID ${appointmentId} gefunden`
      })
    }

    surgery.appointments.splice(index, 1)

    try {
      await this.surgeryRepository.update(surgeryId, surgery)
    } catch (error) {
      return response.status(500).json({
        message: `Konnte Praxis nicht updaten`
      })
    }

    return response.status(200).json({
      message: "Termin erfolgreich gelöscht"
    })

  }

}

export default SurgeryController