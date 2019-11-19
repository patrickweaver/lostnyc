const router = require('express').Router();
const sequelize = require('../../db/init.js');
const User = sequelize.import('../../models/user.js');
const hashPassword = require('../../helpers/hashPassword.js');

// All Flags
router.get("/", async function(req, res) {
  res.json(await User.findAll());
});

// New Flag:
router.post("/new", async function(req, res) {
  
  const pwHash = hashPassword(req.body.password);
    if (pwHash === 'error') {
      res.json({error: 'Server Error'});
    }
  
  const user = {
    username: req.body.username,
    permissions: req.body.permissions,
    password: pwHash
  }
  
  const newUser = await User.create(user)
  res.json(newUser.get());
});

// Delete User:
router.post("/delete", async function(req, res) {
  if (process.env.API_KEY && req.body.apiKey === process.env.API_KEY) {
    var deletedStatus = 0;
    try {
      deletedStatus = await User.destroy({
        where: {
          userId: req.body.userId
        }
      }); 
    } catch(err) {
      console.log("**", err);
      return err;
    }
    if (deletedStatus === 1) {
      res.status(200).json({ deleted: true });
      return;
    } else {
      res.status(400).json({deleted: false, error: "No such user"})
    }
  } else {
    res.status(400).json({deleted: false, error: "Invalid or missing API Key"});
  }
});



module.exports = router;