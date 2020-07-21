import { controller, interfaces, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { Repository, getRepository, ObjectID } from "typeorm";
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

    if (existingSurgery.length > 0) return response.status(400).send('Arzt Praxis existiert schon');

    surgery.appointments = []

    const savedSurgery: Surgery = await (await this.surgeryRepository.insert(surgery)).raw.ops[0];

    return response.status(200).json({
      message: "Praxis hinzugefügt",
      data: savedSurgery
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
    
    let surgery: Surgery 
    try {
      surgery = await this.surgeryRepository.findOne(surgeryId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim finden der Praxis"
      })
    }

    if (surgery === undefined) return response.status(404).json({ message: 'Praxis existiert nicht' })

    return response.status(200).json({
      message: 'Praxis gefunden',
      data: surgery
    })
  }

  @httpPut("/")
  private async updateSurgery(request: Request, response: Response): Promise<Response> {
    const updatedSurgery: Surgery = request.body.surgery

    let surgery: Surgery
    try {
      surgery = await this.surgeryRepository.findOne(updatedSurgery._id)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim suchen der Praxis"
      })
    }

    if (surgery === undefined) return response.status(404).json({ message: 'Praxis existiert nicht' })

    for (const key of Object.keys(updatedSurgery)) {
      surgery[key] = updatedSurgery[key]
    }

    const surgeryId: ObjectID = surgery._id
    delete surgery._id
    
    try {
      await this.surgeryRepository.update(surgeryId, surgery)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim updaten der Praxis"
      })
    }

    return response.status(200).json({
      message: "Praxis erfolgreich geupdatet"
    })
  }

  @httpDelete("/:Id")
  private async deleteSurgery(request: Request, response: Response): Promise<Response> {
    const surgeryId = request.params.Id
    
    try {
      await this.surgeryRepository.delete(surgeryId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Löschen der Praxis"
      })
    }

    return response.status(200).json({
      message: 'Praxis erfolgreich gelöscht',
      data: surgeryId
    })
  }
}

export default SurgeryController