
var defaults = require('model-defaults')
  , firebase = require('model-firebase')(window.firebaseUrl + '/listeners')
  , setters = require('model-setters')
  , memoize = require('model-memoize')
  , model = require('model')
  , uid = require('uid')
  , State = require('state');


/**
 * Listener.
 */

var Listener = module.exports = model('listener')
  .use(defaults)
  .use(setters)
  .use(firebase)
  .use(memoize)
  .attr('id', { default : function () { return uid(); } })
  .attr('joined', { default : Firebase.ServerValue.TIMESTAMP })
  .attr('created', { default : function () { return new Date(); } })
  .attr('state', { default : function () {
    return new State();
  }, set: function (state) {

    if(!(state instanceof State)) state = new State(state);

    return state;
  } })
  .attr('name', { default : '' });

