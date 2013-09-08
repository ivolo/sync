
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/rooms')
  , memoize = require('model-memoize')
  , async = require('async')
  , model = require('model')
  , uid = require('uid')
  , Playlist = require('playlist')
  , Listener = require('listener');


/**
 * Room.
 */

var Room = module.exports = model('room')
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('created', { default : function () { return new Date(); } })
  .attr('title', { default : '' })
  .attr('playlist', { default: '' })
  .attr('listeners', { default: [] });

Room.prototype.master = function (callback) {
  var oldest;

  this.getListeners(function(err, listeners) {

    if(err) return callback(err);

    listeners.forEach(function(listener) {
      if(!oldest || listener.joined() > oldest.joined()) oldest = listener;
    });

    callback(null, oldest);
  });
};

Room.prototype.getPlaylist = function (callback) {

  if(this.playlist) {

    Playlist.get(this.playlist(), callback);

  } else {

    var playlist = new Playlist();

    this.playlist(playlist.id);

    callback(null, playlist);
  }
};

Room.prototype.getListeners = function (callback) {

  var listeners = [];

  if(!this.listeners().length) return callback(null, listeners);

  async.each(this.listeners(), function (id, cb) {

    Listener.get(id, function (err, listener) {

      if(err) return cb(err);

      listeners.push(listener);
    });

  }, function (err) {
    return callback(err, listeners);
  });
};

Room.prototype.addListener = function (listener) {

  var listeners = this.listeners();
  var id = listener.id();
  if(!~listeners.indexOf(id)) {
    listeners.push(id);
  }
  this.listeners(listeners);
  this.save();
};
