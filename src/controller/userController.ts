import { controller, interfaces, httpGet, BaseMiddleware, httpDelete, httpPut } from "inversify-express-utils";
import { Connection, Repository, getRepository, ObjectID } from "typeorm";
import { inject } from "inversify";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs"

import { User } from "../entity/User";
import AuthMiddleware from "../middleware/authMiddleware";

@controller('/user')
class UserController implements interfaces.Controller {
  private userRepository: Repository<User>

  constructor(@inject(Connection) connection: Connection) {
    this.userRepository = getRepository(User)
  }

  @httpGet("/:userId", AuthMiddleware)
  private async getUser(request: Request, response: Response): Promise<Response> {
    const _id: string = request.params.userId;
    

    const user = await this.userRepository.findOne(_id);

    if (user === undefined) return response.status(404).json({ message: 'Nutzer existiert nicht' })

    return response.status(200).json({
      message: "Nutzer gefunden",
      data: user
    })
  }

  @httpPut("/", AuthMiddleware)
  private async updateUser(request: Request, response: Response): Promise<Response> {
    const updatedUser: User = request.body.user

    let user: User
    try {
      user = await this.userRepository.findOne(updatedUser._id)
    } catch (error) {
      return response.status(404).json({
        message: "Nutzer wurde nicht gefunden"
      })
    }

    for (const key of Object.keys(updatedUser)) {
      user[key] = updatedUser[key]
      if (key === 'password') {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(updatedUser.password, salt);
      }
    }

    const userId: ObjectID = user._id
    delete user._id

    try {
      await this.userRepository.update(userId, user)
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        message: "Konnte Nutzer nicht updaten"
      })
    }

    return response.status(200).json({
      message: "Nutzer wurde erfolgreich geupdatet"
    })
  }

  @httpDelete("/:userId", AuthMiddleware)
  private async deleteUser(request: Request, response: Response): Promise<Response> {
    const userId: string = request.params.userId

    try {
      await this.userRepository.delete(userId)
    } catch (error) {
      return response.status(500).json({
        message: "Nutzer konnte nicht gelöscht werden"
      })
    }

    return response.status(200).json({
      message: "Nutzer wurde erfolgreich gelöscht"
    })
  }

}

export default UserController