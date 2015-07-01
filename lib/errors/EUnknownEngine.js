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
 * Provides the EUnknownEngine error which is used when attempting to use an
 * unknown templating engine.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Templating
 */

var util = require('util'),
    t = require('ejs-t');

/**
 * Thrown when tryng to use an unknown templating engine.
 *
 * @param {String} name The name of the engine.
 *
 * @class EUnknownEngine
 * @constructor
 * @extends Error
 */
function EUnknownEngine(name) {
  'use strict';

  EUnknownEngine.super_.call(this);
  Error.captureStackTrace(this, EUnknownEngine);

  this.message = t.t(
    'Unknown templating engine ":name".',
    {':name': name}
  );
}

/**
 * Inherit from the {Error} class.
 */
util.inherits(EUnknownEngine, Error);

/**
 * Export the error constructor.
 */
module.exports = EUnknownEngine;
