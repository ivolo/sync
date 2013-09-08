
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/listeners')
  , memoize = require('model-memoize')
  , model = require('model')
  , uid = require('uid');


/**
 * Playlist.
 */

var Listener = module.exports = model('listener')
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('joined', { default : Firebase.ServerValue.TIMESTAMP })
  .attr('created', { default : function () { return new Date(); } })
  .attr('state', { default : {} })
  .attr('name', { default : '' });