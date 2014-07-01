/* global define, jasmine, beforeEach, afterEach, describe, it, xdescribe, xit, spyOn, expect */
define(function(require) {
    'use strict';

    // imports
    var Backbone   = require('backbone'),
        StateModel = require('stator').State;


    // code
    describe('tests of Stator.State.', function() {
        it('should be a Backbone Model', function() {
            var state = new StateModel();
            expect(state instanceof Backbone.Model).toBe(true);
        });
    });


    describe('tests of Stator.State trigger events "change".', function() {
        var state,
            listnerSpy;

        beforeEach(function() {
            state = new StateModel();
            listnerSpy = jasmine.createSpy('listnerSpy');
        });

        it('should initialize without triggering events "change"', function() {
            state.on('change', listnerSpy);

            state.init('_', []);
            state.init({
                opt: {
                    def: 1
                },
                filters: []
            });

            expect(listnerSpy.calls.count()).toBe(0);
        });

        it('should initialize deep models without triggering events "change"', function() {
            state.on('change', listnerSpy);

            var ref = state.init('sub', {}).ref('sub');

            ref.init('_', []);
            ref.init({
                opt: {
                    def: 1
                },
                filters: []
            });

            expect(listnerSpy.calls.count()).toBe(0);
        });

        it('should use initialized value when path not be reached', function() {
            state.on('change', function(state) {
                listnerSpy(state.toJSON());
            });

            state.init({
                opt: {
                    def: 1
                },
                filters: []
            });

            state.set({
                opt: void 0,
                type: 'users'
            });
            state.set('type', void 0);

            expect(listnerSpy.calls.argsFor(0)).toEqual([{
                opt: {
                    def: 1
                },
                filters: [],
                type: 'users'
            }]);
            expect(listnerSpy.calls.argsFor(1)).toEqual([{
                opt: {
                    def: 1
                },
                filters: []
            }]);
        });
    });

    return null;
});