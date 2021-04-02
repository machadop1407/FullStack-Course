"use strict";

var _JSONStorage = _interopRequireDefault(require("./JSONStorage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _JSONStorage.default;
console.warn('Deprecated: JSONStorage\'s filename has changed!', 'Use \'umzug/lib/storages/JSONStorage\' instead of \'umzug/lib/storages/json\'', 'For more information: https://github.com/sequelize/umzug/pull/139');