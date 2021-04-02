"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logMigrator = logMigrator;
exports.getMigrator = getMigrator;
exports.ensureCurrentMetaSchema = ensureCurrentMetaSchema;
exports.addTimestampsToSchema = addTimestampsToSchema;

var _umzug = _interopRequireDefault(require("umzug"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = _interopRequireDefault(require("../helpers/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Sequelize = _index.default.generic.getSequelize();

function logMigrator(s) {
  if (s.indexOf('Executing') !== 0) {
    _index.default.view.log(s);
  }
}

function getSequelizeInstance() {
  let config = null;

  try {
    config = _index.default.config.readConfig();
  } catch (e) {
    _index.default.view.error(e);
  }

  config = _lodash.default.defaults(config, {
    logging: logMigrator
  });

  try {
    return new Sequelize(config);
  } catch (e) {
    _index.default.view.error(e);
  }
}

async function getMigrator(type, args) {
  if (!(_index.default.config.configFileExists() || args.url)) {
    _index.default.view.error(`Cannot find "${_index.default.config.getConfigFile()}". Have you run "sequelize init"?`);

    process.exit(1);
  }

  const sequelize = getSequelizeInstance();
  const migrator = new _umzug.default({
    storage: _index.default.umzug.getStorage(type),
    storageOptions: _index.default.umzug.getStorageOptions(type, {
      sequelize
    }),
    logging: _index.default.view.log,
    migrations: {
      params: [sequelize.getQueryInterface(), Sequelize],
      path: _index.default.path.getPath(type),
      pattern: /\.(cjs|js|ts)$/
    }
  });
  return sequelize.authenticate().then(() => {
    // Check if this is a PostgreSQL run and if there is a custom schema specified, and if there is, check if it's
    // been created. If not, attempt to create it.
    if (_index.default.version.getDialectName() === 'pg') {
      const customSchemaName = _index.default.umzug.getSchema('migration');

      if (customSchemaName && customSchemaName !== 'public') {
        return sequelize.createSchema(customSchemaName);
      }
    }
  }).then(() => migrator).catch(e => _index.default.view.error(e));
}

function ensureCurrentMetaSchema(migrator) {
  const queryInterface = migrator.options.storageOptions.sequelize.getQueryInterface();
  const tableName = migrator.options.storageOptions.tableName;
  const columnName = migrator.options.storageOptions.columnName;
  return ensureMetaTable(queryInterface, tableName).then(table => {
    const columns = Object.keys(table);

    if (columns.length === 1 && columns[0] === columnName) {
      return;
    } else if (columns.length === 3 && columns.indexOf('createdAt') >= 0) {
      // If found createdAt - indicate we have timestamps enabled
      _index.default.umzug.enableTimestamps();

      return;
    }
  }).catch(() => {});
}

function ensureMetaTable(queryInterface, tableName) {
  return queryInterface.showAllTables().then(tableNames => {
    if (tableNames.indexOf(tableName) === -1) {
      throw new Error('No MetaTable table found.');
    }

    return queryInterface.describeTable(tableName);
  });
}
/**
 * Add timestamps
 *
 * @return {Promise}
 */


function addTimestampsToSchema(migrator) {
  const sequelize = migrator.options.storageOptions.sequelize;
  const queryInterface = sequelize.getQueryInterface();
  const tableName = migrator.options.storageOptions.tableName;
  return ensureMetaTable(queryInterface, tableName).then(table => {
    if (table.createdAt) {
      return;
    }

    return ensureCurrentMetaSchema(migrator).then(() => queryInterface.renameTable(tableName, tableName + 'Backup')).then(() => {
      const queryGenerator = queryInterface.QueryGenerator || queryInterface.queryGenerator;
      const sql = queryGenerator.selectQuery(tableName + 'Backup');
      return _index.default.generic.execQuery(sequelize, sql, {
        type: 'SELECT',
        raw: true
      });
    }).then(result => {
      const SequelizeMeta = sequelize.define(tableName, {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: false
        }
      }, {
        tableName,
        timestamps: true,
        schema: _index.default.umzug.getSchema()
      });
      return SequelizeMeta.sync().then(() => {
        return SequelizeMeta.bulkCreate(result);
      });
    });
  });
}