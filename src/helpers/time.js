/* global define */
define(function(require, exports, module) {
    'use strict';

    // code
    module.exports = {
        param: function(time) {
            return 'time|' + Math.floor(time.getTime() / 1000);
        },
        deparam: function(time) {
            var format = /^time\|(\d+)$/,
                match = format.exec(time),
                res = null;

            if (match) {
                res = new Date(match[1] * 1000);
            }

            return res;
        }
    };
});