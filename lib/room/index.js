
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/rooms')
  , memoize = require('model-memoize')
  , async = require('async')
  , model = require('model')
  , uid = require('uid')
  , Oz = require('oz')
  , roomHtml = require('./room.html');

/**
 * Room.
 */

var Room = module.exports = model('room')
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('created', { default : function () { return new Date(); } })
  .attr('song')
  .attr('startTime', { default: Firebase.ServerValue.TIMESTAMP });

Room.prototype.reset = function () {
  this.song("");
  this.startTime(Firebase.ServerValue.TIMESTAMP);
};

Room.once('construct', function (room) {
  room.view = Oz(roomHtml);
  room.on('change', function () {
    room.view.update(room);
  });

  var song = "";

  room.view.on('addSong', function (form, e) {
    e.preventDefault();
    room.reset();
    room.song(song);
    room.save();
  });

  room.view.on('change:newSong', function (newSong) {
    song = newSong;
  });

  document.body.appendChild(room.view.render(room));
});
