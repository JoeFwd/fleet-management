import { FleetRepository } from '@backend/Domain/Repositories/FleetRepository.js';
import { User as DomainUser } from '@backend/Domain/Entities/User.js';
import { User as PersistentUser } from '@backend/Infra/Entities/User.js';
import { FleetOwnership } from '../Entities/FleetOwnership.js';
import { Fleet as PersistentFleet } from '@backend/Infra/Entities/Fleet.js';
import { UserRepository } from '@backend/Domain/Repositories/UserRepository.js';
import { MapperFactory } from '../Mappers/MapperFactory.js';
import { UserMapper } from '../Mappers/UserMapper.js';
import { EntityManager, FlushMode } from '@mikro-orm/core';

export class UserDatabaseRepository implements UserRepository {
  private readonly userMapper: UserMapper;
  constructor(
    private readonly entityManager: EntityManager,
    private readonly fleetRepository: FleetRepository,
    mapperFactory: MapperFactory
  ) {
    this.userMapper = mapperFactory.createUserMapper();
  }

  public async save(user: DomainUser) {
    await this.entityManager.transactional(
      async (em) => {
        const persistedUser: PersistentUser | null = await em.findOne(PersistentUser, user.userId.id);
        const updatedUser = this.userMapper.toInfra(user, persistedUser || undefined);

        const savedFleets = await Promise.all(user.getFleets().map((fleet) => this.fleetRepository.save(fleet))).then(
          (ids) => ids.map((id) => em.getReference(PersistentFleet, id.id))
        );

        const ownerships: FleetOwnership[] = savedFleets.map((fleet) => new FleetOwnership(fleet, updatedUser));

        em.persist(updatedUser);
        em.persist(ownerships);
      },
      { flushMode: FlushMode.COMMIT }
    );
  }

  public async findUserById(userId: number): Promise<DomainUser | null> {
    const persistedUser: PersistentUser | null = await this.entityManager.findOne(PersistentUser, userId);
    return persistedUser ? this.userMapper.toDomain(persistedUser) : null;
  }
}
