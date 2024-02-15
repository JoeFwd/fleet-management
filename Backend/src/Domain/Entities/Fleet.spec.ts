import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';
import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { Location } from './Location.js';

describe('Fleet', function () {
  let component: Fleet, vehicle: Vehicle, sameVehicle: Vehicle, location: Location;
  beforeEach(() => {
    component = new Fleet('1');
    vehicle = new Vehicle('ABC-123');
    sameVehicle = new Vehicle(vehicle.plateNumber.toString());
    location = new Location(1, 1);
  });

  describe('contructor', () => {
    it('should not validate an invalid id', () => {
      const invalidId = '   '; // whitespace

      const instanciateFleet = () => new Fleet(invalidId);

      expect(() => instanciateFleet()).toThrow('The id must be an integer.');
    });
  });

  describe('registerVehicle', () => {
    it('should register a vehicle', () => {
      component.registerVehicle(vehicle);

      expect(component.getVehicles().map((v) => v.identity())).toEqual([vehicle.identity()]);
    });

    it('should not register a vehicle already in the fleet', () => {
      component.registerVehicle(vehicle);

      // Make sure that equality is not based on the object reference
      const registerSameVehicle = () => component.registerVehicle(sameVehicle);

      expect(() => registerSameVehicle()).toThrow('The vehicle (ABC-123) is already registered in the fleet 1.');
    });

    it('should not register an invalid vehicle', () => {
      const invalidVehicle = undefined;

      const registerVehicle = () => component.registerVehicle(invalidVehicle!);

      expect(() => registerVehicle()).toThrow('Fleet.registerVehicle requires a vehicle');
    });
  });

  describe('parkVehicle', () => {
    it('should park a vehicle', () => {
      component.registerVehicle(vehicle);

      component.parkVehicle(vehicle, location);

      const actualLocation = component.getVehicleLocation(vehicle);
      expect(actualLocation).not.toBeUndefined();
      expect(actualLocation?.identity()).toEqual(location.identity());
    });

    it('should not park a vehicle already parked at the given location', () => {
      component.registerVehicle(vehicle);
      component.parkVehicle(vehicle, location);

      // Make sure that equality is not based on the object reference
      const parkVehicleAgain = () => component.parkVehicle(sameVehicle, location);

      expect(() => parkVehicleAgain()).toThrow(
        'The vehicle (ABC-123) is already parked at this location (latitude: 1, longitude: 1, altitude: 0).'
      );
    });

    it('should not park a vehicle not registered in the fleet', () => {
      const parkVehicle = () => component.parkVehicle(vehicle, location);

      expect(() => parkVehicle()).toThrow(
        'The vehicle (ABC-123) can not be parked as it is not registered in the fleet.'
      );
    });

    it('should not park a vehicle at an invalid location', () => {
      const invalidLocation = undefined;
      component.registerVehicle(vehicle);

      const parkVehicle = () => component.parkVehicle(vehicle, invalidLocation!);

      expect(() => parkVehicle()).toThrow('Fleet.parkVehicle requires a Location instance');
    });

    it('should not park an invalid vehicle', () => {
      const invalidVehicle = undefined;

      const parkVehicle = () => component.parkVehicle(invalidVehicle!, location);

      expect(() => parkVehicle()).toThrow('Fleet.parkVehicle requires a Vehicle instance');
    });
  });

  describe('getVehicleLocation', () => {
    it('should get the location of a vehicle', () => {
      component.registerVehicle(vehicle);
      component.parkVehicle(vehicle, location);

      const actualLocation = component.getVehicleLocation(vehicle);

      expect(actualLocation).not.toBeUndefined();
      expect(actualLocation?.identity()).toEqual(location.identity());
    });

    it('should not get the location of an invalid vehicle', () => {
      const invalidVehicle = undefined;

      const getVehicleLocation = () => component.getVehicleLocation(invalidVehicle!);

      expect(() => getVehicleLocation()).toThrow('A Vehicle instance is required');
    });

    it('should return undefined if the vehicle is not registered in the fleet', () => {
      const actualLocation = component.getVehicleLocation(vehicle);

      expect(actualLocation).toBeUndefined();
    });
  });

  describe('isVehicleRegistered', () => {
    it('should return true if the vehicle is registered', () => {
      component.registerVehicle(vehicle);

      const isVehicleRegistered = component.isVehicleRegistered(vehicle);

      expect(isVehicleRegistered).toBeTruthy();
    });

    it('should return false if the vehicle is not registered', () => {
      const isVehicleRegistered = component.isVehicleRegistered(vehicle);

      expect(isVehicleRegistered).toBeFalsy();
    });

    it('should return false if the vehicle is invalid', () => {
      const invalidVehicle = undefined;

      const isVehicleRegistered = component.isVehicleRegistered(invalidVehicle!);

      expect(isVehicleRegistered).toBeFalsy();
    });
  });
});
