import { Command, InvalidArgumentError } from 'commander';
import { FleetService } from '@backend/App/FleetService.js';
import { DbClient } from '@backend/Infra/Persistence/DbClient.js';
import { FleetDatabaseRepository } from '@backend/Infra/Repositories/FleetDatabaseRepository.js';
import { CreateFleetCommand } from '@backend/App/Commands/CreateFleetCommand.js';
import { AppConfig, ConfigLoader } from '@backend/Infra/Config/ConfigLoader.js';
import { UserDatabaseRepository } from '@backend/Infra/Repositories/UserDatabaseRepository.js';
import { MapperFactory } from '../Mappers/MapperFactory.js';
import { EntityManager } from '@mikro-orm/postgresql';
import { RegisterVehicleCommand } from '@backend/App/Commands/RegisterVehicleCommand.js';
import { ParkVehiculeCommand } from '@backend/App/Commands/ParkVehiculeCommand.js';

function initDbClient(): DbClient {
  const configLoader: ConfigLoader = new ConfigLoader();

  try {
    const config: AppConfig = configLoader.load();
    return new DbClient(config);
  } catch (error) {
    console.error(error instanceof Error ? `error: ${error.message}` : error);
    process.exit(1);
  }
}

function initFleetService(entityManager: EntityManager): FleetService {
  const mapperFactory = new MapperFactory();
  const fleetRepository = new FleetDatabaseRepository(mapperFactory, entityManager);
  return new FleetService(fleetRepository, new UserDatabaseRepository(entityManager, fleetRepository, mapperFactory));
}

async function executeFleetCommand(fleetAction: (fleetService: FleetService) => Promise<void>): Promise<void> {
  const dbClient = initDbClient();
  const { entityManager } = await dbClient.connect();
  const fleetService = initFleetService(entityManager);
  try {
    await fleetAction(fleetService);
  } catch (error) {
    console.error(error instanceof Error ? `error: ${error.message}` : error);
    process.exitCode = 2;
  } finally {
    await dbClient.disconnect();
    process.exit();
  }
}

function convertToNumber(value: string): number {
  if (!value || isNaN(parseFloat(value))) throw new InvalidArgumentError(`The value ${value} is not a valid number.`);
  return parseFloat(value);
}

export function run() {
  const program = new Command();

  program
    .name('fleet')
    .description("CLI to manage the vehicles of a user's fleet")
    .addHelpText(
      'after',
      '\nExit codes:\n  1: Error while loading the configuration\n  2: Error while executing the command\n'
    );

  program
    .command('create')
    .description('Creates a new fleet for a given user.')
    .argument('<userId>', 'a integer user id')
    .action((userId: string) =>
      executeFleetCommand(async (fleetService: FleetService) => {
        const fleetId: string = await fleetService.createFleet(new CreateFleetCommand(userId));
        console.log(`Fleet created with id ${fleetId}`);
      })
    )
    .addHelpText('after', '\nExample:\n  $ fleet create 1');

  program
    .command('register-vehicle')
    .description('Registers a vehicle to a given fleet.')
    .argument('<fleetId>', 'the fleetId to register the vehicle to')
    .argument('<vehiclePlateNumber>', 'the vehicle plate number to register')
    .action(async (fleetId: string, vehiclePlateNumber: string) =>
      executeFleetCommand(async (fleetService: FleetService) => {
        await fleetService.registerVehicle(new RegisterVehicleCommand(fleetId, vehiclePlateNumber));
        console.log(`The vehicle ${vehiclePlateNumber} was registered to the fleet ${fleetId}`);
      })
    )
    .addHelpText('after', "\nExample:\n  $ fleet register-vehicle 1 'AA-123-AA'");

  program
    .command('localize-vehicle')
    .description('Localise a vehicle of a given fleet.')
    .argument('<fleetId>', 'the fleetId to register the vehicle to')
    .argument('<vehiclePlateNumber>', 'the vehicle plate number to register')
    .argument('<lat>', 'the latitude of the vehicle', convertToNumber)
    .argument('<lng>', 'the longitude of the vehicle', convertToNumber)
    .argument('[alt]', 'the altitude of the vehicle', convertToNumber)
    .action(
      async (fleetId: string, vehiclePlateNumber: string, latitude: number, longitude: number, altitude?: number) =>
        executeFleetCommand(async (fleetService: FleetService) => {
          await fleetService.parkVehicle(
            new ParkVehiculeCommand(fleetId, vehiclePlateNumber, latitude, longitude, altitude)
          );
          console.log(
            `The vehicle ${vehiclePlateNumber} in the fleet ${fleetId} is now localized at ${latitude}, ${longitude}${
              altitude ? `, ${altitude}` : ''
            }`
          );
        })
    )
    .addHelpText('after', "\nExample:\n  $ fleet localize-vehicle 1 'AA-123-AA' 48.8566 2.3522");

  program.parse();
}
