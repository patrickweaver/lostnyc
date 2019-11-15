async function getPlaces() {
  var response = await fetch("/api/places");
  return response.json();
}

module.exports = {
  getPlaces: getPlaces,
}