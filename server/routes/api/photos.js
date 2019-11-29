const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Photo = sequelize.import('../../models/photo.js');
const uuidv4 = require('uuid/v4');

var multer = require('multer');
var memoryStorage = multer.memoryStorage();
var memoryUpload = multer({
	storage: memoryStorage,
	limits: {
		filesize: 10*1024*1024, // 10 Mb
		files: 1
	}
}).single('file');

const aws = require('../../helpers/aws.js');


// All Photos
router.get("/", async function(req, res) {
  
  try {
    const photos = await Photo.findAll({raw: true});

    var photosWithUrls = [];
    for (var i in photos) {
      const url = await aws.getSignedUrl(photos[i].photoId);
      photosWithUrls.push(Object.assign(photos[i], {url: url}));
    }
    
    res.json(photosWithUrls);
    
  } catch (err) {
    res.json({error: 'error getting photos'});
  }
});

// New Photo:
router.post('/new', memoryUpload, async function(req, res) {
  console.log("PLACEID:", req.body.placeId);
  var error = false;
  var errorMessage = "";
  const file = req.file;
  const fileExtArr = file.mimetype.split("/");

  //console.log("***** STORAGE:", settings.storage, settings.storage === 'aws')
  console.log("FILENAME:", file.originalname)

  const upload = {
    file: file,
    filetype: file.mimetype,
    fileExt: fileExtArr[fileExtArr.length - 1],
    filename: file.originalname,
    date: new Date,
    id: uuidv4()
  }

  try {
    const response = await aws.upload(upload);

    if (response.success && !response.error) {
      const photo = {
        photoId: upload.id,
        placeId: req.body.placeId
      }

      const newPhoto = await Photo.create(photo)
      const photoSuccess = newPhoto.get();
      const url = await aws.getSignedUrl(photoSuccess.photoId);
      const photoWithUrl = Object.assign(photoSuccess, {url: url})
      
      res.json(photoWithUrl);
      
    } else {
      res.status(500).send({error: 'Error'})
      return;
    }
    
  } catch (err) {
    res.status(500).send({error: 'Error'})
    return;
  }
});

// Approve photo:
router.post('/approve', async function (req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    const status = await Photo.update(
      {approved: true},
      {where: {
        photoId: req.body.photoId
      }}
    );
    
    if (status[0] === 1) {
      res.status(200).json({ updated: true });
    } else {
      res.status(400).json({deleted: false, error: "No such photo"});
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});

// Delete photo
router.post("/delete", async function(req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    const deletedStatus = await Photo.destroy({
      where: {
        photoId: req.body.photoId
      }
    });
    
    if (deletedStatus === 1) {
      res.status(200).json({ deleted: true });
      return;
    } else {
      res.status(400).json({deleted: false, error: "No such photo"})
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});


module.exports = router;