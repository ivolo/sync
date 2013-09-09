var Audia = require('./audia');

var Player = module.exports = function (listener, room) {

	var player = this;

	this.sound = new Audia();

	this.sound.onended = function () {

		player.nextSong();
	};

	this.nowPlaying = null;
	this.room = room;
	this.listener = listener;

	this.room.getPlaylist(function (err, playlist) {

		if(err) throw err;

		player.playlist = playlist;

		player.nextSong();
	});
};

Player.prototype.play = function (song) {

	var player = this;

	this.nowPlaying = song;

	this.sound.onload = function() {
		player.sound.play(0);
	};

	this.sound.src = song.url;

	return this;
};

Player.prototype.nextSong = function () {

	var player = this;

	var song = this.nowPlaying;

	if(song) {
		this.playlist.songs.remove(song);
		this.playlist.songs.add(song);
	}

	this.room.master(function (err, master) {

		if(err) throw err;

		if(master.id() === player.listener.id()) {

			console.log("we are the master")

			if(player.playlist.songs().length()) player.play(player.playlist.songs()[0]);
			else player.playlist.songs().once('add', function (song) {

				player.play(song);
			});
		}
	});
};