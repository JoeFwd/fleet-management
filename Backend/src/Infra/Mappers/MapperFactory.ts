import { FleetMapper } from '@backend/Infra/Mappers/FleetMapper.js';
import { LocationMapper } from '@backend/Infra/Mappers/LocationMapper.js';
import { VehicleMapper } from '@backend/Infra/Mappers/VehicleMapper.js';
import { CollectionMapper } from '@backend/Infra/Mappers/CollectionMapper.js';
import { UserMapper } from '@backend/Infra/Mappers/UserMapper.js';
import { Fleet as DomainFleet } from '@backend/Domain/Entities/Fleet.js';
import { Fleet as PersistentFleet } from '@backend/Infra/Entities/Fleet.js';
import { ParkedVehicle } from '../Entities/ParkedVehicle.js';
import { Vehicle as DomainVehicle } from '@backend/Domain/Entities/Vehicle.js';
import { Vehicle as PersistentVehicle } from '@backend/Infra/Entities/Vehicle.js';
import { Location as DomainLocation } from '@backend/Domain/Entities/Location.js';
import { Location as PersistentLocation } from '@backend/Infra/Entities/Location.js';

export class MapperFactory {
  /**
   * @returns {FleetMapper}
   */
  public createFleetMapper(): FleetMapper {
    return new FleetMapper(this.createLocationMapper(), this.createVehicleMapper());
  }

  /**
   * @returns {LocationMapper}
   */
  public createLocationMapper(): LocationMapper {
    return new LocationMapper();
  }

  /**
   * @returns {VehicleMapper}
   */
  public createVehicleMapper(): VehicleMapper {
    return new VehicleMapper();
  }

  /**
   * @returns {UserMapper}
   */
  public createUserMapper() {
    return new UserMapper();
  }

  /**
   * @returns {CollectionMapper<DomainFleet, {fleet: PersistentFleet; parkedVehicles: ParkedVehicle[] }>}
   */
  public createFleetCollectionMapper(): CollectionMapper<
    DomainFleet,
    {
      fleet: PersistentFleet;
      parkedVehicles: ParkedVehicle[];
    }
  > {
    return new CollectionMapper(this.createFleetMapper());
  }

  /**
   * @returns {CollectionMapper<DomainVehicle, PersistentVehicle>}
   */
  public createVehicleCollectionMapper(): CollectionMapper<DomainVehicle, PersistentVehicle> {
    return new CollectionMapper(this.createVehicleMapper());
  }

  /**
   * @returns {CollectionMapper<DomainLocation, PersistentLocation>}
   */
  public createLocationCollectionMapper(): CollectionMapper<DomainLocation, PersistentLocation> {
    return new CollectionMapper(this.createLocationMapper());
  }
}
