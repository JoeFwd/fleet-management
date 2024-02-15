import { Location } from '@backend/Domain/Entities/Location.js';
import { FleetId, Id } from '@backend/Domain/ValueObjects/id-types.js';
import { DomainEntity } from '@backend/Domain/Entities/DomainEntity.js';
import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';

/**
 * A Fleet handles a collection of unique vehicles.
 * This is the aggregate root to fleet management.
 * The aggregate is composed of the Fleet, Vehicle and Location domain objects.
 */
export class Fleet implements DomainEntity {
  /**
   * The id of the fleet.
   */
  public readonly fleetId: FleetId;
  private readonly vehicles: Map<string, Vehicle> = new Map();
  private readonly locations: Map<string, { vehicle: Vehicle; location: Location }> = new Map();

  /**
   * @param fleetId The id of the fleet.
   */
  constructor(fleetId: string) {
    if (!fleetId) throw new Error('Fleet requires an id.');
    this.fleetId = new Id(fleetId);
  }

  /**
   * Register a vehicle to the fleet.
   * @param {Vehicle} vehicle The vehicle to add to the fleet.
   * @throws {Error} if the vehicle is falsy or if the given vehicle
   * has the same plate number as another vehicle in the fleet.
   */
  public registerVehicle(vehicle: Vehicle): void {
    if (!vehicle) throw new Error('Fleet.registerVehicle requires a vehicle');
    if (this.isVehicleRegistered(vehicle)) {
      const plateNumber = vehicle.plateNumber.toString();
      const fleetId = this.fleetId.toString();
      throw new Error(`The vehicle (${plateNumber}) is already registered in the fleet ${fleetId}.`);
    }
    this.vehicles.set(vehicle.identity(), vehicle);
  }

  /**
   * Parks a vehicle of the fleet in a given location.
   * @param {Vehicle} vehicle The vehicle to park.
   * @param {Location} location The location to park the vehicle at.
   * @throws {Error} if the vehicle or location is falsy or if the given vehicle is not in the fleet
   * or if the vehicle is already parked at the given location.
   */
  public parkVehicle(vehicle: Vehicle, location: Location): void {
    if (!vehicle) throw new Error('Fleet.parkVehicle requires a Vehicle instance');
    if (!location) throw new Error('Fleet.parkVehicle requires a Location instance');

    const plateNumber = vehicle.plateNumber.toString();

    if (!this.isVehicleRegistered(vehicle))
      throw new Error(`The vehicle (${plateNumber}) can not be parked as it is not registered in the fleet.`);

    if (this.locations.get(vehicle.identity())?.location.equals(location))
      throw new Error(`The vehicle (${plateNumber}) is already parked at this location ${location.toString()}.`);

    this.locations.set(vehicle.identity(), { vehicle, location });
  }

  /**
   * Gets the location of a vehicle of the fleet.
   * @param {Vehicle} vehicle The vehicle to get the location of.
   * @returns {Location | undefined} the location of the vehicle or
   * undefined if the vehicle is not in the fleet or has not been parked yet.
   * @throws {Error} if the vehicle is falsy.
   */
  public getVehicleLocation(vehicle: Vehicle): Location | undefined {
    if (!vehicle) throw new Error('A Vehicle instance is required');
    return this.locations.get(vehicle.identity())?.location;
  }

  /**
   * Gets the parked vehicles in the fleet.
   * @returns {Vehicle[]} a list of vehicle and location.
   */
  public getParkedVehicles(): { vehicle: Vehicle; location: Location }[] {
    return [...this.locations.values()];
  }

  /**
   * Gets the list of vehicles registered in the fleet.
   * @returns {Vehicle[]} the list of vehicles registered in the fleet.
   */
  public getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  /**
   * Checks whether a vehicle is registered in the fleet or not.
   * @param vehicle The vehicle to check.
   * @returns true if the vehicle is registered in the fleet, false otherwise.
   */
  public isVehicleRegistered(vehicle: Vehicle): boolean {
    return vehicle && !!this.vehicles.get(vehicle.identity());
  }

  /**
   * Checks whether the id of both fleets match.
   * @param other the other fleet to compare to.
   * @returns true if the ids match, false otherwise.
   */
  public equals(other: Fleet): boolean {
    return other && this.fleetId.equals(other.fleetId);
  }

  public identity(): string {
    return `${this.fleetId.toString()}`;
  }
}
