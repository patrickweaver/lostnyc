/* global apiKey */

const postOptions = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  }
}


async function approvePhoto(photoId) {
  const url = "/api/photos/approve";
  let options = postOptions;
  options.body = JSON.stringify({
    apiKey: apiKey,
    photoId: photoId
  });
  const response = await fetch(url, options);
  const responseJson = await response.json();
  if (!responseJson.error && responseJson.approved) {
    document.getElementById('approve-' + photoId).outerHTML = '';
  } else {
    console.log(responseJson);
    alert('Error');
  }
}
