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
 * Provides the EInvalidEngine error which is used when attempting to use an
 * invalid templating engine constructor.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Templating
 */

var util = require('util'),
    t = require('ejs-t');

/**
 * Thrown when tryng to use an invalid templating engine constructor.
 *
 * @param {String} name The name of the engine.
 *
 * @class EInvalidEngine
 * @constructor
 * @extends Error
 */
function EInvalidEngine(name) {
  'use strict';

  EInvalidEngine.super_.call(this);
  Error.captureStackTrace(this, EInvalidEngine);

  this.message = t.t(
    'The constructor for ":name" does not inherit from Engine.',
    {':name': name}
  );
}

/**
 * Inherit from the {Error} class.
 */
util.inherits(EInvalidEngine, Error);

/**
 * Export the error constructor.
 */
module.exports = EInvalidEngine;
