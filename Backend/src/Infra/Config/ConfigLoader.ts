export type AppConfig = {
  databaseHost: string;
  databasePort: string;
  databaseName: string;
  databaseSchema: string;
  databaseUser: string;
  databasePassword: string;
};

/**
 * Loads the application configuration.
 */
export class ConfigLoader {
  /**
   * Loads the application configuration.
   * @returns {AppConfig} the application configuration.
   * @throws {Error} an error if any of the required environment variables is not defined.
   */
  public load(): AppConfig {
    const env: string[] = [
      'FLEET_DATABASE_HOST',
      'FLEET_DATABASE_PORT',
      'FLEET_DATABASE_NAME',
      'FLEET_DATABASE_USER',
      'FLEET_DATABASE_PASSWORD',
      'FLEET_DATABASE_SCHEMA'
    ];

    const error: string = env
      .map((envVar) => (process.env[envVar] ? '' : `Environment variable ${envVar} is not defined.`))
      .join('\n');

    if (error.trim()) {
      throw new Error(error);
    }

    return {
      databaseHost: process.env[env[0]]!,
      databasePort: process.env[env[1]]!,
      databaseName: process.env[env[2]]!,
      databaseUser: process.env[env[3]]!,
      databasePassword: process.env[env[4]]!,
      databaseSchema: process.env[env[5]]!
    };
  }
}
