import { BaseMiddleware, requestHeaders } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import * as config from "config"
import { injectable } from "inversify";

@injectable()
class AuthMiddleware extends BaseMiddleware {
  handler(request: Request, response: Response, next: NextFunction): void {
    console.log(request.headers)
    if (request.headers.authorization) {
      const token = request.headers.authorization

      if (jwt.verify(token, config.get('SUPER_SECRET'))) {
        console.log('Authenticated')
        return next()
      }
    }
    console.log('Not authenticated')
    return next(response.status(401).json({ message: 'Verpiss dich'}))
  }
}

export default AuthMiddleware