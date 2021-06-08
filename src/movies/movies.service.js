const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// addCritic constant for nested data in listReviews
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

// lists all movies
function list() {
    return knex("movies")
        .select("*");
}

// lists only movies that are currently showing
function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.*")
        .where({ is_showing: true })
        .groupBy("m.movie_id");
}

// reads movie by movie_id
function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .then((returnedMovies) => returnedMovies[0]);
}

// lists which theaters a movie (by movie_id) is playing in
function listTheaters(movieId) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.*", "mt.*")
        .where({ "mt.movie_id": movieId });
}

// lists all reviews for a movie (by movie_id)
function listReviews(movieId) {
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("r.*", "c.*")
        .where({ "r.movie_id": movieId })
        .then((returnedReviews) => {
            const reviewList = [];
            returnedReviews.forEach((review) => {
                const appendedCriticObject = addCritic(review);
                reviewList.push(appendedCriticObject);
            });
            return reviewList;
        });
}

module.exports = {
    list,
    listShowing,
    read,
    listTheaters,
    listReviews,
}