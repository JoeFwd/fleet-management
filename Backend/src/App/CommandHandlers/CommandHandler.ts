/**
 * A CommandHandler determines how a given command should be executed.
 * It takes as input two generic paramaters C and R respectively the type of the command
 * to execute and the type of the result of the command execution.
 */
export interface CommandHandler<C, R> {
  /**
   * Handles the given command
   * @param {C} command The command to handle.
   * @returns {Promise<R>} A promise resolving to the R typed result of the command execution.
   */
  execute(command: C): Promise<R>;
}
