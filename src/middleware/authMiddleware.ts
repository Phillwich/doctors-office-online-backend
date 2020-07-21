import { BaseMiddleware, requestHeaders } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import * as config from "config"
import { injectable } from "inversify";

@injectable()
class AuthMiddleware extends BaseMiddleware {
  handler(request: Request, response: Response, next: NextFunction): void {
    if (request.headers.authorization) {
      const token = request.headers.authorization
      
      try {
        if (jwt.verify(token, config.get('SUPER_SECRET'))) {
          console.log('Authenticated')
          return next()
        }
      } catch (error) {
        return next(response.status(401).json({ message: 'Nicht berechtigt'}))    
      }
    }
    console.log('Not authenticated')
    return next(response.status(401).json({ message: 'Nicht berechtigt'}))
  }
}

export default AuthMiddleware