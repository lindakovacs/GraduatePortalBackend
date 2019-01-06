const fs = require("fs");
const { join } = require("path");
const axios = require("axios");
const archiver = require("archiver");

const zipFilePath = join(`${__dirname}/../AlbanyCanCodeResumes.zip`);

const createZip = urls => {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { store: true });
    const output = fs.createWriteStream(zipFilePath);
    let numOfFilesWritten = 0;

    output.on("error", err => {
      return reject(err);
    });

    output.on("end", () => {
      return reject(new Error("Data has been drained"));
    });

    output.on("close", () => {
      // TODO log to server
      console.log(archive.pointer() + " total bytes");
      console.log("File written to", zipFilePath);
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
      return resolve(zipFilePath);
    });

    archive.on("warning", err => {
      if (err.code === "ENOENT") {
        // TODO log
        console.log("warning");
      } else return reject(err);
    });

    archive.on("error", err => {
      return reject(err);
    });

    archive.on("entry", () => {
      console.log("Achived", urls[numOfFilesWritten]);
      numOfFilesWritten += 1;
      if (numOfFilesWritten === urls.length) archive.finalize();
    });

    archive.pipe(output);

    // setTimeout(() => {
    // TODO kill setTimeout
    urls.forEach((url, idx) => {
      const pieces = url.split("/");
      const fileName = pieces[pieces.length - 1];
      axios
        .get(url)
        .then(res => res.data)
        .then(data => archive.append(data, { name: fileName }))
        .catch(err => reject(err));
    });
    // }, 2000);
  });
};

module.exports = createZip;
