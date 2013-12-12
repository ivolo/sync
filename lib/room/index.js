
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/rooms')
  , memoize = require('model-memoize')
  , async = require('async')
  , model = require('model')
  , uid = require('uid')
  , Oz = require('oz')
  , Player = require('player')
  , getOffset = require('ntp').offset
  , roomHtml = require('./room.html');

/**
 * Add Oz tags
 */
Oz.tags.partial = {
  attr: 'oz-part',
  render: function (el, ctx, prop, scope, next) {
    var val = Oz.get(ctx, prop, this.thisSymbol);

    if(val && val.nodeType) el.appendChild(val);
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
  .attr('startTime', { default: serverTime });

var offset = 0;

getOffset('/ntp', function (_offset) {
  offset = _offset;
});

function serverTime() {
  return new Date().getTime() + offset;
}

Room.prototype.reset = function () {
  this.song("");
  this.startTime(serverTime());
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

    // this is the person that added the song, so we will reset our start time to whenever they load the file
    room.player.once('loaded', function () {
      room.startTime(serverTime());
      room.save();
    });

    room.song(song);
    room.save();
  });

  room.view.on('change:newSong', function (newSong) {
    song = newSong;
  });

  document.body.appendChild(room.view.render(room));
};

Room.prototype.createPlayer = function () {
  var room = this;

  room.player = new Player();

  room.player.on('end', function () {
    room.reset();
    room.save();
  });

  room.on('change song', function (song) {
    room.player.play(song, room.startTime());
  });

  room.on('change startTime', function (startTime) {
    console.log("changing startTime to "+startTime);
    room.player.catchUp(startTime);
  });

  if(room.song()) {
    room.emit('change song', room.song());
  }
};

Room.once('construct', function (room) {

  room.createView();

  room.createPlayer();

});
