const fs = require("fs");
const { join } = require("path");
const axios = require("axios");
const archiver = require("archiver");

const createZip = urls => {
  return new Promise((resolve, reject) => {
    const zipFilePath = join(`${__dirname}/../AlbanyCanCodeResumes.zip`);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { store: true });

    try {
      output.on("close", () => {
        console.log(archive.pointer() + " total bytes");
        console.log("File written to", zipFilePath);
        console.log(
          "archiver has been finalized and the output file descriptor has closed."
        );
        resolve(zipFilePath);
      });

      output.on("end", () => {
        console.log("Data has been drained");
      });

      archive.on("warning", err => {
        if (err.code === "ENOENT") {
          // log warning
          console.log("warning");
        } else {
          // throw error
          throw err;
        }
      });

      archive.pipe(output);

      archive.on("error", err => {
        throw err;
      });
    } catch (e) {
      // TODO log
      console.log(e);
      reject();
    }

    urls.forEach((url, idx) => {
      const pieces = url.split("/");
      const fileName = pieces[pieces.length - 1];
      axios
        .get(url)
        .then(res => res.data)
        .then(data => archive.append(data, { name: fileName }))
        .then(() => {
          if (idx === urls.length - 1) archive.finalize();
        })
        .catch(() => reject());
    });
  });
};

module.exports = createZip;
