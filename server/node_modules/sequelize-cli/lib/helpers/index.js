"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {};

_fs.default.readdirSync(__dirname).filter(file => file.indexOf('.') !== 0 && file.indexOf('index.js') === -1).forEach(file => {
  module.exports[file.replace('-helper.js', '')] = require(_path.default.resolve(__dirname, file));
});

module.exports.default = module.exports;