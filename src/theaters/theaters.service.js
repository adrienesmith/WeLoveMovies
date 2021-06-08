const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// constant to format all movies showing at a theater as an array value within a theater property
const reduceTheaterAndMovies = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    theater_id: ["movies", null, "theater_id"]
  });

// selects a list of all theaters from the database
function list() {
    return knex("theaters as t")
        .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
        .join("movies as m", "mt.movie_id", "m.movie_id")
        .select("*")
        .then(reduceTheaterAndMovies);
}

module.exports = {
    list,
}
