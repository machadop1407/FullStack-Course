"use strict";

var _yargs = require("../core/yargs");

var _migrator = require("../core/migrator");

var _helpers = _interopRequireDefault(require("../helpers"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).option('to', {
  describe: 'Migration name to run migrations until',
  type: 'string'
}).option('from', {
  describe: 'Migration name to start migrations from (excluding)',
  type: 'string'
}).argv;

exports.handler = async function (args) {
  const command = args._[0]; // legacy, gulp used to do this

  await _helpers.default.config.init();

  switch (command) {
    case 'db:migrate':
      await migrate(args);
      break;

    case 'db:migrate:schema:timestamps:add':
      await migrateSchemaTimestampAdd(args);
      break;

    case 'db:migrate:status':
      await migrationStatus(args);
      break;
  }

  process.exit(0);
};

function migrate(args) {
  return (0, _migrator.getMigrator)('migration', args).then(migrator => {
    return (0, _migrator.ensureCurrentMetaSchema)(migrator).then(() => migrator.pending()).then(migrations => {
      const options = {};

      if (migrations.length === 0) {
        _helpers.default.view.log('No migrations were executed, database schema was already up to date.');

        process.exit(0);
      }

      if (args.to) {
        if (migrations.filter(migration => migration.file === args.to).length === 0) {
          _helpers.default.view.log('No migrations were executed, database schema was already up to date.');

          process.exit(0);
        }

        options.to = args.to;
      }

      if (args.from) {
        if (migrations.map(migration => migration.file).lastIndexOf(args.from) === -1) {
          _helpers.default.view.log('No migrations were executed, database schema was already up to date.');

          process.exit(0);
        }

        options.from = args.from;
      }

      return options;
    }).then(options => migrator.up(options));
  }).catch(e => _helpers.default.view.error(e));
}

function migrationStatus(args) {
  return (0, _migrator.getMigrator)('migration', args).then(migrator => {
    return (0, _migrator.ensureCurrentMetaSchema)(migrator).then(() => migrator.executed()).then(migrations => {
      _lodash.default.forEach(migrations, migration => {
        _helpers.default.view.log('up', migration.file);
      });
    }).then(() => migrator.pending()).then(migrations => {
      _lodash.default.forEach(migrations, migration => {
        _helpers.default.view.log('down', migration.file);
      });
    });
  }).catch(e => _helpers.default.view.error(e));
}

function migrateSchemaTimestampAdd(args) {
  return (0, _migrator.getMigrator)('migration', args).then(migrator => {
    return (0, _migrator.addTimestampsToSchema)(migrator).then(items => {
      if (items) {
        _helpers.default.view.log('Successfully added timestamps to MetaTable.');
      } else {
        _helpers.default.view.log('MetaTable already has timestamps.');
      }
    });
  }).catch(e => _helpers.default.view.error(e));
}