import { EntityManager, MikroORM, PostgreSqlDriver, SchemaGenerator } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import { Vehicle } from '@backend/Infra/Entities/Vehicle.js';
import { Fleet } from '@backend/Infra/Entities/Fleet.js';
import { Location } from '@backend/Infra/Entities/Location.js';
import { ParkedVehicle } from '@backend/Infra/Entities/ParkedVehicle.js';
import { User } from '@backend/Infra/Entities/User.js';
import { AppConfig } from '@backend/Infra/Config/ConfigLoader.js';
import { FleetOwnership } from '@backend/Infra/Entities/FleetOwnership.js';

export class DbClient {
  private orm?: MikroORM;

  constructor(private readonly config: AppConfig) {}

  public async connect(): Promise<{
    entityManager: EntityManager;
    schemaGenerator: SchemaGenerator;
  }> {
    const orm: MikroORM = await MikroORM.init<PostgreSqlDriver>({
      metadataProvider: ReflectMetadataProvider,
      entities: [Fleet, Vehicle, Location, ParkedVehicle, User, FleetOwnership],
      host: this.config.databaseHost,
      port: Number(this.config.databasePort),
      dbName: this.config.databaseName,
      user: this.config.databaseUser,
      password: this.config.databasePassword,
      schema: this.config.databaseSchema,
      type: 'postgresql',
      debug: false
    });
    this.orm = orm;
    return {
      entityManager: orm.em.fork({ useContext: true }),
      schemaGenerator: orm.getSchemaGenerator()
    };
  }

  public async disconnect() {
    await (this.orm?.close() ?? Promise.resolve());
  }
}
