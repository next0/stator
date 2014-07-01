/* global require, define */
(function() {
    'use strict';

    var dirs = {
        bower: '../../vendors/'
    };

    require.config({
        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: [
                    'underscore',
                    'jquery'
                ],
                exports: 'Backbone'
            },
            nestedmodel: ['backbone'],
            deparam: ['jquery']
        },
        paths: {
            jquery: dirs.bower + 'jquery/dist/jquery',
            // underscore: dirs.bower + 'underscore/underscore',
            underscore: dirs.bower + 'lodash/dist/lodash',
            backbone: dirs.bower + 'backbone/backbone',
            nestedmodel: dirs.bower + 'backbone-nested-model/backbone-nested',
            deparam: dirs.bower + 'jquery-bbq-deparam/jquery-deparam'
        }
    });

})();