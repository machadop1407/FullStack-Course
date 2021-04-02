"use strict";

var _yargs = require("../core/yargs");

var _migrator = require("../core/migrator");

var _helpers = _interopRequireDefault(require("../helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).option('name', {
  describe: 'Name of the migration to undo',
  type: 'string'
}).argv;

exports.handler = async function (args) {
  // legacy, gulp used to do this
  await _helpers.default.config.init();
  await migrateUndo(args);
  process.exit(0);
};

function migrateUndo(args) {
  return (0, _migrator.getMigrator)('migration', args).then(migrator => {
    return (0, _migrator.ensureCurrentMetaSchema)(migrator).then(() => migrator.executed()).then(migrations => {
      if (migrations.length === 0) {
        _helpers.default.view.log('No executed migrations found.');

        process.exit(0);
      }
    }).then(() => {
      if (args.name) {
        return migrator.down(args.name);
      } else {
        return migrator.down();
      }
    });
  }).catch(e => _helpers.default.view.error(e));
}