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

module.exports = router;