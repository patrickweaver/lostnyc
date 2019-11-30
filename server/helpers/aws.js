// S3 Variables and Config:
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  signatureVersion: 'v4'
});
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
var bucketName = process.env.S3BUCKET;


async function upload(upload) {

  //console.log("BUCKET NAME:", bucketName)
  
  var params = {
    Bucket: bucketName,
    Key: upload.id,
    Body: upload.file.buffer,
    ContentType: upload.filetype
  };

  var s3Data = null
  
  function s3Callback(err, data) {
    if (err) {
      console.log("AWS S3 Error:", err)
      return
    } else {
      console.log("~ S3 DATA:", data)
      /*
      If you want to do something with this:

      var newFile = {
        url: "https://" + bucketName + ".s3.amazonaws.com/" + params.Key,
        filetype: filetype,
        uploadDate: date
      }
      */
      
      data.url = "https://" + bucketName + ".s3.amazonaws.com/" + params.Key
    }
  }
  
  try {
    const data = await s3.putObject(params).promise();
    if (data) {
      s3Data = {
        success: true,
        url: "https://" + bucketName + ".s3.amazonaws.com/" + params.Key
      }
      
      console.log("S3 URL:", s3Data.url);
      
      return(s3Data)
    } else {
      throw "No Data"
    }
    
  } catch(error) {
    console.log("AWS S3 Error:", error)
    return {error: true, success: false}
  }
    
}

async function getSignedUrl(key) {
  //console.log("KEY:", key)
  var params = {
    Bucket: bucketName,
    Key: key
  };
  
  // Using Pre Signed URL:
  
  const url = await s3.getSignedUrl('getObject', params);
  console.log("SIGNED URL:", url, typeof url);
  return url
}

module.exports = {
  upload: upload,
  getSignedUrl: getSignedUrl
}