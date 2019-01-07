const fs = require("fs");
const { join } = require("path");
const axios = require("axios");
const archiver = require("archiver");

const zipFilePath = join(`${__dirname}/../AlbanyCanCodeResumes.zip`);

async function readFiles(urls) {
  return new Promise((resolve, reject) => {
    let files = [];
    urls.forEach(url => {
      const pieces = url.split("/");
      const fileName = pieces[pieces.length - 1];
      axios;
      axios({
        method: "get",
        url,
        responseType: "stream"
      })
        .then(res => {
          files.push([fileName, res.data]);
          if (files.length === urls.length) resolve(files);
        })
        .catch(err => reject(err));
    });
  });
}

async function createZipFile(files) {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { store: true });
    const output = fs.createWriteStream(zipFilePath);

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

    archive.pipe(output);

    files.forEach(([name, data]) => {
      archive.append(data, { name });
    });

    archive.finalize();
  });
}

async function createZip(urls) {
  const files = await readFiles(urls);
  await createZipFile(files);
  return zipFilePath;
}

module.exports = createZip;
