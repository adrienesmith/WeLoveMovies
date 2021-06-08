if (process.env.USER) require("dotenv").config();
const express = require("express");
const cors = require("cors");

const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

const app = express();

// for parsing json
app.use(express.json());

// cors enabled
app.use(cors());

// movies router
app.use("/movies", moviesRouter);

// theaters router
app.use("/theaters", theatersRouter);

// reviews router
app.use("/reviews", reviewsRouter);

// not found handler
app.use(notFound);
// error handler
app.use(errorHandler);

module.exports = app;
