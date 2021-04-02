"use strict";

var _yargs = require("../core/yargs");

var _migrator = require("../core/migrator");

var _helpers = _interopRequireDefault(require("../helpers"));

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).option('seed', {
  describe: 'List of seed files',
  type: 'array'
}).argv;

exports.handler = async function (args) {
  const command = args._[0]; // legacy, gulp used to do this

  await _helpers.default.config.init();

  switch (command) {
    case 'db:seed':
      try {
        const migrator = await (0, _migrator.getMigrator)('seeder', args); // filter out cmd names
        // for case like --seeders-path seeders --seed seedPerson.js db:seed

        const seeds = (args.seed || []).filter(name => name !== 'db:seed' && name !== 'db:seed:undo').map(file => _path.default.basename(file));
        return migrator.up(seeds);
      } catch (e) {
        _helpers.default.view.error(e);
      }

      break;

    case 'db:seed:undo':
      try {
        const migrator = await (0, _migrator.getMigrator)('seeder', args);
        let seeders = _helpers.default.umzug.getStorage('seeder') === 'none' ? await migrator.pending() : await migrator.executed();

        if (args.seed) {
          seeders = seeders.filter(seed => {
            return args.seed.includes(seed.file);
          });
        }

        if (seeders.length === 0) {
          _helpers.default.view.log('No seeders found.');

          return;
        }

        if (!args.seed) {
          seeders = seeders.slice(-1);
        }

        return migrator.down({
          migrations: _lodash.default.chain(seeders).map('file').reverse().value()
        });
      } catch (e) {
        _helpers.default.view.error(e);
      }

      break;
  }

  process.exit(0);
};