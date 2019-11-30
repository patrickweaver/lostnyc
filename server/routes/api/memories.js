const router = require('express').Router();
const sequelize = require('../../db/init.js');
const Memory = sequelize.import('../../models/memory.js');
const Flag = sequelize.import('../../models/flag.js');

const checkLanguage = require('../../helpers/checkLanguage.js');

// All Memories:
router.get("/", async function(req, res) {
  res.json(await Memory.findAll({
    attributes: { include: [[sequelize.fn('COUNT', sequelize.col('flags.flagId')), 'flagsCount']] },
    include: [{model: Flag, as: 'flags', attributes: []}],
    group: ['memory.memoryId']
  }));
});


// Single Memory:

router.get("/find/:memoryId", async function(req, res) {
  try {
    
    const memoryArray = (await sequelize.query(`
      SELECT Memories.*,
      (SELECT COUNT(flagId) FROM Flags
      WHERE (Flags.memoryId = "${req.params.memoryId}"
      AND Flags.dismissed = false))
      AS flagsCount
      FROM Memories
      WHERE Memories.memoryId = "${req.params.memoryId}"
      LIMIT 1;
    `))[0];
    
    if (memoryArray[0].flagsCount > 0) {
      res.json({error: 'Flagged Memory'})
      return;
    }
    
    
    const place = (await sequelize.query(`
      SELECT Places.*
      FROM Places
      WHERE Places.placeId = "${memoryArray[0].placeId}"
      LIMIT 1;
    `))[0]

    place[0].memories = memoryArray;
    
    res.json(place)
  } catch (err) {
    console.log(err);
    res.json({error: "Invalid query"})
  }
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
  if (!req.body.body) {
    res.json({error: 'No Memory Body'})
  } else {
    const author = req.body.author ? req.body.author : 'Anonymous';

    const memory = {
      body: req.body.body,
      author: author,
      placeId: req.body.placeId
    }
    const newMemory = await Memory.create(memory);

    var savedMemory = newMemory.get();

    if (checkLanguage([savedMemory.body, savedMemory.author])) {
      const newFlag = await Flag.create({
        body: `** Inappropriate Content: ${savedMemory.body} by ${savedMemory.author}`,
        placeId: savedMemory.placeId,
        memoryId: savedMemory.memoryId
      })
      savedMemory.flags = [newFlag.get()];
    }

    res.json(newMemory.get());
  }
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
    } else {
      res.status(400).json({deleted: false, error: "No such memory"});
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});

module.exports = router;