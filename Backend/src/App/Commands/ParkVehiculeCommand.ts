/**
 * This command holds all required data to park a vehicle.
 */
export class ParkVehiculeCommand {
  /**
   *
   * @param fleetId the id of the fleet the vehicle belongs to
   * @param vehiclePlateNumber the plate number of the vehicle to park
   * @param latitude a number between -90 and 90
   * @param longitude a number between -180 and 180
   * @param altitude in meters. This parameter is optional
   */
  constructor(
    public readonly fleetId: string,
    public readonly vehiclePlateNumber: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly altitude?: number
  ) {
    if (!fleetId) throw new Error('ParkingVehiculeCommand requires a non-empty fleetId.');
    if (!vehiclePlateNumber) throw new Error('ParkVehiculeCommand requires a non-empty vehiclePlateNumber.');
    if (!latitude) throw new Error('ParkVehiculeCommand requires a latitude.');
    if (!longitude) throw new Error('ParkVehiculeCommand requires a longitude.');
  }
}
