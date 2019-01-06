const fs = require("fs");
const { join } = require("path");
const axios = require("axios");
const archiver = require("archiver");

const zipFilePath = join(`${__dirname}/../AlbanyCanCodeResumes.zip`);

const readFiles = urls => {
  console.log("readFiles");
  return new Promise((resolve, reject) => {
    let files = [];
    urls.forEach((url, idx) => {
      const pieces = url.split("/");
      const fileName = pieces[pieces.length - 1];
      axios
        .get(url)
        .then(res => {
          files.push([fileName, res.data]);
          if ((idx = files.length - 1)) resolve(files);
        })
        .catch(err => reject(err));
    });
  });
};

const createZipFile = files => {
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
      console.log("Achived", files[numOfFilesWritten]);
      numOfFilesWritten += 1;
      if (numOfFilesWritten === files.length) archive.finalize();
    });

    archive.pipe(output);

    files.forEach(([fileName, data]) => {
      archive.append(data, { name: fileName });
    });
  });
};

const createZip = urls => {
  return new Promise((resolve, reject) => {
    return readFiles(urls)
      .then(files => createZipFile(files))
      .then(zipFilePath => resolve(zipFilePath))
      .catch(err => reject(err));
  });
};

module.exports = createZip;
