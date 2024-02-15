import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { CreateFleetCommandHandler } from './CommandHandlers/CreateFleetCommandHandler.js';
import { CreateFleetCommand } from './Commands/CreateFleetCommand.js';
import { FleetId } from '@backend/Domain/ValueObjects/id-types.js';
import { RegisterVehicleCommandHandler } from './CommandHandlers/RegisterVehicleCommandHandler.js';
import { RegisterVehicleCommand } from './Commands/RegisterVehicleCommand.js';
import { ParkVehiculeCommand } from './Commands/ParkVehiculeCommand.js';
import { ParkVehicleCommandHandler } from './CommandHandlers/ParkVehiculeCommandHandler.js';
import { UserRepository } from '@backend/Domain/Repositories/UserRepository.js';

export class FleetService {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly userRepository: UserRepository
  ) {
    if (!fleetRepository) {
      throw new Error('FleetService requires a FleetRepository instance.');
    }
  }

  public async createFleet(command: CreateFleetCommand): Promise<string> {
    const id: FleetId = await new CreateFleetCommandHandler(this.fleetRepository, this.userRepository).execute(command);
    return id.toString();
  }

  public registerVehicle(command: RegisterVehicleCommand): Promise<void> {
    return new RegisterVehicleCommandHandler(this.fleetRepository).execute(command);
  }

  public parkVehicle(command: ParkVehiculeCommand): Promise<void> {
    return new ParkVehicleCommandHandler(this.fleetRepository).execute(command);
  }
}
