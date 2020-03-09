const querystring = require('querystring');
const Wreck = require('@hapi/wreck');

const geocode = async ({ address, zipcode, city = 'Berlin' }) => {
  const { HERE_APP_ID, HERE_APP_CODE } = process.env;
  const query = querystring.stringify({
    app_id: HERE_APP_ID,
    app_code: HERE_APP_CODE,
    searchtext: `${address}, ${zipcode || ''} ${city}`,
    jsonattributes: 1,
  });

  const { payload } = await Wreck.get(`https://geocoder.api.here.com/6.2/geocode.json?${query}`);

  const { latitude, longitude } = JSON.parse(payload)
    .response
    .view[0]
    .result[0]
    .location
    .displayPosition;

  return {
    type: 'Point',
    coordinates: [longitude, latitude],
  };
};

module.exports = { geocode };
