const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Flag = sequelize.import('../../models/flag.js');

// All Flags
router.get("/", async function(req, res) {
  res.json(await Flag.findAll());
});

// New Flag:
router.post("/new", async function(req, res) {
  const flag = {
    body: req.body.body,
    placeId: req.body.placeId,
    memoryId: req.body.memoryId
  }
  
  const newFlag = await Flag.create(flag)
  res.json(newFlag.get());
});

// Dismiss flag:
router.post('/dismiss', async function (req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    const dismissStatus = await Flag.update(
      {dismissed: true},
      {where: {
        flagId: req.body.flagId
      }}
    );
    
    console.log("**")
    console.log(dismissStatus[0]);
    console.log(typeof dismissStatus[0]);
    console.log("**")
    if (dismissStatus[0] === 1) {
      res.status(200).json({ updated: true });
    } else {
      res.status(400).json({deleted: false, error: "No such flag"});
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});

/*
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
*/

module.exports = router;