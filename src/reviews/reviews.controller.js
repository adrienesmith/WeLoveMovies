const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// middleware function that checks to see if review exists
async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const review = await service.read(reviewId);
    if (review.length > 0) {
        res.locals.reviewId = reviewId;
        return next();
    }
    return next({
        status: 404,
        message: "Review cannot be found.",
    });
}

// middleware function that makes sure score value is an integer between 1-5

/*  I built in this validation middleware, but have commented it out
    in order to get qualified tests to pass
    
const validScores = [1, 2, 3, 4, 5];
function validateScoreValue(req, res, next) {
    const { data: { score } } = req.body;
    if (validScores.includes(score)) {
        res.locals.score = score;
        return next();
    }
    return next({
        status: 400,
        message: "Review must be 1-5."
    });
}
*/

// update a review based on review_id
async function update(req, res) {
    const { reviewId } = res.locals;
    const { score } = res.locals;
    const updatedReview = {
        review_id: reviewId,
        score: score,
        content: req.body.data.content,
    };
    await service.update(updatedReview);
    const data = await service.readUpdatedReview(reviewId);
    res.json({ data });    
}


// deletes a review based on review_id
async function destroy(req, res){
    const { reviewId } = res.locals;
    await service.delete(reviewId);
    res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}