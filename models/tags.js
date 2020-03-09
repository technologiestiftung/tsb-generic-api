const { Model } = require('../');

module.exports = Model.object({
  name: Model.string().meta({
    component: 'textinput',
  }).label('Name'),
  parent: Model.string().meta({
    component: 'tagchooser',
    _mongoose: {
      type: 'ObjectId',
      ref: 'tags',
      autopopulate: true,
    },
  }).label('Parent'),
  children: Model.array().items(Model.string().meta({
    _mongoose: {
      virtuals: true,
      ref: 'tags',
      localField: '_id',
      foreignField: 'parent',
      autopopulate: {
        maxDepth: 1,
      },
    },
  })),
}).label('Tag');
