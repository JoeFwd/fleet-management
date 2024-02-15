/**
 * Represents a latitude value.
 */
export class Latitude {
  /**
   * @param {number} latitude a number between -90 and 90.
   * @throws {Error} if latitude is falsy or if it is strictly below -90 or strictly greater than 90.
   */
  constructor(private readonly latitude: number) {
    if (!latitude) throw new Error('latitude requires an truthy value');
    if (latitude < -90 || latitude > 90) throw new Error('A latitude value must be a number between -90 and 90');
  }

  /**
   * @returns the encapsulated latitude value.
   */
  public get(): number {
    return this.latitude;
  }

  /**
   * checks if two latitudes are equal
   * @param other latitude to compare
   * @returns true if the two altitudes are equal, false otherwise
   */
  public equals = (other: Latitude): boolean => this.latitude === other.get();
}
