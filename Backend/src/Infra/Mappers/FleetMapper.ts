import { Fleet as DomainFleet } from '@backend/Domain/Entities/Fleet.js';
import { Vehicle as DomainVehicle } from '@backend/Domain/Entities/Vehicle.js';
import { Location as DomainLocation } from '@backend/Domain/Entities/Location.js';
import { Location as PersistentLocation } from '@backend/Infra/Entities/Location.js';
import { Fleet as PersistentFleet } from '@backend/Infra/Entities/Fleet.js';
import { Vehicle as PersistentVehicle } from '@backend/Infra/Entities/Vehicle.js';
import { ParkedVehicle } from '@backend/Infra/Entities/ParkedVehicle.js';
import { EntityMapper } from '@backend/Infra/Mappers/EntityMapper.js';
import { LocationMapper } from '@backend/Infra/Mappers/LocationMapper.js';
import { VehicleMapper } from '@backend/Infra/Mappers/VehicleMapper.js';
import { CollectionMapper } from './CollectionMapper.js';

/**
 * Maps a the fleet domain entity to the persistent entity and vice-versa.
 */
export class FleetMapper
  implements EntityMapper<DomainFleet, { fleet: PersistentFleet; parkedVehicles: ParkedVehicle[] }>
{
  private readonly vehiclesMapper: CollectionMapper<DomainVehicle, PersistentVehicle>;
  private readonly locationsMapper: CollectionMapper<DomainLocation, PersistentLocation>;

  /**
   * @param locationMapper the location mapper to use to map the parked vehicles' locations.
   * @param vehicleMapper the vehicle mapper to use to map the registered parked vehicles' vehicles.
   */
  constructor(locationMapper: LocationMapper, vehicleMapper: VehicleMapper) {
    this.vehiclesMapper = new CollectionMapper(vehicleMapper);
    this.locationsMapper = new CollectionMapper(locationMapper);
  }

  public toDomain(persistent: { fleet: PersistentFleet; parkedVehicles: ParkedVehicle[] }): DomainFleet {
    if (!persistent || !persistent.fleet || !persistent.parkedVehicles)
      throw new Error('FleetMapper requires a Fleet instance.');

    const domainFleet = new DomainFleet(persistent.fleet.id.toString());

    const persistedVehicles = persistent.fleet.vehicles.getItems();
    this.vehiclesMapper.toDomain(persistedVehicles).forEach((vehicle) => {
      domainFleet.registerVehicle(vehicle);
    });

    const persistedParkedVehicles = persistent.parkedVehicles.map(({ vehicle }) => vehicle);
    const persistedLocations = persistent.parkedVehicles.map(({ location }) => location);

    const domainVehicles = this.vehiclesMapper.toDomain(persistedParkedVehicles);
    const domainLocations = this.locationsMapper.toDomain(persistedLocations);

    domainVehicles.forEach((vehicle, index) => {
      domainFleet.parkVehicle(vehicle, domainLocations[index]);
    });

    return domainFleet;
  }

  public toInfra(
    fleetDomain: DomainFleet,
    fleetInfra?: { fleet: PersistentFleet; parkedVehicles: ParkedVehicle[] }
  ): { fleet: PersistentFleet; parkedVehicles: ParkedVehicle[] } {
    if (!fleetDomain) throw new Error('FleetMapper.toInfra requires a domain Fleet instance.');

    const fleet = fleetInfra?.fleet || new PersistentFleet();
    fleet.id = fleetDomain.fleetId.id;

    const resolvedVehicles: PersistentVehicle[] = this.mapVehiclesToPersistenceModel(
      fleetDomain.getVehicles(),
      fleet.vehicles.getItems()
    );
    fleet.vehicles.removeAll();
    fleet.vehicles.set(resolvedVehicles);

    return {
      fleet,
      parkedVehicles: this.mapParkingsToPersistenceModel(
        fleetDomain,
        fleetInfra?.parkedVehicles?.map(({ location }) => location) || [],
        resolvedVehicles
      )
    };
  }

  private mapVehiclesToPersistenceModel(
    domainVehicles: DomainVehicle[],
    existingVehicles: PersistentVehicle[]
  ): PersistentVehicle[] {
    // Map the vehicles to an existing reference if it exists, otherwise create a new entity.
    // This will lead the orm to update the managed vehicle entity (orm will use the UPDATE sql statement),
    // or create a new entity if it does not exist (orm will use the INSERT sql statement).
    return this.vehiclesMapper.toInfra(domainVehicles, existingVehicles);
  }

  private mapParkingsToPersistenceModel(
    domain: DomainFleet,
    persistedLocations: PersistentLocation[],
    persistedVehicles: PersistentVehicle[]
  ): ParkedVehicle[] {
    const parkings = domain.getParkedVehicles();
    // Map the locations to an existing reference if it exists, otherwise create a new one, then apply domain changes.
    // This will lead the orm to update the managed location entity, or create a new entity if it does not exist.
    const locations: PersistentLocation[] = this.locationsMapper.toInfra(
      parkings.map((parkedVehicle) => parkedVehicle.location),
      persistedLocations
    );

    // At this point the vehicle objects have already been mapped to their persistence model.
    // So here we map the vehicles to their existing reference in order to avoid creating new managed entities.
    // If we were to create new vehicle objects, the orm will try to insert them which would lead to unicity errors.
    const vehicles: PersistentVehicle[] = this.vehiclesMapper.toInfra(
      parkings.map((parkedVehicle) => parkedVehicle.vehicle),
      persistedVehicles
    );

    return vehicles.map((vehicle, index) => new ParkedVehicle(locations[index], vehicle));
  }
}
