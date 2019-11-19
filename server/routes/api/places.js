const router = require('express').Router();
const rp = require('request-promise');
const Sequelize = require('sequelize');
const sequelize = require('../../db/init.js');
const Place = sequelize.import('../../models/place.js');
const Memory = sequelize.import('../../models/memory.js');
const Flag = sequelize.import('../../models/flag.js');

const checkLanguage = require('../../helpers/checkLanguage.js');

// All Places:
router.get("/", async function(req, res) {
  /*
  res.json(await Place.findAll({
    attributes: { include: [
      [sequelize.fn('COUNT', sequelize.col('flags.flagId')), 'flagsCount'],
      [sequelize.fn('COUNT', sequelize.col('memories.memoryId')), 'memoriesCount']
    ]},
    include: [
      {model: Flag, as: 'flags', attributes: []},
      {model: Memory, as: 'memories', attributes: []}
    ],
    group: ['place.placeId']
  }));
  */
  
  
  res.json((await sequelize.query(`
    SELECT Places.*,
    (SELECT COUNT(flagId) FROM Flags
    WHERE (Flags.placeId = Places.placeId
    AND Flags.dismissed = false))
    AS flagsCount,
    (SELECT COUNT(memoryId) FROM Memories
    WHERE Memories.placeId = Places.placeId)
    AS memoriesCount
    FROM Places
    LEFT JOIN Flags on Places.placeId = Flags.placeId
    LEFT JOIN Memories on Places.placeId = Memories.placeId;
  `))[0])
  
});

// Single Place with Memories:
router.get("/find/:placeId", async function(req, res) {
  res.json(await Place.findAll({
    limit: 1,
    where: {
      placeId: req.params.placeId
    },
    include: [
      {model: Memory, as: 'memories'},
      {model: Flag, as: 'flags'}
    ]
  }));
})

// New Place:
router.post("/new", async function(req, res) {
  
  const geolocationOptions = {
    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
    qs: {
      address: `${req.body.address}+${req.body.city}+${req.body.state}+${req.body.zip}`,
      key: process.env.GCP_API_KEY
    }
  }
  const geolocationResponse = JSON.parse(await rp(geolocationOptions));
  const location = geolocationResponse.results[0].geometry.location;
  
  var flagForDefaultLocation = false;
  const locationLat = parseFloat(location.lat);
  const locationLong = parseFloat(location.lng);
  if (
    locationLat > process.env.DEFAULT_LAT_MIN
    && locationLat < process.env.DEFAULT_LAT_MAX
    && locationLong > process.env.DEFAULT_LONG_MIN
    && locationLong < process.env.DEFAULT_LONG_MAX
  ) {
    flagForDefaultLocation = true;
  }
  
  const place = {
    lat: parseFloat(locationLat),
    long: parseFloat(locationLong),
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    openYear: req.body.openYear,
    closeDate: new Date(req.body.closeDate),
    cityCouncilDistrict: req.body.cityCouncilDistrict,
    category: req.body.category
  }
  
  var savedPlace;
  try {
    const newPlace = await Place.create(place)
    savedPlace = newPlace.get();

    
    if (
      checkLanguage([savedPlace.name, savedPlace.address, savedPlace.city, savedPlace.state, savedPlace.zip, savedPlace.yearOpened, savedPlace.category])
      || flagForDefaultLocation
    ) {
      
      var flagReason;
      if (flagForDefaultLocation) {
        flagReason = 'Default Location'
      } else {
        flagReason = 'Inappropriate Content'
      }
      
      const newFlag = await Flag.create({
        body: `** ${flagReason}: ${savedPlace.name} - ${savedPlace.address} - ${savedPlace.city} - ${savedPlace.state} - ${savedPlace.zip} - ${savedPlace.yearOpened}`,
        placeId: savedPlace.placeId
      })
      savedPlace.flags = [newFlag.get()];
      
      savedPlace.flags[0].reason = flagReason;
    }
  } catch (err) {
    
    console.log("ERROR:");
    console.log(err);
    
    savedPlace = {error: "Place not saved"}
  }
  
  res.json(savedPlace);
});

// Delete Place:
router.post("/delete", async function(req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    const deletedStatus = await Place.destroy({
      where: {
        placeId: req.body.placeId
      }
    });
    
    if (deletedStatus === 1) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(400).json({deleted: false, error: "No such place"});
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});

module.exports = router;