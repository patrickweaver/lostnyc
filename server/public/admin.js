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
    document.getElementById('review-' + photoId).outerHTML = '';
  } else {
    console.log(responseJson);
    alert('Error');
  }
}

async function deletePhoto(photoId) {
  const url = "/api/photos/delete";
  let options = postOptions;
  options.body = JSON.stringify({
    apiKey: apiKey,
    photoId: photoId
  });
  const response = await fetch(url, options);
  const responseJson = await response.json();
  if (!responseJson.error && responseJson.deleted) {
    document.getElementById('review-' + photoId).outerHTML = '';
  } else {
    console.log(responseJson);
    alert('Error');
  }
}

async function dismissFlag(flagId) {
  const url = "/api/flags/dismiss";
  let options = postOptions;
  options.body = JSON.stringify({
    apiKey: apiKey,
    flagId: flagId
  });
  const response = await fetch(url, options);
  const responseJson = await response.json();
  if (!responseJson.error && responseJson.dismissed) {
    document.getElementById('review-' + flagId).outerHTML = '';
  } else {
    console.log(responseJson);
    alert('Error');
  }
}

async function deletePlace(placeId, flagId) {
  const url = "/api/places/delete";
  let options = postOptions;
  options.body = JSON.stringify({
    apiKey: apiKey,
    placeId: placeId
  });
  const response = await fetch(url, options);
  const responseJson = await response.json();
  if (!responseJson.error && responseJson.deleted) {
    document.getElementById('review-' + flagId).outerHTML = '';
  } else {
    console.log(responseJson);
    alert('Error');
  }
}

async function deleteMemory(memoryId, flagId) {
  const url = "/api/memories/delete";
  let options = postOptions;
  options.body = JSON.stringify({
    apiKey: apiKey,
    memoryId: memoryId
  });
  const response = await fetch(url, options);
  const responseJson = await response.json();
  if (!responseJson.error && responseJson.deleted) {
    document.getElementById('review-' + flagId).outerHTML = '';
  } else {
    console.log(responseJson);
    alert('Error');
  }
}
