var populate;
//populate = true;

// Set up server:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static('server/public'));

const uuidv4 = require('uuid/v4');

// Initialize DB:
const sequelize = require('./db/init.js');

// Models
//const Place = sequelize.import('./models/place.js');
//const Memory = sequelize.import('./models/memory.js');

if (populate) {
  require('./db/populate.js')();
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

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

