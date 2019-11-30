const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Flag = sequelize.import('../../models/flag.js');
const Place = sequelize.import('../../models/place.js');
const Memory = sequelize.import('../../models/memory.js');
const connect = require('connect-ensure-login');

const getPhotosWithUrls = require('../../helpers/getPhotosWithUrls.js');


router.all('*', connect.ensureLoggedIn(), function(req, res, next) {
  next();
});


// List of Flag Types:
router.get('/', function(req, res) {
  res.render('admin/photos');
});

router.get('/to-approve', async function(req, res) {
  const offset = (req.query.page - 1) * 10 || 0;
  
  const photos = (await sequelize.query(`
    SELECT Photos.*, Places.name as placeName,
    Places.address as placeAddress
    from Photos
    INNER JOIN Places on Photos.placeId = Places.placeId
    WHERE approved = 0
    ORDER BY Photos.createdAt DESC
    LIMIT 10
    OFFSET ${offset}
  `))[0]
  
  const photosWithUrls = await getPhotosWithUrls(photos);
  
  res.render('admin/photos/list', {
    photos: photosWithUrls,
    apiKey: process.env.API_KEY,
    page: req.query.page || 1,
    route: 'to-approve'
  })
});

router.get('/place/:placeId', async function(req, res) {
  const photos = (await sequelize.query(`
    SELECT Photos.*, Places.name as placeName,
    Places.address as placeAddress
    from Photos
    INNER JOIN Places on Photos.placeId = Places.placeId
    WHERE Photos.placeId = "${req.params.placeId}"
  `))[0]
  
  const photosWithUrls = await getPhotosWithUrls(photos);
  
  res.render('admin/photos/list', {
    place: photosWithUrls[0] ? photosWithUrls[0].placeName : 'No Photos for that place',
    photos: photosWithUrls,
    apiKey: process.env.API_KEY
  })
});

module.exports = router;