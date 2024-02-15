import { User } from '@backend/Domain/Entities/User.js';
import { UserRepository } from '@backend/Domain/Repositories/UserRepository.js';

export class UserInMemoryRepository implements UserRepository {
  findUserById(userId: number): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  private users: User[] = [];

  public save(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }
}
