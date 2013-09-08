
var defaults = require('model-defaults')
  , model = require('model')
  , memoize = require('model-memoize')
  , uid = require('uid');


/**
 * Song.
 */

var Song = module.exports = model('song')
  .use(defaults)
  .use(memoize)
  .attr('id', { default: function () { return uid(); } })
  .attr('url', { default: '' });

