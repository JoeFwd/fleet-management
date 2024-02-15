import { FleetInMemoryRepository } from '@backend/Infra/Repositories/FleetInMemoryRepository.js';
import { ExternalWorld } from './ExternalWorld.js';
import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';

export class InMemoryWorld implements ExternalWorld {
  public init(): Promise<FleetRepository> {
    return Promise.resolve(new FleetInMemoryRepository());
  }

  public async clean(): Promise<void> {}
}
