"use strict";

var _yargs = require("../core/yargs");

var _helpers = _interopRequireDefault(require("../helpers"));

var _fs = _interopRequireDefault(require("fs"));

var _cliColor = _interopRequireDefault(require("cli-color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).option('name', {
  describe: 'Defines the name of the seed',
  type: 'string',
  demandOption: true
}).argv;

exports.handler = function (args) {
  _helpers.default.init.createSeedersFolder();

  _fs.default.writeFileSync(_helpers.default.path.getSeederPath(args.name), _helpers.default.template.render('seeders/skeleton.js', {}, {
    beautify: false
  }));

  _helpers.default.view.log('New seed was created at', _cliColor.default.blueBright(_helpers.default.path.getSeederPath(args.name)), '.');

  process.exit(0);
};