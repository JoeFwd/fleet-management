import { Collection, Entity, ManyToMany, PrimaryKey } from '@mikro-orm/core';
import { Vehicle } from './Vehicle.js';
import { PersistentEntity } from './PersistentEntity.js';

@Entity()
export class Fleet implements PersistentEntity {
  @PrimaryKey()
  id!: number;

  @ManyToMany({
    entity: () => Vehicle,
    inversedBy: (v) => v.fleets,
    owner: true,
    pivotTable: 'registration',
    joinColumn: 'fleetId',
    inverseJoinColumn: 'vehicleId'
  })
  vehicles = new Collection<Vehicle>(this);
}
