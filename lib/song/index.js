
var defaults = require('model-defaults')
  , model = require('model')
  ,	reactive = require('reactive')
  , domify = require('domify')
  , uid = require('uid')
  , songTemplate = require('./song.html');

var Song = module.exports = model('song')
	.use(defaults)
	.attr('id', { default: function () { return uid(); } })
	.attr('url', { default: '' })
	.attr('title', { default: '' });

Song.prototype.toObject = function() {
	return this.attrs;
};

Song.View = function(model) {

	this.model = model;

	this.el = domify(songTemplate);

	reactive(this.el, this.model, this);

	return this;
};

module.exports = Song;
