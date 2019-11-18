const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Memory = sequelize.import('../../models/memory.js');
const Flag = sequelize.import('../../models/flag.js');

const checkLanguage = require('../../helpers/checkLanguage.js');

const uuidv4 = require('uuid/v4');

// All Memories:
router.get("/", async function(req, res) {
  res.json(await Memory.findAll({
    attributes: { include: [[sequelize.fn('COUNT', sequelize.col('flags.flagId')), 'flagsCount']] },
    include: [{model: Flag, as: 'flags', attributes: []}],
    group: ['memory.memoryId']
  }));
});

// Memories from one place:
router.get("/:placeId", async function(req, res) {
  res.json(await Memory.findAll({
    where: {
      placeId: req.params.placeId
    }
  }))
})


// New Memory:
router.all("/new", async function(req, res) {
  const memory = {
    memoryId: uuidv4(),
    body: req.body.body,
    author: req.body.author,
    placeId: req.body.placeId
  }
  const newMemory = await Memory.create(memory);
  
  var savedMemory = newMemory.get();
  
  if (checkLanguage([savedMemory.body, savedMemory.author])) {
    const newFlag = await Flag.create({
      flagId: uuidv4(),
      body: `Inappropriate Content: ${savedMemory.body} by ${savedMemory.author}`,
      placeId: savedMemory.placeId,
      memoryId: savedMemory.memoryId
    })
    savedMemory.flags = [newFlag.get()];
  }
  
  res.json(newMemory.get());
});

// Delete Memory:
router.post("/delete", async function(req, res) {
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

module.exports = router;