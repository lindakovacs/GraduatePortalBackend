const express = require("express");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const GoogleSpreadsheet = require("google-spreadsheet");
const { googleSheetApiKey, googleApiCredentials } = require("../config");
// Create a document object using the ID of the spreadsheet - obtained from its URL.

router.get("/", (req, res, next) => {
  const doc = new GoogleSpreadsheet(googleSheetApiKey);

  // Authenticate with the Google Spreadsheets API.
  doc.useServiceAccountAuth(googleApiCredentials, err => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        isSuccess: 0,
        message: "Oops! An unexpected error occurred"
      });
    }
    doc.getRows(1, (err, rows) => {
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
