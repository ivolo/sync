
var bind = require('event').bind
  , body = document.body
  , classes = require('classes')
  , Room = require('room')
  , Listener = require('listener')
  , Router = require('router')
  , uid = require('uid');



/**
 * Router.
 */

var router = new Router();


/**
 * Home route.
 */

router.on('/', function (next) {
  router.go('/' + uid());
});


/**
 * Create new listener.
 */

var listener = new Listener();

/**
 * Document route.
 */

router.on('/:id', function (context, next) {
  body.className = 'loading ss-loading';
  Room.get(context.params.id, function (err, room) {
    body.className = '';

    if (err) throw err;

    if (!room) {
      room = new Room({id: context.params.id});
      room.save();
    }

    listener.listenTo(room);

    window.analytics.track('Viewed Room', { id: room.primary() });
  });
});


/**
 * Listen.
 */

router.listen();