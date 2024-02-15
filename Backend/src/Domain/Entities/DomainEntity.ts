/**
 * Interface for all entities.
 */
export interface DomainEntity {
  /**
   * Checks if the given entity is equal to this entity.
   * @param other The entity to compare to.
   * @returns true if the given entity is equal to this entity, false otherwise.
   */
  equals(other: DomainEntity): boolean;

  /**
   * Gets a string uniquely identifying the entity. This should be used in map keys.
   * @returns the identifier.
   */
  identity(): string;
}
