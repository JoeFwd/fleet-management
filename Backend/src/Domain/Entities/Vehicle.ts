import { PlateNumber } from '@backend/Domain/ValueObjects/PlateNumber.js';
import { DomainEntity } from '@backend/Domain/Entities/DomainEntity.js';

/**
 * Represents a vehicle uniquely identified by a plate number.
 */
export class Vehicle implements DomainEntity {
  /**
   * A valid plate number for the vehicle.
   */
  public readonly plateNumber: PlateNumber;

  /**
   * @param plateNumber A string between 1 to 10 characters. Whitespaces are trimmed.
   * @throws {Error} if the plate number is not a valid string.
   */
  constructor(plateNumber: string) {
    if (!plateNumber) throw new Error('Vehicle requires a plate number string');
    this.plateNumber = new PlateNumber(plateNumber);
  }

  /**
   * Checks if the plate number of both vehicles match.
   * @param other the other vehicle to compare to.
   * @returns true if the plate numbers match, false otherwise.
   */
  public equals(other: Vehicle): boolean {
    return other && this.plateNumber.equals(other.plateNumber);
  }

  /**
   * The identity of the vehicle is its plate number. This may be used in maps
   * @returns a unique string identifying the vehicle.
   */
  public identity(): string {
    return `vehicle-${this.plateNumber.toString()}`;
  }
}
