const express = require("express");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const GoogleSpreadsheet = require("google-spreadsheet");
const getS3File = require("../services/getS3File");
const {
  googleSheetApiKey,
  googleSheetS3Bucket,
  googleSheetS3CertFile,
  googleApiCredentials
} = require("../config");
// Create a document object using the ID of the spreadsheet - obtained from its URL.

router.get("/", async (req, res, next) => {
  const private_key = await getS3File(
    googleSheetS3Bucket,
    googleSheetS3CertFile
  ).then(buffer => buffer.toString("utf-8"));
  const creds = { ...googleApiCredentials, private_key };

  const doc = new GoogleSpreadsheet(googleSheetApiKey);

  // Authenticate with the Google Spreadsheets API.
  doc.useServiceAccountAuth(creds, err => {
    if (err) {
      return res.status(500).send({
        isSuccess: 0,
        message: "Oops! An unexpected error occurred"
      });
    }
    doc.getRows(1, (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          isSuccess: 0,
          message: "Oops! An unexpected error occurred"
        });
      }

      const tableData = mapData(rows);
      if (rows.length) {
        return res.status(200).send({
          isSuccess: 1,
          data: tableData
        });
      } else {
        console.log(err);
        return res.status(500).send({
          isSuccess: 0,
          message: "Oops! An unexpected error occurred"
        });
      }
    });
  });

  const mapData = tableData => {
    const results = tableData.map(data => {
      const { _links, _xml, save, del, id, app, ...obj } = data;
      delete obj["app:edited"];
      return obj;
    });
    return results;
  };
});

router.all("/", methodNotAllowed);

module.exports = router;
