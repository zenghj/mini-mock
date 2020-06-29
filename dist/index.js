"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var chokidar = require("chokidar");
var _debug = require("debug");
var path_to_regexp_1 = require("path-to-regexp");
var debug = _debug('[mini-mock]');
function readJsonSync(file) {
    try {
        return JSON.parse(fs_1.readFileSync(file, {
            encoding: 'utf-8'
        }));
    }
    catch (e) {
        debug('readJsonSync fail', e);
    }
}
function parseRouteMap(map) {
    var routes = Object.keys(map).map(function (key) {
        var _a = __read(key.split(':')), method = _a[0], rest = _a.slice(1);
        return {
            method: method.toLowerCase(),
            path: rest.join(':'),
            mockFile: map[key],
        };
    });
    return routes;
}
function cleanModuleCache(modulePath) {
    var file = require.resolve(modulePath);
    var module = require.cache[file];
    // remove reference in module.parent
    if (module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    require.cache[file] = undefined;
}
var mockOption = null;
function mock(option) {
    var filePath = require.resolve(option.entry);
    mockOption = require(filePath);
    console.log('watching ', filePath);
    chokidar.watch(filePath)
        .on('change', function (event, path) {
        cleanModuleCache(filePath);
        mockOption = require(filePath);
        console.log(event, path, mockOption);
    });
    return function (req, res, next) {
        var config = Object.assign({
            off: false,
            routes: [],
            prefix: '',
        }, mockOption);
        // console.log(JSON.stringify(config))
        if (config.off) {
            return next();
        }
        var routes = parseRouteMap(config.routes);
        var method = req.method;
        var methodedRoutes = routes.filter(function (item) { return item.method === method.toLowerCase(); });
        var target = methodedRoutes.find(function (item) {
            var reg = path_to_regexp_1.pathToRegexp("" + config.prefix + item.path); // 支持prefix https://www.npmjs.com/package/path-to-regexp
            // console.log(reg)
            return reg.exec(req.path);
        });
        if (target) {
            console.log('[hit mock file]', req.path, target.mockFile);
            return res.send(readJsonSync(target.mockFile)); // TODO 支持函数
        }
        return next();
    };
}
exports.mock = mock;
