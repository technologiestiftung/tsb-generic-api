const querystring = require('querystring');
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const {
  before,
  after,
  describe,
  it,
} = exports.lab = Lab.script();

const { start } = require('../');

let server;
let db;
let ObjectId;

before(async () => {
  server = await start();

  const [connection] = server.mongoose.connections;
  ({ ObjectId } = server.mongoose.Types);
  ({ db } = connection);
});

describe('Event -', () => {
  describe('CRUD:', () => {
    const institution = {
      general: {
        name: 'Test orga',
      },
    };

    it('create an institution', async () => {
      const req = {
        method: 'POST',
        url: '/api/v2/institutions',
        payload: institution,
      };
      const res = await server.inject(req);
      const payload = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(payload).to.include({
        general: institution.general,
      });
      expect(payload).to.include(['_id']);
      institution._id = payload._id;
    });

    const venue = {
      general: {
        name: 'Test venue',
      },
    };

    it('create a venue', async () => {
      venue.institution = institution._id;

      const req = {
        method: 'POST',
        url: '/api/v2/venues',
        payload: venue,
      };
      const res = await server.inject(req);
      const payload = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(payload).to.include({
        general: venue.general,
      });
      expect(payload).to.include(['_id']);
      venue._id = payload._id;
    });

    const date = {
      date: {
        from: '2019-11-20',
        to: '2019-11-22',
      },
    };

    it('create a date', async () => {
      date.venue = venue._id;

      const req = {
        method: 'POST',
        url: '/api/v2/date',
        payload: date,
      };
      const res = await server.inject(req);
      const payload = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(payload).to.include(['_id', 'date']);
      expect(payload.date).to.include(['from', 'to']);
      date._id = payload._id;
    });

    const event = {
      general: {
        title: 'Test',
        description: 'Test event',
      },
    };

    it('create an event', async () => {
      event.institution = institution._id;
      event.dates = [date._id];

      const req = {
        method: 'POST',
        url: '/api/v2/events',
        payload: event,
      };
      const res = await server.inject(req);
      const payload = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(payload).to.include({
        general: event.general,
      });
      expect(payload).to.include(['_id']);
      event._id = payload._id;
    });

    it('get an event', async () => {
      const req = {
        method: 'GET',
        url: `/api/v2/events/${event._id}`,
      };
      const res = await server.inject(req);
      const payload = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(payload).to.include(['_id', 'institution', 'dates']);
      expect(payload).to.include({
        general: event.general,
      });
      expect(payload.institution).to.include({
        general: institution.general,
        _id: institution._id,
      });
      console.log('event:', JSON.stringify(payload));
    });

    it('get an event by title', async () => {
      const { title } = event.general;
      const req = {
        method: 'GET',
        url: `/api/v2/events?general=${querystring.escape((JSON.stringify({ title })))}`,
      };
      const res = await server.inject(req);
      const payload = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(payload).to.include(['_id', 'institution', 'dates']);
      expect(payload).to.include({
        general: event.general,
      });
      expect(payload.institution).to.include({
        general: institution.general,
        _id: institution._id,
      });
      console.log('event:', JSON.stringify(payload));
    });

    after(async () => {
      await db.collection('events').deleteOne({ _id: ObjectId(event._id) });
      await db.collection('institutions').deleteOne({ _id: ObjectId(institution._id) });
      await db.collection('venues').deleteOne({ _id: ObjectId(venue._id) });
      await db.collection('dates').deleteOne({ _id: ObjectId(date._id) });
      await server.stop();
    });
  });
});
