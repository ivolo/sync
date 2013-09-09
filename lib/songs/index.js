var Collection = require('collection')
  , Model = require('song');

var Songs = module.exports = function (list, toAdd) {

  toAdd || (toAdd = []);

  list.empty();

  var collection = new Collection();

  collection.list = list;

  collection.toObject = toObject;

  collection.on('add', onAdd);

  collection.on('remove', onRemove);

  toAdd.forEach(function (model) {
    collection.add(model);
  });

  return collection;
};

function toObject () {
  var args = [].slice.call(arguments);

  return this.map(function(model) {

    if(typeof model.toObject === 'function') model = model.toObject.apply(model, args);

    return model;
  }).obj;
}

function onAdd (model) {
  if(!(model instanceof Model)) {

    var index = this.indexOf(model);

    model = new Model(model);

    this.models.splice(index, 1, model);
  }

  this.list.add(model);
}

function onRemove (model) {
  this.list.remove(model);
}