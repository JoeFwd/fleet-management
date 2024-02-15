import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { Location } from '@backend/Domain/Entities/Location.js';
import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';
import { FleetId, Id } from '@backend/Domain/ValueObjects/id-types.js';

export class FleetInMemoryRepository implements FleetRepository {
  private idGenerator: number = 0;
  private readonly fleetsByFleetId = new Map<string, Fleet>();
  private readonly vehiclesByPlateNumber = new Map<string, Vehicle>();

  public findByFleetId(fleetId: FleetId): Promise<Fleet | undefined> {
    const fleet: Fleet | undefined = this.fleetsByFleetId.get(fleetId.toString());
    return Promise.resolve(fleet ? this.copyFleet(fleet) : undefined);
  }

  public save(fleet: Fleet): Promise<FleetId> {
    const identity: string = fleet.fleetId.toString();
    // set fleet by its id
    const newFleet = this.copyFleet(fleet);
    this.fleetsByFleetId.set(identity, newFleet);
    // set the fleet's vehicles by their plate number
    newFleet
      .getVehicles()
      .forEach((vehicle) => this.vehiclesByPlateNumber.set(vehicle.plateNumber.toString(), vehicle));
    return Promise.resolve(new Id(identity));
  }

  public nextIdentity(): Promise<string> {
    this.idGenerator++;
    return Promise.resolve(this.idGenerator.toString());
  }

  private copyFleet(fleet: Fleet): Fleet {
    const copy = new Fleet(fleet.fleetId.toString());
    fleet.getVehicles().forEach((vehicle) => copy.registerVehicle(new Vehicle(vehicle.plateNumber.toString())));
    fleet
      .getParkedVehicles()
      .forEach((parkedVehicle) =>
        copy.parkVehicle(
          new Vehicle(parkedVehicle.vehicle.plateNumber.toString()),
          new Location(
            parkedVehicle.location.latitude.get(),
            parkedVehicle.location.longitude.get(),
            parkedVehicle.location.altitude?.get()
          )
        )
      );
    return copy;
  }
}
