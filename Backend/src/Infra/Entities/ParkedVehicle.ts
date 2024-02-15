import { Entity, OneToOne, PrimaryKeyProp, PrimaryKeyType } from '@mikro-orm/core';
import { Location } from './Location.js';
import { Vehicle } from './Vehicle.js';
import { PersistentEntity } from './PersistentEntity.js';

@Entity()
export class ParkedVehicle implements PersistentEntity {
  [PrimaryKeyProp]?: 'locationId' | 'vehicleId';

  [PrimaryKeyType]?: [number, number];

  @OneToOne({
    entity: () => Location,
    fieldName: 'locationId',
    primary: true,
    unique: 'parked_vehicle_location_id_key'
  })
  location!: Location;

  @OneToOne({
    entity: () => Vehicle,
    fieldName: 'vehicleId',
    primary: true,
    unique: 'parked_vehicle_vehicle_id_key'
  })
  vehicle!: Vehicle;

  constructor(location: Location, vehicle: Vehicle) {
    this.location = location;
    this.vehicle = vehicle;
  }
}
