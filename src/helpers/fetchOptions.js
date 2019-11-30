const post = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

const postFiles = {
  method: 'POST',
  headers: {
    'Accept': 'application/json'
  }
}


module.exports = {
  post: post,
  postFiles: postFiles
}