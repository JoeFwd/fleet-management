import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { DbClient } from '@backend/Infra/Persistence/DbClient.js';
import { randomUUID } from 'crypto';
import { ExternalWorld } from './ExternalWorld.js';
import { FleetDatabaseRepository } from '@backend/Infra/Repositories/FleetDatabaseRepository.js';
import { AppConfig, ConfigLoader } from '@backend/Infra/Config/ConfigLoader.js';
import { MapperFactory } from '@backend/Infra/Mappers/MapperFactory.js';
import { EntityManager } from '@mikro-orm/core';

export class DatabaseWorld implements ExternalWorld {
  private schemaName = randomUUID().toString();
  private dbClient?: DbClient;
  private entityManager?: EntityManager;
  public fleetRepository!: FleetRepository;

  public async init(): Promise<FleetRepository> {
    this.dbClient = this.initDbClient(this.schemaName);

    try {
      const { schemaGenerator, entityManager } = await this.dbClient.connect();
      this.entityManager = entityManager;
      await schemaGenerator.createSchema();
      return new FleetDatabaseRepository(new MapperFactory(), entityManager);
    } catch (error) {
      await this.dbClient.disconnect();
      throw error;
    }
  }

  public async clean(): Promise<void> {
    if (!this.dbClient || !this.entityManager) return;
    try {
      await this.entityManager.getConnection().execute(`DROP SCHEMA "${this.schemaName}" CASCADE;`);
    } finally {
      await this.dbClient.disconnect();
    }
  }

  private initDbClient(schemaName: string): DbClient {
    const configLoader: ConfigLoader = new ConfigLoader();
    const config: AppConfig = configLoader.load();
    return new DbClient({
      ...config,
      databaseSchema: schemaName
    });
  }
}
