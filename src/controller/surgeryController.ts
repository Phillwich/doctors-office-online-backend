import { controller, interfaces, httpGet, httpPost, httpPut, httpDelete } from "inversify-express-utils";
import { Repository, getRepository } from "typeorm";
import { Request, Response } from "express";

import { Surgery } from "../entity/Surgery";
import AuthMiddleware from "../middleware/authMiddleware";


@controller("/surgery")
class SurgeryController implements interfaces.Controller {
  private surgeryRepository: Repository<Surgery>

  constructor() {
    this.surgeryRepository = getRepository(Surgery)
  }

  @httpPost("/", AuthMiddleware)
  private async addSurgery(request: Request, response: Response): Promise<Response> {
    const surgery: Surgery = request.body.surgery;

    const existingSurgery = await this.surgeryRepository.find({ email: surgery.email });

    if (existingSurgery.length > 0) return response.send('Arzt Praxis existiert schon');

    const savedUser: Surgery = await (await this.surgeryRepository.insert(surgery)).raw.ops[0];

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
    console.log(surgeryId)
    const message  = await this.surgeryRepository.delete(surgeryId)
    console.log(message)

    return response.status(200).json({
      message: 'Praxis erfolgreich gelöscht',
      data: surgeryId
    })
  }

}

export default SurgeryController