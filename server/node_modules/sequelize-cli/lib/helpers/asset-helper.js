"use strict";

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const assets = {
  copy: (from, to) => {
    _fsExtra.default.copySync(_path.default.resolve(__dirname, '..', 'assets', from), to);
  },
  read: assetPath => {
    return _fsExtra.default.readFileSync(_path.default.resolve(__dirname, '..', 'assets', assetPath)).toString();
  },
  write: (targetPath, content) => {
    _fsExtra.default.writeFileSync(targetPath, content);
  },
  inject: (filePath, token, content) => {
    const fileContent = _fsExtra.default.readFileSync(filePath).toString();

    _fsExtra.default.writeFileSync(filePath, fileContent.replace(token, content));
  },
  injectConfigFilePath: (filePath, configPath) => {
    (void 0).inject(filePath, '__CONFIG_FILE__', configPath);
  },
  mkdirp: pathToCreate => {
    _fsExtra.default.mkdirpSync(pathToCreate);
  }
};
module.exports = assets;
module.exports.default = assets;