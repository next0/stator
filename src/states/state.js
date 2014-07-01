/* global define */
define(function(require, exports, module) {
    'use strict';

    // imports
    var _        = require('underscore'),
        Backbone = require('backbone'),
        RefModel = require('./ref'),
        time     = require('./../helpers/time');

    // import Backbone plugin
    require('nestedmodel');


    // code
    var REF_DELIMITER = '.';

    var __super__ = Backbone.NestedModel.prototype;
    var StateModel = Backbone.NestedModel.extend({
        initialize: function() {
            var _this = this;
            _this._refs = {};
            _this._init = new Backbone.NestedModel();
            __super__.initialize.apply(_this, arguments);
        },

        init: function(key, val, options) {
            var _this = this,
                attrs;

            if (key === null) {
                return _this;
            }

            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.extend({silent: true}, options || {});

            _this._init.set(attrs, {silent: true});
            _this.set(attrs, options);

            return _this;
        },

        fill: function(attrs, options) {
            var _this = this;
            _this.clear(_.extend({}, options, {silent: true}));
            _this.set(attrs, options);
            return _this;
        },

        ref: function(name) {
            var _this = this,
                path = name.split(REF_DELIMITER),
                ref;

            if (!_this._refs[name]) {
                ref = new RefModel({
                    base: _this,
                    path: name
                });

                _this.listenTo(_this, 'change:' + path[0], function() {
                    ref.trigger('change', _this);
                });

                _this._refs[name] = ref;
            }

            return _this._refs[name];
        },

        get: function(key) {
            var _this = this,
                initValue,
                value;

            initValue = _this._init.get(key);
            value = __super__.get.call(_this, key);

            if (!_.isUndefined(initValue)) {
                return _.merge(initValue, value);
            }

            return value;
        },

        toJSON: function() {
            var _this = this,
                initValue,
                value;

            initValue = _this._init.toJSON();
            value = __super__.toJSON.call(_this);

            if (!_.isEmpty(initValue)) {
                return _.merge(initValue, value);
            }

            return value;
        },

        serialize: function() {
            var _this = this;
            return _.deepClone(_this.toJSON(), function(obj) {
                if (_.isDate(obj)) {
                    return time.param(obj);
                }
                return void 0;
            });
        },

        parse: function(data) {
            var _this = this;
            return _.deepClone(data, function(obj) {
                return time.deparam(obj + '') || void 0;
            });
        }
    });

    module.exports = StateModel;
});