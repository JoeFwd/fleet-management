import { User } from '../Entities/User.js';

/**
 * Repository for the User entity.
 */
export interface UserRepository {
  /**
   * Saves a user and its fleets.
   * @param user the user to save.
   */
  save(user: User): Promise<void>;

  /**
   * Finds a user by its id.
   * @param userId the id of the user to find.
   * @ returns the user if found, null otherwise.
   */
  findUserById(userId: number): Promise<User | null>;
}
