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
                time = null;

            if (match) {
                time = new Date(match[1] * 1000);
            }

            return time;
        }
    };
});