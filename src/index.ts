import { readFileSync, fstat } from 'fs';
import * as chokidar from 'chokidar';
import * as _debug from 'debug'
import { pathToRegexp } from 'path-to-regexp';

const debug = _debug('[mini-mock]')

interface MockOption {
  // readConfig: () => Config
  entry: string;
}

interface Config {
  off: boolean;
  routes: Record<string, string>,
  prefix: string;
}

function readJsonSync(file):Record<string, any> {
  try {
    return JSON.parse(readFileSync(file, {
      encoding: 'utf-8'
    }))
  } catch (e) {
    debug('readJsonSync fail', e)
  }
}

function parseRouteMap(map) {
  const routes = Object.keys(map).map((key) => {
    const [method, ...rest] = key.split(':');
    return {
      method: method.toLowerCase(),
      path: rest.join(':'),
      mockFile: map[key],
    };
  });
  return routes;
}

function cleanModuleCache(modulePath) {
  const file = require.resolve(modulePath)
  const module = require.cache[file];
  // remove reference in module.parent
  if (module.parent) {
      module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }
  require.cache[file] = undefined;
}

let mockOption = null;

export function mock(option: MockOption) {
  const filePath = require.resolve(option.entry)
  mockOption = require(filePath)
  console.log('watching ', filePath)
  chokidar.watch(filePath)
    .on('change', (event, path) => {
      cleanModuleCache(filePath)
      mockOption = require(filePath)
      console.log(event, path, mockOption);
    })
  return function(req, res, next) {
    const config = Object.assign({
      off: false,
      routes: [],
      prefix: '',
    }, mockOption);
    // console.log(JSON.stringify(config))
    if (config.off) {
      return next()
    }
    const routes = parseRouteMap(config.routes);
    const method:string = req.method;
    const methodedRoutes = routes.filter(item => item.method === method.toLowerCase());
    const target = methodedRoutes.find(item => {
      const reg = pathToRegexp(`${config.prefix}${item.path}`); // 支持prefix https://www.npmjs.com/package/path-to-regexp
      // console.log(reg)
      return reg.exec(req.path);
    })
    if (target) {
      console.log('[hit mock file]', req.path, target.mockFile)
      return res.send(readJsonSync(target.mockFile)); // TODO 支持函数
    }
    return next()
  }
}
