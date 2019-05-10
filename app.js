const config = require("./config");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const formData = require("express-form-data");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const graduatesRouter = require("./routes/graduates");
const graduatesNewRouter = require("./routes/graduates-new");
const graduatesEditRouter = require("./routes/graduates-edit");
const loginRouter = require("./routes/login");
const newUserRouter = require("./routes/users-new");
const userRegFormRouter = require("./routes/user-regForm");
const uploadRouter = require("./routes/upload");
const downloadResumesRouter = require("./routes/downloadResumes");
const generalApiRouter = require("./routes/generalApi");

// This will open a MongoDB connection to be used throughout all routes.
mongoose.connect(config.mongoUri, { 
  useNewUrlParser: true,
  useCreateIndex: true
});
const db = mongoose.connection;
// TODO: Figure out how to send a response to the client if connection fails immediately.
db.on("error", err => console.log(err));
db.on("connected", () => console.log("Successfully connected to the database."));
db.on("disconnected", () => console.log("Successfully disconnected from the database."));
// Closes open connection when process is ended.
process.on("SIGINT", () => {
  db.close(() => {
    console.log("Database disconnected on app termination.");
    process.exit(0);
  });
});

const app = express();
if (config.useCors) app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(formData.parse());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/graduates/new", graduatesNewRouter);
app.use("/api/graduates/edit", graduatesEditRouter);
app.use("/api/graduates", graduatesRouter);
app.use("/api/login", loginRouter);
app.use("/api/users/new", newUserRouter);
app.use("/api/user/reg-form", userRegFormRouter);
app.use("/api/upload/", uploadRouter);
app.use("/api/download/resumes", downloadResumesRouter);
app.use("/api", generalApiRouter);
app.use("/", indexRouter);

// Handles all routes so you do not get a not found error
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// catch 404 and forward to error handler
// TODO replace with a JSON style 404
app.use((req, res, next) => {
  next(createError(404));
});

// TODO other error handlers

module.exports = app;
