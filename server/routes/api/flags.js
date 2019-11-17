const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Flag = sequelize.import('../../models/flag.js');

const uuidv4 = require('uuid/v4');

// All Flags
router.get("/", async function(req, res) {
  res.json(await Flag.findAll());
});

// New Flag:
router.post("/new", async function(req, res) {
  const flag = {
    flagId: uuidv4(),
    body: req.body.body,
    placeId: req.body.placeId,
    memoryId: req.body.memoryId
  }
  
  const newFlag = await Flag.create(flag)
  res.json(newFlag.get());
});

module.exports = router;