import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { PersistentEntity } from './PersistentEntity.js';

@Entity()
export class Location implements PersistentEntity {
  @PrimaryKey()
  id!: number;

  @Property({ columnType: 'numeric(10,7)' })
  latitude!: string;

  @Property({ columnType: 'numeric(10,7)' })
  longitude!: string;

  @Property({ columnType: 'numeric(10,7)' })
  altitude!: string;
}
