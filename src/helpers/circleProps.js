const colors = require('./colors.js');
const placeCategories = require('./placeCategories.js');

module.exports = function(place) {
  
  const other = colors[colors.length - 1];
  const placeIndex = placeCategories.indexOf(place.category);
  var color;
  if (placeIndex === -1) {
    color = colors[colors.length - 1];
  } else {
    color = colors[placeIndex];
  }
  
  
  
  return {
    color: color[0],
    fillColor: color[1],
    fillOpacity: 0.5,
    radius: 80,
    placeId: place.placeId
  }
}