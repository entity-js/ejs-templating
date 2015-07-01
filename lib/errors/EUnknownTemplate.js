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
 * Provides the EUnknownTemplate error which is used when attempting to use an
 * unknown template.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule Templating
 */

var util = require('util'),
    t = require('ejs-t');

/**
 * Thrown when tryng to use an unknown template.
 *
 * @param {String} name The name of the template.
 *
 * @class EUnknownTemplate
 * @constructor
 * @extends Error
 */
function EUnknownTemplate(name) {
  'use strict';

  EUnknownTemplate.super_.call(this);
  Error.captureStackTrace(this, EUnknownTemplate);

  this.message = t.t(
    'Unknown template ":name".',
    {':name': name}
  );
}

/**
 * Inherit from the {Error} class.
 */
util.inherits(EUnknownTemplate, Error);

/**
 * Export the error constructor.
 */
module.exports = EUnknownTemplate;
