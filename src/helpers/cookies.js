/* global define */
define(function(require, exports, module) {
    'use strict';

    // code
    module.exports = {
        get: function(name) {
            var regexp = new RegExp('(?:^|;\\s*)' + name + '\\s*=\\s*([^;]*)', 'g'),
                res = regexp.exec(document.cookie);

            return (res) ? decodeURIComponent(res[1]) : null;
        }
    };
});