/** 
* Based off stackoverflow thread:
* @see https://stackoverflow.com/questions/51143871/how-to-normalize-a-url
*/

const { URL } = require("url");

const normalizeUrls = (...urlInputs) => {
  return urlInputs.map(url => {
    try {
      if (!url) return url;

      if (!url.startsWith("https://") && !url.startsWith("http://")) {
        // The following line is based on the assumption that the URL will resolve using https.
        // Ideally, after all checks pass, the URL should be pinged to verify the correct protocol.
        url = `http://${url}`;
      }

      const normalizedUrl = new URL(url);

      if (normalizedUrl.username !== "" || normalizedUrl.password !== "") {
        throw new Error("Username and password not allowed.");
      }

      return normalizedUrl;

    } catch (err) {
      console.error("Invalid url provided", err);
    }
  });
};

module.exports = normalizeUrls;