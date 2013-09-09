var Audia = require('./audia');

var Player = module.exports = function (listener, room) {

	var player = this;

	this.room = room;
	this.listener = listener;

	this.room.getPlaylist(function(err, playlist) {

		if(err) throw err;

		player.playlist = playlist;

		room.master(function(err, master) {

			if(err) throw err;

			// start playing at will
			if(master === player.listener) {

				if(playlist.songs.length()) player.play(playlist.songs[0]);
				else playlist.songs.once('add', function (song) {
					player.play(song);
				});
			}
		});
	});
};