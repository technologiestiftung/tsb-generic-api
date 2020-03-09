const { Model } = require('../');

module.exports = Model.object({
  general: Model.object({
    name: Model.string().max(120)
      .required()
      .label('Name')
      .description('Titel der Veranstaltung (max. 120 Zeichen)')
      .meta({ component: 'textinput' }),
    description: Model.string().max(600)
      .label('Beschreibung')
      .description('Beschreibung (max. 600 Zeichen)')
      .meta({ component: 'richtext' }),
  }).label('Generelle Infos'),
  media: Model.object({
    logo: Model.string().meta({
      component: 'upload',
      type: 'logo',
      _mongoose: {
        type: 'ObjectId',
        ref: 'File',
        autopopulate: {
          match: { type: 'logo' },
          maxDepth: 1,
        },
      },
    })
      .label('Logo'),
    images: Model.array().meta({
      component: 'multiupload',
      type: 'image',
    }).max(5).items(Model.string().meta({
      _mongoose: {
        type: 'ObjectId',
        ref: 'File',
        autopopulate: {
          match: { type: 'image' },
          maxDepth: 1,
        },
      },
    }))
      .label('Bilder')
      .description('Max. 5 Bilder; Format: .png, .jpg, .tif, .svg; Auflösung minimum längste Seite: 1.024 px'),
    embeds: Model.array().meta({ component: 'multiform' }).max(1).items(Model.object({
      _id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
      id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
      createdAt: Model.date(),
      updatedAt: Model.date(),
      data: Model.string()
        .label('Data')
        .meta({ component: 'textarea' }),
      description: Model.string().max(100)
        .label('Beschreibung')
        .description('Beschreibungstext (max. 100 Zeichen)')
        .meta({ component: 'textarea' }),
      source: Model.string().max(100)
        .label('Quelle')
        .description('Quelle und Copyrightangaben (max. 100 Zeichen)')
        .meta({ component: 'textarea' }),
    }))
      .label('Eingebettete Medien')
      .description('Max. 1 Medium'),
  }).label('Medien'),
  location: Model.object({
    coordinates: Model.array().items(Model.number().precision(10)).length(2),
    type: Model.string().valid('Point'),
  }).meta({ component: 'map', type: 'geo' }).label('Koordinaten'),
  address: Model.object({
    street: Model.string()
      .label('Strasse')
      .meta({ component: 'textinput' }),
    number: Model.string().max(10)
      .label('Hausnr.')
      .meta({ component: 'textinput' }),
    zipcode: Model.string().min(3).max(10)
      .label('PLZ')
      .meta({ component: 'textinput' }),
    city: Model.string().max(100)
      .label('Ort')
      .meta({ component: 'textinput' }),
    telephone: Model.string().max(30)
      .label('Telefonnummer')
      .meta({ component: 'phone' }),
    email: Model.string().email()
      .label('E-Mail')
      .meta({ component: 'email' }),
  }).label('Adresse der Institution').meta({ inherit: 'venues' }),
  social: Model.object({
    website: Model.string().uri()
      .label('Webseite')
      .description('URL der Webseite (beginnt mit http:// oder https://)')
      .meta({ component: 'url' }),
    facebook: Model.string().uri()
      .label('Facebook')
      .description('Facebook Seite')
      .meta({ component: 'url' }),
    twitter: Model.string().uri()
      .label('Twitter')
      .description('Twitter Seite')
      .meta({ component: 'url' }),
    instagram: Model.string().uri()
      .label('Instagram')
      .description('Instagram Profil')
      .meta({ component: 'url' }),
    youtube: Model.string().uri()
      .label('Youtube')
      .description('Youtube Profil')
      .meta({ component: 'url' }),
    hashtag: Model.string().regex(/^#[a-zA-Z-_.äöüÄÖÜß]+$/)
      .label('Hashtag')
      .description('Hashtag (beginnt mit #)')
      .meta({ component: 'textinput' }),
  }).label('Website/Social Media'),
  type: Model.string()
    .required()
    .valid('Institution', 'Freie Szene')
    .default('Institution')
    .label('Typ')
    .description('Institution wie z.B. Verein, VHS, Musikschule, Galerie, Museum oder Freie Szene für z.B. Künstlergruppen')
    .meta({ component: 'select' }),
  stateFunding: Model.boolean()
    .label('Landesgefördert')
    .meta({ component: 'checkbox' }),
  categories: Model.array().items(Model.string()
    .meta({
      _mongoose: {
        type: 'ObjectId',
        ref: 'categories',
        autopopulate: true,
      },
    }))
    .meta({ component: 'multirelation', labelKey: 'name' })
    .label('Kategorie'),
}).label('Institution');
