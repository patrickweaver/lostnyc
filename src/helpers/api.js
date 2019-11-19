async function getPlaces() {
  var response = await fetch("/api/places");
  const places = await response.json();
  const showFlaggedPlaces = SHOW_FLAGGED_PLACES;
  var mappedPlaces = [];
  if (!showFlaggedPlaces) {
    for (var i in places) {
      if (parseInt(places[i].flagsCount) === 0) {
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