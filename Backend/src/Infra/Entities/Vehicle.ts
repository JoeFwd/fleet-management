import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Fleet } from './Fleet.js';
import { PersistentEntity } from './PersistentEntity.js';

@Entity()
export class Vehicle implements PersistentEntity {
  @PrimaryKey()
  id!: number;

  @Property({ fieldName: 'plateNumber', columnType: 'text' })
  plateNumber!: string;

  @ManyToMany(() => Fleet, (fleet) => fleet.vehicles)
  fleets = new Collection<Fleet>(this);
}
