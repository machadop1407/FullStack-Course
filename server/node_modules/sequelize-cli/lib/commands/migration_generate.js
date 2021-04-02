"use strict";

var _yargs = require("../core/yargs");

var _helpers = _interopRequireDefault(require("../helpers"));

var _fs = _interopRequireDefault(require("fs"));

var _cliColor = _interopRequireDefault(require("cli-color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._underscoreOption)((0, _yargs._baseOptions)(yargs).option('name', {
  describe: 'Defines the name of the migration',
  type: 'string',
  demandOption: true
})).argv;

exports.handler = function (args) {
  _helpers.default.init.createMigrationsFolder();

  _fs.default.writeFileSync(_helpers.default.path.getMigrationPath(args.name), _helpers.default.template.render('migrations/skeleton.js', {}, {
    beautify: false
  }));

  _helpers.default.view.log('New migration was created at', _cliColor.default.blueBright(_helpers.default.path.getMigrationPath(args.name)), '.');

  process.exit(0);
};