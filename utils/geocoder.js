const NodeGeocoder = require('node-geocoder');

const options = {
    // provider: process.env.GEOCODER_PROVIDER,
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: "3v1wG03pA1fHwyxHbWDpRUbNWlK9CN8M",
    formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
