const Sequelize = require('sequelize');
const sequelize = require('./init.js');
const Place = sequelize.import('../models/place.js');
const User = sequelize.import('../models/user.js');

const uuidv4 = require('uuid/v4');

const hashPassword = require('../helpers/hashPassword.js');


module.exports = function() {
  sequelize.sync()
  .then(async function() {
    
    const pwHash = await hashPassword(process.env.ADMIN_PASSWORD);
    if (pwHash === 'error') {
      return;
    }
    
    return User.create({
      username: process.env.ADMIN_USERNAME,
      password: pwHash,
      permissions: 'superadmin'
    });
  })
  /*
  .then(function() {
    return Place.create({
      placeId: uuidv4(),
      lat: 40.7312736,
      long: -74.0053448,
      name: "bookbook",
      address: "266 Bleecker",
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
      address: "119 W 23rd St",
      city: "New York",
      state: "NY",
      zip: 10011,
      openYear: 1987,
      closeDate: new Date("2016-08-15"),
      cityCouncilDistrict: 3
    });
  });
  */
}


  