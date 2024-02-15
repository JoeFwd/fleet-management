/**
 * PlateNumber is a value object encapsulating a stringified plate number.
 * A plate number may have 1 to 10 characters.
 */
export class PlateNumber {
  /**
   * @param {string} plateNumber A plate number identifying the vehicle between 1 to 10 character long.
   * @throws {Error} if the trimmed plate number is empty or longer than 10 characters.
   */
  constructor(private readonly plateNumber: string) {
    if (!this.isValid(plateNumber))
      throw new Error('The given plate number is invalid. It must be less than 10 characters long.');
  }

  /**
   * @returns a string representation of the plate number.
   */
  public toString = (): string => this.plateNumber;

  /**
   * Checks if two plate numbers are equal
   * @param other the plate number to compare with
   * @returns true if the two plate numbers are equal, false otherwise
   */
  public equals = (other: PlateNumber): boolean => this.plateNumber === other.toString();

  private isValid = (plateNumber: string): boolean => {
    return plateNumber.trim().length < 10;
  };
}
