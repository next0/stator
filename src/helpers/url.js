/* global define */
define(function(require, exports, module) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore');

    // import jquery plugins
    require('deparam');


    // code
    module.exports = {
        param: function(params) {
            return decodeURIComponent($.param(params));
        },
        deparam: function(params) {
            var query = params || '',
                json = $.deparam(query, true);

            return json;
        }
    };
});