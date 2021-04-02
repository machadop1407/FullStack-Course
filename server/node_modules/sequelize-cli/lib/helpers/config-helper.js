"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _url = _interopRequireDefault(require("url"));

var _lodash = _interopRequireDefault(require("lodash"));

var _util = require("util");

var _index = _interopRequireDefault(require("./index"));

var _yargs = _interopRequireDefault(require("../core/yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _yargs.default)().argv;
const api = {
  config: undefined,
  rawConfig: undefined,
  error: undefined,

  init() {
    return Promise.resolve().then(() => {
      let config;

      if (args.url) {
        config = api.parseDbUrl(args.url);
      } else {
        try {
          config = require(api.getConfigFile());
        } catch (e) {
          api.error = e;
        }
      }

      return config;
    }).then(config => {
      if (typeof config === 'object' || config === undefined) {
        return config;
      } else if (config.length === 1) {
        return (0, _util.promisify)(config)();
      } else {
        return config();
      }
    }).then(config => {
      api.rawConfig = config;
    }).then(() => {
      // Always return the full config api
      return api;
    });
  },

  getConfigFile() {
    if (args.config) {
      return _path.default.resolve(process.cwd(), args.config);
    }

    const defaultPath = _path.default.resolve(process.cwd(), 'config', 'config.json');

    const alternativePath = defaultPath.replace('.json', '.js');
    return _index.default.path.existsSync(alternativePath) ? alternativePath : defaultPath;
  },

  relativeConfigFile() {
    return _path.default.relative(process.cwd(), api.getConfigFile());
  },

  configFileExists() {
    return _index.default.path.existsSync(api.getConfigFile());
  },

  getDefaultConfig() {
    return JSON.stringify({
      development: {
        username: 'root',
        password: null,
        database: 'database_development',
        host: '127.0.0.1',
        dialect: 'mysql'
      },
      test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql'
      },
      production: {
        username: 'root',
        password: null,
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql'
      }
    }, undefined, 2) + '\n';
  },

  writeDefaultConfig() {
    const configPath = _path.default.dirname(api.getConfigFile());

    if (!_index.default.path.existsSync(configPath)) {
      _index.default.asset.mkdirp(configPath);
    }

    _fs.default.writeFileSync(api.getConfigFile(), api.getDefaultConfig());
  },

  readConfig() {
    if (!api.config) {
      const env = _index.default.generic.getEnvironment();

      if (api.rawConfig === undefined) {
        throw new Error('Error reading "' + api.relativeConfigFile() + '". Error: ' + api.error);
      }

      if (typeof api.rawConfig !== 'object') {
        throw new Error('Config must be an object or a promise for an object: ' + api.relativeConfigFile());
      }

      if (args.url) {
        _index.default.view.log('Parsed url ' + api.filteredUrl(args.url, api.rawConfig));
      } else {
        _index.default.view.log('Loaded configuration file "' + api.relativeConfigFile() + '".');
      }

      if (api.rawConfig[env]) {
        _index.default.view.log('Using environment "' + env + '".');

        api.rawConfig = api.rawConfig[env];
      } // The Sequelize library needs a function passed in to its logging option


      if (api.rawConfig.logging && !_lodash.default.isFunction(api.rawConfig.logging)) {
        api.rawConfig.logging = console.log;
      } // in case url is present - we overwrite the configuration


      if (api.rawConfig.url) {
        api.rawConfig = _lodash.default.merge(api.rawConfig, api.parseDbUrl(api.rawConfig.url));
      } else if (api.rawConfig.use_env_variable) {
        api.rawConfig = _lodash.default.merge(api.rawConfig, api.parseDbUrl(process.env[api.rawConfig.use_env_variable]));
      }

      api.config = api.rawConfig;
    }

    return api.config;
  },

  filteredUrl(uri, config) {
    const regExp = new RegExp(':?' + _lodash.default.escapeRegExp(config.password) + '@');
    return uri.replace(regExp, ':*****@');
  },

  urlStringToConfigHash(urlString) {
    try {
      const urlParts = _url.default.parse(urlString);

      let result = {
        database: urlParts.pathname.replace(/^\//, ''),
        host: urlParts.hostname,
        port: urlParts.port,
        protocol: urlParts.protocol.replace(/:$/, ''),
        ssl: urlParts.query ? urlParts.query.indexOf('ssl=true') >= 0 : false
      };

      if (urlParts.auth) {
        result = _lodash.default.assign(result, {
          username: urlParts.auth.split(':')[0],
          password: urlParts.auth.split(':')[1]
        });
      }

      return result;
    } catch (e) {
      throw new Error('Error parsing url: ' + urlString);
    }
  },

  parseDbUrl(urlString) {
    let config = api.urlStringToConfigHash(urlString);
    config = _lodash.default.assign(config, {
      dialect: config.protocol
    });

    if (config.dialect === 'sqlite' && config.database.indexOf(':memory') !== 0) {
      config = _lodash.default.assign(config, {
        storage: '/' + config.database
      });
    }

    return config;
  }

};
module.exports = api;