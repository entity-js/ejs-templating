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
 * The base Templating engine class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Templating
 */

/**
 * The TemplatingEngine base class.
 *
 * @class Engine
 * @construct
 */
function Engine () {
  'use strict';

  // Does nothing.
}

/**
 * Get the title of the engine, used for any UI/admin.
 *
 * @method getTitle
 * @returns {String} The title of the engine.
 */
Engine.prototype.getTitle = function () {
  'use strict';

  return '';
};

/**
 * Get the description of the engine, used for any UI/admin.
 *
 * @method getDescription
 * @returns {String} The description of the engine.
 */
Engine.prototype.getDescription = function () {
  'use strict';

  return '';
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
Engine.prototype.render = function (done, code, args) {
  'use strict';

  done(null, code);
};

/**
 * Export the Templating engine constructor.
 */
module.exports = Engine;
