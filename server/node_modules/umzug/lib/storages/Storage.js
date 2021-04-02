"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Storage
 */
class Storage {
  /**
   * Does nothing.
   *
   * @param {String} migrationName - Name of migration to be logged.
   * @returns {Promise}
   */
  logMigration(migrationName) {
    return _bluebird.default.resolve();
  }
  /**
   * Does nothing.
   *
   * @param {String} migrationName - Name of migration to unlog.
   * @returns {Promise}
   */


  unlogMigration(migrationName) {
    return _bluebird.default.resolve();
  }
  /**
   * Does nothing.
   *
   * @returns {Promise.<String[]>}
   */


  executed() {
    return _bluebird.default.resolve([]);
  }

}

exports.default = Storage;