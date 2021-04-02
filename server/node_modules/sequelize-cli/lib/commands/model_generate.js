"use strict";

var _yargs = require("../core/yargs");

var _helpers = _interopRequireDefault(require("../helpers"));

var _cliColor = _interopRequireDefault(require("cli-color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._underscoreOption)((0, _yargs._baseOptions)(yargs).option('name', {
  describe: 'Defines the name of the new model',
  type: 'string',
  demandOption: true
}).option('attributes', {
  describe: 'A list of attributes',
  type: 'string',
  demandOption: true
}).option('force', {
  describe: 'Forcefully re-creates model with the same name',
  type: 'string',
  demandOption: false
})).argv;

exports.handler = function (args) {
  ensureModelsFolder();
  ensureMigrationsFolder();
  checkModelFileExistence(args);

  try {
    _helpers.default.model.generateFile(args);
  } catch (err) {
    _helpers.default.view.error(err.message);
  }

  _helpers.default.migration.generateTableCreationFile(args);

  _helpers.default.view.log('New model was created at', _cliColor.default.blueBright(_helpers.default.path.getModelPath(args.name)), '.');

  _helpers.default.view.log('New migration was created at', _cliColor.default.blueBright(_helpers.default.path.getMigrationPath(_helpers.default.migration.generateMigrationName(args))), '.');

  process.exit(0);
};

function ensureModelsFolder() {
  if (!_helpers.default.path.existsSync(_helpers.default.path.getModelsPath())) {
    _helpers.default.view.error('Unable to find models path (' + _helpers.default.path.getModelsPath() + '). Did you run ' + _cliColor.default.blueBright('sequelize init') + '?');
  }
}

function ensureMigrationsFolder() {
  if (!_helpers.default.path.existsSync(_helpers.default.path.getPath('migration'))) {
    _helpers.default.view.error('Unable to find migrations path (' + _helpers.default.path.getPath('migration') + '). Did you run ' + _cliColor.default.blueBright('sequelize init') + '?');
  }
}

function checkModelFileExistence(args) {
  const modelPath = _helpers.default.path.getModelPath(args.name);

  if (args.force === undefined && _helpers.default.model.modelFileExists(modelPath)) {
    _helpers.default.view.notifyAboutExistingFile(modelPath);

    process.exit(1);
  }
}