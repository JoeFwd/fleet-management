import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';

export interface ExternalWorld {
  init(): Promise<FleetRepository>;
  clean(): Promise<void>;
}
