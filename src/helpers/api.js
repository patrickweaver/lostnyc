/*
global
SHOW_FLAGGED_PLACES
SHOW_NO_MEMORY_PLACES
*/

async function getPlaces() {
  var response = await fetch("/api/places");
  const places = await response.json();
  const showFlaggedPlaces = SHOW_FLAGGED_PLACES;
  const showNoMemoryPlaces = SHOW_NO_MEMORY_PLACES;
  var mappedPlaces = [];
  if (!showFlaggedPlaces || !showNoMemoryPlaces) {
    for (var i in places) {
      // Default to including the place
      let include = true;
      // If we are excluding flagged places:
      if (!showFlaggedPlaces) {
        // If more than 0 flags exclude
        if (parseInt(places[i].flagsCount) > 0) {
          include = false;
        }
      }
      
      // If we are excluding places with no memories:
      if (!showNoMemoryPlaces) {
        // If 0 memories exclude
        if (parseInt(places[i].memoriesCount) === 0) {
          include = false;
        }
      }
      
      if (include){
        mappedPlaces.push(places[i]);
      }
    }
  } else {
    mappedPlaces = places;
  }
  return mappedPlaces;
}

module.exports = {
  getPlaces: getPlaces,
}