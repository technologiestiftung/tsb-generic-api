const { Model } = require('../');

module.exports = Model.object({
  name: Model.string()
    .meta({ component: 'textinput' })
    .label('Name'),
}).label('Kategorien');
