"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _jsBeautify = _interopRequireDefault(require("js-beautify"));

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  render(path, locals, options) {
    options = _lodash.default.assign({
      beautify: true,
      indent_size: 2,
      preserve_newlines: false
    }, options || {});

    const template = _index.default.asset.read(path);

    let content = _lodash.default.template(template)(locals || {});

    if (options.beautify) {
      content = (0, _jsBeautify.default)(content, options);
    }

    return content;
  }

};