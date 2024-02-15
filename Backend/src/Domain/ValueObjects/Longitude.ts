/**
 * Represents a longitude value.
 */
export class Longitude {
  /**
   * @param {number} longitude a number betwwen -180 and 180.
   * @throws {Error} if longitude is falsy or if it is strictly below -90 or strictly greater than 90.
   */
  constructor(private readonly longitude: number) {
    if (!longitude) throw new Error('longitude requires an truthy value');
    if (longitude < -180 || longitude > 180) throw new Error('A longitude value must be a number between -180 and 180');
  }

  /**
   * @returns the encapsulated longitude value.
   */
  public get(): number {
    return this.longitude;
  }

  /**
   * checks if two longitudes are equal
   * @param other longitude to compare
   * @returns true if the two longitudes are equal, false otherwise
   */
  public equals = (other: Longitude): boolean => this.longitude === other.get();
}
