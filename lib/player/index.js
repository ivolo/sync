var Audia = require('./audia')
	,	Oz = require('oz')
	,	playerHtml = require('./player.html')
	, Emitter = require('emitter')
	, getOffset = require('ntp').offset;

var Player = module.exports = function () {

	var player = this;

	this.sound = new Audia();

	this.offset = 0;
	this.timer = null;
	this.startTime = 0;
	this.loaded = false;

	getOffset('/ntp', function (err, offset) {
		if(err) return console.error(err);
		player.offset = offset;
	});

	this.progress = new Progress();

	this.view = Oz(playerHtml);

	this.view.render(this);
};

Emitter(Player.prototype);

Player.prototype.play = function (song, startTime) {

	var player = this;

	if(this.song !== song && song) {

		clearInterval(this.timer);

		this.sound.onload = function() {
			this.loaded = true;
			player.emit('loaded');
			player.catchUp(startTime);

			player.timer = setInterval(function () {
				player.progress.update((player.time() / player.length()) * 100);
				//player.catchUp(startTime);
			}, 500);
		};

		this.sound.onended = function () {
			player.end();
		};

		this.sound.src = song;

		this.song = song;

		//if(this.time() > this.length() && song) this.room.reset();
		
		this.catchUp(startTime);
	}

	this.view.update(this);

	return this;
};

Player.prototype.getTime = function (serverStartTime) {

	var clientStartTime = serverStartTime - this.offset
		,	clientCurrentTime = new Date().getTime()
		, position = clientCurrentTime - clientStartTime;

	return (position || 0) / 1000; // Audia times are in seconds, not milliseconds
};

Player.prototype.time = function () {
	return this.sound.currentTime || 0;
};

Player.prototype.length = function () {
	return this.sound.duration || 0;
};

Player.prototype.end = function () {
	this.song = null;
	this.loaded = false;
	this.sound.onload = function () {};
	this.sound.onended = function () {};
	this.sound.stop();
	this.emit('end');
	clearInterval(this.timer);
	this.view.update(this);
};

Player.prototype.catchUp = function (startTime) {
	var currentTime = this.getTime(startTime || this.startTime);
	if(startTime) this.startTime = startTime;

	if(currentTime !== this.sound.currentTime && this.song) {
		if(currentTime < this.sound.duration) {
			this.sound.play(currentTime);
		} else if(this.loaded) {
			this.end();
		}
	}
};


function Progress () {
	this.view = Oz('<div class="progress"><div class="progress-bar" style="width:0"></div></div>');
	this.el = this.view.render().children[0];
	this.percent = 0;
}

Progress.prototype.update = function (percent) {
	percent = Math.round(percent * 10) / 10;
	if(this.percent !== percent) {
		this.percent = percent;
		this.el.children[0].style.width = this.percent + '%';
	}
};