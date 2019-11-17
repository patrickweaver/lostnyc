const router = require('express').Router();
const rp = require('request-promise');
const Sequelize = require('sequelize');
const sequelize = require('../../db/init.js');
const Place = sequelize.import('../../models/place.js');
const Memory = sequelize.import('../../models/memory.js');
const Flag = sequelize.import('../../models/flag.js');

const uuidv4 = require('uuid/v4');

// All Places:
router.get("/", async function(req, res) {
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
});

// Single Place with Memories:
router.get("/find/:placeId", async function(req, res) {
  res.json(await Place.findAll({
    limit: 1,
    where: {
      placeId: req.params.placeId
    },
    include: [
      {model: Memory, as: 'memories'}
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
  console.log(geolocationResponse);
  const location = geolocationResponse.results[0].geometry.location
  
  const place = {
    placeId: uuidv4(),
    lat: parseFloat(location.lat),
    long: parseFloat(location.lng),
    name: req.body.name,
    address: req.body.address,
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
router.post("/delete", async function(req, res) {
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

module.exports = router;