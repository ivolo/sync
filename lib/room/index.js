
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/rooms')
  , memoize = require('model-memoize')
  , async = require('async')
  , model = require('model')
  , uid = require('uid');


/**
 * Room.
 */

var Room = module.exports = model('room')
  .use(defaults)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('created', { default : function () { return new Date(); } })
  .attr('listeners', { default : {} })
  .attr('title', { default : '' });


Room.prototype.addListener = function (listener) {
  var listeners = this.listeners();
  var id = listener.id();
  listeners[id] = listener;
  this.listeners(listeners);
  this.save();
};


Room.prototype.master = function (callback) {
  var oldest;
  async.each(this.listeners(), function (id, cb) {
    Listener.get(id, function (err, listener) {
      if (!oldest) oldest = listener;
      if (listener.joined() > oldest.joined()) oldest = listener;
      return cb(err);
    });
  }, function (err) {
    return callback(err, oldest);
  });
};