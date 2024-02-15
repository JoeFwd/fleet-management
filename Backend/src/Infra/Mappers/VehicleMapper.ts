import { Vehicle as DomainVehicle } from '@backend/Domain/Entities/Vehicle.js';
import { EntityMapper } from '@backend/Infra/Mappers/EntityMapper.js';
import { Vehicle as PersistentVehicle } from '@backend/Infra/Entities/Vehicle.js';

/**
 * Maps a the vehicle domain entity to the persistent entity and vice-versa.
 */
export class VehicleMapper implements EntityMapper<DomainVehicle, PersistentVehicle> {
  public toDomain(entity: PersistentVehicle): DomainVehicle {
    return new DomainVehicle(entity.plateNumber);
  }

  public toInfra(domainEntity: DomainVehicle, infraEntity?: PersistentVehicle): PersistentVehicle {
    if (!domainEntity) throw new Error('VehicleMapper requires a domain entity');
    if (infraEntity) return infraEntity; // A vehicle does not have mutable properties.

    // id is auto-generated by the database.
    const vehicle = new PersistentVehicle();
    vehicle.plateNumber = domainEntity.plateNumber.toString();
    return vehicle;
  }
}
