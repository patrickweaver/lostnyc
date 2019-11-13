/* global L */

const MAP_CENTER = [40.7055585, -73.989109 ];
const MAP_ZOOM = 13;


var memories = {};


function drawMap() {
  var map = L.map('map').setView(MAP_CENTER, 13);

  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
      attribution: '&copy; <a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
      maxZoom: 18
  }).addTo(map);
  
  var marker = L.marker([40.71, -73.992]).addTo(map);
  
  var circle = L.circle([40.724082,-74.0117596], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }).addTo(map);
  
  /*
  var polygon = L.polygon([
    [40.7316746,-73.993974],
    [40.7283718,-73.9995348],
    [40.7284098,-74.0035425]
  ]).addTo(map);
  */
  var popup = L.popup();

  async function onMapClick(e) {
    var id = (await saveMemory()).id;
    console.log("ID", id);
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString() + ", id: " + id)
      .openOn(map);
    
  }

  map.on('click', onMapClick);
}


async function saveMemory() {
  const url = '/api/new-memory';
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      lat: 10,
      long: 20
    })
  };

  var response = await fetch(url, options)
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
  return myJson;
}


drawMap();


