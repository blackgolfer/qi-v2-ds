// user_cmd_handler.test.js


import userCmdHandler from '../user_cmd_handler.js';
import { exec } from 'child_process';
import { promisify } from 'util';

// Mock exec
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

const execAsync = promisify(exec);

describe('userCmdHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute a valid command', async () => {
    const mockStdout = 'Directory contents';
    exec.mockImplementation((cmd, callback) => {
      callback(null, mockStdout, '');
    });

    console.log = jest.fn();
    await userCmdHandler('echo', ['test']);

    expect(exec).toHaveBeenCalledWith('echo test', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith(mockStdout);
  });

  it('should handle command errors gracefully', async () => {
    const mockError = new Error('Command failed');
    const mockStderr = 'Error message';
    exec.mockImplementation((cmd, callback) => {
      callback(mockError, '', mockStderr);
    });

    console.error = jest.fn();
    await userCmdHandler('invalid_command', []);

    expect(exec).toHaveBeenCalledWith('invalid_command', expect.any(Function));
    expect(console.error).toHaveBeenCalledWith(`Invalid or disallowed command "invalid_command" attempted.`);
  });
});