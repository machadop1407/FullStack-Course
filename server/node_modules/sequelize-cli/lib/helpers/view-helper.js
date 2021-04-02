"use strict";

var _cliColor = _interopRequireDefault(require("cli-color"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = _interopRequireDefault(require("./index"));

var _yargs = _interopRequireDefault(require("../core/yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _yargs.default)().argv;
module.exports = {
  teaser() {
    const versions = ['Node: ' + _index.default.version.getNodeVersion(), 'CLI: ' + _index.default.version.getCliVersion(), 'ORM: ' + _index.default.version.getOrmVersion()];
    this.log();
    this.log(_cliColor.default.underline('Sequelize CLI [' + versions.join(', ') + ']'));
    this.log();
  },

  log() {
    console.log.apply(this, arguments);
  },

  error(error) {
    let message = error;
    const extraMessages = [];

    if (error instanceof Error) {
      message = !args.debug ? error.message : error.stack;
    }

    if (args.debug && error.original) {
      extraMessages.push(error.original.message);
    }

    this.log();
    console.error(`${_cliColor.default.red('ERROR:')} ${message}`);
    extraMessages.forEach(message => console.error(`${_cliColor.default.red('EXTRA MESSAGE:')} ${message}`));
    this.log();
    process.exit(1);
  },

  warn(message) {
    this.log(`${_cliColor.default.yellow('WARNING:')} ${message}`);
  },

  notifyAboutExistingFile(file) {
    this.error('The file ' + _cliColor.default.blueBright(file) + ' already exists. ' + 'Run command with --force to overwrite it.');
  },

  pad(s, smth) {
    let margin = smth;

    if (_lodash.default.isObject(margin)) {
      margin = Object.keys(margin);
    }

    if (Array.isArray(margin)) {
      margin = Math.max.apply(null, margin.map(o => {
        return o.length;
      }));
    }

    return s + new Array(margin - s.length + 1).join(' ');
  }

};