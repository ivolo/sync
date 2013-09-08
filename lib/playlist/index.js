
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/playlists')
  , memoize = require('model-memoize')
  , model = require('model')
  , uid = require('uid')
  , Collection = require('collection');


/**
 * Playlist.
 */

var Playlist = module.exports = model('playlist')
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('created', { default : function () { return new Date(); } })
  .attr('songs', { default : function() { return new Collection(); } })
  .attr('title', { default : '' });
