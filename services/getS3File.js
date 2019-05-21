/**
 * Based off of tutorial:
 * @see https://www.nodejsera.com/storing-files-in-amazon-s3-using-node.html
 */
const aws = require("aws-sdk");
const config = require("../config");

aws.config.update({
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey
  },
  region: config.s3UploadRegion
});
const s3 = new aws.S3();

const getS3File = (bucket, filePath) => {
  return new Promise((resolve, reject) => {
    const s3Params = {
      Bucket: bucket,
      Key: filePath
    };
    s3.getObject(s3Params, (err, data) => {
      if (err) reject(new Error(`Error reading file ${filePath} from S3`));
      return resolve(data.Body);
    });
  });
};

module.exports = getS3File;
