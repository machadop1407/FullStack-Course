"use strict";

var _index = _interopRequireDefault(require("./index"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createFolder(folderName, folder, force) {
  if (force && _fs.default.existsSync(folder) === true) {
    _index.default.view.log('Deleting the ' + folderName + ' folder. (--force)');

    try {
      _fs.default.readdirSync(folder).forEach(filename => {
        _fs.default.unlinkSync(_path.default.resolve(folder, filename));
      });
    } catch (e) {
      _index.default.view.error(e);
    }

    try {
      _fs.default.rmdirSync(folder);

      _index.default.view.log('Successfully deleted the ' + folderName + ' folder.');
    } catch (e) {
      _index.default.view.error(e);
    }
  }

  try {
    if (_fs.default.existsSync(folder) === false) {
      _index.default.asset.mkdirp(folder);

      _index.default.view.log('Successfully created ' + folderName + ' folder at "' + folder + '".');
    } else {
      _index.default.view.log(folderName + ' folder at "' + folder + '" already exists.');
    }
  } catch (e) {
    _index.default.view.error(e);
  }
}

const init = {
  createMigrationsFolder: force => {
    createFolder('migrations', _index.default.path.getPath('migration'), force);
  },
  createSeedersFolder: force => {
    createFolder('seeders', _index.default.path.getPath('seeder'), force);
  },
  createModelsFolder: force => {
    createFolder('models', _index.default.path.getModelsPath(), force);
  },
  createModelsIndexFile: force => {
    const modelsPath = _index.default.path.getModelsPath();

    const indexPath = _path.default.resolve(modelsPath, _index.default.path.addFileExtension('index'));

    if (!_index.default.path.existsSync(modelsPath)) {
      _index.default.view.log('Models folder not available.');
    } else if (_index.default.path.existsSync(indexPath) && !force) {
      _index.default.view.notifyAboutExistingFile(indexPath);
    } else {
      const relativeConfigPath = _path.default.relative(_index.default.path.getModelsPath(), _index.default.config.getConfigFile());

      _index.default.asset.write(indexPath, _index.default.template.render('models/index.js', {
        configFile: "__dirname + '/" + relativeConfigPath.replace(/\\/g, '/') + "'"
      }, {
        beautify: false
      }));
    }
  }
};
module.exports = init;
module.exports.default = init;