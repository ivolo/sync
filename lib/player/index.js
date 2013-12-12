var Audia = require('./audia')
	,	Oz = require('oz')
	,	playerHtml = require('./player.html')
	, Emitter = require('emitter')
	, offsetRef = new Firebase(window.firebaseUrl+ '/.info/serverTimeOffset');

var Player = module.exports = function () {

	var player = this;

	console.log("new audia");
	this.sound = new Audia();

	this.offset = 0;
	this.timer = null;
	this.startTime = 0;

	offsetRef.on('value', function(snap) {
		player.offset = snap.val();
		player.catchUp(player.startTime);
	});

	this.progress = new Progress();

	this.view = Oz(playerHtml);

	this.view.render(this);
};

Emitter(Player.prototype);

Player.prototype.play = function (song, startTime) {

	var player = this;

	if(this.song !== song && song) {

		this.sound.onload = function() {
			player.emit('loaded');
			player.catchUp(startTime);

			player.timer = setInterval(function () {
				player.progress.update((player.time() / player.length()) * 100);
				//player.catchUp(startTime);
			}, 500);
		};

		this.sound.onended = function () {
			player.end()
		};

		clearInterval(this.timer);

		console.log("setting song source to "+song);
		this.sound.src = song;

		this.song = song;

		//if(this.time() > this.length() && song) this.room.reset();
		
		this.catchUp(startTime);
	}

	this.view.update(this);

	return this;
};

Player.prototype.getTime = function (startTime) {

	var position = new Date().getTime() + this.offset - startTime;

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
	this.emit('end');
};

Player.prototype.catchUp = function (startTime) {
	var currentTime = this.getTime(startTime);
	this.starTime = startTime;

	console.log("catching up song to "+startTime);
	console.log("should be at "+currentTime);
	console.log("is at "+this.sound.currentTime);

	if(currentTime !== this.sound.currentTime && this.song) {
		if(currentTime < this.sound.duration) {
			this.sound.play(currentTime);
		} else {
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