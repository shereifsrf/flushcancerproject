const express = require("express");
Promise = require("bluebird"); // eslint-disable-line no-global-assign
//used for reducing logs on development
const morgan = require("morgan");
//compressing files so that the payload download will be lesser for clients
const compress = require("compression");
const methodOverride = require("method-override");
const { logs } = require("./vars");
const helmet = require("helmet");
//to protect from cross origin resource sharing
const cors = require("cors");
const passport = require("passport");
const error = require("../middlewares/error");
const routes = require("../routes/v1");
const strategies = require("./passport");

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
passport.use("facebook", strategies.facebook);
passport.use("google", strategies.google);

// mount api v1 routes
app.use("/api/v1", routes);
app.use("/", (req, res) =>
    res.send(
        "Welcome to FCP backend. Contact Shereif for more details via chachushereef@gmail.com for usage"
    )
);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
