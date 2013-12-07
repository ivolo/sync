var Audia = require('./audia');

var offsetRef = new Firebase(window.firebaseUrl+ '/.info/serverTimeOffset');

var Player = module.exports = function (room) {

	var player = this;

	console.log("new audia");
	this.sound = new Audia();

	this.room = room;
	this.room.player = this;
	this.offset = 0;
	this.timer = null;

	offsetRef.on('value', function(snap) {
		player.offset = snap.val();
	});

	if(this.room.song()) {
		this.play(this.room.song(), this.room.startTime());
	}

	this.room.on('change song', function (song) {
		player.play(song, player.room.startTime());
	});

	this.room.on('change startTime', function (startTime) {
		player.catchUp();
	});
};

Player.prototype.play = function (song, startTime) {

	var player = this;

	this.sound.onload = function() {
		player.sound.stop();
		player.catchUp();
		player.sound.play();

		player.timer = setInterval(function () {
			player.room.progress.update((player.time() / player.length()) * 100);
			player.catchUp();
		}, 500);
	};

	this.sound.onended = function () {
		player.room.reset();
	};

	clearInterval(this.timer);

	if(song) this.sound.src = song;

	//if(this.time() > this.length() && song) this.room.reset();

	return this;
};

Player.prototype.getTime = function (startTime) {
	startTime = startTime || this.room.startTime();

	var position = new Date().getTime() + this.offset - startTime;

	return (position || 0) / 1000; // Audia times are in seconds, not milliseconds
};

Player.prototype.time = function () {
	return this.sound.currentTime || 0;
};

Player.prototype.length = function () {
	return this.sound.duration || 0;
};

Player.prototype.catchUp = function () {
	var currentTime = this.getTime();

	if(currentTime !== this.sound.currentTime) {
		this.sound.currentTime = currentTime;
	}
};