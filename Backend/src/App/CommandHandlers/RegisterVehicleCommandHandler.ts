import { CommandHandler } from '@backend/App/CommandHandlers/CommandHandler.js';
import { RegisterVehicleCommand } from '@backend/App/Commands/RegisterVehicleCommand.js';
import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { Id } from '@backend/Domain/ValueObjects/id-types.js';
import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';

/**
 * Handles the command to register a vehicle.
 */
export class RegisterVehicleCommandHandler implements CommandHandler<RegisterVehicleCommand, void> {
  /**
   * @param fleetRepository the repository to use to retrieve the fleet.
   */
  constructor(private readonly fleetRepository: FleetRepository) {
    if (!fleetRepository) throw new Error('RegisterVehicleCommandHandler requires a FleetRepository instance.');
  }

  public async execute(command: RegisterVehicleCommand): Promise<void> {
    if (!command) throw new Error('RegisterVehicleCommand requires a RegisterVehicleCommand instance');

    // Validate the fleet id
    const fleetId = new Id(command.fleetId);
    // Validate the vehicle plate number given by the command
    const vehicle = new Vehicle(command.plateNumber);

    const fleet: Fleet | undefined = await this.fleetRepository.findByFleetId(fleetId);

    if (!fleet) {
      throw new Error(`The Fleet with id ${command.fleetId} does not exist.`);
    }

    fleet.registerVehicle(vehicle);
    await this.fleetRepository.save(fleet);
  }
}
