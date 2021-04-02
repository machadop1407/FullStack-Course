"use strict";

var _path = _interopRequireDefault(require("path"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storage = {
  migration: 'sequelize',
  seeder: 'none'
};
const storageTableName = {
  migration: 'SequelizeMeta',
  seeder: 'SequelizeData'
};
const storageJsonName = {
  migration: 'sequelize-meta.json',
  seeder: 'sequelize-data.json'
};
let timestampsDefault = false;
module.exports = {
  getStorageOption(property, fallback) {
    return _index.default.config.readConfig()[property] || fallback;
  },

  getStorage(type) {
    return this.getStorageOption(type + 'Storage', storage[type]);
  },

  getStoragePath(type) {
    const fallbackPath = _path.default.join(process.cwd(), storageJsonName[type]);

    return this.getStorageOption(type + 'StoragePath', fallbackPath);
  },

  getTableName(type) {
    return this.getStorageOption(type + 'StorageTableName', storageTableName[type]);
  },

  getSchema(type) {
    return this.getStorageOption(type + 'StorageTableSchema', undefined);
  },

  enableTimestamps() {
    timestampsDefault = true;
  },

  getTimestamps(type) {
    return this.getStorageOption(type + 'Timestamps', timestampsDefault);
  },

  getStorageOptions(type, extraOptions) {
    const options = {};

    if (this.getStorage(type) === 'json') {
      options.path = this.getStoragePath(type);
    } else if (this.getStorage(type) === 'sequelize') {
      options.tableName = this.getTableName(type);
      options.schema = this.getSchema(type);
      options.timestamps = this.getTimestamps(type);
    }

    _lodash.default.assign(options, extraOptions);

    return options;
  }

};