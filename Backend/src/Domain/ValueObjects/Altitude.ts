/**
 * Represents an altitude value in meters.
 */
export class Altitude {
  private readonly altitude: number;
  /**
   * @param {number} altitude in meters. Default value is 0
   */
  constructor(altitude = 0) {
    this.altitude = altitude;
  }

  /**
   * @returns the encapsulated altitude value.
   */
  public get(): number {
    return this.altitude;
  }

  /**
   * checks if two altitudes are equal
   * @param other altitude to compare
   * @returns true if the two altitudes are equal, false otherwise
   */
  public equals = (other: Altitude): boolean => this.altitude === other.get();
}
