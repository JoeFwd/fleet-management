import { User as DomainUser } from '@backend/Domain/Entities/User.js';
import { User as PersistentUser } from '@backend/Infra/Entities/User.js';
import { EntityMapper } from './EntityMapper.js';

/**
 * Maps a the user domain entity to the persistent entity and vice-versa.
 */
export class UserMapper implements EntityMapper<DomainUser, PersistentUser> {
  public toDomain(entity: PersistentUser): DomainUser {
    return new DomainUser(entity.id.toString());
  }

  public toInfra(domainEntity: DomainUser, infraUser?: PersistentUser): PersistentUser {
    if (!domainEntity) throw new Error('UserMapper requires a domain entity');
    if (infraUser) return infraUser; // A user does not have mutable properties.
    const user = new PersistentUser();
    user.id = +domainEntity.userId;
    return user;
  }
}
