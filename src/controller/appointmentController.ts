import { controller, interfaces, httpPost, httpGet, httpDelete } from "inversify-express-utils";
import { Connection, Repository, getRepository, ObjectID } from "typeorm";
const ObjectInstance = require('mongodb').ObjectId;
import { Response, Request } from "express";
import { inject } from "inversify";

import AuthMiddleware from "../middleware/authMiddleware";
import { Appointment } from "../entity/Appointment";
import { User } from "../entity/User";
import { Surgery } from "../entity/Surgery";
import { json } from "body-parser";

@controller('/appointment')
class AppointmentController implements interfaces.Controller {
  private appointmentRepository: Repository<Appointment>;
  private surgeryRepository: Repository<Surgery>;
  private userRepository: Repository<User>;

  constructor() {
    this.appointmentRepository = getRepository(Appointment);
    this.surgeryRepository = getRepository(Surgery);
    this.userRepository = getRepository(User);
  }

  @httpPost("/", AuthMiddleware)
  private async createAppointment(request: Request, response: Response): Promise<Response> {
    const newAppointment: Appointment = request.body.appointment
    const userId: string = newAppointment.userId
    const surgeryId: string = newAppointment.surgeryId
    
    let appointmentCheck 
    try {
      appointmentCheck = await this.appointmentRepository.findOne({ date: newAppointment.date })
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Auflisten der Termine"
      })
    }

    if (appointmentCheck) {
      if (appointmentCheck.surgeryId === surgeryId) {
        return response.status(400).json({
          message: "Dieser Termin ist schon vergeben"
        })
      }
    }

    let appointment: Appointment
    try {
      appointment = await this.appointmentRepository.save(newAppointment)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim hinzufügen eines Termines"
      })
    }

    let user: User
    try {
      user = await this.userRepository.findOne(userId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Suchen des Nutzers"
      })
    }

    user.appointments.push(appointment._id)

    try {
      await this.userRepository.update(userId, user)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Aktualisieren des Users"
      })
    }

    let surgery: Surgery 
    try {
      surgery = await this.surgeryRepository.findOne(surgeryId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Suchen der Arztpraxis"
      })
    }
    
    surgery.appointments.push(appointment._id)

    try {
      await this.surgeryRepository.update(surgeryId, surgery)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Aktualisieren der Praxis"
      })
    }

    return response.status(200).json({
      message: "Termin wurde erstellt und hinzugefügt"
    })
  }

  @httpGet("/:id", AuthMiddleware)
  private async getAppointmentsFromUser(request: Request, response: Response): Promise<Response> {
    const userId: string = request.params.id

    let user: User
    try {
      user = await this.userRepository.findOne(userId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Suchen des Users"
      })
    }

    if (!user) return response.status(404).json({ message: "Nutzer nicht gefunden" })

    const appointmentIds: ObjectID[] = user.appointments

    let userAppointments: Appointment[]
    try {
      userAppointments = await this.appointmentRepository.findByIds(appointmentIds)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beie Appointments suchen"
      })
    }

    return response.status(200).json({
      message: "Appointments gefunden",
      data: userAppointments
    })
  }

  @httpDelete("/:appointmentId", AuthMiddleware)
  private async deleteAppointment(request: Request, response: Response): Promise<Response> {
    const appointmentId: string = request.params.appointmentId

    let appointmentToDelete: Appointment
    try {
      appointmentToDelete = await this.appointmentRepository.findOne(appointmentId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Abfragen des Termins"
      })
    }

    const surgeryId = appointmentToDelete.surgeryId
    const userId = appointmentToDelete.userId

    try {
      await this.appointmentRepository.delete(appointmentId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Löschen des Termins"
      })
    }

    let user: User
    try {
      user = await this.userRepository.findOne(userId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Laden des Nutzers"
      })
    }

    const index = user.appointments.findIndex(element => element === new ObjectInstance(appointmentId))
    user.appointments.splice(index, 1)

    try {
      await this.userRepository.save(user)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim speichern des Nutzers"
      })
    }

    let surgery: Surgery
    try {
      surgery = await this.surgeryRepository.findOne(surgeryId)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Laden der Praxis"
      })
    }

    const surgeryIndex = surgery.appointments.findIndex(element => element === new ObjectInstance(appointmentId))
    surgery.appointments.splice(surgeryIndex, 1)

    try {
      await this.surgeryRepository.save(surgery)
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim speichern der Praxis"
      })
    }

    return response.status(200).json({
      message: "Termin erfolgreich gelöscht"
    })
  }
}

export default AppointmentController