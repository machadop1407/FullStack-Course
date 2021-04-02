"use strict";

var _Storage = _interopRequireDefault(require("./Storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _Storage.default;
console.warn('Deprecated: Storage\'s (former none storage) filename has changed!', 'Use \'umzug/lib/storages/Storage\' instead of \'umzug/lib/storages/none\'', 'For more information: https://github.com/sequelize/umzug/pull/139');