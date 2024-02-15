import { CreateFleetCommand } from '@backend/App/Commands/CreateFleetCommand.js';
import { CommandHandler } from '@backend/App/CommandHandlers/CommandHandler.js';
import { User } from '@backend/Domain/Entities/User.js';
import { FleetId, Id } from '@backend/Domain/ValueObjects/id-types.js';
import { UserRepository } from '@backend/Domain/Repositories/UserRepository.js';
import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';

/**
 * Handles the command to create a fleet.
 */
export class CreateFleetCommandHandler implements CommandHandler<CreateFleetCommand, FleetId> {
  /**
   * @param fleetRepository the repository to use to create the fleet.
   */
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(command: CreateFleetCommand): Promise<FleetId> {
    if (!command) throw new Error('CreateFleetCommandHandler requires a CreateFleetCommand instance');

    // Validate the user id given by the command
    const user = new User(command.userId);

    // Generate a new fleet id
    const fleetId = await this.fleetRepository.nextIdentity();

    // Create the fleet
    user.createFleet(fleetId);

    // Save the user with the new fleet
    await this.userRepository.save(user);

    return new Id(fleetId);
  }
}
