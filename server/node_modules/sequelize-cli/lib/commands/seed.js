"use strict";

var _yargs = require("../core/yargs");

var _migrator = require("../core/migrator");

var _helpers = _interopRequireDefault(require("../helpers"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).argv;

exports.handler = async function (args) {
  const command = args._[0]; // legacy, gulp used to do this

  await _helpers.default.config.init();

  switch (command) {
    case 'db:seed:all':
      await seedAll(args);
      break;

    case 'db:seed:undo:all':
      await seedUndoAll(args);
      break;
  }

  process.exit(0);
};

function seedAll(args) {
  return (0, _migrator.getMigrator)('seeder', args).then(migrator => {
    return migrator.pending().then(seeders => {
      if (seeders.length === 0) {
        _helpers.default.view.log('No seeders found.');

        return;
      }

      return migrator.up({
        migrations: _lodash.default.chain(seeders).map('file').value()
      });
    });
  }).catch(e => _helpers.default.view.error(e));
}

function seedUndoAll(args) {
  return (0, _migrator.getMigrator)('seeder', args).then(migrator => {
    return (_helpers.default.umzug.getStorage('seeder') === 'none' ? migrator.pending() : migrator.executed()).then(seeders => {
      if (seeders.length === 0) {
        _helpers.default.view.log('No seeders found.');

        return;
      }

      return migrator.down({
        migrations: _lodash.default.chain(seeders).map('file').reverse().value()
      });
    });
  }).catch(e => _helpers.default.view.error(e));
}