"use strict";

var _path = _interopRequireDefault(require("path"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const packageJson = require(_path.default.resolve(__dirname, '..', '..', 'package.json'));

module.exports = {
  getCliVersion() {
    return packageJson.version;
  },

  getOrmVersion() {
    return _index.default.generic.getSequelize('package.json').version;
  },

  getDialect() {
    try {
      return _index.default.config.readConfig();
    } catch (e) {
      return null;
    }
  },

  getDialectName() {
    const config = this.getDialect();

    if (config) {
      return {
        sqlite: 'sqlite3',
        postgres: 'pg',
        postgresql: 'pg',
        mariadb: 'mariasql',
        mysql: 'mysql'
      }[config.dialect];
    } else {
      return null;
    }
  },

  getNodeVersion() {
    return process.version.replace('v', '');
  }

};