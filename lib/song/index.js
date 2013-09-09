
var reactive = require('reactive')
  , domify = require('domify')
  , Emitter = require('emitter')
  , songTemplate = require('./song.html');

function SongView (song) {

  this.model = song;
  this.el = domify(songTemplate);

  reactive(this.el, this.model, this);

  return this;
}

Emitter(SongView.prototype);

module.exports = SongView;
