var Audia = require('./audia');

var offsetRef = new Firebase(window.firebaseUrl+ '/.info/serverTimeOffset');

var Player = module.exports = function (listener, room) {

	var player = this;

	this.sound = new Audia();

	this.sound.onended = function () {

		player.nextSong();
	};

	this.nowPlaying = null;
	this.room = room;
	this.listener = listener;
	this.offset = 0;

	offsetRef.on('value', function(snap) {
		player.offset = snap.val();
	});

	this.room.getPlaylist(function (err, playlist) {

		if(err) throw err;

		player.playlist = playlist;

		player.nextSong();
	});
};

Player.prototype.play = function (song, state) {

	var player = this;

	var position = state ? state.position() : 0;

	this.nowPlaying = song;

	this.sound.onload = function() {

		if(state) console.log(new Date().getTime(), player.offset, state.time());

		var offset = state ? new Date().getTime() + player.offset - state.time() : 0;

		offset = offset / 1000; // Audia times are in seconds, not milliseconds

		player.sound.play(position + offset);

		player.listener.state({
			song: song,
			position: position,
			time: Firebase.ServerValue.TIMESTAMP
		});

		player.listener.save();
	};

	this.sound.src = song.url();

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

			if(player.playlist.songs().length()) player.play(player.playlist.songs().first());
			else player.playlist.songs().once('add', function (song) {
				player.play(this.first());
			});
		} else {

			if(master.state().song) player.play(master.state().song(), master.state());

			master.on('update', function () {
				console.log("update");
				player.play(master.state().song(), master.state());
			});
		}
	});
};