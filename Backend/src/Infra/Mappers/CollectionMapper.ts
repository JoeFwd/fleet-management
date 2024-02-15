import type { DomainEntity } from '@backend/Domain/Entities/DomainEntity.js';
import { EntityMapper } from './EntityMapper.js';

/**
 * Decorates an EntityMapper to map a collection of entities to domain its persistence model and vice-versa.
 */
export class CollectionMapper<D extends DomainEntity, I> implements EntityMapper<D[], I[]> {
  constructor(private readonly entityMapper: EntityMapper<D, I>) {}

  toDomain(entity: I[]): D[] {
    return entity.map((e) => this.entityMapper.toDomain(e));
  }

  toInfra(domainEntities: D[], infraEntities: I[] | undefined): I[] {
    const persistedEntities = new Map<string, I>(
      infraEntities?.map((entity) => [this.entityMapper.toDomain(entity).identity(), entity]) || []
    );

    return domainEntities.map((entity) => {
      const id = entity.identity();
      const persistedVehicle = persistedEntities.get(id);
      return this.entityMapper.toInfra(entity, persistedVehicle);
    });
  }
}
