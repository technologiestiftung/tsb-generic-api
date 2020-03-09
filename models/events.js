const { Model } = require('../');
const date = require('./date');

module.exports = Model.object({
  general: Model.object({
    title: Model.string()
      .required()
      .max(240)
      .label('Titel DE')
      .description('Titel der Veranstaltung (max. 120 Zeichen)')
      .meta({ component: 'textinput' }),
    title_en: Model.string().max(240)
      .label('Title EN')
      .description('Event\'s title (max. 120 chars)')
      .meta({ component: 'textinput' }),
    subtitle: Model.string().max(120)
      .label('Untertitel DE')
      .description('Untertitel der Veranstaltung (max. 120 Zeichen)')
      .meta({ component: 'textinput' }),
    subtitle_en: Model.string().max(120)
      .label('Subline EN')
      .description('Event\'s subline (max. 120 chars)')
      .meta({ component: 'textinput' }),
    description: Model.string().max(600)
      .label('Beschreibungstext DE')
      .description('Beschreibungstext zur Veranstaltung (max. 600 Zeichen)')
      .meta({ component: 'richtext' }),
    description_en: Model.string().max(600)
      .label('Description EN')
      .description('Event\'s description (max. 600 chars)')
      .meta({ component: 'richtext' }),
    isHighlight: Model.boolean()
      .label('Highlight')
      .meta({ component: 'switch' }),
    isPermanent: Model.boolean()
      .label('unbegrenzte Dauer')
      .meta({ component: 'switch' }),
    isTimeLimited: Model.boolean()
      .label('zeitbegrenzte Dauer')
      .meta({ component: 'switch' }),
  }).label('Generelle Infos'),
  dates: Model.array()
    .items(date)
    .label('Veranstaltungstag / -dauer')
    .description('Datum und Uhrzeit')
    .meta({ component: 'calendar' }),
  media: Model.object({
    images: Model.array()
      .meta({
        component: 'multiupload',
        type: 'image',
      })
      .max(8)
      .items(Model.string().meta({
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
    embeds: Model.array().meta({ component: 'multiform' }).max(8).items(Model.object({
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
        .meta({ component: 'textinput' }),
    }))
      .label('Eingebettete Medien')
      .description('Max. 8 Medium'),
  }).label('Medien').description('Bilder und eingebettete Filme'),
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
  festival: Model.string().meta({
    component: 'relation',
    labelKey: 'general.title',
    _mongoose: {
      type: 'ObjectId',
      ref: 'events',
      autopopulate: {
        maxDepth: 1,
      },
    },
  }).label('Festival'),
  tags: Model.array().items(Model.string().meta({
    _mongoose: {
      type: 'ObjectId',
      ref: 'tags',
      autopopulate: true,
    },
  })).meta({ component: 'multitagchooser' }).label('Kategorien'),
  targetAudience: Model.array().items(Model.string().valid(
    'Erwachsene',
    'Familien',
    'Kinder',
    'Jugendliche',
    'Schüler & Lehrer',
    'Studierende',
    'Senioren',
  )).label('Zielgruppe')
    .meta({ component: 'checkboxgroup' }),
  price: Model.object({
    tickets: Model.array()
      .meta({ component: 'multiform' })
      .max(8)
      .items({
        _id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
        id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
        createdAt: Model.date(),
        updatedAt: Model.date(),
        name: Model.string().max(120)
          .label('Name')
          .description('z.B. Ermäßigt, Studenten, Early-bird, Vorkasse')
          .meta({ component: 'textinput' }),
        value: Model.number().precision(2).min(0)
          .label('Preis in €')
          .meta({ component: 'number' }),
        link: Model.string().uri()
          .label('Link zu Ticket')
          .meta({ component: 'url' }),
      })
      .label('Tickets'),
    free: Model.bool()
      .label('Kostenlos')
      .meta({ component: 'switch' }),
    priceCategory: Model.string().valid('kostenlos', 'bis 10 €', '11 bis 20 €', 'ab 21 €')
      .label('Preiskategorie')
      .meta({ component: 'select' }),
    priceInformation: Model.string()
      .max(240)
      .label('Preisinformation')
      .description('Zusätzliche Informationen zur Preiskategorie')
      .meta({ component: 'textinput' }),
  }).label('Preis'),
})
  .label('Veranstaltung')
  .meta({
    role: 'USER',
  });
