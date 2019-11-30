const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Flag = sequelize.import('../../models/flag.js');
const Place = sequelize.import('../../models/place.js');
const Memory = sequelize.import('../../models/memory.js');
const connect = require('connect-ensure-login');


router.all('*', connect.ensureLoggedIn(), function(req, res, next) {
  next();
});


// List of Flag Types:
router.get('/', function(req, res) {
  res.render('admin/flags');
});

router.get('/memory', async function(req, res) {
  const flags = (await sequelize.query(`
    SELECT Flags.flagId AS flagId, Flags.memoryId AS memoryId,
    Flags.placeId AS flagPlaceId, Flags.body AS flagBody,
    Flags.createdAt AS flagCreatedAt, Memories.placeId as memoryPlaceId,
    Memories.body AS memoryBody, Memories.author AS memoryAuthor,
    Memories.createdAt AS memoryCreatedAt
    from Flags
    INNER JOIN Memories on Flags.memoryId = Memories.memoryId
  `))[0]
  
  res.render('admin/flags/memory', {
    flags: flags,
    apiKey: process.env.API_KEY
  })
});

router.get('/place', async function(req, res) {
  const flags = (await sequelize.query(`
    SELECT Flags.flagId AS flagId, Flags.placeId AS placeId,
    Flags.memoryId AS flagMemoryId, Flags.body AS flagBody,
    Flags.createdAt AS flagCreatedAt, Places.lat AS lat,
    Places.long AS long, Places.name AS name, Places.address AS address,
    Places.city as city, Places.state AS state, Places.zip AS zip,
    Places.openYear as openYear, Places.closeDate as closeDate,
    Places.cityCouncilDistrict as cityCouncilDistrict,
    Places.createdAt as placeCreatedAt
    from Flags
    INNER JOIN Places on Flags.placeId = Places.placeId
  `))[0]
  
  res.render('admin/flags/place', {
    flags: flags,
    apiKey: process.envv.API_KEY
  })
})

module.exports = router;