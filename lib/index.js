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

/**
 * The Templating component.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Templating
 */

var fs = require('fs'),
    async = require('async'),
    ejsStatic = require('ejs-static'),
    sortBy = require('ejs-sortby'),
    merge = require('ejs-merge'),
    Swig = require('./engines/swig'),
    Engine = require('./engine'),
    EUnknownEngine = require('./errors/EUnknownEngine'),
    EUnknownTemplate = require('./errors/EUnknownTemplate'),
    EInvalidEngine = require('./errors/EInvalidEngine');

var templating,
    _static = ejsStatic('ejs-templating', {
      _locals: {},
      _templates: {},
      _engines: {}
    }).get();

templating = module.exports = {
  /**
   * Registers a new templating engine.
   *
   * @method registerEngine
   * @param {String} name The name of the engine.
   * @param {Function} Constructor The engine constructor.
   * @returns {Object} Returns self.
   * @chainable
   */
  registerEngine: function (name, Constructor) {
    'use strict';

    if (typeof Constructor !== 'function') {
      throw new TypeError('The engine constructor must be an constructor.');
    }

    var engine = new Constructor();
    if (engine instanceof Engine === false) {
      throw new EInvalidEngine(name);
    }

    _static._engines[name] = engine;
    return templating;
  },

  /**
   * Determines if an engine has been registered.
   *
   * @method registeredEngine
   * @param {String} name The name of the engine.
   * @returns {Boolean} Returns true or false.
   */
  registeredEngine: function (name) {
    'use strict';

    return _static._engines[name] !== undefined;
  },

  /**
   * unregisters a registered engine.
   *
   * @method unregisterEngine
   * @param {String} name The name of the registered engine.
   * @returns {Object} Returns self.
   * @chainable
   */
  unregisterEngine: function (name) {
    'use strict';

    delete _static._engines[name];
    return templating;
  },

  /**
   * Gets the defined engines.
   *
   * @method engines
   * @returns {Object} The defined engines.
   */
  engines: function () {
    'use strict';

    return _static._engines;
  },

  /**
   * Add a local variable, these are sent to all templates.
   *
   * @method addLocal
   * @param {String} name The name of the local variable.
   * @param {Mixed} value The value to assign the local variable.
   * @returns {Object} Returns self.
   * @chainable
   */
  addLocal: function (name, value) {
    'use strict';

    _static._locals[name] = value;
    return templating;
  },

  /**
   * Deletes a local variable.
   *
   * @method delLocal
   * @param {String} name The name of the local variable.
   * @returns {Object} Returns self.
   * @chainable
   */
  delLocal: function (name) {
    'use strict';

    delete _static._locals[name];
    return templating;
  },

  /**
   * Gets the defined local values.
   *
   * @method locals
   * @returns {Object} The defined locals.
   */
  locals: function () {
    'use strict';

    return _static._locals;
  },

  /**
   * Registers a new template.
   *
   * @method register
   * @param {String} name The name of the template.
   * @param {Object|String} target The target, this will be either a filename or
   *   object containing 'code' or 'entity' details.
   * @param {Integer} [weight=0] The weight to apply to the template within its
   *   source.
   * @param {String} [engine='swig'] The engine this template uses to render.
   * @return {Object} Returns self.
   * @chainable
   */
  register: function (name, target, weight, engine) {
    'use strict';

    if (_static._templates[name] === undefined) {
      _static._templates[name] = [];
    }

    var tpl = {
      weight: weight || 0,
      engine: engine || 'swig'
    };

    if (typeof target === 'string') {
      tpl.filename = target;
    } else if (target && typeof target === 'function') {
      tpl.callback = target;
    } else if (target && target.code) {
      tpl.code = target.code;
    }

    _static._templates[name].push(tpl);
    sortBy(_static._templates[name], 'weight');

    return templating;
  },

  /**
   * Determines if a template has been registered.
   *
   * @method registered
   * @param {String} name The template name to check for.
   * @return {Boolean} Returns true or false.
   */
  registered: function (name) {
    'use strict';

    return _static._templates[name] !== undefined;
  },

  /**
   * Unregisters a set of templates or a specific template.
   *
   * @method unregister
   * @param {String} name The template name to unregister.
   * @param {Mixed} [target] The details of the specific template to remove.
   * @return {Object} Returns self.
   * @chainable
   */
  unregister: function (name, target) {
    'use strict';

    if (!target) {
      delete _static._templates[name];
    } else if (_static._templates[name]) {
      var tmp = [];
      for (var i = 0, len = _static._templates[name].length; i < len; i++) {
        var tpl = _static._templates[name][i];

        if (
          (
            target.code &&
            tpl.code &&
            tpl.code === target.code
          ) ||
          (
            typeof target === 'function' &&
            tpl.callback &&
            tpl.callback === target
          ) ||
          (
            tpl.filename &&
            tpl.filename === target
          )
        ) {
          continue;
        }

        tmp.push(tpl);
      }

      _static._templates[name] = tmp;
    }

    return templating;
  },

  /**
   * Returns an array of the last available templates template from each source.
   *
   * @method templates
   * @param {String} [name] The name of the template to return, if not provided
   *   all templates are returned.
   * @return {Object|Array} An object of all templates, or array of the
   *   specified template.
   */
  templates: function (name) {
    'use strict';

    return name ?
      (_static._templates[name] ? _static._templates[name] : []) :
      _static._templates;
  },

  /**
   * Gets a templates code from the given name.
   *
   * @method template
   * @param {Function} done The done callback.
   *   @param {Error} done.err Any raised errors.
   *   @param {String} done.engine The templating engine.
   *   @param {String} done.code The template code.
   * @param {String} name The name of the template.
   * @async
   *
   * @throws {Error} An error is thrown if the template isnt available.
   */
  template: function (done, name) {
    'use strict';

    var tpls = this.templates(name),
        tpl = tpls.length > 0 ? tpls[tpls.length - 1] : false;

    if (!tpl) {
      return done(new EUnknownTemplate(name));
    }

    var queue = [],
        code;

    if (tpl.code) {
      queue.push(function (next) {
        code = tpl.code;
        next();
      });
    } else if (tpl.filename) {
      queue.push(function (next) {
        fs.readFile(tpl.filename, function (err, data) {
          if (err) {
            return next(err);
          }

          code = data;
          next();
        });
      });
    } else if (tpl.callback) {
      queue.push(function (next) {
        tpl.callback(function (err, tplCode) {
          if (err) {
            return next(err);
          }

          code = tplCode;
          next();
        }, tpl);
      });
    }

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      done(null, tpl.engine || 'swig', code);
    });
  },

  /**
   * Renders a template with any provided arguments.
   *
   * @method render
   * @param {Function} done The done callback.
   *   @param {Error} done.err Any raised errors.
   *   @param {String} done.output The rendered output.
   * @param {String} name The name of the template to render.
   * @param {Object} [args] Any arguments to pass to the rendering engine.
   * @async
   */
  render: function (done, name, args) {
    'use strict';

    var queue = [],
        engine,
        code,
        locals = merge({}, _static._locals);

    merge(locals, args);

    queue.push(function (next) {
      templating.template(function (err, e, tpl) {
        if (err) {
          return next(err);
        }

        engine = e;
        code = tpl;
        next();
      }, name);
    });

    async.series(queue, function (err) {
      if (err) {
        return done(err);
      }

      if (_static._engines[engine] === undefined) {
        return done(new EUnknownEngine(engine));
      }

      _static._engines[engine].render(done, code, locals);
    });
  }
};

templating
  .registerEngine('swig', Swig)
  .addLocal('now', function () {
    'use strict';

    return new Date();
  });
