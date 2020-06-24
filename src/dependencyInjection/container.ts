import { Container } from 'inversify';

import DatabaseModule from './modules/database_module';
import AuthMiddlewareModule from './modules/middelware_module';

const createContainer = async () => {
  let container = new Container();

  await container.loadAsync(new DatabaseModule());
  container.load(new AuthMiddlewareModule())
  return container;
}

export default createContainer