"use strict";

var _path2 = _interopRequireDefault(require("path"));

var _helper = _interopRequireDefault(require("./helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @class Migration
 */
module.exports = class Migration {
  /**
   * Wrapper function for migration methods.
   *
   * @callback Migration~wrap
   * @param {function} - Migration method to be wrapped.
   * @return {*|Promise}
   */

  /**
   * Constructs Migration.
   *
   * @param {String} path - Path of the migration file.
   * @param {Object} options
   * @param {String} options.upName - Name of the method `up` in migration
   * module.
   * @param {String} options.downName - Name of the method `down` in migration
   * module.
   * @param {Object} options.migrations
   * @param {Migration~wrap} options.migrations.wrap - Wrapper function for
   * migration methods.
   * @param {Migration~customResolver} [options.migrations.customResolver] - A
   * function that specifies how to get a migration object from a path. This
   * should return an object of the form { up: Function, down: Function }.
   * Without this defined, a regular javascript import will be performed.
   * @constructs Migration
   */
  constructor(path, options) {
    this.path = _path2.default.resolve(path);
    this.file = _path2.default.basename(this.path);
    this.options = options;
  }
  /**
   * Tries to require migration module. CoffeeScript support requires
   * 'coffee-script' to be installed.
   * To require other file types, like TypeScript or raw sql files, a
   * custom resolver can be used.
   *
   * @returns {Promise.<Object>} Required migration module
   */


  migration() {
    if (typeof this.options.migrations.customResolver === 'function') {
      return this.options.migrations.customResolver(this.path);
    }

    if (this.path.match(/\.coffee$/)) {
      // 2.x compiler registration
      _helper.default.resolve('coffeescript/register') || // 1.7.x compiler registration
      _helper.default.resolve('coffee-script/register') || // Prior to 1.7.x compiler registration
      _helper.default.resolve('coffee-script') ||
      /* jshint expr: true */
      function () {
        console.error('You have to add "coffee-script" to your package.json.');
        process.exit(1);
      }();
    }

    return require(this.path);
  }
  /**
   * Executes method `up` of migration.
   *
   * @returns {Promise}
   */


  up() {
    return this._exec(this.options.upName, [].slice.apply(arguments));
  }
  /**
   * Executes method `down` of migration.
   *
   * @returns {Promise}
   */


  down() {
    return this._exec(this.options.downName, [].slice.apply(arguments));
  }
  /**
   * Check if migration file name is starting with needle.
   * @param {String} needle - The beginning of the file name.
   * @returns {boolean}
   */


  testFileName(needle) {
    return this.file.indexOf(needle) === 0;
  }
  /**
   * Executes a given method of migration with given arguments.
   *
   * @param {String} method - Name of the method to be called.
   * @param {*} args - Arguments to be used when called the method.
   * @returns {Promise}
   * @private
   */


  _exec(method, args) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const migration = yield _this.migration();
      let fun = migration[method];

      if (migration.default) {
        fun = migration.default[method] || migration[method];
      }

      if (!fun) throw new Error('Could not find migration method: ' + method);

      const wrappedFun = _this.options.migrations.wrap(fun);

      const result = wrappedFun.apply(migration, args);

      if (!result || typeof result.then !== 'function') {
        throw new Error(`Migration ${_this.file} (or wrapper) didn't return a promise`);
      }

      yield result;
    })();
  }

};