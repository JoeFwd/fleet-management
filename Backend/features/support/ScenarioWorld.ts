import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { Location } from '@backend/Domain/Entities/Location.js';
import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';
import { FleetId } from '@backend/Domain/ValueObjects/id-types.js';
import { ExternalWorld } from './ExternalWorld.js';
import { IWorldOptions, World, setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { DatabaseWorld } from './DatabaseWorld.js';
import { InMemoryWorld } from './InMemoryWorld.js';

interface ExternalWorldOptions {
  useExternalDb?: boolean;
}

export class ScenarioWorld extends World<ExternalWorldOptions> implements ExternalWorld {
  public fleetRepository!: FleetRepository;
  public myFleet?: Fleet = undefined;
  public myFleetId?: FleetId = undefined;
  public otherFleet?: Fleet = undefined;
  public otherFleetId?: FleetId = undefined;
  public vehicle?: Vehicle = undefined;
  public location?: Location = undefined;
  public error?: Error = undefined;

  private fleetScenarioWorld: ExternalWorld;

  constructor(options: IWorldOptions<ExternalWorldOptions>) {
    super(options);
    this.fleetScenarioWorld = new InMemoryWorld();
    if (options.parameters.useExternalDb) {
      this.fleetScenarioWorld = new DatabaseWorld();
    }
  }

  public async init(): Promise<FleetRepository> {
    this.fleetRepository = await this.fleetScenarioWorld.init();
    return this.fleetRepository;
  }

  public clean(): Promise<void> {
    return this.fleetScenarioWorld.clean();
  }
}

setDefaultTimeout(3600 * 1000);
setWorldConstructor(ScenarioWorld);
