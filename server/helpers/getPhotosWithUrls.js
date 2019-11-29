const aws = require('./aws.js');

module.exports = async function(photos) {
  var photosWithUrls = [];
  for (var i in photos) {
    try {
      const url = await aws.getSignedUrl(photos[i].photoId);
      photosWithUrls.push(Object.assign(photos[i], {url: url}));
    } catch (error) {
      // Do nothing
    }
  }
  return photosWithUrls;
}