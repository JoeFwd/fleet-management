import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { ScenarioWorld } from '../support/ScenarioWorld.js';
import { RegisterVehicleCommand } from '@backend/App/Commands/RegisterVehicleCommand.js';
import { RegisterVehicleCommandHandler } from '@backend/App/CommandHandlers/RegisterVehicleCommandHandler.js';
import { expect } from 'chai';
import { ParkVehicleCommandHandler } from '@backend/App/CommandHandlers/ParkVehiculeCommandHandler.js';
import { ParkVehiculeCommand } from '@backend/App/Commands/ParkVehiculeCommand.js';
import assert from 'assert';
import { Fleet } from '@backend/Domain/Entities/Fleet.js';
import { Id } from '@backend/Domain/ValueObjects/id-types.js';
import { Vehicle } from '@backend/Domain/Entities/Vehicle.js';
import { Location } from '@backend/Domain/Entities/Location.js';

Before(function (this: ScenarioWorld) {
  return this.init();
});

After(function (this: ScenarioWorld) {
  return this.clean();
});

Given('my fleet', async function (this: ScenarioWorld) {
  this.myFleet = new Fleet('1');
  this.myFleetId = new Id('1');
  await this.fleetRepository.save(this.myFleet);
});

Given('the fleet of another user', async function (this: ScenarioWorld) {
  this.otherFleet = new Fleet('2');
  this.otherFleetId = new Id('2');
  await this.fleetRepository.save(this.otherFleet);
});

Given('a vehicle', function (this: ScenarioWorld) {
  this.vehicle = new Vehicle('AA-AAA-AA');
});

Given('a location', function (this: ScenarioWorld) {
  this.location = new Location(43.3, 5.4); // Marseille
});

Given('I have registered this vehicle into my fleet', async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.myFleet && this.vehicle);

  this.myFleet.registerVehicle(this.vehicle);
  await this.fleetRepository.save(this.myFleet);
});

Given("this vehicle has been registered into the other user's fleet", async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.otherFleet && this.vehicle);

  this.otherFleet.registerVehicle(this.vehicle);
  this.otherFleetId = await this.fleetRepository.save(this.otherFleet);
});

Given('my vehicle has been parked into this location', async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.myFleet && this.vehicle && this.location);

  this.myFleet.parkVehicle(this.vehicle, this.location);
  await this.fleetRepository.save(this.myFleet);
});

When(/I (?:try to )?register this vehicle into my fleet/, async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.myFleetId && this.vehicle);

  return new RegisterVehicleCommandHandler(this.fleetRepository)
    .execute(new RegisterVehicleCommand(this.myFleetId.toString(), this.vehicle.plateNumber.toString()))
    .catch((error: Error) => {
      this.error = error;
    });
});

When(/I (?:try to )?park my vehicle at this location/, async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.location && this.vehicle && this.myFleetId && this.vehicle);

  return new ParkVehicleCommandHandler(this.fleetRepository)
    .execute(
      new ParkVehiculeCommand(
        this.myFleetId.toString(),
        this.vehicle.plateNumber.toString(),
        this.location.latitude.get(),
        this.location.longitude.get()
      )
    )
    .catch((error: Error) => {
      this.error = error;
    });
});

Then('this vehicle should be part of my vehicle fleet', async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.myFleetId && this.vehicle && !this.error);

  const fleet: Fleet | undefined = await this.fleetRepository.findByFleetId(this.myFleetId);

  expect(fleet?.isVehicleRegistered(this.vehicle)).to.be.true;
});

Then(
  'I should be informed this this vehicle has already been registered into my fleet',
  function (this: ScenarioWorld) {
    // expect world state to be set
    assert(this.myFleet && this.vehicle && this.error);

    const fleetId: string = this.myFleet.fleetId.toString();
    const plateNumber: string = this.vehicle.plateNumber.toString();
    expect(this.error.message).to.equal(`The vehicle (${plateNumber}) is already registered in the fleet ${fleetId}.`);
  }
);

Then('the known location of my vehicle should verify this location', async function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.vehicle && this.myFleetId && this.location && !this.error);

  const fleet: Fleet | undefined = await this.fleetRepository.findByFleetId(this.myFleetId);

  const actualLocation: Location | undefined = fleet?.getVehicleLocation(this.vehicle);
  expect(actualLocation?.equals(this.location)).to.be.true;
});

Then('I should be informed that my vehicle is already parked at this location', function (this: ScenarioWorld) {
  // expect world state to be set
  assert(this.vehicle && this.error && this.location);

  const plateNumber: string = this.vehicle.plateNumber.toString();
  const location: string = this.location.toString();
  expect(this.error.message).to.equal(`The vehicle (${plateNumber}) is already parked at this location ${location}.`);
});
