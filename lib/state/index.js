
var Song = require('song')
  , defaults = require('model-defaults')
  , model = require('model')
  , setters = require('model-setters');

var State = module.exports = model('state')
  .use(defaults)
  .use(setters)
  .attr('song', { default: function () { return new Song(); }, set: function (song) {
    if(!(song instanceof Song)) song = new Song(song);

    return song;
  } })
  .attr('position', { default: 0 })
  .attr('time', { default: Firebase.ServerValue.TIMESTAMP });

State.prototype.toObject = function () {
  return {
    song: this.song().toObject(),
    position: this.position(),
    time: this.time()
  };
};

// Call the setter
State.on('construct', function(song) {
  song.song(song.song());
});

