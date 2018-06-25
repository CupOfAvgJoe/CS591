const express = require('express');
const router = express.Router();
const auth = require('../config/auth.json');
const request = require('request');  //used for geolocation
const rpl = require('request-promise-lite'); //used for waterfalling
const async = require('async');

router.post('/', function(req, res, next) {
    let address = {
        street: `${req.body.street}`,
        city: `${req.body.city}`,
        state: `${req.body.state}`,
        postalcode: `${req.body.postalcode}`,
    };

    let fsParam = {
        url: 'https://api.foursquare.com/v2/venues/explore',
        qs: {
            client_id: `${auth.Foursquare.CLIENT_ID}`,
            client_secret: `${auth.Foursquare.CLIENT_SECRET}`,
            section: `${req.body.theme}`,
            openNow: "1",
            limit: "10",
            v: "20180622"
        }
    };

    console.log(`starting waterfall`);

    async.waterfall([
        async.constant(address),
        getStart,
        async.apply(getRecommendations, fsParam),
        getUberPrices,
        getLyftPrices
    ],
    function final(err, result) {
       if(err) {
           res.json({message: "error"})
       }
       else {
           res.json(result)
       }
    });

});

const getStart = function(address, callback) {
    let start = {};

    const options = {
        qs:
            {
                key: `${auth.LOCATION_IQ.API_TOKEN}`,
                street: `${address.street}`,
                city: `${address.city}`,
                state: `${address.state}`,
                postalcode: `${address.postalcode}`,
                format: 'json'
            },
        json: true
    };

    let getCoordinate = function(options) {
        return new Promise(function(resolve, reject) {
            rpl.get('https://us1.locationiq.org/v1/search.php', options)
                .then(function (response) {
                    start.lat = response[0].lat;
                    start.lon = response[0].lon;
                    resolve();
            })
        })
    };

    Promise.all([getCoordinate(options)])
        .then(function() {
            callback(null, start);
        })
};

const getRecommendations = function(fsParam, start, callback) {
    fsParam.qs.ll = `${start.lat},${start.lon}`;

    let recommendations = [];

    request(fsParam, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        body.response.groups[0].items.forEach(function(item){
            let place = {
                name: item.venue.name,
                location: {
                    lat: item.venue.location.lat,
                    lon: item.venue.location.lng,
                    address: item.venue.location.formattedAddress
                },
                category: item.venue.categories[0].name
            };
            recommendations.push(place)
        });
        callback(null, recommendations, start)
    });
};

const getUberPrices = function(recommendations, start, callback) {
    return new Promise(function (resolve, reject) {
        let options = {
            method: 'GET',
            url: 'https://api.uber.com/v1.2/estimates/price',
            qs:
                {
                    start_latitude: `${start.lat}`,
                    start_longitude: `${start.lon}`
                },
            headers:
                {Authorization: 'Token ' + `${auth.UBER.SERVER_TOKEN}`}
        };

        let getPrices = function (place) {
            return new Promise(function (resolve, reject) {

                options.qs.end_latitude = `${place.location.lat}`;
                options.qs.end_longitude = `${place.location.lon}`;

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    let estimates = [];
                    let data = JSON.parse(body);

                    data.prices.forEach(function (price) {
                        let estimate = {
                            type: price.display_name,
                            estimate: price.estimate
                        };
                        estimates.push(estimate)
                    });
                    place.Uber_estimates = estimates;
                    resolve();
                });
            })
        };

        let recommendationEstimates = recommendations.map(getPrices);

        Promise.all(recommendationEstimates)
            .then(function() {
                callback(null, recommendations, start)
            })
            .catch(function(err) {
                console.log(err)
            })
    });
};

const getLyftPrices = function(recommendations, start, callback) {
    return new Promise(function (resolve, reject) {
        let options = {
            method: 'GET',
            url: 'https://api.lyft.com/v1/cost',
            qs:
                {
                    start_lat: `${start.lat}`,
                    start_lng: `${start.lon}`
                },
            headers:
                {Authorization: 'bearer ' + `${auth.LYFT.CLIENT_TOKEN}`}
        };

        let getPrices = function (place) {
            return new Promise(function (resolve, reject) {

                options.qs.end_lat = `${place.location.lat}`;
                options.qs.end_lng = `${place.location.lon}`;

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    let estimates = [];
                    let data = JSON.parse(body);

                    data.cost_estimates.forEach(function (price) {
                        let estimate = {
                            type: price.ride_type,
                            estimate: `$${(price.estimated_cost_cents_min)/100.0}-$${(price.estimated_cost_cents_max)/100.0}`
                        };
                        estimates.push(estimate)
                    });
                    place.Lyft_estimates = estimates;
                    resolve();
                });
            })
        };

        let recommendationEstimates = recommendations.map(getPrices);

        Promise.all(recommendationEstimates)
            .then(function() {
                callback(null, recommendations, start)
            })
            .catch(function(err) {
                console.log(err)
            })
    });
};


module.exports = router;
