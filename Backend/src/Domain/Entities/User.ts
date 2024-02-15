import { DomainEntity } from '@backend/Domain/Entities/DomainEntity.js';
import { Id, UserId } from '@backend/Domain/ValueObjects/id-types.js';
import { Fleet } from './Fleet.js';

/**
 * A User is the owner of a fleet.
 */
export class User implements DomainEntity {
  /**
   * The id of the user.
   */
  public readonly userId: UserId;

  private readonly fleets: Fleet[] = [];

  /**
   * @param {UserId} userId the id of the user
   * @throws {Error} if the userId is not a valid integer value.
   */
  constructor(userId: string) {
    this.userId = new Id(userId);
  }

  /**
   * Creates a new fleet for the user.
   * @param fleetId the id of the fleet to create.
   * @returns the newly created fleet.
   */
  public createFleet(fleetId: string): Fleet {
    const fleet = new Fleet(fleetId);
    this.fleets.push(fleet);
    return fleet;
  }

  /**
   * @returns the list of fleets owned by the user.
   */
  public getFleets(): Fleet[] {
    // TODO use clone deep to avoid changing the original array
    return this.fleets;
  }

  /**
   * Checks if the id of both users match.
   * @param other the other user to compare to.
   * @returns true if the ids match, false otherwise.
   */
  public equals(other: User): boolean {
    return other && this.userId.equals(other.userId);
  }

  public identity(): string {
    return `user-${this.userId.toString()}`;
  }
}
