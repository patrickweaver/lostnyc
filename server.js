const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));


const memories = [
  [40.7316746,-73.993974],
  [40.7484519,-73.9906174],
  [40.7272708,-74.0159667]
]


app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// All Memories:
app.get("/api/memories", function(req, res) {
  res.json(memories);
});


// New Memory:
app.all("/api/new-memory", function(req, res) {
  console.log('lat:', req.body.lat);
  console.log('long:', req.body.long);
  
  // Save to DB
  
  res.status(200).json({ id: 1234 })
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
