"use strict";

var _yargs = require("../core/yargs");

var _helpers = _interopRequireDefault(require("../helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).option('force', {
  describe: 'Will drop the existing config folder and re-create it',
  type: 'boolean',
  default: false
}).argv;

exports.handler = async function (argv) {
  const command = argv._[0];

  switch (command) {
    case 'init':
      await initConfig(argv);
      await initModels(argv);
      await initMigrations(argv);
      await initSeeders(argv);
      break;

    case 'init:config':
      await initConfig(argv);
      break;

    case 'init:models':
      await initModels(argv);
      break;

    case 'init:migrations':
      await initMigrations(argv);
      break;

    case 'init:seeders':
      await initSeeders(argv);
      break;
  }

  process.exit(0);
};

function initConfig(args) {
  if (!_helpers.default.config.configFileExists() || !!args.force) {
    _helpers.default.config.writeDefaultConfig();

    _helpers.default.view.log('Created "' + _helpers.default.config.relativeConfigFile() + '"');
  } else {
    _helpers.default.view.notifyAboutExistingFile(_helpers.default.config.relativeConfigFile());

    process.exit(1);
  }
}

function initModels(args) {
  _helpers.default.init.createModelsFolder(!!args.force);

  _helpers.default.init.createModelsIndexFile(!!args.force);
}

function initMigrations(args) {
  _helpers.default.init.createMigrationsFolder(!!args.force);
}

function initSeeders(args) {
  _helpers.default.init.createSeedersFolder(!!args.force);
}