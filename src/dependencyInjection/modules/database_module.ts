import { AsyncContainerModule } from 'inversify';
import { createConnection, Connection } from 'typeorm';

class DatabaseModule extends AsyncContainerModule {

  constructor() {
    super(async (bind) => {
      const connection = await createConnection();
      
      bind(Connection).toConstantValue(connection);
    });
  }

}

export default DatabaseModule