import { AsyncContainerModule } from 'inversify';
import AuthMiddleware from "../../middleware/authMiddleware"
import { BaseMiddleware } from 'inversify-express-utils';

class AuthMiddlewareModule extends AsyncContainerModule {

  constructor() {
    super(async (bind) => {
      // const middleware = new AuthMiddleware();
      
      bind(AuthMiddleware).to(AuthMiddleware);
    });
  }

}

export default AuthMiddlewareModule