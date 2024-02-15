/**
 * The id of an entity.
 */
export class Id {
  public readonly id: number;

  /**
   * @param {string} id An id identifying the entity.
   * @throws {Error} if id does not have a least one non-whitespace character.
   */
  constructor(id: string) {
    if (!id?.trim().match(/^[0-9]+$/)) throw new Error('The id must be an integer.');
    this.id = parseInt(id.trim());
  }

  /**
   * @returns the encapsulated id
   */
  public toString(): string {
    return this.id.toString();
  }

  /**
   * Compares this id with another id.
   * @param other  The other id to compare with.
   * @returns true if the other id is equal to this id, false otherwise.
   */
  public readonly equals = (other: Id): boolean => this.id === other.id;
}

export type FleetId = Id;
export type UserId = Id;
