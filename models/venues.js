const { Model } = require('../');

module.exports = Model.object({
  general: Model.object({
    name: Model.string().max(240)
      .required()
      .label('Name')
      .description('Name der Spielstätte (max. 120 Zeichen)')
      .meta({ component: 'textinput' }),
    description: Model.string().max(600)
      .meta({ component: 'richtext' })
      .label('Beschreibung (max. 600 Zeichen)'),
  }).label('Generelle Infos')
    .meta({ inherit: 'institutions' }),
  institutions: Model.array()
    .meta({
      component: 'multirelation',
      labelKey: 'general.name',
    })
    .items(Model.string().meta({
      _mongoose: {
        type: 'ObjectId',
        ref: 'institutions',
        autopopulate: true,
      },
    })).required()
    .label('Institution/Freie Szene')
    .description('Eine Institution/Freie Szene wählen'),
  location: Model.object({
    coordinates: Model.array().items(Model.number().precision(10)),
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
  }).label('Adresse Spielstätte')
    .meta({ inherit: 'institutions' }),
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
  }).label('Webseite/Social Media')
    .meta({ inherit: 'institutions' }),
  media: Model.object({
    images: Model.array()
      .meta({ component: 'multiupload', type: 'image' })
      .max(8).items(Model.string().meta({
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
      .description('Max. 8 Bilder; Format: .png, .jpg, .tif, .svg; Auflösung minimum längste Seite: 1.024 px'),
    embeds: Model.array().max(8).meta({ component: 'multiform' }).items(Model.object({
      _id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
      id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
      createdAt: Model.date(),
      updatedAt: Model.date(),
      data: Model.string()
        .label('Data')
        .meta({ component: 'textinput' }),
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
      .description('Max. 8 Medium'),
  }).label('Medien').description('Bilder und eingebettete Filme'),
  venues: Model.array()
    .meta({ component: 'multirelation', labelKey: 'general.name' })
    .items(Model.string().meta({
      labelKey: 'general.name',
      _mongoose: {
        type: 'ObjectId',
        ref: 'venues',
        autopopulate: true,
      },
    }))
    .label('Sonstige Orte')
    .description('z.B. Shop, Café oder Restaurant, Bibliothek/Archiv'),
  accessibility: Model.object({
    wheelchair: Model.object({
      accessible: Model.string()
        .valid('yes', 'no', 'limited', 'unknown')
        .meta({ component: 'select' })
        .label('Generell zugänglich'),
      toilets: Model.bool().meta({ component: 'checkbox' }).label('WC zugänglich'),
      description: Model.string().max(100)
        .meta({ component: 'textarea' })
        .label('Sonstiges (max. 100 Zeichen)'),
    }).label('Menschen im Rollstuhl und Gehbehinderte'),
    blind: Model.object({
      germanLanguage: Model.bool().meta({ component: 'checkbox' }).label('Deutsche Sprache'),
      otherLanguages: Model.array().meta({ component: 'languageSelect' }).label('Weitere Sprachen'),
      easyLanguage: Model.bool().meta({ component: 'checkbox' }).label('Leichte Sprache'),
      braille: Model.bool().meta({ component: 'checkbox' }).label('Taktiles Leitsystem'),
      audioguide: Model.bool().meta({ component: 'checkbox' }).label('Audioguide'),
      description: Model.string().max(100)
        .meta({ component: 'textarea' })
        .label('Sonstiges (max. 100 Zeichen)'),
    }).label('Blinde und Sehbehinderte'),
    deaf: Model.object({
      germanLanguage: Model.bool().meta({ component: 'checkbox' }).label('Deutsche Sprache'),
      otherLanguages: Model.array().meta({ component: 'languageSelect' }).label('Weitere Sprachen'),
      easyLanguage: Model.bool().meta({ component: 'checkbox' }).label('Leichte Sprache'),
      subtitles: Model.bool().meta({ component: 'checkbox' }).label('Unter-/Übertitel'),
      signLanguage: Model.bool().meta({ component: 'checkbox' }).label('Gebärdensprache'),
      hearingAid: Model.bool().meta({ component: 'checkbox' }).label('Hörunterstützung'),
      videoguide: Model.bool().meta({ component: 'checkbox' }).label('Video Guide mit Gebärdensprache oder/und Texttranskription'),
      description: Model.string().max(100).label('Sonstiges (max. 100 Zeichen)').meta({ component: 'textarea' }),
    }).label('Gehörlose und Hörgeschädigte'),
  }).meta({ _mongoose: { _id: false } }).label('Barrierefreiheit'),
  openingHours: Model.object({
    hours: Model.string()
      .label('Öffnungszeiten')
      .meta({ component: 'openingHours' }),
    other: Model.string()
      .label('Sonstiges')
      .description('Bsp. Geschlossen bei Sanierung usw. Oder Kassenschluss und letzter Einlass')
      .meta({ component: 'textarea' }),
  }).label('Öffnungszeiten'),
  eventCount: Model.string().meta({
    _mongoose: {
      virtuals: true,
      ref: 'events',
      localField: '_id',
      foreignField: 'dates.venue',
      count: true,
      autopopulate: true,
    },
  }),
}).label('Spielstätte').description('Kulturorte oder Kulturspielstätte');
