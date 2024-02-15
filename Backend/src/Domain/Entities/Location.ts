import { Altitude } from '@backend/Domain/ValueObjects/Altitude.js';
import { Latitude } from '@backend/Domain/ValueObjects/Latitude.js';
import { Longitude } from '@backend/Domain/ValueObjects/Longitude.js';
import { DomainEntity } from '@backend/Domain/Entities/DomainEntity.js';

// Represents a 3D location on the Earth.
export class Location implements DomainEntity {
  /**
   * @param latitude a number between -90 and 90.
   */
  public readonly latitude: Latitude;
  /**
   * @param longitude a number between -180 and 180.
   */
  public readonly longitude: Longitude;
  /**
   * @param altitude in meters.
   */
  public readonly altitude: Altitude;

  /**
   * @param locationId the location's id.
   * @param latitude a number between -90 and 90.
   * @param longitude a number between -180 and 180.
   * @param altitude in meters. Default value is 0
   * @throws {Error} if the latitude or the longitude is invalid.
   */
  constructor(latitude: number, longitude: number, altitude = 0) {
    if (!latitude) throw new Error('Location requires a latitude number.');
    if (!longitude) throw new Error('Location requires a longitude number.');
    this.latitude = new Latitude(latitude);
    this.longitude = new Longitude(longitude);
    this.altitude = new Altitude(altitude);
  }

  /**
   * Checks whether the longitude and latitude of both locations match.
   * @param other the other location to compare to.
   * @returns true if the longitude and latitude match, false otherwise.
   */
  public equals(other: Location): boolean {
    return other && this.latitude.equals(other.latitude) && this.longitude.equals(other.longitude);
  }

  /**
   * The identity of the location is its latitude and longitude. This may be used in maps.
   * @returns a unique string identifying the location.
   */
  public identity(): string {
    return `location-${this.latitude.get()}-${this.longitude.get()}`;
  }

  /**
   * @returns a string representation of the location.
   */
  public toString(): string {
    return `(latitude: ${this.latitude.get()}, longitude: ${this.longitude.get()}, altitude: ${this.altitude.get()})`;
  }
}
