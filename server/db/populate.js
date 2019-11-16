const Sequelize = require('sequelize');
const sequelize = require('./init.js');
const Place = sequelize.import('../models/place.js');

const uuidv4 = require('uuid/v4');

// Sync models to db, then create a place

module.exports = function() {
  
  sequelize.sync()
  .then(function() {
    return Place.create({
      placeId: uuidv4(),
      lat: 40.7312736,
      long: -74.0053448,
      name: "bookbook",
      streetNumber: "266",
      street: "Bleecker",
      city: "New York",
      state: "NY",
      zip: 10014,
      openYear: 2009,
      closeDate: new Date("2019-05-30"),
      cityCouncilDistrict: 3
    });
  })
  .then(function(place) {
    console.log(place.get());
    return Place.create({
      placeId: uuidv4(),
      lat: 40.7434485,
      long: -73.9934609,
      name: "Tekserve",
      streetNumber: "119",
      street: "W 23rd St",
      city: "New York",
      state: "NY",
      zip: 10011,
      openYear: 1987,
      closeDate: new Date("2016-08-15"),
      cityCouncilDistrict: 3
    });
  })
  .then(function(place) {
    console.log(place.get());
  });
  
}


  