const config = require("./config");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const testRouter = require("./routes/test");
const graduates = require("./routes/graduates");
const graduatesNew = require("./routes/graduates-new");
const app = express();
if (config.useCors) app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/api/test", testRouter);
app.use("/api/graduates", graduates);
app.use("/api/graduates/new", graduatesNew);

// Handles all routes so you do not get a not found error
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// catch 404 and forward to error handler
// TODO replace with a JSON style 404
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
