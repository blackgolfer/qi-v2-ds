// main.js

import userCmdHandler from './user_cmd_handler.js';

const run = async () => {
  try {
    // Example command: List directory contents
    await userCmdHandler('ls', ['-la']);

    // Example command: Echo a message
    await userCmdHandler('echo', ['Hello, World!']);

    // Example command with no parameters
    await userCmdHandler('pwd');

    // Example command that results in error (if 'invalid_command' is not in allowedCommands)
    await userCmdHandler('invalid_command', []);
  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
  }
};

run();
