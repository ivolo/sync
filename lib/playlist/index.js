
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/playlists')
  , memoize = require('model-memoize')
  , model = require('model')
  , uid = require('uid')
  , list = require('list')
  , domReady = require('domready')
  , dom = require('dom')
  , Collection = require('collection');

var SongView = require('song')
  , Songs = list(SongView);

/**
 * Playlist.
 */

var Playlist = module.exports = model('playlist')
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('created', { default : function () { return new Date(); } })
  .attr('songs', { default : [] })
  .attr('title', { default : '' });

// Set up the view for the Playlist

Playlist.on('construct', function(playlist, attrs) {

  playlist.songCollection = new Collection(playlist.songs);

  playlist.view = new Songs();

  domReady(function() {
    dom(window.document.body).append(playlist.view.el);
  });

  playlist.songCollection.on('add', function(song) {

    playlist.songs.push(song);
    playlist.view.add(song);

    playlist.save();
  });
});
