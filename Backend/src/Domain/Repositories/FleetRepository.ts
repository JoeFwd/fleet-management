import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { FleetId } from '@backend/Domain/ValueObjects/id-types.js';

/**
 * Persistence abstraction for the fleet repository
 */
export interface FleetRepository {
  /**
   * Find a fleet by its id
   * @param {string} fleetId the id of the fleet to find
   * @returns {Promise<Fleet | undefined>} a promise which resolves to the fleet or undefined if not found
   */
  findByFleetId(fleetId: FleetId): Promise<Fleet | undefined>;

  /**
   * Idempotently saves the given fleet
   * @param {Fleet} fleet the fleet to save
   */
  save(fleet: Fleet): Promise<FleetId>;

  /**
   * Generates the next identity for a fleet
   * @returns {string} the next identity for a fleet
   */
  nextIdentity(): Promise<string>;
}
