"use strict";

var _SequelizeStorage = _interopRequireDefault(require("./SequelizeStorage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _SequelizeStorage.default;
console.warn('Deprecated: SequelizeStorage\'s filename has changed!', 'Use \'umzug/lib/storages/SequelizeStorage\' instead of \'umzug/lib/storages/sequelize\'', 'For more information: https://github.com/sequelize/umzug/pull/139');