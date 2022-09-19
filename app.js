var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
dotenv.config();

const {
  MONGO_DB,
  SECRET
  } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false, 
    store: MongoStore.create({
      mongoUrl:
        MONGO_DB,
      ttl: 2 * 24 * 60 * 60,
    }),
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
