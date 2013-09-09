
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
  .attr('view', { noSync: true, default: function () {

    var view = new Songs();

    domReady(function () {
      dom(window.document.body).append(view.el);
    });

    console.log(view);

    return view;
  }})
  .attr('songs', { default : [] })
  .attr('title', { default : '' });

// Initialize the songs as a collection

Playlist.on('construct', function (playlist) {

  var initialSongs = playlist.songs();

  console.log(playlist);

  var songs = new Collection();

  songs.toObject = function () {
    return this.models;
  };

  songs.on('add', function (song) {
    console.log(playlist.view());
    playlist.view().add(song);
  });

  playlist.songs(songs);

  initialSongs.forEach(function (song) {
    playlist.songs().add(song);
  });

});
