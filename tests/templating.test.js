/**
 *  ______   __   __   ______  __   ______  __  __
 * /\  ___\ /\ "-.\ \ /\__  _\/\ \ /\__  _\/\ \_\ \
 * \ \  __\ \ \ \-.  \\/_/\ \/\ \ \\/_/\ \/\ \____ \
 *  \ \_____\\ \_\\"\_\  \ \_\ \ \_\  \ \_\ \/\_____\
 *   \/_____/ \/_/ \/_/   \/_/  \/_/   \/_/  \/_____/
 *                                         __   ______
 *                                        /\ \ /\  ___\
 *                                       _\_\ \\ \___  \
 *                                      /\_____\\/\_____\
 *                                      \/_____/ \/_____/
 */

var util = require('util'),
    test = require('unit.js');

describe('ejs/templating', function () {

  'use strict';

  var Templating,
      Engine = require('../lib/engine'),
      EUnknownEngine = require('../lib/errors/EUnknownEngine'),
      EUnknownTemplate = require('../lib/errors/EUnknownTemplate'),
      EInvalidEngine = require('../lib/errors/EInvalidEngine');

  function TestEngine () {
    'use strict';

    TestEngine.super_.call(this);
  }

  util.inherits(TestEngine, Engine);

  beforeEach(function () {

    Templating = require('../lib');

  });

  afterEach(function () {

    var name = require.resolve('../lib');
    delete require.cache[name];

  });

  describe('Templating.registerEngine()', function () {

    it('shouldThrowErrorIfInvalidEngineClass', function () {

      test.exception(function () {
        Templating.registerEngine('test', false);
      }).isInstanceOf(TypeError);

    });

    it('shouldThrowErrorIfClassNotInherited', function () {

      function TestEngine2 () {}

      test.exception(function () {
        Templating.registerEngine('test', TestEngine2);
      }).isInstanceOf(EInvalidEngine);

    });

    it('shouldRegister', function () {

      Templating.registerEngine('test', TestEngine);

      test.object(
        Templating.engines()
      ).hasProperty('test');

      test.object(
        Templating.engines().test
      ).isInstanceOf(TestEngine);

    });

  });

  describe('Templating.registeredEngine()', function () {

    it('shouldReturnFalseIfEngineHasNotBeenRegistered', function () {

      test.bool(
        Templating.registeredEngine('test')
      ).isNotTrue();

    });

    it('shouldReturnTrueIfEngineHasBeenRegistered', function () {

      Templating.registerEngine('test', TestEngine);

      test.bool(
        Templating.registeredEngine('test')
      ).isTrue();

    });

  });

  describe('Templating.unregisterEngine()', function () {

    it('shouldUnregisterEngine', function () {

      Templating.registerEngine('test', TestEngine);

      Templating.unregisterEngine('test');

      test.object(
        Templating.engines()
      ).hasNotProperty('test');

    });

  });

  describe('Templating.addLocal()', function () {

    it('shouldAddNewLocalValue', function () {

      Templating.addLocal('test', true);

      test.object(
        Templating.locals()
      ).hasProperty('test');

      test.bool(
        Templating.locals().test
      ).isTrue();

    });

    it('shouldUpdateExistingLocalValue', function () {

      Templating.addLocal('test', true);
      Templating.addLocal('test', 'hello');

      test.string(
        Templating.locals().test
      ).is('hello');

    });

  });

  describe('Templating.delLocal()', function () {

    it('shouldRemoveNewLocalValue', function () {

      Templating.addLocal('test', true);
      Templating.delLocal('test');

      test.object(
        Templating.locals()
      ).hasNotProperty('test');

    });

  });

  describe('Templating.register()', function () {

    it('shouldAddNewTemplateToObject', function () {

      var code = 'Hello {{ name }}';

      Templating.register('test', {
        'code': code
      }, 0, null);

      test.object(
        Templating.templates()
      ).hasProperty('test');

      test.array(
        Templating.templates().test
      ).hasLength(1);

      test.object(
        Templating.templates().test[0]
      ).is({
        'code': code,
        'engine': 'swig',
        'weight': 0
      });

    });

    it('shouldAddAnotherTemplateToObject', function () {

      var code = 'Hello {{ name }}',
          code2 = 'Welcome {{ name }}';

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.register('test', {
        'code': code2
      }, 0, null);

      test.array(
        Templating.templates().test
      ).hasLength(2);

      test.object(
        Templating.templates().test[0]
      ).is({
        'code': code,
        'engine': 'swig',
        'weight': 0
      });

      test.object(
        Templating.templates().test[1]
      ).is({
        'code': code2,
        'engine': 'swig',
        'weight': 0
      });

    });

    it('templateItemsShouldBeWeighted', function () {

      var code = 'Hello {{ name }}',
          code2 = 'Welcome {{ name }}',
          code3 = 'Goodbye {{ name }}';

      Templating.register('test', {
        'code': code
      }, 2, null);

      Templating.register('test', {
        'code': code2
      }, 0, null);

      Templating.register('test', {
        'code': code3
      }, -2, null);

      test.array(
        Templating.templates().test
      ).hasLength(3);

      test.object(
        Templating.templates().test[0]
      ).is({
        'code': code3,
        'engine': 'swig',
        'weight': -2
      });

      test.object(
        Templating.templates().test[1]
      ).is({
        'code': code2,
        'engine': 'swig',
        'weight': 0
      });

      test.object(
        Templating.templates().test[2]
      ).is({
        'code': code,
        'engine': 'swig',
        'weight': 2
      });

    });

    it('registerWithFilename', function () {

      Templating.register('test', 'filename.swig', 0, null);
      test.value(
        Templating.templates().test[0].filename
      ).is('filename.swig');

    });

    it('registerWithCallback', function () {

      var callback = function () {};

      Templating.register('test', callback, 0, null);
      test.function(
        Templating.templates().test[0].callback
      ).is(callback);

    });

  });

  describe('Templating.registered()', function () {

    it('shouldReturnFalseIfTemplateDoesntExist', function () {

      test.bool(
        Templating.registered('test')
      ).isNotTrue();

    });

    it('shouldReturnTrueWhenTemplateHasBeenRegistered', function () {

      var code = 'Hello {{ name }}';

      Templating.register('test', {
        'code': code
      }, 2, null);

      test.bool(
        Templating.registered('test')
      ).isTrue();

    });

  });

  describe('Templating.unregister()', function () {

    it('shouldUnregisterAllRegisteredTemplatesOfName', function () {

      var code = 'Hello {{ name }}';

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.unregister('test');

      test.bool(
        Templating.registered('test')
      ).isNotTrue();

    });

    it('shouldUnregisterSpecificRegisteredTemplate', function () {

      var code = 'Hello {{ name }}',
          code2 = 'Welcome {{ name }}';

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.register('test', {
        'code': code2
      }, 0, null);

      Templating.unregister('test', {code: code});

      test.bool(
        Templating.registered('test')
      ).isTrue();

      test.array(
        Templating.templates('test')
      ).hasLength(1);

      test.string(
        Templating.templates('test')[0].code
      ).is(code2);

    });

    it('shouldUnregisterSpecificRegisteredTemplateAndDuplicates', function () {

      var code = 'Hello {{ name }}',
          code2 = 'Welcome {{ name }}';

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.register('test', {
        'code': code2
      }, 0, null);

      Templating.register('test', {
        'code': code
      }, 0, null);

      Templating.unregister('test', {code: code});

      test.bool(
        Templating.registered('test')
      ).isTrue();

      test.array(
        Templating.templates('test')
      ).hasLength(1);

      test.string(
        Templating.templates('test')[0].code
      ).is(code2);

    });

  });

  describe('Templating.templates()', function () {

    it('shouldReturnEmptyArrayWithNoTemplates', function () {

      test.array(
        Templating.templates('test')
      ).hasLength(0);

    });

    it('shouldReturnArrayWithOneItem', function () {

      var code = 'Hello {{ name }}';

      Templating.register('test', {
        'code': code
      }, 0, null);

      test.array(
        Templating.templates('test')
      ).hasLength(1);

    });

    it('shouldReturnArrayWithMultipleItems', function () {

      var code = 'Hello {{ name }}',
          code2 = 'Welcome {{ name }}',
          code3 = 'Goodbye {{ name }}';

      Templating.register('test', {
        'code': code
      }, 5, null);

      Templating.register('test', {
        'code': code2
      }, 0, null);

      Templating.register('test', {
        'code': code3
      }, -5, null);

      var templates = Templating.templates('test');

      test.array(
        templates
      ).hasLength(3);

      test.value(
        templates[0].code
      ).is(code3);

      test.value(
        templates[1].code
      ).is(code2);

      test.value(
        templates[2].code
      ).is(code);

    });

  });

  describe('Templating.render()', function () {

    it('shouldThrowAnErrorIfTemplateDoesntExist', function (done) {

      Templating.render(function (err, output) {

        test.object(
          err
        ).isInstanceOf(EUnknownTemplate);

        done();

      }, 'test');

    });

    it('shouldThrowAnErrorIfEngineDoesntExist', function (done) {

      Templating.register('test', {
        'code': 'Hello {{ name }}'
      }, 0, 'jade');

      Templating.render(function (err, output) {

        test.object(
          err
        ).isInstanceOf(EUnknownEngine);

        done();

      }, 'test');

    });

    it('shouldReturnRenderedOutput', function (done) {

      Templating.register('test', {
        'code': 'Hello {{ name }}'
      }, 0, null);

      Templating.render(function (err, output) {

        test.value(err).isNull();

        test.string(
          output
        ).is('Hello John');

        done();

      }, 'test', {'name': 'John'});

    });

    it('shouldImportFromInternalTemplate', function (done) {

      Templating.register('test', {
        'code': 'Hello {{ name }}'
      }, 0, null);

      Templating.register('test2', {
        'code': '{% include "test" %}, {{ name}}'
      }, 0, null);

      Templating.render(function (err, output) {

        test.value(err).isNull();

        test.string(
          output
        ).is('Hello John, John');

        done();

      }, 'test2', {'name': 'John'});

    });

  });

});
