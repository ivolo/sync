
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/rooms')
  , memoize = require('model-memoize')
  , async = require('async')
  , model = require('model')
  , uid = require('uid')
  , Oz = require('oz')
  , Progress = require('progress')
  , Player = require('player')
  , roomHtml = require('./room.html');

/**
 * Add Oz tags
 */
Oz.tags.partial = {
  attr: 'oz-part',
  render: function (el, ctx, prop, scope, next) {
    var val = Oz.get(ctx, prop, this.thisSymbol);

    el.appendChild(val);
  }
};

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

Room.prototype.createView = function () {
  var room = this;

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
};

Room.prototype.createPlayer = function () {
  room.player = new Player();

  if(room.song()) {
    room.player.play(room.song(), room.startTime());
  }

  room.on('change song', function (song) {
    room.player.play(song, room.startTime());
  });

  room.on('change startTime', function (startTime) {
    room.player.catchUp();
  });
};

Room.prototype.createProgress = function () {
  room.progress = new Progress();

  room.view.update(room);
};

Room.once('construct', function (room) {

  room.createView();

  room.createPlayer();

  room.createProgress();

});
