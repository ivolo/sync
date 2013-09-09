
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/playlists')
  , memoize = require('model-memoize')
  , setters = require('model-setters')
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
  .attr('songs', { default : [], set: function (songs) {

    var playlist = this;

    playlist.view().empty();

    var songsCollection = new Collection();

    songsCollection.toObject = function () {
      return this.models;
    };

    songsCollection.on('add', function (song) {
      playlist.view().add(song);
    });

    songsCollection.on('remove', function (song) {
      playlist.view().remove(song);
    });

    songs.forEach(function (song) {
      songsCollection.add(song);
    });

    return songsCollection;
  } })
  .attr('title', { default : '' });

