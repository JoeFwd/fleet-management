import { Entity, PrimaryKey } from '@mikro-orm/core';
import { PersistentEntity } from './PersistentEntity.js';

@Entity()
export class User implements PersistentEntity {
  @PrimaryKey()
  id!: number;
}
