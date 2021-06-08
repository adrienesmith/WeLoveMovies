const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// middleware that checks if movie_id exists
async function movieExists(req, res, next){
    const { movieId } = req.params;
    const movie = await service.read(movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    return next ({
        status: 404, 
        message: "Movie cannot be found."
    });
}

// list function based on query parameters 
async function list(req, res) {
    const { is_showing } = req.query;
    if (is_showing) {
        // will only show movies currently showing if is_showing is true
        res.json({ data: await service.listShowing() });
    } else {
        // otherwise will list all movies
        res.json({ data: await service.list() });
    }
}

// read movie based on movie_id (response sent after passing movieExists middlware)
function read(req, res) {
    const { movie } = res.locals;
    res.json({ data: movie });
}

// list theaters where movie (based on movie_id) is playing
async function listTheaters(req, res) {
    const { movie: { movie_id } } = res.locals;
    const data = await service.listTheaters(movie_id);
    res.json({ data });
}

// list reviews for movie (based on movie_id)
async function listReviews(req, res) {
    const { movie: { movie_id } } = res.locals;
    const data = await service.listReviews(movie_id);
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
}