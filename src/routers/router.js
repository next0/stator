/* global define */
define(function(require, exports, module) {
    'use strict';

    // imports
    var _        = require('underscore'),
        Backbone = require('backbone'),
        url      = require('helpers/url');


    // code
    var NAMED_PARAM = /(\(\?)?:\w+/g,
        SPLAT_PARAM = /\*\w+/g,
        QUERY_STRING_PARAM_NAME = '__query__';

    var __super__ = Backbone.Router.prototype;
    var Router = Backbone.Router.extend({
        route: function(route, name, callback) {
            var _this = this,
                metadata = _this._metadata || (_this._metadata = {});

            if (!_.isRegExp(route)) {
                metadata[name] = {
                    action: name,
                    route: route,
                    params: _this._extractNamedParameters(route)
                };

                route += '(?*' + QUERY_STRING_PARAM_NAME + ')';
                route = _this._routeToRegExp(route);
            }
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) {
                callback = _this[name];
            }

            var router = _this;
            Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment),
                    metadata = _this._metadata[name] || {},
                    params = metadata.params;

                if (params) {
                    args = _.object(params, args);
                    args = _this.parse(args, metadata);

                    router.execute(callback, args, params);
                    router.trigger.call(router, 'route:' + name, args);
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                }
            });

            return _this;
        },

        navigate: function(fragment, options) {
            var _this = this,
                metadata = _this._metadata || (_this._metadata = {}),
                params,
                path = '';

            if (!_.isString(fragment)) {
                params = _.transform(fragment, function(result, value, key) {
                    if (key.charAt(0) !== '$') {
                        result[key] = value;
                    }
                });

                if (fragment.$action || fragment.$route) {
                    metadata = metadata[fragment.$action || fragment.$route];
                    path = metadata ? metadata.route : fragment.$route;

                    path = path
                        .replace(/([:*])(\w+)/g, function(match, type, name) {
                            var val = params[name];
                            delete params[name];
                            return !(_.isNull(val) && _.isUndefined(val)) ? val : match;
                        })
                        .replace(/\([^)]*[:*][^)]+\)/g, '')
                        .replace(/\(|\)/g, '')
                        .replace(/\/+/g, '/');
                }
                params = url.param(params);
                if (params.length) {
                    path += '?' + params;
                }
            }

            return Backbone.history.navigate(path, options);
        },

        _extractNamedParameters: function(route) {
            var types = [NAMED_PARAM, SPLAT_PARAM],
                names = [],
                list,
                i;

            for (i in types) {
                list = route.match(types[i]);
                if (list) {
                    names = names.concat(list);
                }
            }

            return _.map(names, function(name) {
                return name.slice(1);
            });
        },

        parse: function(args, metadata) {
            var _this = this,
                params = metadata.params,
                obj;

            if (params[params.length - 1] === QUERY_STRING_PARAM_NAME) {
                obj = url.deparam(args[QUERY_STRING_PARAM_NAME]);
                delete args[QUERY_STRING_PARAM_NAME];
                args = _.extend(args, obj);
            }
            args.$route = metadata.route;
            args.$action = metadata.action;

            return args;
        }
    });

    module.exports = Router;
});