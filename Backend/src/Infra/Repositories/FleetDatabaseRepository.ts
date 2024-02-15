import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { Fleet as DomainFleet } from '@backend/Domain/Entities/Fleet.js';
import { Id } from '@backend/Domain/ValueObjects/id-types.js';
import { FleetMapper } from '@backend/Infra/Mappers/FleetMapper.js';
import { Fleet as PersistentFleet } from '@backend/Infra/Entities/Fleet.js';
import { ParkedVehicle } from '@backend/Infra/Entities/ParkedVehicle.js';
import { MapperFactory } from '../Mappers/MapperFactory.js';
import { EntityManager } from '@mikro-orm/postgresql';

export class FleetDatabaseRepository implements FleetRepository {
  private static readonly FLEET_SEQ_NAME = 'fleet_id_seq';
  private readonly fleetMapper: FleetMapper;

  constructor(
    mapperFactory: MapperFactory,
    private readonly entityManager: EntityManager
  ) {
    this.fleetMapper = mapperFactory.createFleetMapper();
  }

  public findByFleetId = async (fleetId: Id): Promise<DomainFleet | undefined> => {
    const fleet = await this.entityManager.findOne(PersistentFleet, fleetId.id, { populate: ['vehicles'] });
    if (!fleet) return undefined;

    const parkedVehicles: ParkedVehicle[] = await this.entityManager.find(
      ParkedVehicle,
      { vehicle: { $in: fleet.vehicles.getItems().map((v) => v.id) } },
      { populate: ['location'] }
    );

    return this.fleetMapper.toDomain({ fleet, parkedVehicles });
  };

  public async save(domainFleet: DomainFleet): Promise<Id> {
    const managedFleet = await this.entityManager.findOne(PersistentFleet, domainFleet.fleetId.id, {
      populate: ['vehicles']
    });

    let fleetAggregate: { fleet: PersistentFleet; parkedVehicles: ParkedVehicle[] };
    if (managedFleet) {
      const managedParkings: ParkedVehicle[] = await this.entityManager.find(
        ParkedVehicle,
        { vehicle: { $in: managedFleet.vehicles.getItems().map((v) => v.id) } },
        { populate: ['location'] }
      );

      fleetAggregate = this.fleetMapper.toInfra(domainFleet, {
        fleet: managedFleet,
        parkedVehicles: managedParkings
      });
    } else {
      fleetAggregate = this.fleetMapper.toInfra(domainFleet);
    }
    this.entityManager.persist(fleetAggregate.fleet);
    this.entityManager.persist(fleetAggregate.parkedVehicles);
    await this.entityManager.flush();
    return domainFleet.fleetId;
  }

  public async nextIdentity(): Promise<string> {
    const nextIdentity: { nextval: string }[] = await this.entityManager
      .getConnection()
      .execute(`SELECT nextval('${FleetDatabaseRepository.FLEET_SEQ_NAME}')`);
    return nextIdentity[0].nextval;
  }
}
