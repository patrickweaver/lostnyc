/* global L */

const getPlaces = require('./getPlaces');


const MAP_CENTER = [40.7055585, -73.989109 ];
const MAP_ZOOM = 13;
var map;


var memories = {};


function drawMap() {
  map = L.map('map').setView(MAP_CENTER, 13);

  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
      attribution: '&copy; <a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
      maxZoom: 18
  }).addTo(map);
  
  // Map Events
  map.on('click', onMapClick);
}

function drawPlace(place) {
  var circle = L.circle([place.lat, place.long], {
    color: '#57ccf7',
    fillColor: '#57ccf7',
    fillOpacity: 0.5,
    radius: 100
  }).addTo(map);
}

async function onMapClick(e) {
  
  var id = (await savePlace(e.latlng.lat, e.latlng.long)).id;
  console.log("ID", id);
  var popup = L.popup();
  popup
    .setLatLng(e.latlng)
    .setContent(`
      I am a standalone popup.
    `)
    .openOn(map);

}




async function savePlace(lat, long) {
  const url = '/api/new-place';
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      lat: lat,
      long: long
    })
  };
  /*
  var response = await fetch(url, options)
  const myJson = await response.json();
  console.log(JSON.stringify(myJson));
  return myJson;
  */
  return {}
}


(async function main() {
  drawMap();
  const places = await getPlaces();
  console.log(places);
  
  for (var i in places) {
    drawPlace(places[i]);
  }
  
})();


