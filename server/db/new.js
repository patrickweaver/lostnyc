/* 
PLACES
placeId TEXT,
lat INT,
long INT,
streetNumber TEXT,
street TEXT,
city TEXT,
state TEXT,
zip TEXT,
daysClosed INT,
cityCouncilDistrict INT


MEMORIES
memoryId TEXT,
placeId TEXT,
body TEXT,
author TEXT
*/

const uuidv4 = require('uuid/v4');


function newPlace(db) {
  
  const place = {
    placeId: uuidv4(),
    lat: 0,
    long: 0,
    streetNumber: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    daysClosed: 0,
    cityCouncilDistrict: 0
  }
  
  
  db.serialize(function() {
    db.run(`INSERT INTO Places (
      placeId, lat, long, streetNumber, street, city,
      state, zip, daysClosed, cityCouncilDistrict
    ) VALUES (
      "$placeId", $lat, $long, "$streetNumber", "$street",
      "$city", "$state", "$zip", "$daysClosed", $cityCouncilDistrict 
    )`, place);
  });
  
}

function newMemory(db) {
  
  const memory = {
    memoryId: uuidv4(),
    placeId: "",
    body: "",
    author: ""
  }
  
  db.serialize(function() {
    db.run(`INSERT INTO Memories (
      memoryId, placeId, body, author
    ) VALUES (
      "$memoryId", "$placeId", "$body", "$author"
    )`);
  });
}


module.exports = {
  place: newPlace,
  memory: newMemory
}