import { controller, interfaces, httpPost } from "inversify-express-utils";
import { Connection, Repository, getRepository } from "typeorm";
import { inject } from "inversify";
import { Response, Request } from "express";
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import * as config from "config"

import { User } from "../entity/User";

@controller('/login')
class AuthController implements interfaces.Controller {
  private connection: Connection;
  private userRepository: Repository<User>;

  constructor(@inject(Connection) connection: Connection) {
    this.connection = this.connection;
    this.userRepository = getRepository(User);
  }

  @httpPost("/")
  private async login(request: Request, response: Response): Promise<Response> {
    const { email, password }: User = request.body.userData;

    const user: User[] = await this.userRepository.find({ email });
  
    if (user.length === 0) return response.send("Nutzer existiert nicht");
    
    if (!bcrypt.compareSync(password, user[0].password)) return response.send("Falsches Passwort");

    const token = jwt.sign({ _id: user[0]._id }, config.get("SUPER_SECRET"), { expiresIn: 60 * 30 });

    delete user[0].password;

    return response.status(200).json({
      message: "Erfolgreich eingeloggt",
      data: {
        token, 
        user: user[0]
      }
    });
  }
}

export default AuthController