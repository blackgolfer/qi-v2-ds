import { exec } from 'child_process';
import { promisify } from 'util';
import * as R from 'ramda';
import { createLogger, transports, format } from 'winston';

// Promisify exec for cleaner async/await usage
const execAsync = promisify(exec);

// Initialize Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return ` [${level.toUpperCase()}]: `;
    })
  ),
  transports: [
    new transports.Console(),
    // Add file transports if needed
  ],
});

// Define allowed commands for security
const allowedCommands = ['ls', 'echo', 'pwd']; // Extend this list as necessary

/**
 * Validates the command and its parameters.
 * @param {string} cmd - The base command.
 * @param {string[]} params - The command parameters.
 * @returns {boolean} - True if valid, else false.
 */
const validateCommand = (cmd, params) => {
  if (!allowedCommands.includes(cmd)) {
    logger.error(`Invalid or disallowed command "" attempted.`);
    return false;
  }
  // Add more validation rules as needed (e.g., sanitize params)
  return true;
};

/**
 * Executes a shell command asynchronously.
 * @param {string} cmd - The full shell command to execute.
 * @returns {Promise<{ stdout: string, stderr: string }>} - The command outputs.
 * @throws {Error} - If command execution fails.
 */
const executeShellCommand = async (cmd) => {
  try {
    const { stdout, stderr } = await execAsync(cmd);
    return { stdout, stderr };
  } catch (error) {
    throw new Error(`Command execution failed: ${error.message}`);
  }
};

/**
 * Handles user commands by executing shell commands.
 * @param {string} cmd - The base command.
 * @param {string[]} [params=[]] - The parameters for the command.
 */
const userCmdHandler = async (cmd, params = []) => {
  if (!validateCommand(cmd, params)) return;

  // Construct the full command string
  const fullCommand = R.join(' ', R.prepend(cmd, params)); // e.g., 'ls -la'

  try {
    const { stdout, stderr } = await executeShellCommand(fullCommand);

    // Log stdout if available
    if (stdout.trim()) {
      logger.info(`Output of "":\n`);
    }

    // Log stderr if available
    if (stderr.trim()) {
      logger.error(`Error Output for "":\n`);
    }
  } catch (error) {
    logger.error(`Failed to execute command "": ${error.message}`);
  }
};

export default userCmdHandler;
