const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// addCritic variable for nested data in update
const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

// reads a review based on review_id - exists for validation purposes only
function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ "review_id": reviewId });
}

// updates a review
function update(updatedReview) {
    return knex("reviews")
        .select("*")
        .where({ "review_id": updatedReview.review_id })
        .update(updatedReview, "*")
        .then((updatedReviews) => updatedReviews[0])
}

// retrieves the updated review and joins the critics table
function readUpdatedReview(reviewId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ "r.review_id": reviewId })
        .first()
        .then(addCritic)
}


// deletes a review based on review_id
function destroy(reviewId) {
    return knex("reviews")
        .where({ "review_id": reviewId })
        .del();
}

module.exports = {
    read,
    update,
    readUpdatedReview,
    delete: destroy,
}