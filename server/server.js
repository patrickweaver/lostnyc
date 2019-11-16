// Set up server:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('server/public'));

const uuidv4 = require('uuid/v4');

// Initialize DB:
const sequelize = require('./db/init.js');

// Models
const Place = sequelize.import('./models/place.js');
const Memory = sequelize.import('./models/memory.js');

// Sync models to db, then create a place

sequelize.sync().then(function() {
  
  /*
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
  */
  

  
})//.then(function(place) {
  //console.log(place.get());
//});


/* - - - - - - - - - - - - */
/* Routes: */
/* - - - - - - - - - - - - */

const memories = require('./routes/api/memories.js');
app.use('/api/memories', memories);
const places = require('./routes/api/places.js');
app.use('/api/places', places);
const flags = require('./routes/api/flags.js');
app.use('/api/flags', flags);

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

