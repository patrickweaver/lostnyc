module.exports = function() {
  // init sqlite db
  var fs = require('fs');
  var dbFile = './.data/sqlite.db';
  var exists = fs.existsSync(dbFile);
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(dbFile);

  // if ./.data/sqlite.db does not exist, create it
  db.serialize(function(){
    if (!exists) {
      db.run(`CREATE TABLE Places (
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
      )`);
      console.log('New table Places created!');
      db.run(`CREATE TABLE Memories (
        memoryId TEXT,
        placeId TEXT,
        body TEXT,
        author TEXT
      )`);
      console.log('New table Memories created!');
    }
    else {
      console.log('Database "Places" ready to go!');
      db.each('SELECT * from Emojis', function(err, row) {
        if ( row ) {
          console.log('record:', row);
        }
      });
    }
  });
  
  return db;
}