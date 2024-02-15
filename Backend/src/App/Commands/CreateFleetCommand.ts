/**
 * This command holds the required data to persist a fleet.
 */
export class CreateFleetCommand {
  /**
   * @param userId The user id of the user that owns the fleet.
   */
  constructor(public readonly userId: string) {
    if (!userId) throw new Error('CreateFleetCommand requires a userId string.');
  }
}
