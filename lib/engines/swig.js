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
 * The Swig Templating engine class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Templating
 */

var util = require('util'),
    path = require('path'),
    async = require('async'),
    swig = require('swig'),
    Engine = require('../engine');

/**
 * Helper function to initialize the internal templating loader.
 *
 * @method swigInternalLoader
 * @param {Engine} engine The templating engine.
 * @return {Object} The swig loader.
 */
function swigInternalLoader(engine) {
  'use strict';

  function asyncMethod(done, name) {
    var code,
        queue = [];

    queue.push(function (next) {
      require('../').template(function (err, tpl) {
        if (err) {
          return next(err);
        }

        code = tpl;
        next();
      }, name);
    });

    async.series(queue, function (err) {
      done(err ? err : null, err ? null : code);
    });
  }

  function syncMethod(name) {
    var error,
        code;

    require('../').template(function (err, eng, tpl) {
      if (err) {
        error = err;
        return;
      }

      code = tpl;
    }, name);

    var delay = 0;
    while (!error && !code) {
      delay++;

      if (delay > 10000000) {
        error = new Error(
          'Timeout while waiting for response from template method.'
        );
      }
    }

    if (error) {
      throw error;
    }

    return code;
  }

  return {
    resolve: function (to, from) {
      return path.resolve('/', to);
    },
    load: function (identifier, cb) {
      var name = identifier.substr(1);

      return cb ? asyncMethod(cb, name) : syncMethod(name);
    }
  };
}

/**
 * The Swig engine class.
 *
 * @class Swig
 * @extends Engine
 * @construct
 */
function Swig() {
  'use strict';

  Swig.super_.call(this);

  swig.setDefaults({
    loader: swigInternalLoader(this)
  });
}

util.inherits(Swig, Engine);

/**
 * Get the title of the engine, used for any UI/admin.
 *
 * @method getTitle
 * @returns {String} The title of the engine.
 */
Swig.prototype.getTitle = function () {
  'use strict';

  return 'Swig';
};

/**
 * Get the description of the engine, used for any UI/admin.
 *
 * @method getDescription
 * @returns {String} The description of the engine.
 */
Swig.prototype.getDescription = function () {
  'use strict';

  return 'A templating engine using the Swig engine.';
};

/**
 * Renders some templating code using this engine.
 *
 * @method render
 * @param {Function} done The done callback.
 *   @param {Error} done.err Any raised errors.
 *   @param {String} done.output The rendered output.
 * @param {String} code The code to render.
 * @param {Object} [args={}] Any arguments to pass to the templating engine.
 * @async
 */
Swig.prototype.render = function (done, code, args) {
  'use strict';

  try {
    var output = swig.render(code, {
      locals: args
    });

    return done(null, output);
  } catch (err) {
    return done(err, null);
  }
};

/**
 * Export the Swig Templating engine constructor.
 */
module.exports = Swig;
