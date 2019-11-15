// Set up server:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('server/public'));

// Used for creating object ids:
const uuidv4 = require('uuid/v4');

/* - - - - - - - - - - - - */
/* DB */
/* - - - - - - - - - - - - */

// Initialize DB:
const Sequelize = require('sequelize');
const sequelize = new Sequelize('db', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: './.data/sqlite.db'
});

// Models
const Place = sequelize.import(__dirname + '/models/place.js');
const Memory = sequelize.import(__dirname + '/models/memory.js');

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

// All Places:
app.get("/api/places", async function(req, res) {
  res.json(await Place.findAll());
});

// New Place:
app.post("/api/places/new", async function(req, res) {
  
  const place = {
    placeId: uuidv4(),
    lat: parseFloat(req.body.lat),
    long: parseFloat(req.body.long),
    name: req.body.name,
    streetNumber: req.body.streetNumber,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    openYear: req.body.openYear,
    closeDate: new Date(req.body.closeDate),
    cityCouncilDistrict: req.body.cityCouncilDistrict
  }
  
  const newPlace = await Place.create(place)
  
  console.log("New Place:", newPlace.get())
  res.json(newPlace.get());
});

// Delete Place:
app.post("/api/places/delete", async function(req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    const deletedStatus = await Place.destroy({
      where: {
        placeId: req.body.placeId
      }
    });
    
    if (deletedStatus === 1) {
      res.status(200).json({ deleted: true });
      return;
    } else {
      res.status(400).json({deleted: false, error: "No such place"})
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});





// All Memories:
app.get("/api/memories", async function(req, res) {
  res.json(await Memory.findAll());
});

// Memories from one place:
app.get("/api/memories/:placeId", async function(req, res) {
  res.json(await Memory.findAll({
    where: {
      placeId: req.params.placeId
    }
  }))
})


// New Memory:
app.all("/api/memories/new", function(req, res) {
  console.log('lat:', req.body.lat);
  console.log('long:', req.body.long);
  
  // Save to DB
  
  res.status(200).json({ id: 1234 })
});

// Delete Memory:
app.post("/api/memories/delete", async function(req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    const deletedStatus = await Memory.destroy({
      where: {
        memoryId: req.body.memoryId
      }
    });
    if (deletedStatus === 1) {
      res.status(200).json({ deleted: true });
      return;
    } else {
      res.status(400).json({deleted: false, error: "No such memory"})
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

