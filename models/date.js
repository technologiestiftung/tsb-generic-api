const { Model } = require('../');

module.exports = Model.object({
  _id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
  id: Model.string().regex(/^[0-9a-fA-F]{24}$/),
  createdAt: Model.date(),
  updatedAt: Model.date(),
  date: Model.object({
    from: Model.date().required()
      .label('Von')
      .description('Veranstaltungsbeginn')
      .meta({ component: 'date' }),
    to: Model.date().required()
      .label('Bis')
      .description('Veranstaltungsende')
      .meta({ component: 'date' }),
  }).label('Veranstaltungstag / -dauer').description('Datum und Uhrzeit'),
  venue: Model.string()
    .meta({
      component: 'relation',
      labelKey: 'general.name',
      _mongoose: {
        type: 'ObjectId',
        ref: 'venues',
        autopopulate: true,
      },
    })
    .label('Veranstaltungsort')
    .description('Veranstaltungsort'),
  type: Model.array().items(Model.string().valid(
    'Führung',
    'Eröffnung',
    'Premiere',
    'Derniere',
    'Release',
    'Vernissage',
    'Finissage',
    'Uraufführung',
    'Wiederaufnahme',
  )).max(2).meta({ component: 'checkboxgroup' })
    .label('Typ')
    .description('Sondereigenschaften der Veranstaltung'),
  artist: Model.object({
    general: Model.object({
      name: Model.string().max(120)
        .label('Name')
        .description('Name des Künstler/Band (max. 120 Zeichen)')
        .meta({ component: 'textinput' }),
      description: Model.string().max(600)
        .label('Beschreibung')
        .description('Beschreibungstext des Künstler/Band (max. 600 Zeichen)')
        .meta({ component: 'richtext' }),
      description_en: Model.string().max(600)
        .label('Description')
        .description('Artist\'s description (max. 600 chars)')
        .meta({ component: 'richtext' }),
    }).label('generelle Infos zu Künstler/Band').description('Kontakten des Künstler/Band'),
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
    }).label('Webseite/Social Media').description('Kontakten des Künstler/Band'),
  }).label('Künstler/Band').description('Angaben zu der Künstler/Band'),
  accessibility: Model.object({
    wheelchair: Model.object({
      accessible: Model.string()
        .valid('yes', 'no', 'limited', 'unknown')
        .meta({ component: 'select' })
        .label('Generell zugänglich'),
      toilets: Model.bool()
        .meta({ component: 'checkbox' })
        .label('WC zugänglich'),
      description: Model.string().max(100)
        .meta({ component: 'textarea' })
        .label('Sonstiges (max. 100 Zeichen)'),
    }).label('Menschen im Rollstuhl und Gehbehinderte'),
    blind: Model.object({
      germanLanguage: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Deutsche Sprache'),
      otherLanguages: Model.array()
        .meta({ component: 'languageSelect' })
        .label('Weitere Sprachen'),
      easyLanguage: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Leichte Sprache'),
      braille: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Taktiles Leitsystem'),
      audioguide: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Audioguide'),
      description: Model.string().max(100)
        .meta({ component: 'textarea' })
        .label('Sonstiges (max. 100 Zeichen)'),
    }).label('Blinde und Sehbehinderte'),
    deaf: Model.object({
      germanLanguage: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Deutsche Sprache'),
      otherLanguages: Model.array()
        .meta({ component: 'languageSelect' })
        .label('Weitere Sprachen'),
      easyLanguage: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Leichte Sprache'),
      subtitles: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Unter-/Übertitel'),
      signLanguage: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Gebärdensprache'),
      hearingAid: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Hörunterstützung'),
      videoguide: Model.bool()
        .meta({ component: 'checkbox' })
        .label('Video Guide mit Gebärdensprache oder/und Texttranskription'),
      description: Model.string().max(100)
        .meta({ component: 'textarea' })
        .label('Sonstiges (max. 100 Zeichen)'),
    }).label('Gehörlose und Hörgeschädigte'),
  }).meta({ _mongoose: { _id: false } }).label('Barrierefreiheit').description('Barrierefreiheit für die Veranstaltung'),
}).label('Termin').description('Ein einzeltermin einer Veranstaltung');
