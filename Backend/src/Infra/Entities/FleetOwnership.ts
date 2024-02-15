import { Entity, ManyToOne, OneToOne, PrimaryKeyProp, PrimaryKeyType } from '@mikro-orm/core';
import { User } from './User.js';
import { Fleet } from './Fleet.js';
import { PersistentEntity } from './PersistentEntity.js';

@Entity()
export class FleetOwnership implements PersistentEntity {
  [PrimaryKeyProp]?: 'userId' | 'fleetId';

  [PrimaryKeyType]?: [number, number];

  @ManyToOne({
    entity: () => User,
    fieldName: 'userId',
    primary: true
  })
  user!: User;

  @OneToOne({
    entity: () => Fleet,
    fieldName: 'fleetId',
    primary: true,
    unique: 'fleet_ownership_fleet_id_key'
  })
  fleet!: Fleet;

  constructor(fleet: Fleet, user: User) {
    this.fleet = fleet;
    this.user = user;
  }
}
