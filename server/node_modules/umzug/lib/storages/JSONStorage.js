"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _fs = _interopRequireDefault(require("fs"));

var _path2 = _interopRequireDefault(require("path"));

var _Storage = _interopRequireDefault(require("./Storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class JSONStorage
 */
class JSONStorage extends _Storage.default {
  /**
   * Constructs JSON file storage.
   *
   * @param {Object} [options]
   * @param {String} [options.path='./umzug.json'] - Path to JSON file where
   * the log is stored. Defaults './umzug.json' relative to process' cwd.
   */
  constructor({
    path = _path2.default.resolve(process.cwd(), 'umzug.json')
  } = {}) {
    super();
    this.path = path;
  }
  /**
   * Logs migration to be considered as executed.
   *
   * @param {String} migrationName - Name of the migration to be logged.
   * @returns {Promise}
   */


  logMigration(migrationName) {
    const filePath = this.path;

    const readfile = _bluebird.default.promisify(_fs.default.readFile);

    const writefile = _bluebird.default.promisify(_fs.default.writeFile);

    return readfile(filePath).catch(() => '[]').then(content => JSON.parse(content)).then(content => {
      content.push(migrationName);
      return writefile(filePath, JSON.stringify(content, null, '  '));
    });
  }
  /**
   * Unlogs migration to be considered as pending.
   *
   * @param {String} migrationName - Name of the migration to be unlogged.
   * @returns {Promise}
   */


  unlogMigration(migrationName) {
    const filePath = this.path;

    const readfile = _bluebird.default.promisify(_fs.default.readFile);

    const writefile = _bluebird.default.promisify(_fs.default.writeFile);

    return readfile(filePath).catch(() => '[]').then(content => JSON.parse(content)).then(content => {
      content = content.filter(m => m !== migrationName);
      return writefile(filePath, JSON.stringify(content, null, '  '));
    });
  }
  /**
   * Gets list of executed migrations.
   *
   * @returns {Promise.<String[]>}
   */


  executed() {
    const filePath = this.path;

    const readfile = _bluebird.default.promisify(_fs.default.readFile);

    return readfile(filePath).catch(() => '[]').then(content => JSON.parse(content));
  }

}

exports.default = JSONStorage;