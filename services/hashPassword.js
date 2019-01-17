const argv = require("minimist")([...process.argv]);
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { password } = argv;

if (!password) {
  throw new Error(
    "Missing password. Please run the command like this:\nnode ./services/hashPassword.js --password myPass"
  );
}

bcrypt.hash(password, saltRounds, (err, hash) => {
  console.log("\nGenerated hash:");
  console.log(hash, "\n");

  // Testing just in case
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) throw err;
    if (!isMatch)
      throw new Error(
        "Could not unhash error. Please do not used generated hash."
      );
  });
});
