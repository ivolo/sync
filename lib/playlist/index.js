
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
  .attr('view', { default: function () {

    var view = new Songs();

    domReady(function() {
      dom(window.document.body).append(view.el);
    });

    return view;
  } })
  .attr('songs', { default : function() {

    var songs = new Collection();
    var view = this.view();

    songs.on('add', function(song) {
      view.add(song);
    });

    return new Collection();
  } })
  .attr('title', { default : '' });
