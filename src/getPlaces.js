 module.exports = async function() {
   var response = await fetch("/api/places");
   return response.json();
 }