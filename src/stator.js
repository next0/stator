/* global define */
define(function(require, exports, module) {
    'use strict';

    module.exports = {
        State:      require('./states/state'),
        Ref:        require('./states/ref'),

        Model:      require('./models/model'),
        Collection: require('./models/collection'),

        View:       require('./views/view'),
        Region:     require('./views/region'),

        Router:     require('./routers/router')
    };
});