/**
 * This command holds all required data to persist a vehicle into a fleet.
 */
export class RegisterVehicleCommand {
  /**
   *
   * @param {string} fleetId  The id of the fleet to register the vehicle into.
   * @param {string} plateNumber The plate number of the vehicle to register.
   */
  constructor(
    public readonly fleetId: string,
    public readonly plateNumber: string
  ) {
    if (!fleetId) throw new Error('RegisterVehicleCommand requires a fleetId.');
    if (!plateNumber) throw new Error('RegisterVehicleCommand requires a plateNumber.');
  }
}
