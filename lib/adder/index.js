var dom = require('dom')
  , domReady = require('domready')
  , formTemplate = require('./form.html');


var adder = module.exports = function(playlist) {

  var form = dom(formTemplate);

  form.on('submit', function(e) {
    e.preventDefault();

    var urlInput = form.find('[name="url"]');

    playlist.songs().add({
      url: urlInput.value()
    });

    playlist.save();

    urlInput.value("");
  });

  domReady(function() {
    dom(window.document.body).prepend(form);
  });
};