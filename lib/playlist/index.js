
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/playlists')
  , memoize = require('model-memoize')
  , setters = require('model-setters')
  , model = require('model')
  , uid = require('uid')
  , list = require('list')
  , domReady = require('domready')
  , dom = require('dom')
  , SongCollection = require('songs')
  , Song = require('song')
  , Songs = list(Song.View);

/**
 * Playlist.
 */

var Playlist = module.exports = model('playlist')
  .use(setters)
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('created', { default : function () { return new Date(); } })
  .attr('view', { noSync: true, default: function () {

    var view = new Songs();

    domReady(function () {
      dom(window.document.body).append(view.el);
    });

    return view;
  }})
  .attr('songs', { default : [], set: function (songs) { return new SongCollection(this.view(), songs); } })
  .attr('title', { default : '' });

// Call the setter immediately when it's created
Playlist.on('construct', function(playlist) {
  playlist.songs(playlist.songs());
});