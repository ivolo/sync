
var defaults = require('model-defaults')
  , setters = require('model-setters')
  , model = require('model')
  , uid = require('uid')
  , Player = require('player');


/**
 * Listener.
 */

var Listener = module.exports = model('listener')
  .use(defaults)
  .use(setters)
  .attr('id', { default : function () { return uid(); } })
  .attr('joined', { default : Firebase.ServerValue.TIMESTAMP })
  .attr('created', { default : function () { return new Date(); } })
  .attr('name', { default : '' })
  .attr('room' , {});

Listener.prototype.listenTo = function (room) {
  this.room(room.id());
  this._room = room;
  if(!this.player) this.player = new Player(room);
};

