import { interfaces, controller, httpPost } from "inversify-express-utils";
import { Repository, getRepository } from "typeorm";
import * as bcrypt from "bcryptjs"

import { User } from "../entity/User";
import { Response, Request } from "express";

@controller("/register")
class RegisterController implements interfaces.Controller {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  @httpPost("/")
  private async registerUser(request: Request, response: Response): Promise<Response> {
    
    const user: User  = request.body.user;

    const existingUser = await this.userRepository.find({ email: user.email });
  
    if (existingUser.length > 0) return response.status(400).json({ message: 'Benutzer existiert schon' });

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    user.appointments = []
    user.isAdmin = false
    
    let savedUser: User
    try {
      savedUser = await (await this.userRepository.insert(user)).raw.ops[0];
    } catch (error) {
      return response.status(500).json({
        message: "Fehler beim Speichern des Nutzers"
      })
    }
    
    return response.status(200).json({
      message: "Nutzer hinzugefügt",
      data: savedUser
    });
  }
}

export default RegisterController