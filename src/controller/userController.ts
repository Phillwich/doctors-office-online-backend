import { controller, interfaces, httpGet, BaseMiddleware } from "inversify-express-utils";
import { Connection, Repository, getRepository } from "typeorm";
import { inject, injectable} from "inversify";
import { Request, Response } from "express";

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

    if (user === undefined) return response.json({ message: 'Nutzer existiert nicht' })

    return response.status(200).json({
      message: "Nutzer gefunden",
      data: user
    })
  }

}

export default UserController