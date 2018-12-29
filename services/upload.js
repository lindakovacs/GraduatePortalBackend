/**
 * Based off of tutorial:
 * @see https://www.nodejsera.com/storing-files-in-amazon-s3-using-node.html
 */
const aws = require("aws-sdk");
const fs = require("fs");
const config = require("../config");

const region = config.s3UploadRegion;
const s3Url = `https://s3.${region}.amazonaws.com/`;
const bucket = config.s3UploadBucket;

aws.config.update({
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey
  },
  region
});
const s3 = new aws.S3();

const upload = (s3Folder, fileObj) => {
  return new Promise((resolve, reject) => {
    const { originalFilename, path, headers } = fileObj;
    const fileName = originalFilename
      .split(".")
      .reduce((acc, piece, idx, pieces) => {
        return pieces.length - 1 === idx
          ? `${acc}-${new Date().getTime()}.${piece}`
          : acc + piece;
      }, "");
    const key = `${s3Folder}/${fileName}`;

    fs.readFile(path, (err, body) => {
      if (err) {
        // TODO log
        console.log("Error uploading file");
        resolve();
      }

      const s3Params = {
        Bucket: bucket,
        Key: key,
        ContentType: headers["content-type"],
        ACL: "public-read",
        Body: body
      };
      s3.putObject(s3Params, (err, data) => {
        if (err) {
          // TODO log
          console.log("Error uploading file to S3");
          resolve();
        }
        return resolve({
          ...data,
          imageUrl: `${s3Url}/${bucket}/${key}`
        });
      });
    });
  });
};

module.exports = upload;
