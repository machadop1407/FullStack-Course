"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Sequelize = _index.default.generic.getSequelize();

module.exports = {
  getTableName(modelName) {
    return Sequelize.Utils.pluralize(modelName);
  },

  generateTableCreationFileContent(args) {
    return _index.default.template.render('migrations/create-table.js', {
      tableName: this.getTableName(args.name),
      attributes: _index.default.model.transformAttributes(args.attributes),
      createdAt: args.underscored ? 'created_at' : 'createdAt',
      updatedAt: args.underscored ? 'updated_at' : 'updatedAt'
    });
  },

  generateMigrationName(args) {
    return _lodash.default.trimStart(_lodash.default.kebabCase('create-' + args.name), '-');
  },

  generateTableCreationFile(args) {
    const migrationName = this.generateMigrationName(args);

    const migrationPath = _index.default.path.getMigrationPath(migrationName);

    _index.default.asset.write(migrationPath, this.generateTableCreationFileContent(args));
  }

};