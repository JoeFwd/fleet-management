import { ParkVehiculeCommand } from '@backend/App/Commands/ParkVehiculeCommand.js';
import { CommandHandler } from '@backend/App/CommandHandlers/CommandHandler.js';
import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { Id } from '@backend/Domain/ValueObjects/id-types.js';
import { Location } from '@backend/Domain/Entities/Location.js';
import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';

/**
 * @inheritdoc
 * Handles the command to park a vehicle.
 */
export class ParkVehicleCommandHandler implements CommandHandler<ParkVehiculeCommand, void> {
  /**
   * @param fleetRepository The repository to use to retrieve the fleet.
   */
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(command: ParkVehiculeCommand): Promise<void> {
    // Validate the vehicle plate number given by the command
    const vehicle = new Vehicle(command.vehiclePlateNumber);

    // Validate the location given by the command
    const location = new Location(command.latitude, command.longitude, command.altitude);

    const fleet: Fleet | undefined = await this.fleetRepository.findByFleetId(new Id(command.fleetId));
    if (!fleet) {
      throw new Error(`The Fleet with id ${command.fleetId} does not exist.`);
    }

    fleet.parkVehicle(vehicle, location);

    await this.fleetRepository.save(fleet);
  }
}
