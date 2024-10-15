import parseArgs from "node:util";

const options = {
  'log': {
    type: 'string',
  },
  color: {
    type: 'boolean',
  }
};

const args = ['--log', 'all', 'print', '--color', 'file.txt'];
const config = {options, allowPositionals: true, args};

parseArgs(config)