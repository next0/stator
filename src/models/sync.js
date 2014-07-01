/* global define */
define(function(require, exports, module) {
    'use strict';

    // imports
    var Backbone = require('backbone'),
        cookies  = require('./../helpers/cookies');


    // code
    var sync = {
        _transformer: function(method, model, options) {
            var apikey = cookies.get('api-key');

            options || (options = {});
            if (apikey) {
                options.beforeSend = function(xhr) {
                    xhr.withCredentials = true;
                    xhr.setRequestHeader('Authorization', 'api-key ' + apikey);
                };
            }

            return options;
        },

        transform: function(transformer) {
            if (transformer) {
                sync._transformer = transformer;
                return sync;
            }

            return sync._transformer;
        },

        sync: function(method, model, options) {
            var _this = this,
                transformer = sync.transform();

            if (transformer) {
                options = transformer(method, model, options);
            }

            return Backbone.sync.call(_this, method, model, options);
        }
    };

    module.exports = sync;
});