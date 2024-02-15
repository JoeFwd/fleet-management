/**
 * Interface for adapting entities to and from domain and infra layers
 * @template D a domain entity
 * @template I The infra object type.
 */
export interface EntityMapper<D, I> {
  /**
   *
   * @param entity The infra entity to be mapped to a domain entity.
   */
  toDomain(entity: I): D;

  /**
   * Maps a domain entity to an infra entity. If the infra entity is provided,
   * it will be mutated to reflect the domain representation, otherwise a new instance will be returned.
   * @param domainEntity The domain entity to be mapped to an infra entity.
   * @param infraEntity The persisted infra entity or undefined.
   * @returns the modified infra entity if provided otherwise a new instance.
   * @throws {Error} if the domain entity is not provided.
   */
  toInfra(domainEntity: D, infraEntity: I | undefined): I;
}
