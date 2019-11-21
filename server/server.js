var populate;
//populate = true;

// Set up server:
var path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use(express.static('server/public'));

const pug = require("pug");
app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "pug");

const uuidv4 = require('uuid/v4');

// Initialize DB:
const sequelize = require('./db/init.js');

// Maybe only have this happen if the db or tables don't exist
const Place = sequelize.import('./models/place.js');
const Memory = sequelize.import('./models/memory.js');
const Flag = sequelize.import('./models/flag.js');
const User = sequelize.import('./models/user.js');
sequelize.sync();

if (populate) {
  require('./db/populate.js')();
}


// Authentication

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const hashPassword = require('./helpers/hashPassword.js');

app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
//app.use(passport.session({secret: process.env.PASSPORT_SECRET}));
app.use(passport.session());

passport.use(new Strategy(
  function(username, password, cb) {
      findUserByUsername(username, async function(err, user) {
        if (err) {
          console.log("ERROR:", err);
          return cb(err);
        }
        if (!user) {       
          return cb(null, false);
        }
        var success;
        try {
          success = await bcrypt.compare(password, user.password);
        } catch(err) {
          success = false;
        }
        if (!success) {
          return cb(null, false);
        }
        console.log("Successful Login");
        return cb(null, user);
      }
    );
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.userId);
});

passport.deserializeUser(function(id, cb) {
  findUserByUserId(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

function findUserByUsername(username, cb) {
  process.nextTick(async function() {
    // Find User
    const users = await User.findAll({
      limit: 1,
      where: {
        username: username
      }
    })
    const user = users[0];
    return cb(null, user)
  });
}

function findUserByUserId(userId, cb) {
  process.nextTick(async function() {
    // Find user
    const users = await User.findAll({
      limit: 1,
      where: {
        userId: userId
      }
    })
    const user = users[0];
    if (user) {
      cb(null, user);
    } else {
      cb(new Error('User ' + userId + ' does not exist'));
    }
  });
}


/* - - - - - - - - - - - - */
/* Routes: */
/* - - - - - - - - - - - - */

const memories = require('./routes/api/memories.js');
app.use('/api/memories', memories);
const places = require('./routes/api/places.js');
app.use('/api/places', places);
const flags = require('./routes/api/flags.js');
app.use('/api/flags', flags);
const users = require('./routes/api/users.js');
app.use('/api/users', users);
const auth = require('./routes/authentication.js')(passport);
app.use('/auth', auth);
const adminFlags = require('./routes/admin/flags.js');
app.use('/admin/flags', adminFlags);


// Redirects:
app.all('/login', function(req, res) {
  res.redirect('/auth/login');
});
app.all('/logout', function(req, res) {
  res.redirect('/auth/logout');
});
app.all('/profile', function(req, res) {
  res.redirect('/auth/profile');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

